'use client'

import { useState } from 'react'
import { Copy, Check, Terminal, Code2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const requestExample = `{
  "query": "My landlord is not returning my security deposit",
  "language": "en",
  "include_audit_log": true
}`

const responseExample = `{
  "success": true,
  "data": {
    "query": "My landlord is not returning my security deposit",
    "detected_language": "English",
    "translated_query": "My landlord is not returning my security deposit",
    "domain": "Tenancy",
    "confidence_score": 78,
    "cited_sections": [
      {
        "act": "Transfer of Property Act, 1882",
        "section": "Section 106",
        "title": "Duration of certain leases in absence of written contract",
        "snippet": "In the absence of a contract or local law...",
        "relevance": "High"
      },
      {
        "act": "Consumer Protection Act, 2019",
        "section": "Section 2(7)",
        "title": "Definition of Consumer",
        "snippet": "Consumer means any person who buys any goods...",
        "relevance": "Medium"
      }
    ],
    "action_steps": [
      "Send a written legal notice to landlord via registered post",
      "File complaint at District Consumer Forum if amount < ₹1 crore",
      "Approach Rent Control Tribunal in your district"
    ],
    "deadlines": [
      "Consumer complaint must be filed within 2 years"
    ],
    "audit_log": [
      {
        "statute": "Transfer of Property Act §106",
        "score": 0.91,
        "method": "semantic_search"
      },
      {
        "statute": "Consumer Protection Act §35",
        "score": 0.74,
        "method": "keyword_match"
      }
    ]
  }
}`

const curlExample = `curl -X POST https://api.legalsaathi.in/api/query \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "query": "My landlord is not returning my security deposit",
    "language": "en",
    "include_audit_log": true
  }'`

const pythonExample = `import requests

url = "https://api.legalsaathi.in/api/query"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
payload = {
    "query": "My landlord is not returning my security deposit",
    "language": "en",
    "include_audit_log": True
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()

print(f"Domain: {data['data']['domain']}")
print(f"Confidence: {data['data']['confidence_score']}%")
for step in data['data']['action_steps']:
    print(f"- {step}")`

const javascriptExample = `const response = await fetch('https://api.legalsaathi.in/api/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    query: 'My landlord is not returning my security deposit',
    language: 'en',
    include_audit_log: true
  })
});

const data = await response.json();

console.log(\`Domain: \${data.data.domain}\`);
console.log(\`Confidence: \${data.data.confidence_score}%\`);
data.data.action_steps.forEach(step => {
  console.log(\`- \${step}\`);
});`

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg bg-[#1a2744] p-4 text-sm text-gray-100">
        <code>{code}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-2 h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  )
}

export default function ApiDocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Hero */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                v1.0
              </Badge>
              <Badge variant="outline">REST API</Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Legal Saathi API
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Integrate AI-powered legal guidance into your applications. Get cited legal references, 
              action steps, and confidence scores for legal queries in multiple Indian languages.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Terminal className="mr-2 h-4 w-4" />
                Get API Key
              </Button>
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
            {/* Sidebar Navigation */}
            <aside className="hidden lg:block">
              <nav className="sticky top-20 space-y-1">
                <a href="#endpoint" className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground bg-muted">
                  Query Endpoint
                </a>
                <a href="#request" className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted">
                  Request Body
                </a>
                <a href="#response" className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted">
                  Response Format
                </a>
                <a href="#examples" className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted">
                  Code Examples
                </a>
                <a href="#errors" className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted">
                  Error Handling
                </a>
                <a href="#rate-limits" className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted">
                  Rate Limits
                </a>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Endpoint Section */}
              <Card id="endpoint">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Query Endpoint
                  </CardTitle>
                  <CardDescription>
                    Submit a legal query and receive AI-analyzed guidance with citations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-3">
                    <Badge className="bg-green-600 hover:bg-green-600">POST</Badge>
                    <code className="text-sm font-mono text-foreground">/api/query</code>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Base URL: <code className="rounded bg-muted px-1.5 py-0.5">https://api.legalsaathi.in</code>
                  </p>
                </CardContent>
              </Card>

              {/* Request Body */}
              <Card id="request">
                <CardHeader>
                  <CardTitle>Request Body</CardTitle>
                  <CardDescription>JSON payload structure for the query endpoint</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CodeBlock code={requestExample} language="json" />
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 pr-4 text-left font-medium">Parameter</th>
                          <th className="py-2 pr-4 text-left font-medium">Type</th>
                          <th className="py-2 pr-4 text-left font-medium">Required</th>
                          <th className="py-2 text-left font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><code className="rounded bg-muted px-1.5 py-0.5">query</code></td>
                          <td className="py-2 pr-4 text-muted-foreground">string</td>
                          <td className="py-2 pr-4"><Badge variant="destructive" className="text-xs">Required</Badge></td>
                          <td className="py-2 text-muted-foreground">The legal question in any supported language</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><code className="rounded bg-muted px-1.5 py-0.5">language</code></td>
                          <td className="py-2 pr-4 text-muted-foreground">string</td>
                          <td className="py-2 pr-4"><Badge variant="secondary" className="text-xs">Optional</Badge></td>
                          <td className="py-2 text-muted-foreground">Language code: en, hi, ta, te, bn, mr (default: auto-detect)</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4"><code className="rounded bg-muted px-1.5 py-0.5">include_audit_log</code></td>
                          <td className="py-2 pr-4 text-muted-foreground">boolean</td>
                          <td className="py-2 pr-4"><Badge variant="secondary" className="text-xs">Optional</Badge></td>
                          <td className="py-2 text-muted-foreground">Include detailed matching audit trail (default: false)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Response Format */}
              <Card id="response">
                <CardHeader>
                  <CardTitle>Response Format</CardTitle>
                  <CardDescription>Structure of the API response</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={responseExample} language="json" />
                </CardContent>
              </Card>

              {/* Code Examples */}
              <Card id="examples">
                <CardHeader>
                  <CardTitle>Code Examples</CardTitle>
                  <CardDescription>Implementation examples in popular languages</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="curl">
                    <TabsList className="mb-4">
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    </TabsList>
                    <TabsContent value="curl">
                      <CodeBlock code={curlExample} language="bash" />
                    </TabsContent>
                    <TabsContent value="python">
                      <CodeBlock code={pythonExample} language="python" />
                    </TabsContent>
                    <TabsContent value="javascript">
                      <CodeBlock code={javascriptExample} language="javascript" />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Error Handling */}
              <Card id="errors">
                <CardHeader>
                  <CardTitle>Error Handling</CardTitle>
                  <CardDescription>Common error responses and their meanings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 pr-4 text-left font-medium">Status Code</th>
                          <th className="py-2 pr-4 text-left font-medium">Error</th>
                          <th className="py-2 text-left font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><Badge variant="destructive">400</Badge></td>
                          <td className="py-2 pr-4 font-mono text-sm">INVALID_REQUEST</td>
                          <td className="py-2 text-muted-foreground">Missing or invalid query parameter</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><Badge variant="destructive">401</Badge></td>
                          <td className="py-2 pr-4 font-mono text-sm">UNAUTHORIZED</td>
                          <td className="py-2 text-muted-foreground">Invalid or missing API key</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><Badge variant="destructive">429</Badge></td>
                          <td className="py-2 pr-4 font-mono text-sm">RATE_LIMITED</td>
                          <td className="py-2 text-muted-foreground">Too many requests, please slow down</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4"><Badge variant="destructive">500</Badge></td>
                          <td className="py-2 pr-4 font-mono text-sm">SERVER_ERROR</td>
                          <td className="py-2 text-muted-foreground">Internal server error, please try again</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Rate Limits */}
              <Card id="rate-limits">
                <CardHeader>
                  <CardTitle>Rate Limits</CardTitle>
                  <CardDescription>API usage quotas by plan tier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <h4 className="font-semibold text-foreground">Basic</h4>
                      <p className="mt-1 text-2xl font-bold text-foreground">100</p>
                      <p className="text-sm text-muted-foreground">requests/day</p>
                    </div>
                    <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
                      <h4 className="font-semibold text-foreground">Pro</h4>
                      <p className="mt-1 text-2xl font-bold text-primary">10,000</p>
                      <p className="text-sm text-muted-foreground">requests/day</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="font-semibold text-foreground">Enterprise</h4>
                      <p className="mt-1 text-2xl font-bold text-foreground">Unlimited</p>
                      <p className="text-sm text-muted-foreground">requests/day</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
