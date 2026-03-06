import { ImageIcon, Scissors, Sparkles, Upload } from 'lucide-react'
import { useState } from 'react'

const RemoveBackground = () => {
  const outputFormats = [
    'PNG',
    'JPG',
    'WEBP'
  ]

  const backgroundOptions = [
    'Transparent',
    'White',
    'Black',
    'Custom Color'
  ]

  const [selectedFormat, setSelectedFormat] = useState('PNG')
  const [selectedBackground, setSelectedBackground] = useState('Transparent')
  const [image, setImage] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle background removal logic
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))
    }
  }

  return (
    <div className='grid md:grid-cols-2 gap-6 h-auto'>
      {/* Left Side */}
      <div className='h-auto overflow-y-scroll w-full md:w-md bg-white p-6 rounded-lg border-2 border-dashed border-gray-200 flex flex-col'>
        <div className='flex text-center gap-4 mb-6'>
          <Sparkles className='w-6 h-6 text-blue-500' />
          <h2 className='text-lg font-semibold text-gray-700'>Remove Background</h2>
        </div>

        <form onSubmit={handleSubmit} className='w-full space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Upload Image</label>
            <div className='w-full'>
              <label className='flex flex-col items-center justify-center w-full min-h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden'>
                {image ? (
                  <div className='relative w-full'>
                    <img src={image} alt="Uploaded" className='w-full h-auto max-h-96 object-contain' />
                    <div className='absolute bottom-2 right-2 text-black bg-blue-200 rounded-full px-3 py-1 text-xs'>
                      Click to change

                    </div>

                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                    <Upload className='w-8 h-8 mb-2 text-gray-500' />
                    <p className='text-sm text-gray-500'>Click to upload or drag and drop</p>
                    <p className='text-xs text-gray-400'>PNG, JPG, WEBP (MAX. 10MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  className='hidden'
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <h2 className='text-gray-700 mt-4 text-sm font-medium'>Background Option</h2>
            <div className='flex flex-wrap w-full gap-3 mt-3'>
              {backgroundOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${selectedBackground === option ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedBackground(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <h2 className='text-gray-700 mt-4 text-sm font-medium'>Output Format</h2>
            <div className='flex flex-wrap w-full gap-3 mt-3'>
              {outputFormats.map((format) => (
                <button
                  key={format}
                  type="button"
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${selectedFormat === format ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedFormat(format)}
                >
                  {format}
                </button>
              ))}
            </div>

            <button className='flex items-center w-full mt-5 justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-base font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <Scissors className='w-5 h-5 text-white'/>
              <h2>Remove Background</h2>
            </button>
          </div>
        </form>
      </div>

      {/* Right Side */}
      <div className='h-auto w-full md:w-md bg-white p-6 rounded-lg border-dashed border-2 border-gray-200 overflow-y-scroll'>
        <div>
          <div className='flex text-center gap-4 mb-6'>
            <Sparkles className='w-6 h-6 text-blue-500' />
            <h2 className='text-lg font-semibold text-gray-700'>Result</h2>
          </div>
        </div>
        {image ? (
          <div className='flex flex-col items-center justify-center'>
            <img src={image} alt="Uploaded" className='w-full h-full rounded-lg shadow-md' />
            <p className='text-gray-500 mt-3 text-sm text-center'>Click "Remove Background" to process this image</p>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full'>
            <ImageIcon className='w-9 h-9 text-gray-500' />
            <p className='text-gray-500 mt-3 text-sm text-center'>Your image with removed background will appear here. Upload an image and select your preferences to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RemoveBackground
