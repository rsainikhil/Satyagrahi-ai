'use client'

import { useState, useRef } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Image from 'next/image'

interface ImageUploaderProps {
  onBack: () => void
}

export default function ImageUploader({ onBack }: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setError(null)

    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setAnalysis(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setLoading(true)
    setError(null)

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const base64Image = selectedImage.split(',')[1]

      const prompt = `Analyze this image from a social science perspective, considering:
      1. Cultural significance and symbolism
      2. Social context and implications
      3. Historical or contemporary relevance
      4. Behavioral and psychological insights
      
      Provide a comprehensive yet concise analysis that reveals deeper sociological meanings.`

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType: "image/jpeg"
          }
        },
        { text: prompt }
      ])

      const response = await result.response
      setAnalysis(response.text())
    } catch (error) {
      console.error('Image analysis error:', error)
      setError('Failed to analyze image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setAnalysis(null)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center">
          <button
            onClick={onBack}
            className="hover:bg-white/10 p-2 rounded-lg transition-all duration-300 ease-in-out"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold ml-4">Visual Social Analysis</h1>
        </div>
      </header>

      <main className="flex-grow p-6 md:p-8 max-w-6xl mx-auto w-full">
        <div 
          className={`bg-white rounded-2xl shadow-xl p-8 mb-6 transition-all duration-300 ${
            isDragging ? 'border-4 border-blue-400 border-dashed' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!selectedImage && (
            <div className="text-center py-12">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                ref={fileInputRef}
              />
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Upload Your Image!</h2>
                <p className="text-gray-600 mb-4">Drag, Drop, or Click—Easy Peasy!</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Choose File
                </button>
              </div>
            </div>
          )}

          {selectedImage && (
            <div className="space-y-6">
              <div className="relative w-full max-w-2xl mx-auto aspect-video">
                <Image
                  src={selectedImage}
                  alt="Selected image"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              {!analysis && !loading && (
                <div className="text-center mt-6">
                  <button
                    onClick={analyzeImage}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Decode Like a Pro Historian!
                  </button>
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Scanning for ancient gossip… ⏳</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded-r-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {analysis && (
            <div className="mt-8 bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-xl shadow-inner">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Timeline checked: Yep, history still repeats itself
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                {analysis}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}