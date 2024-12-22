'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaRobot, 
  FaBook, 
  FaChartLine, 
  FaShieldAlt,
  FaUniversity,
  FaGraduationCap,
  FaResearchgate
} from 'react-icons/fa'

// Directly import the components
import ChatInterface from './components/ChatInterface'
import ImageUploadChat from './components/ImageUploader'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeModule, setActiveModule] = useState<'chat' | 'upload' | null>(null)

  // Loading effect
  useEffect(() => {
    const loadingSequence = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(loadingSequence);
  }, []);

  // Enhanced Loading Screen Component
  const LoadingScreen = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center 
    bg-gradient-to-br from-blue-100 to-blue-300 overflow-hidden">
      {/* Animated Background Particles */}
      {[...Array(50)].map((_, i) => (
        <motion.div 
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            opacity: 0
          }}
          animate={{ 
            x: [
              Math.random() * window.innerWidth, 
              Math.random() * window.innerWidth, 
              Math.random() * window.innerWidth
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight
            ],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="absolute w-2 h-2 bg-blue-400 rounded-full"
        />
      ))}
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: [0, 1.2, 1],
            rotate: [0, 360],
            transition: {
              duration: 1.5,
              ease: "easeInOut"
            }
          }}
          className="mb-6"
        >
          <FaRobot className="text-9xl text-blue-700 animate-pulse" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold text-blue-900 mb-4"
        >
          Social Science Research Hub
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xl text-blue-700 text-center max-w-md"
        >
          Initializing Advanced AI Research Platform...
        </motion.p>
      </div>
    </div>
  )

  // Render active modules
  if (activeModule === 'chat') {
    return <ChatInterface onBack={() => setActiveModule(null)} />
  }

  if (activeModule === 'upload') {
    return <ImageUploadChat onBack={() => setActiveModule(null)} />
  }

  // Return loading screen if still loading
  if (isLoading) return <LoadingScreen />

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header Section */}
      <header className="bg-blue-600 text-white py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Social Science Research Hub
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Advanced AI-powered platform for comprehensive research and analysis
        </p>
      </header>

      {/* Module Selection Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Research Modules
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our advanced AI-powered research tools and modules
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100,
            delay: 0.6 
          }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* AI Research Chatbot Module */}
          <motion.div
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-2xl 
            shadow-xl p-8 text-center border border-gray-100"
          >
            <FaRobot className="mx-auto text-6xl text-blue-700 mb-6" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              AI Research Chatbot
            </h2>
            <p className="text-gray-700 mb-6">
              Engage with an intelligent assistant specializing in social science research
            </p>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveModule('chat')}
              className="bg-blue-600 text-white px-8 py-3 rounded-full 
              hover:bg-blue-700 transition-colors"
            >
              Start Conversation
            </motion.button>
          </motion.div>

          {/* Image Analysis Module */}
          <motion.div
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-2xl 
            shadow-xl p-8 text-center border border-gray-100"
          >
            <FaBook className="mx-auto text-6xl text-green-700 mb-6" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Image Analysis Upload
            </h2>
            <p className="text-gray-700 mb-6">
              Upload images for AI-driven contextual analysis and insights
            </p>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveModule('upload')}
              className="bg-green-600 text-white px-8 py-3 rounded-full 
              hover:bg-green-700 transition-colors"
            >
              Upload Image
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
      {/* Use Cases Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Use Cases & Applications
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Empowering researchers, academics, and professionals across various domains
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaUniversity className="text-5xl text-blue-600" />,
                title: "Academic Research",
                description: "Advanced data analysis and literature review assistance",
                details: "Support for comprehensive research methodologies"
              },
              {
                icon: <FaGraduationCap className="text-5xl text-green-600" />,
                title: "Student Support",
                description: "Thesis and dissertation research tools",
                details: "AI-powered research guidance and insights"
              },
              {
                icon: <FaResearchgate className="text-5xl text-purple-600" />,
                title: "Professional Research",
                description: "Cross-disciplinary research collaboration",
                details: "Innovative problem-solving and analysis"
              }
            ].map((useCase, index) => (
              <motion.div 
                key={index}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                className="bg-gray-50 rounded-2xl shadow-md p-6 text-center border border-gray-100"
              >
                <div className="mb-4 flex justify-center">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {useCase.title}
                </h3>
                <p className="text-blue-600 font-medium mb-2">
                  {useCase.description}
                </p>
                <p className="text-gray-600 text-sm">
                  {useCase.details}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Specifications Section */}
<section className="bg-gray-100 py-16">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Platform Specifications
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Cutting-edge technologies powering our research platform
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          icon: <FaChartLine className="text-5xl text-blue-600 mb-4" />,
          title: "AI-Powered Analytics",
          description: "Advanced machine learning algorithms",
          details: [
            "Natural Language Processing",
            "Predictive Data Modeling",
            "Intelligent Insights Generation"
          ]
        },
        {
          icon: <FaShieldAlt className="text-5xl text-green-600 mb-4" />,
          title: "Data Security",
          description: "Robust protection mechanisms",
          details: [
            "End-to-End Encryption",
            "GDPR Compliance",
            "Secure Cloud Infrastructure"
          ]
        },
        {
          icon: <FaRobot className="text-5xl text-purple-600 mb-4" />,
          title: "Intelligent Assistance",
          description: "AI-driven research companion",
          details: [
            "Contextual Understanding",
            "Multi-disciplinary Support",
            "Adaptive Learning Capabilities"
          ]
        }
      ].map((spec, index) => (
        <motion.div 
          key={index}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            transition: { duration: 0.3 }
          }}
          className="bg-white rounded-2xl 
          shadow-lg p-8 text-center 
          transform transition-all duration-300 
          hover:shadow-xl border border-gray-100"
        >
          <div className="flex justify-center mb-6">
            {spec.icon}
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">
            {spec.title}
          </h3>
          <p className="text-blue-600 font-medium mb-4">
            {spec.description}
          </p>
          <div className="space-y-2">
            {spec.details.map((detail, detailIndex) => (
              <div 
                key={detailIndex}
                className="bg-gray-50 rounded-full 
                px-4 py-2 text-sm text-gray-700 
                inline-block mr-2 mb-2"
              >
                {detail}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>

    {/* Technical Specifications Details */}
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="mt-12 bg-white rounded-2xl shadow-lg p-8"
    >
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Technical Architecture
      </h3>
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Backend", value: "Next.js 14" },
          { label: "Frontend", value: "React TypeScript" },
          { label: "Styling", value: "Tailwind CSS" },
          { label: "State Management", value: "React Hooks" },
          { label: "Animations", value: "Framer Motion" },
          { label: "AI Model", value: "Gemini 1.5-flash" },
          { label: "Deployment", value: "Vercel" },
          { label: "Database", value: "Prisma ORM" }
        ].map((tech, index) => (
          <div 
            key={index}
            className="bg-gray-50 rounded-lg p-4 text-center 
            border border-gray-100 hover:bg-gray-100 
            transition duration-300"
          >
            <p className="font-semibold text-gray-700">{tech.label}</p>
            <p className="text-blue-600 font-bold">{tech.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
</section>
    </motion.div>
  )
}