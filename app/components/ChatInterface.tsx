'use client'

import { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'



export default function ChatInterface({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<any[]>([
    {
      id: 0,
      type: 'ai',
      text: 'Hey! Need help with social science? I’ve got you covered. What’s your question?'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeAI = async () => {
    try {
      // Use environment variable instead of hardcoded API key
      const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      
      if (!API_KEY) {
        throw new Error('Gemini API Key is not configured')
      }

      const genAI = new GoogleGenerativeAI(API_KEY)
      return genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash" 
      })
    } catch (error) {
      console.error('AI Initialization Error', error)
      setError('Failed to initialize AI. Please check your configuration.')
      return null
    }
  }

  // Simplified Language Processing
  const processMessage = async (model: any, message: string) => {
    try {
      const result = await model.generateContent(
        `Explain this social science concept in very simple, easy-to-understand language for a general audience:
        ${message}
        
        Guidelines:
        - Use clear, everyday language
        - Avoid complex academic jargon
        - Explain like you're talking to a friend
        - Give a straightforward, practical explanation`
      )
      return result.response.text()
    } catch (error) {
      console.error('Message Processing Error', error)
      return "Sorry, I'm having trouble explaining that right now."
    }
  }

  // Send Message Handler
  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      const model = await initializeAI()
      if (!model) throw new Error('Model not initialized')

      const aiResponse = await processMessage(model, inputMessage)

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: aiResponse
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Send Message Error', error)
      const errorMessage = {
        id: Date.now() + 2,
        type: 'error',
        text: "I'm having trouble helping you right now. Let's try again."
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <button 
          onClick={onBack} 
          className="text-white hover:bg-blue-700 p-2 rounded"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold">Social Science Explained Simply</h1>
      </header>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`p-3 rounded-lg max-w-md text-base ${
              message.type === 'user' 
                ? 'bg-blue-100 text-blue-900 self-end ml-auto' 
                : message.type === 'error'
                ? 'bg-red-100 text-red-900'
                : 'bg-gray-100 text-gray-900 self-start'
            }`}
          >
            {message.text}
          </div>
        ))}
        
        {loading && (
          <div className="text-center text-gray-700">
            Thinking... 🤔
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-300 flex items-center">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about social science in simple terms"
          className="flex-grow p-2 border rounded-lg mr-2 text-black"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !inputMessage.trim()}
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}