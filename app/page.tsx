'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FaBook, 
  FaRobot, 
  FaUniversity, 
  FaGlobeAmericas, 
  FaChartLine 
} from 'react-icons/fa'
import ChatInterface from './components/ChatInterface'
import ImageUploader from './components/ImageUploader'

export default function Home() {
  const [activeModule, setActiveModule] = useState<'chat' | 'upload' | null>(null)

  const researchTopics = [
    {
      icon: <FaGlobeAmericas className="text-5xl text-blue-600" />,
      title: "Global Social Movements",
      description: "Explore the dynamics of social change across different cultural contexts."
    },
    {
      icon: <FaUniversity className="text-5xl text-green-600" />,
      title: "Academic Research",
      description: "Deep dive into scholarly research methodologies and social science theories."
    },
    {
      icon: <FaChartLine className="text-5xl text-purple-600" />,
      title: "Data Analysis",
      description: "Leverage AI-powered insights for comprehensive social research analysis."
    }
  ]

  const moduleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    }
  }

  if (activeModule === 'chat') {
    return <ChatInterface onBack={() => setActiveModule(null)} />
  }

  if (activeModule === 'upload') {
    return <ImageUploader onBack={() => setActiveModule(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 px-4 bg-white shadow-lg"
      >
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Social Science Research Assistant
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Bridging technology and social research through advanced AI-powered insights and analysis
        </p>
      </motion.div>

      {/* Action Buttons */}
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <motion.div
          variants={moduleVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-xl p-8 text-center hover:shadow-2xl transition-all"
        >
          <FaRobot className="mx-auto text-6xl text-blue-600 mb-6" />
          <h2 className="text-3xl font-semibold mb-4">AI Research Chatbot</h2>
          <p className="text-gray-600 mb-6">
            Engage with an intelligent assistant specializing in social science research and analysis
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveModule('chat')}
            className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            Start Conversation
          </motion.button>
        </motion.div>

        <motion.div
          variants={moduleVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-xl p-8 text-center hover:shadow-2xl transition-all"
        >
          <FaBook className="mx-auto text-6xl text-green-600 mb-6" />
          <h2 className="text-3xl font-semibold mb-4">Image Analysis</h2>
          <p className="text-gray-600 mb-6">
            Upload historical images for contextual research and AI-powered insights
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveModule('upload')}
            className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors"
          >
            Upload Image
          </motion.button>
        </motion.div>
      </div>

      {/* Research Topics */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-16"
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Explore Research Domains
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {researchTopics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transform hover:-translate-y-2 transition-all"
            >
              {topic.icon}
              <h3 className="text-2xl font-semibold mt-6 mb-4">{topic.title}</h3>
              <p className="text-gray-600">{topic.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}