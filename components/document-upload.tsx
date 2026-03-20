'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { useLanguage } from '@/lib/language-context'

interface UploadedDocument {
  documentId: string
  documentName: string
  totalChunks: number
  totalCharacters: number
  createdAt: string
}

interface DocumentUploadProps {
  onUploadComplete?: (document: UploadedDocument) => void
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [mode, setMode] = useState<'file' | 'text'>('file')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [textContent, setTextContent] = useState('')
  const [documentName, setDocumentName] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)

  const resetForm = useCallback(() => {
    setSelectedFile(null)
    setTextContent('')
    setDocumentName('')
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const allowedTypes = ['text/plain', 'text/markdown', 'application/json', 'text/csv']
    const allowedExtensions = ['.txt', '.md', '.json', '.csv']
    
    const hasAllowedExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    )
    
    if (!allowedTypes.includes(file.type) && !hasAllowedExtension) {
      toast.error('Invalid file type', {
        description: 'Please upload a text file (.txt, .md, .json, or .csv)',
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Maximum file size is 5MB',
      })
      return
    }

    setSelectedFile(file)
    if (!documentName) {
      setDocumentName(file.name.replace(/\.[^/.]+$/, ''))
    }
  }, [documentName])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleUpload = async () => {
    if (mode === 'file' && !selectedFile) {
      toast.error('No file selected', {
        description: 'Please select a file to upload',
      })
      return
    }

    if (mode === 'text' && textContent.trim().length < 50) {
      toast.error('Content too short', {
        description: 'Please enter at least 50 characters of text',
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(10)

    try {
      const formData = new FormData()
      
      if (mode === 'file' && selectedFile) {
        formData.append('file', selectedFile)
      } else {
        formData.append('content', textContent)
      }
      
      if (documentName.trim()) {
        formData.append('name', documentName.trim())
      }

      setUploadProgress(30)

      const response = await fetch('/api/documents/ingest', {
        method: 'POST',
        body: formData,
      })

      setUploadProgress(70)

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Upload failed')
      }

      setUploadProgress(100)

      toast.success('Document embedded successfully', {
        description: `"${result.data.documentName}" has been processed into ${result.data.totalChunks} chunks and embedded for semantic search.`,
        duration: 5000,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      })

      if (onUploadComplete) {
        onUploadComplete(result.data)
      }

      resetForm()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Embedding failed', {
        description: error instanceof Error ? error.message : 'Failed to process document',
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {t('documents.uploadTitle') || 'Upload Document'}
        </CardTitle>
        <CardDescription>
          {t('documents.uploadDescription') || 'Upload legal documents to enhance the knowledge base'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Selector */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === 'file' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('file')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Upload File
          </Button>
          <Button
            type="button"
            variant={mode === 'text' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('text')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Paste Text
          </Button>
        </div>

        {/* Document Name */}
        <div className="space-y-2">
          <Label htmlFor="document-name">Document Name (optional)</Label>
          <Input
            id="document-name"
            placeholder="e.g., Consumer Protection Act 2019"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            disabled={isUploading}
          />
        </div>

        {/* File Upload Mode */}
        {mode === 'file' && (
          <div
            className={`
              relative rounded-lg border-2 border-dashed p-6 transition-colors
              ${isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:border-primary/50'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.json,.csv,text/plain,text/markdown,application/json,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
              }}
              disabled={isUploading}
            />
            
            <div className="flex flex-col items-center gap-2 text-center">
              {selectedFile ? (
                <>
                  <FileText className="h-10 w-10 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    disabled={isUploading}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Remove
                  </Button>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">
                      {isDragOver ? 'Drop file here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      TXT, MD, JSON, or CSV (max 5MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Text Input Mode */}
        {mode === 'text' && (
          <div className="space-y-2">
            <Label htmlFor="text-content">Document Content</Label>
            <Textarea
              id="text-content"
              placeholder="Paste the legal document text here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              disabled={isUploading}
              className="min-h-[200px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {textContent.length} characters (minimum 50 required)
            </p>
          </div>
        )}

        {/* Progress Bar */}
        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {uploadProgress < 30 && 'Uploading...'}
              {uploadProgress >= 30 && uploadProgress < 70 && 'Processing and chunking document...'}
              {uploadProgress >= 70 && uploadProgress < 100 && 'Generating embeddings...'}
              {uploadProgress === 100 && 'Complete!'}
            </p>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={isUploading || (mode === 'file' && !selectedFile) || (mode === 'text' && textContent.trim().length < 50)}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Document...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload and Embed Document
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
