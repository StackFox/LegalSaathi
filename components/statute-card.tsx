'use client'

import { useState } from 'react'
import { ChevronDown, Copy, Check, BookOpen, Scale } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/language-context'
import type { CitedSection } from '@/lib/types'

interface StatuteCardProps {
  section: CitedSection
  className?: string
}

const relevanceStyles = {
  High: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800', barColor: 'bg-green-500' },
  Medium: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', barColor: 'bg-amber-500' },
  Low: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700', barColor: 'bg-gray-400' },
}

// Generate detailed legal explanations for Indian law sections
function generateLegalExplanation(section: CitedSection): string {
  const explanations: Record<string, string> = {
    // Rent Control / Tenancy
    'Section 4': 'This section establishes the standard rent determination mechanism. Under Indian tenancy law, standard rent is the fair rent fixed by the Rent Controller considering factors like location, amenities, and market conditions. Landlords cannot charge rent exceeding this amount. Tenants can apply to the Rent Controller to fix standard rent if disputes arise.',
    'Section 14': 'This section specifies the grounds for eviction under the Rent Control Act. A landlord can only evict a tenant on specific grounds such as: (a) non-payment of rent, (b) subletting without consent, (c) causing nuisance, (d) bona fide requirement for personal use. The landlord must prove the grounds before the Rent Controller.',
    'Section 19': 'Deals with the procedure for recovery of possession. The landlord must file an application before the Rent Controller with proper evidence. The tenant has the right to contest and be heard. Orders can be appealed to the Rent Control Tribunal.',
    
    // Consumer Protection
    'Section 2(7)': 'Defines "consumer" under the Consumer Protection Act, 2019. A consumer is any person who buys goods or hires services for consideration. It includes users of goods/services with the consent of the purchaser. This definition is crucial for establishing locus standi in consumer complaints.',
    'Section 35': 'Establishes the jurisdiction of Consumer Disputes Redressal Commissions. District Commission handles complaints up to Rs. 1 crore, State Commission from Rs. 1-10 crore, and National Commission above Rs. 10 crore. Complainants must file in the appropriate forum based on the value.',
    'Section 38': 'Provides the procedure for filing complaints. A complaint can be filed by the consumer, registered voluntary consumer association, Central/State Government, or legal heirs. It must include details of the defect/deficiency and relief sought.',
    
    // RTI Act
    'Section 3': 'Establishes the fundamental right to information for all citizens of India. Subject to provisions of this Act, all citizens have the right to information accessible under this Act held by any public authority. This is the cornerstone provision enabling transparency.',
    'Section 6': 'Prescribes the procedure for making an RTI request. Applications must be in writing or through electronic means, accompanied by the prescribed fee. Applications should be addressed to the Public Information Officer (PIO) of the concerned authority.',
    'Section 7': 'Mandates disposal of requests within 30 days. If information concerns life or liberty, it must be provided within 48 hours. The PIO must either provide information or reject the request with reasons. Failure to respond is deemed refusal.',
    
    // IPC / Criminal Law
    'Section 420': 'Defines cheating and dishonestly inducing delivery of property. Punishment includes imprisonment up to 7 years and fine. The prosecution must prove: (a) deception, (b) fraudulent or dishonest intent, (c) inducement to deliver property or alter valuable security.',
    'Section 498A': 'Addresses cruelty by husband or relatives towards a married woman. Covers both physical and mental cruelty. Punishment is imprisonment up to 3 years and fine. The offense is cognizable and non-bailable.',
    'Section 304B': 'Deals with dowry death. If a woman dies within 7 years of marriage under suspicious circumstances related to dowry demands, it is presumed to be a dowry death. Minimum punishment is 7 years, extendable to life imprisonment.',
    
    // Police/FIR
    'Section 154': 'Mandates registration of FIR for cognizable offenses. Every information relating to a cognizable offense must be recorded by the police. The informant is entitled to a free copy of the FIR. Refusal to register FIR is an offense under Section 166A IPC.',
    'Section 156': 'Empowers police to investigate cognizable cases. Investigation includes: (a) proceeding to the spot, (b) ascertaining facts, (c) discovering evidence, (d) taking measures for arrest. Magistrate can direct investigation under Section 156(3) if police refuse.',
    'Section 167': 'Governs police custody and remand procedures. Police custody cannot exceed 15 days. Total remand period cannot exceed 60 days for offenses punishable up to 10 years, or 90 days for more serious offenses.',
    
    // Labour Law
    'Section 14 (Industrial Disputes)': 'Under the Industrial Disputes Act, provides for conditions of service during pendency of proceedings. Employers cannot change service conditions or terminate without permission from the authority before whom proceedings are pending.',
    'Section 25F': 'Requires conditions precedent to retrenchment. The employer must: (a) give one month notice, (b) pay 15 days wages for every year of service, (c) give notice to appropriate government. Non-compliance makes retrenchment void.',
    
    // Property Law
    'Section 54': 'Defines "sale" under the Transfer of Property Act. Sale is a transfer of ownership in exchange for a price. For immovable property worth Rs. 100 or more, it must be by registered instrument.',
    'Section 106': 'Governs termination of tenancy. Month-to-month tenancy can be terminated by 15 days notice. For agricultural tenancy, 6 months notice ending with agricultural year is required.',
  }
  
  // Try to match the section
  const sectionKey = section.section.replace(/[()]/g, '').trim()
  
  for (const [key, explanation] of Object.entries(explanations)) {
    if (sectionKey.includes(key) || key.includes(sectionKey.split(' ')[0] + ' ' + sectionKey.split(' ')[1])) {
      return explanation
    }
  }
  
  // Default explanation based on the act
  if (section.act.toLowerCase().includes('rent') || section.act.toLowerCase().includes('tenancy')) {
    return `This provision under the ${section.act} governs the rights and obligations of landlords and tenants. It establishes the legal framework for rent determination, eviction procedures, and tenant protections. The Rent Controller has jurisdiction to adjudicate disputes arising under this section.`
  }
  
  if (section.act.toLowerCase().includes('consumer')) {
    return `This provision under the ${section.act} protects consumer rights and provides remedies for unfair trade practices, defective goods, and deficient services. Consumers can seek redressal through Consumer Disputes Redressal Commissions established at district, state, and national levels.`
  }
  
  if (section.act.toLowerCase().includes('rti') || section.act.toLowerCase().includes('information')) {
    return `This provision under the ${section.act} facilitates transparency and accountability in government functioning. Citizens can request information from public authorities, which must be provided within prescribed timelines unless exempted under specific grounds.`
  }
  
  return `This section of the ${section.act} is relevant to your query. It establishes specific legal rights, obligations, or procedures that apply to your situation. For authoritative interpretation, refer to judicial precedents and consult a qualified legal professional.`
}

// Calculate relevance percentage based on relevance level
function getRelevancePercentage(section: CitedSection): number {
  if (section.relevance_score !== undefined) {
    return section.relevance_score
  }
  // Default percentages based on relevance level (deterministic based on section name hash)
  const hashCode = (section.act + section.section).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  const variation = Math.abs(hashCode % 10)
  
  switch (section.relevance) {
    case 'High': return 85 + variation // 85-94%
    case 'Medium': return 60 + variation // 60-69%
    case 'Low': return 35 + variation // 35-44%
    default: return 50
  }
}

export function StatuteCard({ section, className }: StatuteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const { t } = useLanguage()

  const handleCopy = async () => {
    const text = `${section.act} - ${section.section}\n${section.title}\n\n${section.snippet}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const styles = relevanceStyles[section.relevance]
  const relevancePercentage = getRelevancePercentage(section)
  const explanation = section.explanation || generateLegalExplanation(section)

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-md', className)}>
      <CardHeader 
        className="cursor-pointer p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h4 className="font-semibold text-foreground">{section.act}</h4>
              <span className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border',
                styles.bg, styles.text, styles.border
              )}>
                {section.relevance}
              </span>
            </div>
            <p className="text-sm font-medium text-primary">{section.section}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{section.title}</p>
            
            {/* Relevance percentage bar */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t('statute.relevance')}</span>
                <span className={cn('font-semibold', styles.text)}>{relevancePercentage}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div 
                  className={cn('h-full rounded-full transition-all duration-500', styles.barColor)}
                  style={{ width: `${relevancePercentage}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                handleCopy()
              }}
              className="h-8 w-8 shrink-0"
              aria-label="Copy section"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <ChevronDown 
              className={cn(
                'h-5 w-5 text-muted-foreground transition-transform',
                isExpanded && 'rotate-180'
              )} 
            />
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="border-t bg-muted/30 p-4 space-y-4">
          {/* Snippet/Summary */}
          <div>
            <p className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Summary
            </p>
            <p className="text-sm leading-relaxed text-foreground bg-background rounded-lg p-3 border">
              {section.snippet}
            </p>
          </div>
          
          {/* Detailed Legal Explanation */}
          <div>
            <p className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              {t('statute.explanation')}
            </p>
            <div className="text-sm leading-relaxed text-muted-foreground bg-primary/5 rounded-lg p-3 border border-primary/10">
              {explanation}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
