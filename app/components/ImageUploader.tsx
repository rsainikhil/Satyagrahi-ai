'use client'

import { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

export default function ImageUploadChat({ onBack }: { onBack: () => void }) {
  const [images, setImages] = useState<File[]>([])
  const [messages, setMessages] = useState<any[]>([
    {
      id: 0,
      type: 'ai',
      text: 'Upload an image and I will analyze it for you!'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  // Gemini 1.5 Flash Image Analysis
  const analyzeImage = async (file: File, userPrompt?: string) => {
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash" 
      })

      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          const base64Image = (reader.result as string).split(',')[1]
          
          try {
            const result = await model.generateContent({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: userPrompt || 'Describe this image in detail' },
                    { inlineData: { 
                      mimeType: file.type, 
                      data: base64Image 
                    }}
                  ]
                }
              ]
            })

            resolve(result.response.text())
          } catch (error) {
            reject(error)
          }
        }
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error('Image Analysis Error', error)
      return "Sorry, I couldn't analyze the image."
    }
  }

  // Image Upload Handler
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileArray = Array.from(files)
      setImages(prev => [...prev, ...fileArray])
    }
  }

  // Send Message with Image Analysis
  const sendMessage = async () => {
    if (!inputMessage.trim() && images.length === 0) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      images: images
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      if (images.length > 0) {
        const imageAnalyses = await Promise.all(
          images.map(image => analyzeImage(image, inputMessage))
        )

        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          text: imageAnalyses.join('\n\n')
        }

        setMessages(prev => [...prev, aiMessage])
      }

      setInputMessage('')
      setImages([])
    } catch (error) {
      console.error('Message Send Error', error)
      setError('Failed to analyze image')
    } finally {
      setLoading(false)
    }
  }

  // Remove Image
  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      {/* Header with Back Button */}
      <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="text-white hover:bg-blue-700 p-2 rounded"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold">Image Analysis Chat</h1>
      </header>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 text-center">
          {error}
        </div>
      )}

      {/* Image Upload Section */}
      <div className="p-4 bg-gray-100 flex space-x-2 overflow-x-auto">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="imageUpload"
        />
        <label 
          htmlFor="imageUpload" 
          className="bg-blue-500 text-white p-2 rounded cursor-pointer"
        >
          Upload Images
        </label>

        {images.map((image, index) => (
          <div key={index} className="relative">
            <img 
              src={URL.createObjectURL(image)} 
              alt={`Preview ${index}`} 
              className="h-20 w-20 object-cover rounded"
            />
            <button 
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 bg-white">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`mb-4 ${
              message.type === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div 
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-black'
              }`}
            >
              {message.text}
              {message.images && message.images.map((img: File, index: number) => (
                <img 
                  key={index} 
                  src={URL.createObjectURL(img)} 
                  alt={`Uploaded ${index}`} 
                  className="mt-2 max-w-full rounded"
                />
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-100 border-t flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about the image..."
          className="flex-grow p-2 border rounded-l text-black"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded-r"
        >
          {loading ? 'Analyzing...' : 'Send'}
        </button>
      </div>
    </div>
  )
}