/**
 * Real Indian Legal Documents Database
 * 
 * This file contains actual legal provisions from Indian laws sourced from:
 * - India Code (https://indiacode.nic.in)
 * - Legislative Department (https://legislative.gov.in)
 * - Ministry of Law and Justice (https://lawmin.gov.in)
 * 
 * These are authentic legal texts that power the RAG system.
 */

export interface LegalDocument {
  id: string
  act: string
  section: string
  title: string
  fullText: string
  snippet: string
  keywords: string[]
  domain: string
  effectiveDate?: string
  amendmentDate?: string
  sourceUrl?: string
}

export const legalDocuments: LegalDocument[] = [
  // ============================================
  // RIGHT TO INFORMATION ACT, 2005
  // ============================================
  {
    id: 'rti-2005-s6',
    act: 'Right to Information Act, 2005',
    section: 'Section 6',
    title: 'Request for obtaining information',
    fullText: `(1) A person, who desires to obtain any information under this Act, shall make a request in writing or through electronic means in English or Hindi or in the official language of the area in which the application is being made, accompanying such fee as may be prescribed, to—
(a) the Central Public Information Officer or State Public Information Officer, as the case may be, of the concerned public authority;
(b) the Central Assistant Public Information Officer or State Assistant Public Information Officer, as the case may be, specifying the particulars of the information sought by him or her:
Provided that where such request cannot be made in writing, the Central Public Information Officer or State Public Information Officer, as the case may be, shall render all reasonable assistance to the person making the request orally to reduce the same in writing.
(2) An applicant making request for information shall not be required to give any reason for requesting the information or any other personal details except those that may be necessary for contacting him.
(3) Where an application is made to a public authority requesting for an information,—
(i) which is held by another public authority; or
(ii) the subject matter of which is more closely connected with the functions of another public authority, the public authority, to which such application is made, shall transfer the application or such part of it as may be appropriate to that other public authority and inform the applicant immediately about such transfer:
Provided that the transfer of an application pursuant to this sub-section shall be made as soon as practicable but in no case later than five days from the date of receipt of the application.`,
    snippet: 'A person, who desires to obtain any information under this Act, shall make a request in writing or through electronic means in English or Hindi or in the official language of the area in which the application is being made...',
    keywords: ['RTI', 'information', 'application', 'request', 'public authority', 'PIO', 'fee'],
    domain: 'RTI',
    effectiveDate: '2005-10-12',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/2006'
  },
  {
    id: 'rti-2005-s7',
    act: 'Right to Information Act, 2005',
    section: 'Section 7',
    title: 'Disposal of request',
    fullText: `(1) Subject to the proviso to sub-section (2) of section 5 or the proviso to sub-section (3) of section 6, the Central Public Information Officer or State Public Information Officer, as the case may be, on receipt of a request under section 6 shall, as expeditiously as possible, and in any case within thirty days of the receipt of the request, either provide the information on payment of such fee as may be prescribed or reject the request for any of the reasons specified in sections 8 and 9:
Provided that where the information sought for concerns the life or liberty of a person, the same shall be provided within forty-eight hours of the receipt of the request.
(2) If the Central Public Information Officer or State Public Information Officer, as the case may be, fails to give decision on the request for information within the period specified under sub-section (1), the Central Public Information Officer or State Public Information Officer, as the case may be, shall be deemed to have refused the request.
(3) Where a decision is taken to provide the information on payment of any further fee representing the cost of providing the information, the Central Public Information Officer or State Public Information Officer, as the case may be, shall send an intimation to the person making the request, giving—
(a) the details of further fees representing the cost of providing the information as determined by him, together with the calculations made to arrive at the amount in accordance with fee prescribed under sub-section (1), requesting him to deposit that fees, and the period intervening between the despatch of the said intimation and payment of fees shall be excluded for the purpose of calculating the period of thirty days referred to in that sub-section;
(b) information concerning his or her right with respect to review the decision as to the amount of fees charged or the form of access provided, including the particulars of the appellate authority, time limit, process and any other forms.`,
    snippet: 'The Central Public Information Officer or State Public Information Officer, on receipt of a request under section 6 shall, as expeditiously as possible, and in any case within thirty days of the receipt of the request, either provide the information or reject the request...',
    keywords: ['RTI', 'response', 'thirty days', '48 hours', 'life liberty', 'fee', 'disposal'],
    domain: 'RTI',
    effectiveDate: '2005-10-12',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/2006'
  },
  {
    id: 'rti-2005-s19',
    act: 'Right to Information Act, 2005',
    section: 'Section 19',
    title: 'Appeal',
    fullText: `(1) Any person who, does not receive a decision within the time specified in sub-section (1) or clause (a) of sub-section (3) of section 7, or is aggrieved by a decision of the Central Public Information Officer or State Public Information Officer, as the case may be, may within thirty days from the expiry of such period or from the receipt of such a decision prefer an appeal to such officer who is senior in rank to the Central Public Information Officer or State Public Information Officer as the case may be, in each public authority:
Provided that such officer may admit the appeal after the expiry of the period of thirty days if he or she is satisfied that the appellant was prevented by sufficient cause from filing the appeal in time.
(2) Where an appeal is preferred against an order made by a Central Public Information Officer or a State Public Information Officer, as the case may be, under section 11 to disclose third party information, the appeal by the concerned third party shall be made within thirty days from the date of the order.
(3) A second appeal against the decision under sub-section (1) shall lie within ninety days from the date on which the decision should have been made or was actually received, with the Central Information Commission or the State Information Commission:
Provided that the Central Information Commission or the State Information Commission, as the case may be, may admit the appeal after the expiry of the period of ninety days if it is satisfied that the appellant was prevented by sufficient cause from filing the appeal in time.`,
    snippet: 'Any person who does not receive a decision within the time specified, or is aggrieved by a decision of the PIO, may within thirty days prefer an appeal to such officer who is senior in rank to the PIO...',
    keywords: ['RTI', 'appeal', 'first appeal', 'second appeal', 'thirty days', 'ninety days', 'Information Commission'],
    domain: 'RTI',
    effectiveDate: '2005-10-12',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/2006'
  },

  // ============================================
  // CODE OF CRIMINAL PROCEDURE, 1973
  // ============================================
  {
    id: 'crpc-1973-s154',
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 154',
    title: 'Information in cognizable cases',
    fullText: `(1) Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant; and every such information, whether given in writing or reduced to writing as aforesaid, shall be signed by the person giving it, and the substance thereof shall be entered in a book to be kept by such officer in such form as the State Government may prescribe in this behalf.
(2) A copy of the information as recorded under sub-section (1) shall be given forthwith, free of cost, to the informant.
(3) Any person aggrieved by a refusal on the part of an officer in charge of a police station to record the information referred to in sub-section (1) may send the substance of such information, in writing and by post, to the Superintendent of Police concerned who, if satisfied that such information discloses the commission of a cognizable offence, shall either investigate the case himself or direct an investigation to be made by any police officer subordinate to him, in the manner provided by this Code, and such officer shall have all the powers of an officer in charge of the police station in relation to that offence.`,
    snippet: 'Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant...',
    keywords: ['FIR', 'cognizable offence', 'police station', 'information', 'writing', 'SP', 'Superintendent of Police'],
    domain: 'Criminal Law',
    effectiveDate: '1974-04-01',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/1611'
  },
  {
    id: 'crpc-1973-s156',
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 156',
    title: 'Police officer\'s power to investigate cognizable case',
    fullText: `(1) Any officer in charge of a police station may, without the order of a Magistrate, investigate any cognizable case which a Court having jurisdiction over the local area within the limits of such station would have power to inquire into or try under the provisions of Chapter XIII.
(2) No proceeding of a police officer in any such case shall at any stage be called in question on the ground that the case was one which such officer was not empowered under this section to investigate.
(3) Any Magistrate empowered under section 190 may order such an investigation as above-mentioned.`,
    snippet: 'Any officer in charge of a police station may, without the order of a Magistrate, investigate any cognizable case. Any Magistrate empowered under section 190 may order such an investigation.',
    keywords: ['investigation', 'cognizable case', 'police officer', 'Magistrate', 'section 156(3)'],
    domain: 'Criminal Law',
    effectiveDate: '1974-04-01',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/1611'
  },
  {
    id: 'crpc-1973-s482',
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 482',
    title: 'Saving of inherent powers of High Court',
    fullText: `Nothing in this Code shall be deemed to limit or affect the inherent powers of the High Court to make such orders as may be necessary to give effect to any order under this Code, or to prevent abuse of the process of any Court or otherwise to secure the ends of justice.`,
    snippet: 'Nothing in this Code shall be deemed to limit or affect the inherent powers of the High Court to make such orders as may be necessary to give effect to any order under this Code, or to prevent abuse of the process of any Court...',
    keywords: ['High Court', 'inherent powers', 'quashing', 'abuse of process', 'justice'],
    domain: 'Criminal Law',
    effectiveDate: '1974-04-01',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/1611'
  },

  // ============================================
  // INDIAN PENAL CODE, 1860
  // ============================================
  {
    id: 'ipc-1860-s166a',
    act: 'Indian Penal Code, 1860',
    section: 'Section 166A',
    title: 'Public servant disobeying direction under law',
    fullText: `Whoever, being a public servant,—
(a) knowingly disobeys any direction of the law which prohibits him from requiring the attendance at any place of any person for the purpose of investigation into an offence or any other matter, or
(b) knowingly disobeys, to the prejudice of any person, any other direction of the law regulating the manner in which he shall conduct such investigation, or
(c) fails to record any information given to him under sub-section (1) of section 154 of the Code of Criminal Procedure, 1973 (2 of 1974), in relation to cognizable offence punishable under section 326A, section 326B, section 354, section 354B, section 370, section 370A, section 376, section 376A, section 376AB, section 376B, section 376C, section 376D, section 376DA, section 376DB or section 509,
shall be punished with rigorous imprisonment for a term which shall not be less than six months but which may extend to two years, and shall also be liable to fine.`,
    snippet: 'Whoever, being a public servant, fails to record any information given to him under sub-section (1) of section 154 of CrPC in relation to cognizable offence, shall be punished with rigorous imprisonment...',
    keywords: ['public servant', 'FIR', 'failure to register', 'punishment', 'cognizable offence', 'police'],
    domain: 'Criminal Law',
    effectiveDate: '2013-04-03',
    amendmentDate: '2013-04-03',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/2263'
  },
  {
    id: 'ipc-1860-s498a',
    act: 'Indian Penal Code, 1860',
    section: 'Section 498A',
    title: 'Husband or relative of husband of a woman subjecting her to cruelty',
    fullText: `Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.
Explanation.—For the purposes of this section, "cruelty" means—
(a) any wilful conduct which is of such a nature as is likely to drive the woman to commit suicide or to cause grave injury or danger to life, limb or health (whether mental or physical) of the woman; or
(b) harassment of the woman where such harassment is with a view to coercing her or any person related to her to meet any unlawful demand for any property or valuable security or is on account of failure by her or any person related to her to meet such demand.`,
    snippet: 'Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.',
    keywords: ['cruelty', 'wife', 'husband', 'domestic violence', 'harassment', 'dowry', 'mental cruelty'],
    domain: 'Family Law',
    effectiveDate: '1983-12-25',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/2263'
  },

  // ============================================
  // CONSUMER PROTECTION ACT, 2019
  // ============================================
  {
    id: 'cpa-2019-s2-7',
    act: 'Consumer Protection Act, 2019',
    section: 'Section 2(7)',
    title: 'Definition of Consumer',
    fullText: `"consumer" means any person who—
(i) buys any goods for a consideration which has been paid or promised or partly paid and partly promised, or under any system of deferred payment and includes any user of such goods other than the person who buys such goods for consideration paid or promised or partly paid or partly promised, or under any system of deferred payment, when such use is made with the approval of such person, but does not include a person who obtains such goods for resale or for any commercial purpose; or
(ii) hires or avails of any service for a consideration which has been paid or promised or partly paid and partly promised, or under any system of deferred payment and includes any beneficiary of such service other than the person who hires or avails of the services for consideration paid or promised, or partly paid and partly promised, or under any system of deferred payment, when such services are availed of with the approval of the first mentioned person, but does not include a person who avails of such service for any commercial purpose.
Explanation.—For the purposes of this clause,—
(a) the expression "commercial purpose" does not include use by a person of goods bought and used by him exclusively for the purpose of earning his livelihood, by means of self-employment;
(b) the expressions "buys any goods" and "hires or avails any services" includes offline or online transactions through electronic means or by teleshopping or direct selling or multi-level marketing.`,
    snippet: 'Consumer means any person who buys any goods for a consideration which has been paid or promised or partly paid and partly promised, or hires or avails of any service for a consideration...',
    keywords: ['consumer', 'goods', 'services', 'consideration', 'online', 'offline', 'commercial purpose'],
    domain: 'Consumer Law',
    effectiveDate: '2020-07-20',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/15256'
  },
  {
    id: 'cpa-2019-s35',
    act: 'Consumer Protection Act, 2019',
    section: 'Section 35',
    title: 'Jurisdiction of District Commission',
    fullText: `(1) Subject to the other provisions of this Act, the District Commission shall have jurisdiction to entertain complaints where the value of the goods or services paid as consideration does not exceed one crore rupees:
Provided that where the Central Government deems it necessary so to do, it may prescribe such other value, as it deems fit.
(2) A complaint shall be instituted in a District Commission within the local limits of whose jurisdiction,—
(a) the opposite party or each of the opposite parties, where there are more than one, at the time of the institution of the complaint, ordinarily resides or carries on business or has a branch office or personally works for gain; or
(b) any of the opposite parties, where there are more than one, at the time of the institution of the complaint, actually and voluntarily resides, or carries on business or has a branch office, or personally works for gain, provided that in such case, the permission of the District Commission is obtained; or
(c) the cause of action, wholly or in part, arises; or
(d) the complainant resides or personally works for gain.`,
    snippet: 'The District Commission shall have jurisdiction to entertain complaints where the value of the goods or services paid as consideration does not exceed one crore rupees.',
    keywords: ['District Commission', 'jurisdiction', 'one crore', 'consumer complaint', 'cause of action'],
    domain: 'Consumer Law',
    effectiveDate: '2020-07-20',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/15256'
  },
  {
    id: 'cpa-2019-s39',
    act: 'Consumer Protection Act, 2019',
    section: 'Section 39',
    title: 'Manner of filing complaint and its limitation',
    fullText: `(1) A complaint in relation to any goods sold or delivered or any service provided may be filed with a District Commission by—
(a) the consumer to whom such goods are sold or delivered or such service is provided;
(b) any recognised consumer association, whether the consumer to whom such goods are sold or delivered or such service is provided is a member of such association or not;
(c) one or more consumers, where there are numerous consumers having the same interest;
(d) in case of death of a consumer, his legal heir or legal representative; or
(e) in case of a consumer being a minor, his parent or legal guardian.
(2) Every complaint filed under sub-section (1) shall be accompanied by such fee and filed in such manner as may be prescribed.
(3) The District Commission shall not admit a complaint unless it is filed within two years from the date on which the cause of action has arisen:
Provided that a complaint may be entertained after the period specified in this sub-section, if the complainant satisfies the District Commission that he had sufficient cause for not filing the complaint within such period:
Provided further that no such complaint shall be entertained unless the District Commission condones such delay.`,
    snippet: 'A complaint may be filed with a District Commission by the consumer, recognised consumer association, or in case of death of a consumer, his legal heir. The complaint must be filed within two years from the date on which the cause of action has arisen.',
    keywords: ['consumer complaint', 'District Commission', 'two years', 'limitation', 'legal heir', 'consumer association'],
    domain: 'Consumer Law',
    effectiveDate: '2020-07-20',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/15256'
  },

  // ============================================
  // PROTECTION OF WOMEN FROM DOMESTIC VIOLENCE ACT, 2005
  // ============================================
  {
    id: 'pwdva-2005-s3',
    act: 'Protection of Women from Domestic Violence Act, 2005',
    section: 'Section 3',
    title: 'Definition of domestic violence',
    fullText: `For the purposes of this Act, any act, omission or commission or conduct of the respondent shall constitute domestic violence in case it—
(a) harms or injures or endangers the health, safety, life, limb or well-being, whether mental or physical, of the aggrieved person or tends to do so and includes causing physical abuse, sexual abuse, verbal and emotional abuse and economic abuse; or
(b) harasses, harms, injures or endangers the aggrieved person with a view to coerce her or any other person related to her to meet any unlawful demand for any dowry or other property or valuable security; or
(c) has the effect of threatening the aggrieved person or any person related to her by any conduct mentioned in clause (a) or clause (b); or
(d) otherwise injures or causes harm, whether physical or mental, to the aggrieved person.
Explanation I.—For the purposes of this section,—
(i) "physical abuse" means any act or conduct which is of such a nature as to cause bodily pain, harm, or danger to life, limb, or health or impair the health or development of the aggrieved person and includes assault, criminal intimidation and criminal force;
(ii) "sexual abuse" includes any conduct of a sexual nature that abuses, humiliates, degrades or otherwise violates the dignity of woman;
(iii) "verbal and emotional abuse" includes—
(a) insults, ridicule, humiliation, name calling and insults or ridicule specially with regard to not having a child or a male child; and
(b) repeated threats to cause physical pain to any person in whom the aggrieved person is interested.
(iv) "economic abuse" includes—
(a) deprivation of all or any economic or financial resources to which the aggrieved person is entitled under any law or custom whether payable under an order of a court or otherwise or which the aggrieved person requires out of necessity including, but not limited to, household necessities for the aggrieved person and her children, if any, stridhan, property, jointly or separately owned by the aggrieved person, payment of rental related to the shared household and maintenance;
(b) disposal of household effects, any alienation of assets whether movable or immovable, valuables, shares, securities, bonds and the like or other property in which the aggrieved person has an interest or is entitled to use by virtue of the domestic relationship or which may be reasonably required by the aggrieved person or her children or her stridhan or any other property jointly or separately held by the aggrieved person; and
(c) prohibition or restriction to continued access to resources or facilities which the aggrieved person is entitled to use or enjoy by virtue of the domestic relationship including access to the shared household.`,
    snippet: 'Domestic violence includes physical abuse, sexual abuse, verbal and emotional abuse and economic abuse. It includes any act that harms or injures or endangers the health, safety, life, limb or well-being of the aggrieved person.',
    keywords: ['domestic violence', 'physical abuse', 'sexual abuse', 'emotional abuse', 'economic abuse', 'women', 'protection'],
    domain: 'Family Law',
    effectiveDate: '2006-10-26',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/2021'
  },
  {
    id: 'pwdva-2005-s12',
    act: 'Protection of Women from Domestic Violence Act, 2005',
    section: 'Section 12',
    title: 'Application to Magistrate',
    fullText: `(1) An aggrieved person or a Protection Officer or any other person on behalf of the aggrieved person may present an application to the Magistrate seeking one or more reliefs under this Act:
Provided that before passing any order on such application, the Magistrate shall take into consideration any domestic incident report received by him from the Protection Officer or the service provider.
(2) The relief sought for under sub-section (1) may include a relief for issuance of an order for payment of compensation or damages without prejudice to the right of such person to institute a suit for compensation or damages for the injuries caused by the acts of domestic violence committed by the respondent:
Provided that where a decree for any amount as compensation or damages has been passed by any court in favour of the aggrieved person, the amount, if any, paid or payable in pursuance of the order made by the Magistrate under this Act shall be set off against the amount payable under such decree and vice versa.
(3) Every application under sub-section (1) shall be in such form and contain such particulars as may be prescribed or as nearly as possible thereto.
(4) The Magistrate shall fix the first date of hearing, which shall not ordinarily be beyond three days from the date of receipt of the application by the court.
(5) The Magistrate shall endeavour to dispose of every application made under sub-section (1) within a period of sixty days from the date of its first hearing.`,
    snippet: 'An aggrieved person or a Protection Officer may present an application to the Magistrate seeking relief under this Act. The Magistrate shall fix the first hearing within three days and endeavour to dispose of the application within sixty days.',
    keywords: ['Magistrate', 'application', 'Protection Officer', 'domestic violence', 'relief', 'sixty days', 'compensation'],
    domain: 'Family Law',
    effectiveDate: '2006-10-26',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/2021'
  },

  // ============================================
  // TRANSFER OF PROPERTY ACT, 1882
  // ============================================
  {
    id: 'topa-1882-s106',
    act: 'Transfer of Property Act, 1882',
    section: 'Section 106',
    title: 'Duration of certain leases in absence of written contract or local usage',
    fullText: `In the absence of a contract or local law or usage to the contrary, a lease of immovable property for agricultural or manufacturing purposes shall be deemed to be a lease from year to year, terminable, on the part of either lessor or lessee, by six months' notice; and a lease of immovable property for any other purpose shall be deemed to be a lease from month to month, terminable, on the part of either lessor or lessee, by fifteen days' notice.
Every notice under this section must be in writing, signed by or on behalf of the person giving it, and either be sent by post to the party who is intended to be bound by it or be tendered or delivered personally to such party, or to one of his family or servants at his residence, or (if such tender or delivery is not practicable) affixed to a conspicuous part of the property.`,
    snippet: 'In the absence of a contract, a lease for agricultural purposes is terminable by six months\' notice, and for any other purpose by fifteen days\' notice. Every notice must be in writing.',
    keywords: ['lease', 'tenancy', 'notice', 'six months', 'fifteen days', 'landlord', 'tenant', 'eviction'],
    domain: 'Property Law',
    effectiveDate: '1882-07-01',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/2338'
  },
  {
    id: 'topa-1882-s108',
    act: 'Transfer of Property Act, 1882',
    section: 'Section 108',
    title: 'Rights and liabilities of lessor and lessee',
    fullText: `In the absence of a contract or local usage to the contrary, the lessor and the lessee of immovable property, as against one another, respectively, possess the rights and are subject to the liabilities mentioned in the rules next following, or such of them as are applicable to the property leased:—
(A) Rights and Liabilities of the Lessor
(a) The lessor is bound to disclose to the lessee any material defect in the property, with reference to its intended use, of which the former is and the latter is not aware, and which the latter could not with ordinary care discover;
(b) the lessor is bound on the lessee's request to put him in possession of the property;
(c) the lessor shall be deemed to contract with the lessee that, if the latter pays the rent reserved by the lease and performs the contracts binding on the lessee, he may hold the property during the time limited by the lease without interruption.
(B) Rights and Liabilities of the Lessee
(d) If during the continuance of the lease any accession is made to the property, such accession (subject to the law relating to alluvion for the time being in force) shall be deemed to be comprised in the lease;
(e) if by fire, tempest or flood, or violence of an army or of a mob, or other irresistible force, any material part of the property be wholly destroyed or rendered substantially and permanently unfit for the purposes for which it was let, the lease shall, at the option of the lessee, be void.`,
    snippet: 'The lessor is bound to disclose material defects in the property and to put the lessee in possession. The lessee may hold the property without interruption if rent is paid and contracts performed.',
    keywords: ['lessor', 'lessee', 'rights', 'liabilities', 'possession', 'defect', 'rent', 'lease'],
    domain: 'Property Law',
    effectiveDate: '1882-07-01',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/2338'
  },

  // ============================================
  // SEXUAL HARASSMENT OF WOMEN AT WORKPLACE ACT, 2013
  // ============================================
  {
    id: 'shww-2013-s2',
    act: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
    section: 'Section 2(n)',
    title: 'Definition of sexual harassment',
    fullText: `"sexual harassment" includes any one or more of the following unwelcome acts or behaviour (whether directly or by implication) namely:—
(i) physical contact and advances; or
(ii) a demand or request for sexual favours; or
(iii) making sexually coloured remarks; or
(iv) showing pornography; or
(v) any other unwelcome physical, verbal or non-verbal conduct of sexual nature.`,
    snippet: 'Sexual harassment includes physical contact and advances, demand for sexual favours, sexually coloured remarks, showing pornography, or any other unwelcome conduct of sexual nature.',
    keywords: ['sexual harassment', 'workplace', 'women', 'physical contact', 'sexual favours', 'harassment'],
    domain: 'Labour Law',
    effectiveDate: '2013-12-09',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/1998'
  },
  {
    id: 'shww-2013-s4',
    act: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
    section: 'Section 4',
    title: 'Constitution of Internal Complaints Committee',
    fullText: `(1) Every employer of a workplace shall, by an order in writing, constitute a Committee to be known as the "Internal Complaints Committee":
Provided that where the offices or administrative units of the workplace are located at different places or divisional or sub-divisional level, the Internal Committee shall be constituted at all administrative units or offices.
(2) The Internal Complaints Committee shall consist of the following members to be nominated by the employer, namely:—
(a) a Presiding Officer who shall be a woman employed at a senior level at workplace from amongst the employees:
Provided that in case a senior level woman employee is not available, the Presiding Officer shall be nominated from other offices or administrative units of the workplace referred to in sub-section (1):
Provided further that in case the other offices or administrative units of the workplace do not have a senior level woman employee, the Presiding Officer shall be nominated from any other workplace of the same employer or other department or organisation;
(b) not less than two Members from amongst employees preferably committed to the cause of women or who have had experience in social work or have legal knowledge;
(c) one member from amongst non-governmental organisations or associations committed to the cause of women or a person familiar with the issues relating to sexual harassment.`,
    snippet: 'Every employer shall constitute an Internal Complaints Committee with a woman Presiding Officer at senior level, at least two employee members, and one member from NGO or person familiar with sexual harassment issues.',
    keywords: ['ICC', 'Internal Complaints Committee', 'workplace', 'sexual harassment', 'employer', 'Presiding Officer'],
    domain: 'Labour Law',
    effectiveDate: '2013-12-09',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/1998'
  },

  // ============================================
  // MOTOR VEHICLES ACT, 1988
  // ============================================
  {
    id: 'mva-1988-s166',
    act: 'Motor Vehicles Act, 1988',
    section: 'Section 166',
    title: 'Application for compensation',
    fullText: `(1) An application for compensation arising out of an accident of the nature specified in sub-section (1) of section 165 may be made—
(a) by the person who has sustained the injury; or
(b) by the owner of the property; or
(c) where death has resulted from the accident, by all or any of the legal representatives of the deceased; or
(d) by any agent duly authorised by the person injured or all or any of the legal representatives of the deceased, as the case may be:
Provided that where all the legal representatives of the deceased have not joined in any such application for compensation, the application shall be made on behalf of or for the benefit of all the legal representatives of the deceased and the legal representatives who have not so joined, shall be impleaded as respondents to the application.
(2) Every application under sub-section (1) shall be made, at the option of the claimant, either to the Claims Tribunal having jurisdiction over the area in which the accident occurred, or to the Claims Tribunal within the local limits of whose jurisdiction the claimant resides or carries on business or within the local limits of whose jurisdiction the defendant resides, and shall be in such form and contain such particulars as may be prescribed:
Provided that where no claim for compensation under section 140 is made in such application, the application shall contain a separate statement to that effect immediately before the signature of the applicant.`,
    snippet: 'An application for compensation arising out of a motor accident may be made by the injured person, owner of property, or legal representatives of the deceased to the Claims Tribunal.',
    keywords: ['motor accident', 'compensation', 'Claims Tribunal', 'injury', 'death', 'legal representative'],
    domain: 'Motor Vehicle Law',
    effectiveDate: '1989-07-01',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/1798'
  },

  // ============================================
  // NEGOTIABLE INSTRUMENTS ACT, 1881
  // ============================================
  {
    id: 'nia-1881-s138',
    act: 'Negotiable Instruments Act, 1881',
    section: 'Section 138',
    title: 'Dishonour of cheque for insufficiency of funds',
    fullText: `Where any cheque drawn by a person on an account maintained by him with a banker for payment of any amount of money to another person from out of that account for the discharge, in whole or in part, of any debt or other liability, is returned by the bank unpaid, either because of the amount of money standing to the credit of that account is insufficient to honour the cheque or that it exceeds the amount arranged to be paid from that account by an agreement made with that bank, such person shall be deemed to have committed an offence and shall, without prejudice to any other provisions of this Act, be punished with imprisonment for a term which may extend to two years, or with fine which may extend to twice the amount of the cheque, or with both:
Provided that nothing contained in this section shall apply unless—
(a) the cheque has been presented to the bank within a period of six months from the date on which it is drawn or within the period of its validity, whichever is earlier;
(b) the payee or the holder in due course of the cheque, as the case may be, makes a demand for the payment of the said amount of money by giving a notice in writing, to the drawer of the cheque, within thirty days of the receipt of information by him from the bank regarding the return of the cheque as unpaid; and
(c) the drawer of such cheque fails to make the payment of the said amount of money to the payee or, as the case may be, to the holder in due course of the cheque, within fifteen days of the receipt of the said notice.`,
    snippet: 'Where a cheque is returned unpaid due to insufficient funds, the drawer commits an offence punishable with imprisonment up to two years or fine up to twice the cheque amount. The payee must send notice within 30 days of dishonour.',
    keywords: ['cheque bounce', 'dishonour', 'insufficient funds', 'notice', 'thirty days', 'fifteen days', 'imprisonment'],
    domain: 'Banking Law',
    effectiveDate: '1988-04-01',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/2323'
  },

  // ============================================
  // LIMITATION ACT, 1963
  // ============================================
  {
    id: 'la-1963-s3',
    act: 'Limitation Act, 1963',
    section: 'Section 3',
    title: 'Bar of limitation',
    fullText: `(1) Subject to the provisions contained in sections 4 to 24 (inclusive), every suit instituted, appeal preferred, and application made after the prescribed period shall be dismissed although limitation has not been set up as a defence.
(2) For the purposes of this Act,—
(a) a suit is instituted,—
(i) in an ordinary case, when the plaint is presented to the proper officer;
(ii) in the case of a pauper, when his application for leave to sue as a pauper is made; and
(iii) in the case of a claim against a company which is being wound up by the court, when the claimant first sends in his claim to the official liquidator;
(b) any claim by way of a set off or a counter claim, shall be treated as a separate suit and shall be deemed to have been instituted—
(i) in the case of a set off, on the same date as the suit in which the set off is pleaded;
(ii) in the case of a counter claim, on the date on which the counter claim is made in court;
(c) an application by notice of motion in a High Court is made when the application is presented to the proper officer of that court.`,
    snippet: 'Every suit instituted, appeal preferred, and application made after the prescribed period shall be dismissed although limitation has not been set up as a defence.',
    keywords: ['limitation', 'time limit', 'suit', 'appeal', 'application', 'prescribed period', 'dismissal'],
    domain: 'Civil Law',
    effectiveDate: '1964-01-01',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/1565'
  },

  // ============================================
  // SPECIFIC RELIEF ACT, 1963
  // ============================================
  {
    id: 'sra-1963-s6',
    act: 'Specific Relief Act, 1963',
    section: 'Section 6',
    title: 'Suit by person dispossessed of immovable property',
    fullText: `(1) If any person is dispossessed without his consent of immovable property otherwise than in due course of law, he or any person claiming through him may, by suit, recover possession thereof, notwithstanding any other title that may be set up in such suit.
(2) No suit under this section shall be brought—
(a) after the expiry of six months from the date of dispossession; or
(b) against the Government.
(3) No appeal shall lie from any order or decree passed in any suit instituted under this section, nor shall any review of any such order or decree be allowed.
(4) Nothing in this section shall bar any person from suing to establish his title to such property and to recover possession thereof.`,
    snippet: 'If any person is dispossessed without consent of immovable property otherwise than in due course of law, he may by suit recover possession within six months from the date of dispossession.',
    keywords: ['dispossession', 'immovable property', 'possession', 'six months', 'title', 'recovery'],
    domain: 'Property Law',
    effectiveDate: '1964-03-01',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/1926'
  },

  // ============================================
  // INFORMATION TECHNOLOGY ACT, 2000
  // ============================================
  {
    id: 'it-2000-s66c',
    act: 'Information Technology Act, 2000',
    section: 'Section 66C',
    title: 'Punishment for identity theft',
    fullText: `Whoever, fraudulently or dishonestly make use of the electronic signature, password or any other unique identification feature of any other person, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to rupees one lakh.`,
    snippet: 'Whoever fraudulently or dishonestly makes use of the electronic signature, password or any other unique identification feature of any other person, shall be punished with imprisonment up to three years and fine up to one lakh rupees.',
    keywords: ['identity theft', 'password', 'electronic signature', 'cyber crime', 'fraud', 'punishment'],
    domain: 'Cyber Law',
    effectiveDate: '2008-10-27',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/1999'
  },
  {
    id: 'it-2000-s66d',
    act: 'Information Technology Act, 2000',
    section: 'Section 66D',
    title: 'Punishment for cheating by personation by using computer resource',
    fullText: `Whoever, by means for any communication device or computer resource cheats by personating, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees.`,
    snippet: 'Whoever cheats by personation using computer resource shall be punished with imprisonment up to three years and fine up to one lakh rupees.',
    keywords: ['cheating', 'personation', 'computer', 'cyber crime', 'fraud', 'punishment', 'online fraud'],
    domain: 'Cyber Law',
    effectiveDate: '2008-10-27',
    sourceUrl: 'https://indiacode.nic.in/handle/123456789/1999'
  },
]

// Group documents by domain for easier access
export const documentsByDomain: Record<string, LegalDocument[]> = legalDocuments.reduce((acc, doc) => {
  if (!acc[doc.domain]) {
    acc[doc.domain] = []
  }
  acc[doc.domain].push(doc)
  return acc
}, {} as Record<string, LegalDocument[]>)

// Get all unique domains
export const allDomains = [...new Set(legalDocuments.map(doc => doc.domain))]

// Helper function to search documents by keywords
export function searchDocumentsByKeywords(query: string): LegalDocument[] {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/)
  
  return legalDocuments
    .map(doc => {
      const matchScore = doc.keywords.reduce((score, keyword) => {
        if (queryLower.includes(keyword.toLowerCase())) {
          return score + 2
        }
        if (queryWords.some(word => keyword.toLowerCase().includes(word))) {
          return score + 1
        }
        return score
      }, 0)
      
      // Also check title and snippet
      if (doc.title.toLowerCase().includes(queryLower)) {
        return { doc, score: matchScore + 3 }
      }
      if (doc.snippet.toLowerCase().includes(queryLower)) {
        return { doc, score: matchScore + 2 }
      }
      
      return { doc, score: matchScore }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ doc }) => doc)
}
