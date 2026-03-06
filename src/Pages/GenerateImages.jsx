import { Image, Sparkles, Wand2 } from 'lucide-react'
import { useState } from 'react'

const GenerateImages = () => {
  const imageStyles = [
    'Realistic',
    'Anime',
    'Cartoon',
    'Oil Painting',
    'Watercolor',
    'Digital Art',
    '3D Render',
    'Sketch',
    'Abstract'
  ]

  const [selectedStyle, setSelectedStyle] = useState('Realistic')
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle image generation logic
  }

  return (
    <div className='grid md:grid-cols-2 gap-6 h-auto'>
      {/* Left Side */}
      <div className='h-auto overflow-y-scroll w-full md:w-md bg-white p-6 rounded-lg border-2 border-dashed border-gray-200 flex flex-col'>
        <div className='flex text-center gap-4 mb-6'>
          <Sparkles className='w-6 h-6 text-blue-500' />
          <h2 className='text-lg font-semibold text-gray-700'>Generate AI Images</h2>
        </div>

        <form onSubmit={handleSubmit} className='w-full space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Image Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with flying cars at sunset..."
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]'
            />

            <h2 className='text-gray-700 mt-3 text-sm font-medium'>Image Style</h2>
            <div className='flex flex-wrap w-full gap-3 mt-3'>
              {imageStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${selectedStyle === style ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedStyle(style)}
                >
                  {style}
                </button>
              ))}
            </div>

            <button className='flex items-center w-full mt-5 justify-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-base font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <Wand2 className='w-5 h-5 text-white'/>
              <h2>Generate Image</h2>
            </button>
          </div>
        </form>
      </div>

      {/* Right Side */}
      <div className='h-auto w-full md:w-md bg-white p-6 rounded-lg border-dashed border-2 border-gray-200 overflow-y-scroll'>
        <div>
          <div className='flex text-center gap-4 mb-6'>
            <Sparkles className='w-6 h-6 text-blue-500' />
            <h2 className='text-lg font-semibold text-gray-700'>Generated Image</h2>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center h-full'>
          <Image className='w-9 h-9 text-gray-500' />
          <p className='text-gray-500 mt-3 text-sm text-center'>Your generated image will appear here. Describe what you want to see and select a style to create unique AI-generated artwork.</p>
        </div>
      </div>
    </div>
  )
}

export default GenerateImages
