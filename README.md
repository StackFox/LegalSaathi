# Legal Saathi (लीगल साथी) - AI Legal Aid Assistant

Legal Saathi is a comprehensive, AI-powered legal aid platform designed to provide accessible legal guidance to Indian citizens. Built with Next.js 16 and React 19, it leverages RAG (Retrieval-Augmented Generation) with real Indian legal statutes to deliver accurate, cited legal information in **10 Indian languages**.

![Legal Saathi Banner - Dark](public/og-image.png)
![Legal Saathi Banner - Light](public/image.png)

## 🚀 Key Features

- **Multilingual Support:** Full support for 10 languages: English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, and Punjabi.
- **AI-Powered Legal Guidance:** Uses Google Gemini (2.5 Flash) + Pinecone Vector DB to answer queries with citations from real acts (RTI, IPC, CrPC, Consumer Protection, etc.).
- **Real Legal Citations:** Every response includes specific sections and acts (e.g., "Section 154 of CrPC") with relevance scores.
- **Voice Input:** Integrated voice recognition (Web Speech API) for accessibility.
- **Smart Classification:** Automatically detects legal domains (Tenancy, Police/FIR, Consumer, Workplace, etc.) and intent.
- **Confidence Scoring:** Visual confidence meter (High/Medium/Low) with automatic escalation for low-confidence queries.
- **Admin Dashboard:** Analytics dashboard for tracking query stats, escalated cases, and domain distribution.
- **Secure Authentication:** User management via Clerk (Email/Password + Google OAuth).

## 🛠️ Tech Stack

### Core
- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5.7+
- **Styling:** Tailwind CSS v4, shadcn/ui, Radix UI, Lucide React
- **Animations:** Framer Motion

### AI & Data
- **LLM:** Google Gemini 2.5 Flash
- **Embeddings:** Gemini Embedding 001
- **Vector DB:** Pinecone (Serverless)
- **Fallback:** OpenAI GPT-4o-mini & TF-IDF (offline fallback)

### Services
- **Auth:** Clerk
- **Analytics:** Vercel Analytics
- **Notifications:** Sonner

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm / yarn / pnpm
- API Keys for:
  - Google AI Studio (Gemini)
  - Pinecone
  - Clerk
  - (Optional) OpenAI

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/legal-saathi.git
   cd legal-saathi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # AI Services
   GOOGLE_AI_API_KEY=your_gemini_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX=legal-saathi
   
   # Optional
   OPENAI_API_KEY=sk-...
   ```

4. **Initialize Vector Database:**
   The application will automatically attempt to initialize the Pinecone index with the legal documents from `lib/legal-documents.ts` upon the first query if the index is empty. Ensure your Pinecone index is created with **1024 dimensions** and **cosine** metric.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
├── app/
│   ├── ask/                 # Main legal query interface
│   ├── dashboard/           # Admin analytics dashboard (Protected)
│   ├── api/                 # API Routes (Chat, Transcribe)
│   └── ...                  # Auth & Layout pages
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── statute-card.tsx     # Legal citation display
│   ├── confidence-meter.tsx # AI confidence visualization
│   └── ...                  # Custom components
├── lib/
│   ├── rag-gemini-pinecone.ts # Main RAG logic
│   ├── legal-documents.ts   # Database of Indian Acts
│   └── language-context.tsx # i18n implementation
└── public/                  # Static assets
```

## 📡 API Documentation

### POST `/api/chat`
Main endpoint for processing legal queries.

**Request:**
```json
{
  "query": "How do I file an RTI?",
  "language": "en",
  "include_audit_log": true
}
```

**Response:**
Returns a `LegalResponse` object containing:
- Translated query
- Legal domain classification
- Confidence score
- List of cited sections (Act, Section, Relevance)
- Action steps & Deadlines

## ⚖️ Legal Disclaimer

> **IMPORTANT:** Legal Saathi is an AI-powered informational tool. It provides general guidance based on Indian laws but **does NOT constitute professional legal advice**.
> 
> The information provided may not be applicable to every specific situation. Users should always consult with a qualified advocate or visit their nearest Legal Aid Clinic for professional advice.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ for India 🇮🇳