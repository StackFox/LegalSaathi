'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3, 
  Filter,
  UserPlus,
  ShieldX,
  LogIn
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
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
import { mockDashboardStats, mockQueryRecords, mockDomainDistribution } from '@/lib/mock-data'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#2D9C4E', '#8b5cf6', '#6b7280', '#3b82f6', '#FF6B35', '#ec4899', '#dc2626']

function AccessDeniedScreen() {
  const { t } = useLanguage()

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        
        <main className="flex flex-1 items-center justify-center bg-muted/30 px-4">
          <Card className="max-w-md w-full">
            <CardContent className="flex flex-col items-center text-center p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
                <ShieldX className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t('dashboard.accessDenied')}
              </h1>
              <p className="text-muted-foreground mb-6">
                {t('dashboard.adminOnly')}
              </p>
              <Button 
                asChild
                className="gap-2"
              >
                <Link href="/sign-in" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  {t('dashboard.signInAdmin')}
                </Link>
              </Button>
              <p className="mt-4 text-xs text-muted-foreground">
                Admin access ke liye Clerk dashboard me role set kiya gaya hona chahiye.
              </p>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const [domainFilter, setDomainFilter] = useState<string>('all')
  const [confidenceFilter, setConfidenceFilter] = useState<string>('all')

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

  // Check authentication and admin role
  if (!isAuthenticated || !isAdmin) {
    return <AccessDeniedScreen />
  }

  const filteredRecords = mockQueryRecords.filter(record => {
    if (domainFilter !== 'all' && record.domain !== domainFilter) return false
    if (confidenceFilter === 'high' && record.confidence < 80) return false
    if (confidenceFilter === 'medium' && (record.confidence < 60 || record.confidence >= 80)) return false
    if (confidenceFilter === 'low' && record.confidence >= 60) return false
    return true
  })

  const escalatedRecords = mockQueryRecords.filter(r => r.status === 'Escalated')

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-IN', { 
      day: 'numeric',
      month: 'short',
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
          </div>

          {/* Stats Row */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('dashboard.totalQueries')}</p>
                  <p className="text-2xl font-bold text-foreground">{mockDashboardStats.totalQueriesToday.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('dashboard.escalatedCases')}</p>
                  <p className="text-2xl font-bold text-foreground">{mockDashboardStats.escalatedCases}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('dashboard.topDomain')}</p>
                  <p className="text-2xl font-bold text-foreground">{mockDashboardStats.topLegalDomain}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('dashboard.avgConfidence')}</p>
                  <p className="text-2xl font-bold text-foreground">{mockDashboardStats.avgConfidence}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Queries Table */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-lg">{t('dashboard.recentQueries')}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select value={domainFilter} onValueChange={setDomainFilter}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Domain" />
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
                      <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Confidence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Confidence</SelectItem>
                          <SelectItem value="high">High (80%+)</SelectItem>
                          <SelectItem value="medium">Medium (60-80%)</SelectItem>
                          <SelectItem value="low">{"Low (<60%)"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">Query</TableHead>
                          <TableHead>Domain</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="max-w-[250px] truncate font-medium text-foreground">
                              {record.query}
                            </TableCell>
                            <TableCell>
                              <LegalDomainBadge domain={record.domain} size="sm" />
                            </TableCell>
                            <TableCell>
                              {getConfidenceBadge(record.confidence)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={record.status === 'Escalated' ? 'destructive' : 'default'}
                                className={record.status === 'Resolved' ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400' : ''}
                              >
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatTimestamp(record.timestamp)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Domain Distribution Chart */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('dashboard.domainDistribution')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockDomainDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="count"
                          nameKey="domain"
                        >
                          {mockDomainDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number, name: string) => [`${value} queries`, name]}
                          contentStyle={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--border)',
                            color: 'var(--foreground)'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Escalated Cases Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    {t('dashboard.escalatedCases')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {escalatedRecords.map((record) => (
                      <div key={record.id} className="rounded-lg border border-border p-3">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {record.query}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <LegalDomainBadge domain={record.domain} size="sm" />
                            {getConfidenceBadge(record.confidence)}
                          </div>
                          <Button size="sm" variant="outline">
                            <UserPlus className="mr-1 h-3 w-3" />
                            Assign
                          </Button>
                        </div>
                      </div>
                    ))}
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
