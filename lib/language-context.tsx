'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'hi'

interface Translations {
  [key: string]: {
    en: string
    hi: string
  }
}

export const translations: Translations = {
  // Header
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.ask': { en: 'Ask Legal Saathi', hi: 'लीगल साथी से पूछें' },
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'nav.apiDocs': { en: 'API Docs', hi: 'API दस्तावेज़' },
  'nav.myQueries': { en: 'My Queries', hi: 'मेरे प्रश्न' },
  'header.title': { en: 'Legal Saathi', hi: 'लीगल साथी' },
  'header.subtitle': { en: 'लीगल साथी', hi: 'Legal Saathi' },
  
  // Accessibility
  'accessibility.highContrast': { en: 'High Contrast', hi: 'उच्च कंट्रास्ट' },
  'accessibility.normal': { en: 'Normal', hi: 'सामान्य' },
  'accessibility.darkMode': { en: 'Dark Mode', hi: 'डार्क मोड' },
  'accessibility.lightMode': { en: 'Light Mode', hi: 'लाइट मोड' },
  'accessibility.fontSize': { en: 'Font Size', hi: 'फ़ॉन्ट आकार' },
  'accessibility.language': { en: 'Language', hi: 'भाषा' },
  'accessibility.theme': { en: 'Toggle Theme', hi: 'थीम को टॉगल करें' },
  
  // Landing Page
  'hero.badge': { en: 'Trusted by 50,000+ citizens', hi: '50,000+ नागरिकों का भरोसा' },
  'hero.title': { en: 'Free Legal Help in Your Language', hi: 'आपकी भाषा में मुफ्त कानूनी सहायता' },
  'hero.subtitle': { en: 'आपकी भाषा में मुफ्त कानूनी सहायता', hi: 'Free Legal Help in Your Language' },
  'hero.description': { 
    en: 'Get instant legal guidance on RTI, consumer rights, tenant issues, FIR registration, and more. AI-powered, cited from real Indian laws.',
    hi: 'RTI, उपभोक्ता अधिकार, किरायेदार मुद्दे, FIR पंजीकरण और अधिक पर तुरंत कानूनी मार्गदर्शन प्राप्त करें। AI-संचालित, वास्तविक भारतीय कानूनों से उद्धृत।'
  },
  'hero.searchPlaceholder': { 
    en: 'Ask your question in Hindi or English...', 
    hi: 'अपना सवाल हिंदी या अंग्रेजी में पूछें...' 
  },
  'hero.search': { en: 'Search', hi: 'खोजें' },
  
  // Features
  'features.title': { en: 'Why Trust Legal Saathi?', hi: 'लीगल साथी पर भरोसा क्यों करें?' },
  'features.subtitle': { en: 'Designed for accessibility, accuracy, and ease of use', hi: 'पहुंच, सटीकता और उपयोग में आसानी के लिए डिज़ाइन किया गया' },
  'features.citedLaws.title': { en: 'Cited from Real Laws', hi: 'वास्तविक कानूनों से उद्धृत' },
  'features.citedLaws.description': { 
    en: 'Every response includes citations from actual Indian legal statutes with section numbers.',
    hi: 'हर जवाब में धारा संख्याओं के साथ वास्तविक भारतीय कानूनी विधियों से उद्धरण शामिल हैं।'
  },
  'features.multilingual.title': { en: 'Available in Hindi', hi: 'हिंदी में उपलब्ध' },
  'features.multilingual.description': { 
    en: 'Ask questions in Hindi or English. We understand both and provide guidance in your language.',
    hi: 'हिंदी या अंग्रेजी में सवाल पूछें। हम दोनों समझते हैं और आपकी भाषा में मार्गदर्शन प्रदान करते हैं।'
  },
  'features.free.title': { en: 'Free & Confidential', hi: 'मुफ्त और गोपनीय' },
  'features.free.description': { 
    en: 'No registration required. Your queries are not stored or shared with anyone.',
    hi: 'कोई पंजीकरण आवश्यक नहीं। आपके प्रश्न किसी के साथ संग्रहीत या साझा नहीं किए जाते।'
  },
  
  // How it works
  'howItWorks.title': { en: 'How It Works', hi: 'यह कैसे काम करता है' },
  'howItWorks.subtitle': { en: 'Get legal guidance in three simple steps', hi: 'तीन आसान चरणों में कानूनी मार्गदर्शन प्राप्त करें' },
  'howItWorks.step1.title': { en: 'Ask Your Question', hi: 'अपना सवाल पूछें' },
  'howItWorks.step1.description': { en: 'Type or speak your legal question in Hindi or English', hi: 'हिंदी या अंग्रेजी में अपना कानूनी सवाल टाइप करें या बोलें' },
  'howItWorks.step2.title': { en: 'AI Analyzes Laws', hi: 'AI कानूनों का विश्लेषण करता है' },
  'howItWorks.step2.description': { en: 'Our AI searches through Indian legal statutes to find relevant sections', hi: 'हमारा AI प्रासंगिक धाराओं को खोजने के लिए भारतीय कानूनी विधियों में खोज करता है' },
  'howItWorks.step3.title': { en: 'Get Cited Guidance', hi: 'उद्धृत मार्गदर्शन प्राप्त करें' },
  'howItWorks.step3.description': { en: 'Receive clear action steps with references to actual laws', hi: 'वास्तविक कानूनों के संदर्भों के साथ स्पष्ट कार्य चरण प्राप्त करें' },
  'howItWorks.cta': { en: 'Ask Legal Saathi Now', hi: 'अभी लीगल साथी से पूछें' },
  
  // Stats
  'stats.questions': { en: 'Questions Answered', hi: 'सवालों के जवाब' },
  'stats.domains': { en: 'Legal Domains', hi: 'कानूनी क्षेत्र' },
  'stats.languages': { en: 'Languages Supported', hi: 'भाषाएं समर्थित' },
  'stats.confidence': { en: 'High Confidence Rate', hi: 'उच्च विश्वास दर' },
  
  // Footer
  'footer.disclaimer.title': { en: 'Important Disclaimer', hi: 'महत्वपूर्ण अस्वीकरण' },
  'footer.disclaimer.text': { 
    en: 'Legal Saathi provides general legal information and guidance only. This service is not a substitute for professional legal advice from a qualified lawyer. For specific legal matters, please consult a licensed legal professional. We are not responsible for any actions taken based on this information.',
    hi: 'लीगल साथी केवल सामान्य कानूनी जानकारी और मार्गदर्शन प्रदान करता है। यह सेवा किसी योग्य वकील से पेशेवर कानूनी सलाह का विकल्प नहीं है। विशिष्ट कानूनी मामलों के लिए, कृपया लाइसे��स प्राप्त कानूनी पेशेवर से परामर्श करें।'
  },
  'footer.brand': { en: 'Free legal guidance for all. Empowering citizens with legal knowledge.', hi: 'सभी के लिए मुफ्त कानूनी मार्गदर्शन। नागरिकों को कानूनी ज्ञान से सशक्त बनाना।' },
  'footer.quickLinks': { en: 'Quick Links', hi: 'त्वरित लिंक' },
  'footer.legalTopics': { en: 'Legal Topics', hi: 'कानूनी विषय' },
  'footer.helplines': { en: 'Emergency Helplines', hi: 'आपातकालीन हेल्पलाइन' },
  'footer.copyright': { en: 'Made for the people of India.', hi: 'भारत के लोगों के लिए बनाया गया।' },
  
  // Ask Page
  'ask.selectLanguage': { en: 'Select Language', hi: 'भाषा चुनें' },
  'ask.yourQuestion': { en: 'Your Legal Question', hi: 'आपका कानूनी सवाल' },
  'ask.placeholder': { en: 'Type your legal question here...', hi: 'अपना कानूनी सवाल यहाँ लिखें...' },
  'ask.submit': { en: 'Ask Legal Saathi', hi: 'लीगल साथी से पूछें' },
  'ask.quickTopics': { en: 'Quick Topics', hi: 'त्वरित विषय' },
  'ask.confidence': { en: 'Analysis Confidence', hi: 'विश्लेषण विश्वास' },
  'ask.summary': { en: 'Summary', hi: 'सारांश' },
  'ask.relevantLaws': { en: 'Relevant Laws', hi: 'प्रासंगिक कानून' },
  'ask.actions': { en: 'What You Can Do', hi: 'आप क्या कर सकते हैं' },
  'ask.deadlines': { en: 'Important Deadlines', hi: 'महत्वपूर्ण समय सीमाएं' },
  'ask.emptyTitle': { en: 'Ask your legal question', hi: 'अपना कानूनी सवाल पूछें' },
  'ask.emptyDescription': { en: 'Type your question in the box on the left or select a quick topic to get started', hi: 'बाईं ओर बॉक्स में अपना प्रश्न लिखें या शुरू करने के लिए कोई विषय चुनें' },
  
  // Dashboard
  'dashboard.title': { en: 'Admin Dashboard', hi: 'एडमिन डैशबोर्ड' },
  'dashboard.subtitle': { en: 'Monitor queries, escalations, and system performance', hi: 'प्रश्नों, एस्केलेशन और सिस्टम प्रदर्शन की निगरानी करें' },
  'dashboard.totalQueries': { en: 'Total Queries Today', hi: 'आज कुल प्रश्न' },
  'dashboard.escalatedCases': { en: 'Escalated Cases', hi: 'एस्केलेटेड केस' },
  'dashboard.topDomain': { en: 'Top Legal Domain', hi: 'शीर्ष कानूनी क्षेत्र' },
  'dashboard.avgConfidence': { en: 'Avg Confidence', hi: 'औसत विश्वास' },
  'dashboard.recentQueries': { en: 'Recent Queries', hi: 'हाल के प्रश्न' },
  'dashboard.domainDistribution': { en: 'Domain Distribution', hi: 'डोमेन वितरण' },
  'dashboard.accessDenied': { en: 'Access Denied', hi: 'पहुंच अस्वीकृत' },
  'dashboard.adminOnly': { en: 'This page is only accessible to administrators. Please sign in with an admin account.', hi: 'यह पेज केवल व्यवस्थापकों के लिए उपलब्ध है। कृपया एडमिन खाते से साइन इन करें।' },
  'dashboard.signInAdmin': { en: 'Sign In as Admin', hi: 'एडमिन के रूप में साइन इन करें' },
  
  // Auth
  'auth.welcome': { en: 'Welcome to Legal Saathi', hi: 'लीगल साथी में आपका स्वागत है' },
  'auth.description': { en: 'Sign in to save your queries and access personalized features', hi: 'अपने प्रश्न सहेजने और व्यक्तिगत सुविधाओं तक पहुंचने के लिए साइन इन करें' },
  'auth.signIn': { en: 'Sign In', hi: 'साइन इन' },
  'auth.signInWithGoogle': { en: 'Sign in with Google', hi: 'Google से साइन इन करें' },
  'auth.signUpWithGoogle': { en: 'Sign up with Google', hi: 'Google से साइन अप करें' },
  'auth.or': { en: 'or continue with email', hi: 'या ईमेल से जारी रखें' },
  'auth.signUp': { en: 'Sign Up', hi: 'साइन अप' },
  'auth.signOut': { en: 'Sign Out', hi: 'साइन आउट' },
  'auth.email': { en: 'Email', hi: 'ईमेल' },
  'auth.password': { en: 'Password', hi: 'पासवर्ड' },
  'auth.confirmPassword': { en: 'Confirm Password', hi: 'पासवर्ड की पुष्टि करें' },
  'auth.name': { en: 'Full Name', hi: 'पूरा नाम' },
  'auth.signingIn': { en: 'Signing in...', hi: 'साइन इन हो रहा है...' },
  'auth.creatingAccount': { en: 'Creating account...', hi: 'खाता बना रहा है...' },
  'auth.createAccount': { en: 'Create Account', hi: 'खाता बनाएं' },
  'auth.demoCredentials': { en: 'Demo credentials', hi: 'डेमो क्रेडेंशियल्स' },
  'auth.myQueries': { en: 'My Queries', hi: 'मेरे प्रश्न' },
  'auth.profile': { en: 'Profile', hi: 'प्रोफ़ाइल' },
  
  // Documents
  'documents.uploadTitle': { en: 'Upload Document', hi: 'दस्तावेज़ अपलोड करें' },
  'documents.uploadDescription': { en: 'Upload legal documents to enhance the knowledge base', hi: 'ज्ञान आधार को बेहतर बनाने के लिए कानूनी दस्तावेज़ अपलोड करें' },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  fontSize: 'normal' | 'large' | 'xlarge'
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [fontSize, setFontSizeState] = useState<'normal' | 'large' | 'xlarge'>('normal')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    const savedFontSize = localStorage.getItem('fontSize') as 'normal' | 'large' | 'xlarge'
    
    if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
      setLanguageState(savedLang)
    }
    
    if (savedFontSize && ['normal', 'large', 'xlarge'].includes(savedFontSize)) {
      setFontSizeState(savedFontSize)
      document.documentElement.setAttribute('data-font-size', savedFontSize)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
  }

  const setFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSizeState(size)
    localStorage.setItem('fontSize', size)
    document.documentElement.setAttribute('data-font-size', size)
  }

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    return translation[language]
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, fontSize, setFontSize }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
