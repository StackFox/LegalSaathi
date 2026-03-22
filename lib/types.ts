// Legal Saathi Types

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa'

export type LegalDomain = 
  | 'IPC' 
  | 'RTI' 
  | 'General'
  | 'Consumer' 
  | 'Tenancy' 
  | 'Workplace' 
  | 'Family Law' 
  | 'Police/FIR'

export type RelevanceLevel = 'High' | 'Medium' | 'Low'

export interface CitedSection {
  act: string
  section: string
  title: string
  snippet: string
  relevance: RelevanceLevel
}

export interface AuditLogEntry {
  statute: string
  score: number
  method: 'semantic_search' | 'keyword_match' | 'hybrid'
  timestamp?: string
}

export interface LegalResponse {
  query: string
  detected_language: string
  translated_query: string
  domain: LegalDomain
  confidence_score: number
  cited_sections: CitedSection[]
  action_steps: string[]
  deadlines: string[]
  audit_log: AuditLogEntry[]
}

export interface DashboardStats {
  totalQueriesToday: number
  escalatedCases: number
  topLegalDomain: LegalDomain
  avgConfidence: number
}

export interface QueryRecord {
  id: string
  query: string
  domain: LegalDomain
  confidence: number
  status: 'Resolved' | 'Escalated'
  timestamp: string
  language: Language
}

export interface DomainDistribution {
  domain: LegalDomain
  count: number
  percentage: number
}
