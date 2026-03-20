import { NextRequest, NextResponse } from 'next/server'
import type { LegalResponse, Language, CitedSection, AuditLogEntry } from '@/lib/types'

interface QueryRequest {
  query: string
  language?: Language
  include_audit_log?: boolean
}

interface ApiResponse {
  success: boolean
  data?: LegalResponse
  error?: {
    code: string
    message: string
  }
}

// Simulate language detection
function detectLanguage(text: string): string {
  const hindiRegex = /[\u0900-\u097F]/
  const tamilRegex = /[\u0B80-\u0BFF]/
  const teluguRegex = /[\u0C00-\u0C7F]/
  const bengaliRegex = /[\u0980-\u09FF]/

  if (hindiRegex.test(text)) return 'Hindi'
  if (tamilRegex.test(text)) return 'Tamil'
  if (teluguRegex.test(text)) return 'Telugu'
  if (bengaliRegex.test(text)) return 'Bengali'

  return 'English'
}

// Enhanced tenant dispute classification
interface TenantSubCategory {
  type: 'deposit' | 'eviction' | 'rent_increase' | 'maintenance' | 'notice' | 'agreement' | 'general'
  keywords: string[]
}

const tenantSubCategories: TenantSubCategory[] = [
  { type: 'deposit', keywords: ['deposit', 'security', 'advance', 'wapas', 'refund', 'return', 'जमा', 'अग्रिम'] },
  { type: 'eviction', keywords: ['evict', 'throw out', 'vacate', 'notice to leave', 'nikalna', 'निकालना', 'बेदखल'] },
  { type: 'rent_increase', keywords: ['increase', 'hike', 'raise', 'badh', 'बढ़', 'किराया बढ़ा'] },
  { type: 'maintenance', keywords: ['repair', 'fix', 'broken', 'maintenance', 'leak', 'damage', 'मरम्मत', 'टूटा'] },
  { type: 'notice', keywords: ['notice', 'days', 'month notice', 'नोटिस', 'सूचना'] },
  { type: 'agreement', keywords: ['agreement', 'contract', 'registered', 'stamp', 'agreement नहीं', 'करार', 'अनुबंध'] },
]

function classifyTenantDispute(query: string): string {
  const lowerQuery = query.toLowerCase()

  for (const subCat of tenantSubCategories) {
    for (const keyword of subCat.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        return `tenant-${subCat.type}`
      }
    }
  }

  return 'tenant-general'
}

// Simulate domain classification
function classifyDomain(query: string): { domain: string; subType?: string } {
  const lowerQuery = query.toLowerCase()

  // Tenant/landlord related
  if (lowerQuery.includes('tenant') || lowerQuery.includes('landlord') ||
    lowerQuery.includes('rent') || lowerQuery.includes('deposit') ||
    lowerQuery.includes('किरायेदार') || lowerQuery.includes('मकान मालिक') ||
    lowerQuery.includes('किराया') || lowerQuery.includes('evict') ||
    lowerQuery.includes('lease') || lowerQuery.includes('flat')) {
    const subType = classifyTenantDispute(query)
    return { domain: 'tenant-rights', subType }
  }

  if (lowerQuery.includes('fir') || lowerQuery.includes('police') || lowerQuery.includes('complaint')) {
    return { domain: 'police-fir' }
  }
  if (lowerQuery.includes('rti') || lowerQuery.includes('information') || lowerQuery.includes('सूचना का अधिकार')) {
    return { domain: 'rti-filing' }
  }
  if (lowerQuery.includes('workplace') || lowerQuery.includes('harassment') ||
    lowerQuery.includes('office') || lowerQuery.includes('boss') || lowerQuery.includes('कार्यस्थल')) {
    return { domain: 'workplace-harassment' }
  }
  if (lowerQuery.includes('consumer') || lowerQuery.includes('refund') ||
    lowerQuery.includes('defective') || lowerQuery.includes('product') || lowerQuery.includes('उपभोक्ता')) {
    return { domain: 'consumer-complaint' }
  }
  if (lowerQuery.includes('domestic') || lowerQuery.includes('violence') ||
    lowerQuery.includes('husband') || lowerQuery.includes('wife') || lowerQuery.includes('घरेलू')) {
    return { domain: 'domestic-violence' }
  }

  return { domain: 'general' }
}

// Contextual tenant dispute responses
const tenantResponses: Record<string, LegalResponse> = {
  'tenant-deposit': {
    query: '',
    detected_language: 'English',
    translated_query: '',
    domain: 'Tenancy',
    confidence_score: 85,
    cited_sections: [
      {
        act: 'Transfer of Property Act, 1882',
        section: 'Section 108(l)',
        title: 'Rights and liabilities of lessor and lessee',
        snippet: 'The lessor is bound to make payment of all public charges and to discharge all obligations legally enforceable by the owner of the property...',
        relevance: 'High'
      },
      {
        act: 'Model Tenancy Act, 2021',
        section: 'Section 8',
        title: 'Security Deposit',
        snippet: 'The security deposit shall not exceed two months rent for residential premises. The landlord shall refund the security deposit after deducting any legitimate dues within one month of the tenant vacating the premises.',
        relevance: 'High'
      },
      {
        act: 'Consumer Protection Act, 2019',
        section: 'Section 35',
        title: 'Jurisdiction of District Commission',
        snippet: 'The District Commission shall have jurisdiction to entertain complaints where the value of goods or services does not exceed one crore rupees.',
        relevance: 'Medium'
      }
    ],
    action_steps: [
      'Send a written legal notice to the landlord via registered post demanding return of deposit within 15 days',
      'Clearly mention the deposit amount, date of payment, and reference any receipt or agreement',
      'If no written agreement exists, gather evidence like bank transfer records, witnesses, or messages',
      'After 15 days without response, file complaint at District Consumer Forum (for claims up to Rs. 1 crore)',
      'Alternatively, file a civil suit for recovery of money in the appropriate civil court',
      'Keep copies of all communication for court records'
    ],
    deadlines: [
      'Consumer complaint must be filed within 2 years of cause of action',
      'Legal notice should give 15-30 days for response',
      'Model Tenancy Act requires refund within 1 month of vacating'
    ],
    audit_log: [
      { statute: 'Transfer of Property Act §108', score: 0.89, method: 'semantic_search' },
      { statute: 'Model Tenancy Act §8', score: 0.94, method: 'semantic_search' },
      { statute: 'Consumer Protection Act §35', score: 0.78, method: 'keyword_match' }
    ]
  },
  'tenant-eviction': {
    query: '',
    detected_language: 'English',
    translated_query: '',
    domain: 'Tenancy',
    confidence_score: 82,
    cited_sections: [
      {
        act: 'Transfer of Property Act, 1882',
        section: 'Section 106',
        title: 'Duration of certain leases in absence of written contract',
        snippet: 'In case of immovable property, a lease from month to month is terminable by either party giving to the other party fifteen days notice expiring with the end of a month of the tenancy.',
        relevance: 'High'
      },
      {
        act: 'Model Tenancy Act, 2021',
        section: 'Section 21',
        title: 'Grounds for eviction',
        snippet: 'No landlord shall evict a tenant except on one or more grounds specified: non-payment of rent for two months, misuse of premises, subletting without consent, or bona fide requirement of landlord.',
        relevance: 'High'
      },
      {
        act: 'Specific Relief Act, 1963',
        section: 'Section 6',
        title: 'Suit by person dispossessed of immovable property',
        snippet: 'If any person is dispossessed without his consent of immovable property otherwise than in due course of law, he may recover possession thereof by a suit instituted within six months.',
        relevance: 'High'
      }
    ],
    action_steps: [
      'Verify if proper notice period was given as per agreement or law (typically 1-3 months)',
      'Check if eviction ground is valid under state Rent Control Act',
      'Do not vacate until receiving a court order - illegal eviction is punishable',
      'If forcefully evicted, file FIR under Section 441-442 IPC for criminal trespass',
      'File suit under Section 6 of Specific Relief Act within 6 months to recover possession',
      'Approach Rent Controller/Rent Tribunal for stay on eviction proceedings'
    ],
    deadlines: [
      'Suit for recovery of possession must be filed within 6 months of dispossession',
      'Notice period is typically 1 month for month-to-month tenancy',
      'Registered lease agreement notice period as per agreement terms'
    ],
    audit_log: [
      { statute: 'Transfer of Property Act §106', score: 0.91, method: 'semantic_search' },
      { statute: 'Model Tenancy Act §21', score: 0.88, method: 'semantic_search' },
      { statute: 'Specific Relief Act §6', score: 0.85, method: 'hybrid' }
    ]
  },
  'tenant-rent_increase': {
    query: '',
    detected_language: 'English',
    translated_query: '',
    domain: 'Tenancy',
    confidence_score: 79,
    cited_sections: [
      {
        act: 'Model Tenancy Act, 2021',
        section: 'Section 9',
        title: 'Revision of Rent',
        snippet: 'The landlord may revise rent in agreement with the tenant. Rent revision shall not be made more than once in a year and according to the percentage agreed upon in the tenancy agreement.',
        relevance: 'High'
      },
      {
        act: 'State Rent Control Acts',
        section: 'Various',
        title: 'Rent Increase Limitations',
        snippet: 'Most state Rent Control Acts limit rent increase to 5-10% per year and require landlord to follow due process before increasing rent.',
        relevance: 'High'
      },
      {
        act: 'Indian Contract Act, 1872',
        section: 'Section 63',
        title: 'Effect of novation, rescission, and alteration of contract',
        snippet: 'If the parties to a contract agree to substitute a new contract for it, or to rescind or alter it, the original contract need not be performed.',
        relevance: 'Medium'
      }
    ],
    action_steps: [
      'Check your rent agreement for rent revision clause and notice requirements',
      'If no clause exists, landlord can only increase rent upon mutual agreement',
      'Check your state Rent Control Act for maximum permissible rent increase (usually 5-10% per year)',
      'If increase is unreasonable, negotiate in writing with landlord',
      'File complaint with Rent Controller if increase violates Rent Control Act provisions',
      'Document all communications about rent increase'
    ],
    deadlines: [
      'Rent revision notice typically required 1-3 months in advance',
      'Rent can only be revised once per year under most state laws',
      'Complaint to Rent Controller can be filed anytime during tenancy'
    ],
    audit_log: [
      { statute: 'Model Tenancy Act §9', score: 0.87, method: 'semantic_search' },
      { statute: 'State Rent Control Acts', score: 0.82, method: 'keyword_match' },
      { statute: 'Indian Contract Act §63', score: 0.71, method: 'hybrid' }
    ]
  },
  'tenant-maintenance': {
    query: '',
    detected_language: 'English',
    translated_query: '',
    domain: 'Tenancy',
    confidence_score: 76,
    cited_sections: [
      {
        act: 'Transfer of Property Act, 1882',
        section: 'Section 108(c)',
        title: 'Rights and liabilities of the lessor',
        snippet: 'If during the continuance of the lease, any accession is made to the property, the lessor shall be liable for repairs necessary to preserve the property from damage.',
        relevance: 'High'
      },
      {
        act: 'Model Tenancy Act, 2021',
        section: 'Section 14',
        title: 'Duties of Landlord',
        snippet: 'The landlord shall be responsible for structural repairs including walls, roof, and floor. Essential services like water supply, sanitation, and electrical fittings shall be maintained by landlord.',
        relevance: 'High'
      },
      {
        act: 'Model Tenancy Act, 2021',
        section: 'Section 15',
        title: 'Duties of Tenant',
        snippet: "The tenant shall keep the premises in good condition excluding structural repairs, inform landlord of any damage, and bear cost of repairs caused by tenant's negligence.",
        relevance: 'Medium'
      }
    ],
    action_steps: [
      'Document the maintenance issue with photos, videos, and written description with dates',
      'Send written notice to landlord requesting repairs within a reasonable time (15-30 days)',
      'If landlord fails to act, you may get repairs done and deduct from rent (keep all bills)',
      'For essential services (water, electricity), approach Municipal Corporation for intervention',
      'File complaint with Rent Controller for persistent maintenance failures',
      'As last resort, withhold rent proportionate to unusable space (with legal notice)'
    ],
    deadlines: [
      'Landlord should respond to maintenance requests within 15-30 days',
      'Emergency repairs (water leak, electrical hazard) require immediate attention',
      'Document issues before deducting any costs from rent'
    ],
    audit_log: [
      { statute: 'Transfer of Property Act §108(c)', score: 0.88, method: 'semantic_search' },
      { statute: 'Model Tenancy Act §14', score: 0.92, method: 'semantic_search' },
      { statute: 'Model Tenancy Act §15', score: 0.79, method: 'hybrid' }
    ]
  },
  'tenant-notice': {
    query: '',
    detected_language: 'English',
    translated_query: '',
    domain: 'Tenancy',
    confidence_score: 83,
    cited_sections: [
      {
        act: 'Transfer of Property Act, 1882',
        section: 'Section 106',
        title: 'Duration of certain leases in absence of written contract',
        snippet: 'For month-to-month lease, notice of termination must be given 15 days before the end of the month. For year-to-year lease, 6 months notice is required.',
        relevance: 'High'
      },
      {
        act: 'Model Tenancy Act, 2021',
        section: 'Section 22',
        title: 'Notice of Termination',
        snippet: 'Notice period for termination shall be as agreed in tenancy agreement. In absence of agreement, notice shall be equal to the period of tenancy or three months, whichever is less.',
        relevance: 'High'
      },
      {
        act: 'Code of Civil Procedure, 1908',
        section: 'Order 7 Rule 11',
        title: 'Rejection of plaint',
        snippet: 'A suit for eviction without proper notice as required by law may be rejected by the court.',
        relevance: 'Medium'
      }
    ],
    action_steps: [
      'Check your rent agreement for specific notice period requirements',
      'If no agreement exists, follow Transfer of Property Act: 15 days for monthly tenancy',
      'Notice must be in writing and clearly state the termination date',
      'Send notice via registered post or speed post with acknowledgment',
      'Keep a copy of notice and postal receipt as proof',
      'If you are the tenant, ensure you vacate on or before the date mentioned in notice'
    ],
    deadlines: [
      'Month-to-month tenancy: 15 days notice ending with the month',
      'Year-to-year tenancy: 6 months notice',
      'As per agreement: Follow the specific clause in rent agreement'
    ],
    audit_log: [
      { statute: 'Transfer of Property Act §106', score: 0.94, method: 'semantic_search' },
      { statute: 'Model Tenancy Act §22', score: 0.89, method: 'semantic_search' },
      { statute: 'CPC Order 7 Rule 11', score: 0.72, method: 'keyword_match' }
    ]
  },
  'tenant-agreement': {
    query: '',
    detected_language: 'English',
    translated_query: '',
    domain: 'Tenancy',
    confidence_score: 81,
    cited_sections: [
      {
        act: 'Registration Act, 1908',
        section: 'Section 17',
        title: 'Documents of which registration is compulsory',
        snippet: 'Lease agreements for more than one year or those which reserve a yearly rent must be registered. Unregistered lease cannot be used as evidence in court.',
        relevance: 'High'
      },
      {
        act: 'Model Tenancy Act, 2021',
        section: 'Section 4',
        title: 'Written Agreement',
        snippet: 'Every tenancy shall be in writing and registered with Rent Authority. An unwritten tenancy shall be deemed to be month-to-month tenancy.',
        relevance: 'High'
      },
      {
        act: 'Indian Stamp Act, 1899',
        section: 'Various',
        title: 'Stamp Duty on Lease Agreements',
        snippet: 'Lease agreements must be executed on proper stamp paper as per state stamp duty rates. Unstamped agreements may be impounded by courts.',
        relevance: 'Medium'
      }
    ],
    action_steps: [
      'Request landlord in writing to create a proper rent agreement',
      'If verbal agreement exists, document payment history as evidence of tenancy',
      'Bank transfer records, utility bills in your name can establish tenancy',
      'Get 11-month agreement registered to avoid stamp duty complications',
      'Include all terms: rent amount, deposit, notice period, maintenance responsibilities',
      'Keep copies of all documents and correspondence'
    ],
    deadlines: [
      'Lease above 11 months must be registered within 4 months of execution',
      'Verbal tenancy is treated as month-to-month tenancy with 15-day notice period',
      'Register with local Rent Authority after signing agreement'
    ],
    audit_log: [
      { statute: 'Registration Act §17', score: 0.91, method: 'semantic_search' },
      { statute: 'Model Tenancy Act §4', score: 0.88, method: 'semantic_search' },
      { statute: 'Indian Stamp Act', score: 0.76, method: 'keyword_match' }
    ]
  },
  'tenant-general': {
    query: '',
    detected_language: 'English',
    translated_query: '',
    domain: 'Tenancy',
    confidence_score: 72,
    cited_sections: [
      {
        act: 'Transfer of Property Act, 1882',
        section: 'Section 105',
        title: 'Definition of Lease',
        snippet: 'A lease of immovable property is a transfer of a right to enjoy such property for a certain time, in consideration of a price paid or promised.',
        relevance: 'High'
      },
      {
        act: 'Model Tenancy Act, 2021',
        section: 'Section 3',
        title: 'Application',
        snippet: 'This Act applies to premises let out for residential, commercial, or educational purposes. Both landlord and tenant have rights and duties under this Act.',
        relevance: 'High'
      },
      {
        act: 'State Rent Control Acts',
        section: 'Various',
        title: 'General Provisions',
        snippet: 'Each state has its own Rent Control Act governing landlord-tenant relationships, rent fixation, eviction grounds, and dispute resolution.',
        relevance: 'Medium'
      }
    ],
    action_steps: [
      'Identify the specific issue: deposit, eviction, rent hike, maintenance, or agreement',
      'Check your rent agreement for relevant clauses',
      'Document all communications with landlord in writing',
      'For any dispute, first try to resolve amicably through written negotiation',
      'Approach the Rent Controller or Rent Tribunal in your district for unresolved disputes',
      'Consult a local lawyer for complex matters involving large sums or multiple issues'
    ],
    deadlines: [
      'Keep records of all rent payments and receipts',
      'Complaints to Rent Controller can be filed during active tenancy',
      'Civil suits generally have 3-year limitation for recovery of money'
    ],
    audit_log: [
      { statute: 'Transfer of Property Act §105', score: 0.85, method: 'semantic_search' },
      { statute: 'Model Tenancy Act §3', score: 0.82, method: 'semantic_search' },
      { statute: 'State Rent Control Acts', score: 0.78, method: 'keyword_match' }
    ]
  }
}

// Other domain responses (keeping the mock ones for non-tenant categories)
const otherResponses: Record<string, LegalResponse> = {
  'police-fir': {
    query: '',
    detected_language: 'English',
    translated_query: '',
    domain: 'Police/FIR',
    confidence_score: 92,
    cited_sections: [
      {
        act: 'Code of Criminal Procedure, 1973',
        section: 'Section 154',
        title: 'Information in cognizable cases',
        snippet: 'Every information relating to the commission of a cognizable offence shall be reduced to writing by the officer in charge of the police station.',
        relevance: 'High'
      },
      {
        act: 'Code of Criminal Procedure, 1973',
        section: 'Section 154(3)',
        title: 'Remedy if FIR not registered',
        snippet: 'Any person aggrieved by refusal to record FIR may send the information to the Superintendent of Police who shall investigate or direct investigation.',
        relevance: 'High'
      }
    ],
    action_steps: [
      'Submit written complaint to SHO (Station House Officer)',
      'If refused, send complaint by registered post to SP/SSP',
      'File complaint with Magistrate under Section 156(3) CrPC',
      'Use state online FIR portal if available',
      'File complaint with State Human Rights Commission'
    ],
    deadlines: [
      'FIR should be registered immediately',
      'Magistrate complaint can be filed anytime'
    ],
    audit_log: [
      { statute: 'CrPC §154', score: 0.96, method: 'semantic_search' },
      { statute: 'CrPC §156(3)', score: 0.89, method: 'semantic_search' }
    ]
  },
  'rti-filing': {
    query: '',
    detected_language: 'English',
    translated_query: '',
    domain: 'RTI',
    confidence_score: 95,
    cited_sections: [
      {
        act: 'Right to Information Act, 2005',
        section: 'Section 6',
        title: 'Request for obtaining information',
        snippet: 'A person who desires information shall make request in writing or electronic means to the Public Information Officer.',
        relevance: 'High'
      },
      {
        act: 'Right to Information Act, 2005',
        section: 'Section 7',
        title: 'Disposal of request',
        snippet: 'PIO shall provide information within 30 days of receipt of request.',
        relevance: 'High'
      }
    ],
    action_steps: [
      'Write RTI application addressing the PIO',
      'Pay Rs.10 as application fee',
      'Submit in person, by post, or through rtionline.gov.in',
      'Keep acknowledgment receipt for tracking'
    ],
    deadlines: [
      'Response within 30 days',
      'Life/liberty matters: 48 hours',
      'First appeal within 30 days'
    ],
    audit_log: [
      { statute: 'RTI Act §6', score: 0.98, method: 'semantic_search' },
      { statute: 'RTI Act §7', score: 0.94, method: 'semantic_search' }
    ]
  },
  'general': {
    query: '',
    detected_language: 'English',
    translated_query: '',
    domain: 'General',
    confidence_score: 60,
    cited_sections: [
      {
        act: 'Constitution of India',
        section: 'Article 39A',
        title: 'Equal Justice and Free Legal Aid',
        snippet: 'The State shall secure that the operation of the legal system promotes justice and shall provide free legal aid to ensure justice is not denied.',
        relevance: 'Medium'
      }
    ],
    action_steps: [
      'Please provide more details about your legal issue',
      'Specify the type of dispute: consumer, tenant, workplace, family, criminal',
      'Include relevant dates, amounts, and parties involved',
      'Visit nearest Legal Aid Services Authority for free consultation'
    ],
    deadlines: [
      'Different limitation periods apply to different types of cases',
      'Consult a lawyer for specific deadlines applicable to your case'
    ],
    audit_log: [
      { statute: 'Constitution Article 39A', score: 0.65, method: 'keyword_match' }
    ]
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body: QueryRequest = await request.json()

    if (!body.query || typeof body.query !== 'string' || body.query.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Query parameter is required and must be a non-empty string'
          }
        },
        { status: 400 }
      )
    }

    const detectedLanguage = body.language
      ? body.language.charAt(0).toUpperCase() + body.language.slice(1)
      : detectLanguage(body.query)

    const { domain, subType } = classifyDomain(body.query)

    // Get the appropriate response based on domain and sub-type
    let mockResponse: LegalResponse

    if (domain === 'tenant-rights' && subType && tenantResponses[subType]) {
      mockResponse = { ...tenantResponses[subType] }
    } else if (otherResponses[domain]) {
      mockResponse = { ...otherResponses[domain] }
    } else {
      mockResponse = { ...otherResponses['general'] }
    }

    // Build response with query-specific details
    const responseData: LegalResponse = {
      ...mockResponse,
      query: body.query,
      detected_language: detectedLanguage,
      translated_query: body.query,
    }

    if (!body.include_audit_log) {
      responseData.audit_log = []
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      data: responseData
    })

  } catch (error) {
    console.error('API Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An internal server error occurred. Please try again.'
        }
      },
      { status: 500 }
    )
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    name: 'Legal Saathi API',
    version: '1.0.0',
    endpoints: {
      query: {
        method: 'POST',
        path: '/api/query',
        description: 'Submit a legal query for AI-powered analysis'
      }
    },
    documentation: '/api-docs'
  })
}
