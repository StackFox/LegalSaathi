import { mockResponses } from './mock-data'
import type { AuditLogEntry, CitedSection, LegalResponse, Language } from './types'

type TopicKey = keyof typeof mockResponses

type CorpusDoc = {
  id: string
  topicKey: TopicKey
  domain: LegalResponse['domain']
  citedSection: CitedSection
  tokens: string[]
  tfidf: Map<string, number>
  norm: number
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\u0900-\u097F\u0E00-\u0E7F]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function computeTf(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>()
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1)
  return tf
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

function detectLanguage(text: string): Language {
  // Simple heuristic (kept lightweight for demo)
  const hindiRegex = /[\u0900-\u097F]/
  const tamilRegex = /[\u0B80-\u0BFF]/
  const teluguRegex = /[\u0C00-\u0C7F]/
  const bengaliRegex = /[\u0980-\u09FF]/

  if (hindiRegex.test(text)) return 'hi'
  if (tamilRegex.test(text)) return 'ta'
  if (teluguRegex.test(text)) return 'te'
  if (bengaliRegex.test(text)) return 'bn'
  return 'en'
}

const corpusDocs: CorpusDoc[] = (() => {
  const docs: CorpusDoc[] = []

  for (const [topicKeyRaw, resp] of Object.entries(mockResponses) as Array<[TopicKey, (typeof mockResponses)[TopicKey]]>) {
    for (const section of resp.cited_sections) {
      const text = `${section.act} ${section.section} ${section.title} ${section.snippet}`
      const tokens = tokenize(text)
      docs.push({
        id: `${topicKeyRaw}:${section.act}:${section.section}`,
        topicKey: topicKeyRaw,
        domain: resp.domain,
        citedSection: section,
        tokens,
        tfidf: new Map(),
        norm: 1,
      })
    }
  }

  const N = docs.length
  const df = new Map<string, number>()

  // Document frequency
  for (const d of docs) {
    const seen = new Set<string>()
    for (const token of d.tokens) {
      if (seen.has(token)) continue
      seen.add(token)
      df.set(token, (df.get(token) ?? 0) + 1)
    }
  }

  const idf = (term: string) => Math.log((N + 1) / ((df.get(term) ?? 0) + 1)) + 1

  for (const d of docs) {
    const tf = computeTf(d.tokens)
    const tfidf = new Map<string, number>()
    let normSq = 0

    for (const [term, count] of tf.entries()) {
      // Use raw term frequency (simple but works for small corpus)
      const v = count * idf(term)
      tfidf.set(term, v)
      normSq += v * v
    }

    d.tfidf = tfidf
    d.norm = Math.sqrt(normSq) || 1
  }

  return docs
})()

function computeQueryVector(query: string): { vec: Map<string, number>; norm: number } {
  const tokens = tokenize(query)
  const tf = computeTf(tokens)

  // Reuse the same idf formulation by inferring from corpus df
  // (idf uses dfs, so we compute quickly from the existing corpusDocs)
  // To keep this fast and simple, we approximate idf by term frequency presence across docs.
  const dfApprox = new Map<string, number>()
  for (const doc of corpusDocs) {
    for (const token of new Set(doc.tokens)) dfApprox.set(token, (dfApprox.get(token) ?? 0) + 1)
  }

  const N = corpusDocs.length
  const idf = (term: string) => Math.log((N + 1) / ((dfApprox.get(term) ?? 0) + 1)) + 1

  const vec = new Map<string, number>()
  let normSq = 0
  for (const [term, count] of tf.entries()) {
    const v = count * idf(term)
    vec.set(term, v)
    normSq += v * v
  }
  return { vec, norm: Math.sqrt(normSq) || 1 }
}

function cosineSim(queryVec: Map<string, number>, queryNorm: number, doc: CorpusDoc): number {
  let dot = 0
  // Iterate over query terms (usually smaller)
  for (const [term, qv] of queryVec.entries()) {
    const dv = doc.tfidf.get(term)
    if (!dv) continue
    dot += qv * dv
  }
  return dot / (queryNorm * doc.norm)
}

export async function answerLegalQueryWithRag(params: {
  query: string
  language?: Language
  include_audit_log?: boolean
}): Promise<LegalResponse> {
  const { query, language, include_audit_log } = params

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error('Query is required')
  }

  const detectedLang = language ?? detectLanguage(query)

  const queryText = query.trim()
  const queryVec = computeQueryVector(queryText)

  const scoredDocs = corpusDocs
    .map((doc) => ({
      doc,
      score: cosineSim(queryVec.vec, queryVec.norm, doc),
    }))
    .sort((a, b) => b.score - a.score)

  // Pick best topic by total score contribution
  const topicScore = new Map<TopicKey, number>()
  for (const { doc, score } of scoredDocs) {
    topicScore.set(doc.topicKey, (topicScore.get(doc.topicKey) ?? 0) + score)
  }

  let bestTopic: TopicKey = scoredDocs[0]?.doc.topicKey ?? 'tenant-rights'
  let bestTopicTotal = -Infinity
  for (const [k, v] of topicScore.entries()) {
    if (v > bestTopicTotal) {
      bestTopicTotal = v
      bestTopic = k
    }
  }

  const selectedResp = mockResponses[bestTopic]

  const docsInTopic = scoredDocs
    .filter((x) => x.doc.topicKey === bestTopic)
    .slice(0, 3)

  const maxScoreInTopic = docsInTopic[0]?.score ?? 0
  const cited_sections: CitedSection[] = docsInTopic.map(({ doc, score }) => {
    const relRatio = maxScoreInTopic > 0 ? score / maxScoreInTopic : 0
    const relevance = relRatio >= 0.7 ? 'High' : relRatio >= 0.35 ? 'Medium' : 'Low'
    return {
      ...doc.citedSection,
      relevance,
      snippet: doc.citedSection.snippet,
    }
  })

  // Confidence: relative to best overall similarity
  const maxOverall = scoredDocs[0]?.score ?? 0
  const bestDocScore = docsInTopic[0]?.score ?? 0
  const confidence_score = maxOverall > 0 ? Math.round(clamp((bestDocScore / maxOverall) * 100, 35, 98)) : 60

  const audit_log: AuditLogEntry[] = include_audit_log
    ? docsInTopic.map(({ doc, score }) => ({
      statute: `${doc.citedSection.act} ${doc.citedSection.section}`.trim(),
      score,
      method: 'semantic_search',
      timestamp: new Date().toISOString(),
    }))
    : []

  return {
    query: queryText,
    detected_language: detectedLang.charAt(0).toUpperCase() + detectedLang.slice(1),
    translated_query: queryText,
    domain: selectedResp.domain,
    confidence_score,
    cited_sections,
    action_steps: selectedResp.action_steps,
    deadlines: selectedResp.deadlines,
    audit_log,
  }
}

