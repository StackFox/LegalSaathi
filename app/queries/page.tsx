'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  MessageSquare, 
  Search, 
  Clock,
  ExternalLink,
  ShieldX,
  LogIn,
  Filter,
  RotateCcw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LegalDomainBadge } from '@/components/legal-domain-badge'
import { useLanguage } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'

// Mock user queries for demonstration
const mockUserQueries = [
  {
    id: "UQ001",
    query: "Mera landlord deposit wapas nahi kar raha hai, 6 mahine ho gaye",
    domain: "Tenancy",
    confidence: 78,
    timestamp: "2024-01-15T10:30:00",
    language: "hi",
    status: "Answered"
  },
  {
    id: "UQ002",
    query: "How to file RTI for getting birth certificate details",
    domain: "RTI",
    confidence: 95,
    timestamp: "2024-01-14T14:20:00",
    language: "en",
    status: "Answered"
  },
  {
    id: "UQ003",
    query: "Consumer complaint for defective mobile phone",
    domain: "Consumer",
    confidence: 88,
    timestamp: "2024-01-13T09:15:00",
    language: "en",
    status: "Answered"
  },
  {
    id: "UQ004",
    query: "Police is not registering my FIR for theft case",
    domain: "Police/FIR",
    confidence: 92,
    timestamp: "2024-01-12T16:45:00",
    language: "en",
    status: "Answered"
  },
  {
    id: "UQ005",
    query: "Office mein harassment ho raha hai",
    domain: "Workplace",
    confidence: 45,
    timestamp: "2024-01-11T11:30:00",
    language: "hi",
    status: "Escalated"
  }
]

function AccessDeniedScreen() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex flex-1 items-center justify-center bg-muted/30 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center text-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <ShieldX className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Sign In Required
            </h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your query history and saved questions.
            </p>
            <Button 
              asChild
              className="gap-2"
            >
              <Link href="/sign-in" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                {t('auth.signIn')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

export default function QueriesPage() {
  const { t } = useLanguage()
  const { isAuthenticated, isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [domainFilter, setDomainFilter] = useState<string>('all')

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-muted/30">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Check authentication
  if (!isAuthenticated) {
    return <AccessDeniedScreen />
  }

  const filteredQueries = mockUserQueries.filter(query => {
    const matchesSearch = searchQuery === '' || 
      query.query.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDomain = domainFilter === 'all' || query.domain === domainFilter
    return matchesSearch && matchesDomain
  })

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">{confidence}%</Badge>
    }
    if (confidence >= 60) {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">{confidence}%</Badge>
    }
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">{confidence}%</Badge>
  }

  const clearFilters = () => {
    setSearchQuery('')
    setDomainFilter('all')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              {t('nav.myQueries')}
            </h1>
            <p className="mt-1 text-muted-foreground">
              View and manage your previous legal queries
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search your queries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={domainFilter} onValueChange={setDomainFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="All Domains" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Domains</SelectItem>
                      <SelectItem value="Consumer">Consumer</SelectItem>
                      <SelectItem value="Tenancy">Tenancy</SelectItem>
                      <SelectItem value="RTI">RTI</SelectItem>
                      <SelectItem value="Police/FIR">Police/FIR</SelectItem>
                      <SelectItem value="Workplace">Workplace</SelectItem>
                      <SelectItem value="Family Law">Family Law</SelectItem>
                    </SelectContent>
                  </Select>
                  {(searchQuery || domainFilter !== 'all') && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Query List */}
          {filteredQueries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No queries found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || domainFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'You haven\'t asked any legal questions yet'}
                </p>
                <Button asChild>
                  <Link href="/ask">
                    Ask Your First Question
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredQueries.map((query) => (
                <Card key={query.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 space-y-2">
                        <p className="text-foreground font-medium line-clamp-2">
                          {query.query}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <LegalDomainBadge domain={query.domain as any} size="sm" />
                          {getConfidenceBadge(query.confidence)}
                          <Badge 
                            variant={query.status === 'Escalated' ? 'destructive' : 'default'}
                            className={query.status === 'Answered' ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400' : ''}
                          >
                            {query.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(query.timestamp)}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                        className="shrink-0"
                      >
                        <Link href={`/ask?q=${encodeURIComponent(query.query)}`}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Query Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{mockUserQueries.length}</p>
                  <p className="text-xs text-muted-foreground">Total Queries</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {mockUserQueries.filter(q => q.status === 'Answered').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Answered</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {mockUserQueries.filter(q => q.status === 'Escalated').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Escalated</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {Math.round(mockUserQueries.reduce((acc, q) => acc + q.confidence, 0) / mockUserQueries.length)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
