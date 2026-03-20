import type { LegalResponse, QueryRecord, DomainDistribution, DashboardStats } from './types'

// Mock responses for each topic chip
export const mockResponses: Record<string, LegalResponse> = {
  'tenant-rights': {
    query: "Mera landlord bina notice deposit wapas nahi kar raha",
    detected_language: "Hindi",
    translated_query: "My landlord is not returning deposit without notice",
    domain: "Tenancy",
    confidence_score: 78,
    cited_sections: [
      {
        act: "Transfer of Property Act, 1882",
        section: "Section 106",
        title: "Duration of certain leases in absence of written contract",
        snippet: "In the absence of a contract or local law or usage to the contrary, a lease of immovable property for agricultural or manufacturing purposes shall be deemed to be a lease from year to year, terminable, on the part of either lessor or lessee, by six months' notice...",
        relevance: "High"
      },
      {
        act: "Consumer Protection Act, 2019",
        section: "Section 2(7)",
        title: "Definition of Consumer",
        snippet: "Consumer means any person who buys any goods or hires or avails any service for a consideration which has been paid or promised or partly paid and partly promised...",
        relevance: "Medium"
      },
      {
        act: "Rent Control Act (Model)",
        section: "Section 14",
        title: "Security Deposit Provisions",
        snippet: "The landlord shall refund the security deposit within one month of the tenant vacating the premises, after deducting any legitimate dues...",
        relevance: "High"
      }
    ],
    action_steps: [
      "Send a written legal notice to landlord via registered post demanding return of deposit within 15 days",
      "Keep copies of rent receipts, agreement, and deposit payment proof",
      "File complaint at District Consumer Forum if amount is less than ₹1 crore",
      "Approach Rent Control Tribunal in your district for faster resolution",
      "Consider filing a civil suit for recovery if other remedies fail"
    ],
    deadlines: [
      "Consumer complaint must be filed within 2 years of cause of action",
      "Legal notice should give 15-30 days for response"
    ],
    audit_log: [
      { statute: "Transfer of Property Act §106", score: 0.91, method: "semantic_search" },
      { statute: "Consumer Protection Act §35", score: 0.74, method: "keyword_match" },
      { statute: "Rent Control Act §14", score: 0.82, method: "hybrid" }
    ]
  },
  'police-fir': {
    query: "Police meri FIR darz nahi kar rahi hai",
    detected_language: "Hindi",
    translated_query: "Police is not registering my FIR",
    domain: "Police/FIR",
    confidence_score: 92,
    cited_sections: [
      {
        act: "Code of Criminal Procedure, 1973",
        section: "Section 154",
        title: "Information in cognizable cases",
        snippet: "Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant...",
        relevance: "High"
      },
      {
        act: "Code of Criminal Procedure, 1973",
        section: "Section 154(3)",
        title: "Remedy if FIR not registered",
        snippet: "Any person aggrieved by a refusal on the part of an officer in charge of a police station to record the information referred to in subsection (1) may send the substance of such information, in writing and by post, to the Superintendent of Police concerned...",
        relevance: "High"
      },
      {
        act: "Indian Penal Code, 1860",
        section: "Section 166A",
        title: "Public servant disobeying direction under law",
        snippet: "Whoever, being a public servant, knowingly disobeys any direction of the law which prohibits him from requiring the attendance at any place of any person for the purpose of investigation into an offence...",
        relevance: "Medium"
      }
    ],
    action_steps: [
      "Write down your complaint and submit it in writing to the SHO (Station House Officer)",
      "If refused, send your complaint by registered post to the Superintendent of Police (SP)",
      "You can also file a complaint directly with the Magistrate under Section 156(3) CrPC",
      "Use the online FIR facility available in most states",
      "File a complaint with the State Human Rights Commission if rights are violated"
    ],
    deadlines: [
      "FIR should be registered immediately - there is no time limit for police to refuse",
      "Magistrate complaint can be filed anytime"
    ],
    audit_log: [
      { statute: "CrPC §154", score: 0.96, method: "semantic_search" },
      { statute: "CrPC §156(3)", score: 0.89, method: "semantic_search" },
      { statute: "IPC §166A", score: 0.71, method: "keyword_match" }
    ]
  },
  'rti-filing': {
    query: "RTI kaise file karein government office mein",
    detected_language: "Hindi",
    translated_query: "How to file RTI in government office",
    domain: "RTI",
    confidence_score: 95,
    cited_sections: [
      {
        act: "Right to Information Act, 2005",
        section: "Section 6",
        title: "Request for obtaining information",
        snippet: "A person, who desires to obtain any information under this Act, shall make a request in writing or through electronic means in English or Hindi or in the official language of the area...",
        relevance: "High"
      },
      {
        act: "Right to Information Act, 2005",
        section: "Section 7",
        title: "Disposal of request",
        snippet: "Subject to the proviso to sub-section (2) of section 5 or the proviso to sub-section (3) of section 6, the Central Public Information Officer or State Public Information Officer, as the case may be, on receipt of a request under section 6 shall, as expeditiously as possible, and in any case within thirty days of the receipt of the request...",
        relevance: "High"
      },
      {
        act: "Right to Information Act, 2005",
        section: "Section 19",
        title: "Appeal",
        snippet: "Any person who, does not receive a decision within the time specified in sub-section (1) or clause (a) of sub-section (3) of section 7, or is aggrieved by a decision of the Central Public Information Officer or State Public Information Officer, may within thirty days from the expiry of such period or from the receipt of such a decision prefer an appeal to such officer who is senior in rank to the Central Public Information Officer or State Public Information Officer...",
        relevance: "Medium"
      }
    ],
    action_steps: [
      "Write your RTI application addressing the Public Information Officer (PIO) of the concerned department",
      "Pay ₹10 as application fee (by postal order, DD, or cash where accepted)",
      "BPL card holders are exempt from fees - attach BPL certificate",
      "Submit application in person, by post, or through online RTI portal (rtionline.gov.in)",
      "Keep acknowledgment receipt safe for tracking and appeals"
    ],
    deadlines: [
      "Response must be provided within 30 days",
      "For life/liberty matters, response within 48 hours",
      "First appeal within 30 days of response/non-response"
    ],
    audit_log: [
      { statute: "RTI Act §6", score: 0.98, method: "semantic_search" },
      { statute: "RTI Act §7", score: 0.94, method: "semantic_search" },
      { statute: "RTI Act §19", score: 0.85, method: "hybrid" }
    ]
  },
  'workplace-harassment': {
    query: "Office mein boss harassment kar raha hai",
    detected_language: "Hindi",
    translated_query: "Boss is harassing me at office",
    domain: "Workplace",
    confidence_score: 85,
    cited_sections: [
      {
        act: "Sexual Harassment of Women at Workplace Act, 2013",
        section: "Section 2(n)",
        title: "Definition of Sexual Harassment",
        snippet: "Sexual harassment includes any one or more of the following unwelcome acts or behaviour: physical contact and advances, a demand or request for sexual favours, making sexually coloured remarks, showing pornography, any other unwelcome physical, verbal or non-verbal conduct of sexual nature...",
        relevance: "High"
      },
      {
        act: "Sexual Harassment of Women at Workplace Act, 2013",
        section: "Section 4",
        title: "Constitution of Internal Complaints Committee",
        snippet: "Every employer of a workplace shall, by an order in writing, constitute a Committee to be known as the Internal Complaints Committee...",
        relevance: "High"
      },
      {
        act: "Indian Penal Code, 1860",
        section: "Section 354A",
        title: "Sexual harassment and punishment",
        snippet: "A man committing any of the following acts: physical contact and advances involving unwelcome and explicit sexual overtures; or a demand or request for sexual favours; or showing pornography against the will of a woman; or making sexually coloured remarks, shall be guilty of the offence of sexual harassment...",
        relevance: "High"
      }
    ],
    action_steps: [
      "Document all incidents with dates, times, witnesses, and evidence",
      "File a written complaint with the Internal Complaints Committee (ICC) of your organization",
      "If no ICC exists, approach the Local Complaints Committee at the district level",
      "You can also file a police complaint under IPC Section 354A",
      "Seek support from women's helpline 181 or NCW helpline 7827-170-170"
    ],
    deadlines: [
      "Complaint to ICC must be filed within 3 months of incident",
      "ICC must complete inquiry within 90 days"
    ],
    audit_log: [
      { statute: "POSH Act §2(n)", score: 0.93, method: "semantic_search" },
      { statute: "POSH Act §4", score: 0.88, method: "semantic_search" },
      { statute: "IPC §354A", score: 0.91, method: "hybrid" }
    ]
  },
  'consumer-complaint': {
    query: "Defective product ka refund nahi mil raha",
    detected_language: "Hindi",
    translated_query: "Not getting refund for defective product",
    domain: "Consumer",
    confidence_score: 88,
    cited_sections: [
      {
        act: "Consumer Protection Act, 2019",
        section: "Section 2(6)",
        title: "Definition of Complaint",
        snippet: "Complaint means any allegation in writing made by a complainant for obtaining any relief provided under this Act...",
        relevance: "High"
      },
      {
        act: "Consumer Protection Act, 2019",
        section: "Section 35",
        title: "Jurisdiction of District Commission",
        snippet: "Subject to the other provisions of this Act, the District Commission shall have jurisdiction to entertain complaints where the value of the goods or services paid as consideration does not exceed one crore rupees...",
        relevance: "High"
      },
      {
        act: "Consumer Protection Act, 2019",
        section: "Section 39",
        title: "Relief which may be granted by District Commission",
        snippet: "If the District Commission is satisfied that the goods complained against suffer from any of the defects specified in the complaint or that any of the allegations contained in the complaint about the services or any unfair trade practice or restrictive trade practices are proved, it shall issue an order to the opposite party directing him to do one or more of the following things...",
        relevance: "High"
      }
    ],
    action_steps: [
      "Send a legal notice to the seller/manufacturer demanding refund within 15 days",
      "Collect all evidence: bills, warranty card, photos of defect, communication records",
      "File complaint at District Consumer Forum (for claims up to ₹1 crore)",
      "You can file online at edaakhil.nic.in - National Consumer Helpline portal",
      "No lawyer required - you can argue your own case"
    ],
    deadlines: [
      "File complaint within 2 years from date of cause of action",
      "Forum must dispose case within 3 months (5 months if testing required)"
    ],
    audit_log: [
      { statute: "Consumer Protection Act §35", score: 0.95, method: "semantic_search" },
      { statute: "Consumer Protection Act §39", score: 0.89, method: "semantic_search" },
      { statute: "Consumer Protection Act §2(6)", score: 0.82, method: "keyword_match" }
    ]
  },
  'domestic-violence': {
    query: "Pati ghar mein maarta hai, kya karein",
    detected_language: "Hindi",
    translated_query: "Husband beats at home, what to do",
    domain: "Family Law",
    confidence_score: 55,
    cited_sections: [
      {
        act: "Protection of Women from Domestic Violence Act, 2005",
        section: "Section 3",
        title: "Definition of Domestic Violence",
        snippet: "For the purposes of this Act, any act, omission or commission or conduct of the respondent shall constitute domestic violence in case it harms or injures or endangers the health, safety, life, limb or well-being, whether mental or physical, of the aggrieved person or tends to do so...",
        relevance: "High"
      },
      {
        act: "Protection of Women from Domestic Violence Act, 2005",
        section: "Section 12",
        title: "Application to Magistrate",
        snippet: "An aggrieved person or a Protection Officer or any other person on behalf of the aggrieved person may present an application to the Magistrate seeking one or more reliefs under this Act...",
        relevance: "High"
      },
      {
        act: "Indian Penal Code, 1860",
        section: "Section 498A",
        title: "Husband or relative subjecting woman to cruelty",
        snippet: "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine...",
        relevance: "High"
      }
    ],
    action_steps: [
      "Immediately contact Women Helpline 181 or police emergency 100",
      "Go to the nearest Protection Officer or Service Provider registered under DV Act",
      "File complaint at local police station - they must register it",
      "Approach Magistrate directly for protection orders under DV Act",
      "Seek shelter at government-run short-stay homes or One Stop Centres"
    ],
    deadlines: [
      "Protection order can be obtained within 3 days in urgent cases",
      "No limitation period for filing domestic violence complaint"
    ],
    audit_log: [
      { statute: "DV Act §3", score: 0.94, method: "semantic_search" },
      { statute: "DV Act §12", score: 0.91, method: "semantic_search" },
      { statute: "IPC §498A", score: 0.88, method: "hybrid" }
    ]
  }
}

// Dashboard mock data
export const mockDashboardStats: DashboardStats = {
  totalQueriesToday: 1247,
  escalatedCases: 89,
  topLegalDomain: "Consumer",
  avgConfidence: 76
}

export const mockQueryRecords: QueryRecord[] = [
  {
    id: "Q001",
    query: "Mera landlord deposit wapas nahi kar raha hai, 6 mahine ho gaye",
    domain: "Tenancy",
    confidence: 78,
    status: "Resolved",
    timestamp: "2024-01-15T10:30:00",
    language: "hi"
  },
  {
    id: "Q002",
    query: "Police is not registering my FIR for theft case",
    domain: "Police/FIR",
    confidence: 92,
    status: "Resolved",
    timestamp: "2024-01-15T11:15:00",
    language: "en"
  },
  {
    id: "Q003",
    query: "Office mein sexual harassment ho raha hai mujhe darr lagta hai",
    domain: "Workplace",
    confidence: 45,
    status: "Escalated",
    timestamp: "2024-01-15T11:45:00",
    language: "hi"
  },
  {
    id: "Q004",
    query: "How to file RTI for getting birth certificate details",
    domain: "RTI",
    confidence: 95,
    status: "Resolved",
    timestamp: "2024-01-15T12:00:00",
    language: "en"
  },
  {
    id: "Q005",
    query: "Consumer complaint for defective mobile phone, company not responding",
    domain: "Consumer",
    confidence: 88,
    status: "Resolved",
    timestamp: "2024-01-15T12:30:00",
    language: "en"
  },
  {
    id: "Q006",
    query: "Sasural wale dowry maang rahe hain aur torture kar rahe hain",
    domain: "Family Law",
    confidence: 52,
    status: "Escalated",
    timestamp: "2024-01-15T13:00:00",
    language: "hi"
  },
  {
    id: "Q007",
    query: "Builder not giving possession after 3 years, paid full amount",
    domain: "Consumer",
    confidence: 82,
    status: "Resolved",
    timestamp: "2024-01-15T13:30:00",
    language: "en"
  },
  {
    id: "Q008",
    query: "Mujhe illegal detention mein rakha gaya tha police ne",
    domain: "Police/FIR",
    confidence: 38,
    status: "Escalated",
    timestamp: "2024-01-15T14:00:00",
    language: "hi"
  }
]

export const mockDomainDistribution: DomainDistribution[] = [
  { domain: "Consumer", count: 342, percentage: 27.4 },
  { domain: "Tenancy", count: 234, percentage: 18.8 },
  { domain: "Police/FIR", count: 198, percentage: 15.9 },
  { domain: "RTI", count: 187, percentage: 15.0 },
  { domain: "Workplace", count: 156, percentage: 12.5 },
  { domain: "Family Law", count: 98, percentage: 7.9 },
  { domain: "IPC", count: 32, percentage: 2.5 }
]

export const languageOptions = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' }
] as const

export const topicChips = [
  { id: 'tenant-rights', label: 'Tenant Rights', labelHi: 'किरायेदार अधिकार' },
  { id: 'police-fir', label: 'Police Complaint (FIR)', labelHi: 'पुलिस शिकायत (FIR)' },
  { id: 'rti-filing', label: 'RTI Filing', labelHi: 'RTI दायर करना' },
  { id: 'workplace-harassment', label: 'Workplace Harassment', labelHi: 'कार्यस्थल उत्पीड़न' },
  { id: 'consumer-complaint', label: 'Consumer Complaint', labelHi: 'उपभोक्ता शिकायत' },
  { id: 'domestic-violence', label: 'Domestic Violence', labelHi: 'घरेलू हिंसा' }
] as const
