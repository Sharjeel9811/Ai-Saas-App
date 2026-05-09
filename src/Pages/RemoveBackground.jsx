import { useAuth } from '@clerk/clerk-react'
import { removeBackground } from '@imgly/background-removal'
import { ImageIcon, Scissors, Sparkles, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ProgressBar from '../Components/ProgressBar'
import { addCreationHistory } from '../lib/creationsHistory'

const RemoveBackground = () => {
  const { userId } = useAuth()
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
  const [customBackgroundColor, setCustomBackgroundColor] = useState('#ffffff')
  const [image, setImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [resultUrl, setResultUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const progressIntervalRef = useRef(null)

  // Progress animation while loading
  useEffect(() => {
    if (loading) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return 90;
          const inc = Math.floor(Math.random() * 15) + 5;
          return Math.min(90, p + inc);
        });
      }, 500);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [loading]);

  useEffect(() => {
    return () => {
      if (image?.startsWith('blob:')) {
        URL.revokeObjectURL(image)
      }

      if (resultUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(resultUrl)
      }
    }
  }, [image, resultUrl])

  const getOutputMimeType = () => {
    if (selectedFormat === 'JPG') return 'image/jpeg'
    if (selectedFormat === 'WEBP') return 'image/webp'
    return 'image/png'
  }

  const getBackgroundFill = () => {
    if (selectedBackground === 'White') return '#ffffff'
    if (selectedBackground === 'Black') return '#000000'
    if (selectedBackground === 'Custom Color') return customBackgroundColor
    return null
  }

  const downscaleImageForProcessing = async (file) => {
    const MAX_DIMENSION = 1600
    const bitmap = await createImageBitmap(file)
    const longestSide = Math.max(bitmap.width, bitmap.height)

    if (longestSide <= MAX_DIMENSION) {
      if (typeof bitmap.close === 'function') bitmap.close()
      return file
    }

    const scale = MAX_DIMENSION / longestSide
    const targetWidth = Math.max(1, Math.round(bitmap.width * scale))
    const targetHeight = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const context = canvas.getContext('2d')
    if (!context) {
      if (typeof bitmap.close === 'function') bitmap.close()
      return file
    }

    context.drawImage(bitmap, 0, 0, targetWidth, targetHeight)
    if (typeof bitmap.close === 'function') bitmap.close()

    return await new Promise((resolve) => {
      canvas.toBlob((scaledBlob) => {
        resolve(scaledBlob || file)
      }, 'image/png', 0.92)
    })
  }

  const convertBlob = async (blob) => {
    const outputMimeType = getOutputMimeType()
    const backgroundFill = getBackgroundFill()

    if (outputMimeType === 'image/png' && !backgroundFill) {
      return blob
    }

    const bitmap = await createImageBitmap(blob)
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height

    const context = canvas.getContext('2d')
    if (!context) {
      return blob
    }

    if (backgroundFill) {
      context.fillStyle = backgroundFill
      context.fillRect(0, 0, canvas.width, canvas.height)
    }

    context.drawImage(bitmap, 0, 0)

    return await new Promise((resolve) => {
      canvas.toBlob((convertedBlob) => {
        resolve(convertedBlob || blob)
      }, outputMimeType, 0.92)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imageFile) {
      setError('Please upload an image first.')
      return
    }

    setLoading(true)
    setError('')
    setResultUrl('')
    setProgress(10)

    try {
      // Let React paint loader UI before starting heavy processing.
      await new Promise((resolve) => requestAnimationFrame(resolve))

      const optimizedInput = await downscaleImageForProcessing(imageFile)
      const processedBlob = await removeBackground(optimizedInput)
      const convertedBlob = await convertBlob(processedBlob)
      const url = URL.createObjectURL(convertedBlob)

      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      setProgress(100)
      setTimeout(() => setProgress(0), 800)
      setResultUrl(url)
      addCreationHistory({
        userId,
        type: 'remove-background',
        prompt: `Remove background from ${imageFile.name} with ${selectedBackground} background and ${selectedFormat} format`,
        content: 'Background removed',
      })
    } catch (processingError) {
      setError(processingError.message || 'Failed to remove background.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImage(URL.createObjectURL(file))
      setResultUrl('')
      setError('')
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 h-auto w-full'>
      {/* Left Side */}
      <div className='h-auto overflow-y-auto w-full min-w-0 bg-white p-4 sm:p-6 rounded-lg border-2 border-dashed border-gray-200 flex flex-col'>
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
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${selectedBackground === option ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedBackground(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            {selectedBackground === 'Custom Color' ? (
              <div className='mt-3 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2'>
                <label className='text-sm font-medium text-gray-700'>Custom color</label>
                <input
                  type='color'
                  value={customBackgroundColor}
                  onChange={(e) => setCustomBackgroundColor(e.target.value)}
                  className='h-9 w-12 cursor-pointer rounded-md border border-gray-300 bg-white p-1'
                  aria-label='Choose custom background color'
                />
                <span className='text-xs text-gray-500'>{customBackgroundColor}</span>
              </div>
            ) : null}

            <h2 className='text-gray-700 mt-4 text-sm font-medium'>Output Format</h2>
            <div className='flex flex-wrap w-full gap-3 mt-3'>
              {outputFormats.map((format) => (
                <button
                  key={format}
                  type="button"
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${selectedFormat === format ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedFormat(format)}
                >
                  {format}
                </button>
              ))}
            </div>

            <button disabled={loading} className='flex items-center w-full mt-5 justify-center gap-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white text-base font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-70'>
              <Scissors className='w-5 h-5 text-white'/>
              <h2>{loading ? 'Processing...' : 'Remove Background'}</h2>
            </button>

            {error ? <p className='text-red-600 text-sm mt-3'>{error}</p> : null}
          </div>
        </form>
      </div>

      {/* Right Side */}
      <div className='h-auto w-full min-w-0 bg-linear-to-b from-white to-slate-50/60 p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm overflow-y-auto'>
        <div>
          <div className='flex items-start justify-between gap-4 mb-6'>
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center'>
                <Sparkles className='w-5 h-5' />
              </div>
              <div>
                <h2 className='text-lg font-semibold text-slate-800'>Cleaned Result</h2>
                <p className='text-xs text-slate-500'>Your background-free image will appear here for preview and download</p>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className='flex flex-col items-center justify-center h-96 rounded-xl border border-slate-200 bg-white'>
            <ProgressBar progress={progress} isVisible={true} />
          </div>
        ) : resultUrl ? (
          <div className='flex flex-col items-center justify-center gap-3 p-3 rounded-xl border border-slate-200 bg-white'>
            <img src={resultUrl} alt='Background removed result' className='w-full max-h-105 rounded-xl shadow-md object-contain' />
            <a href={resultUrl} download={`background-removed.${selectedFormat.toLowerCase()}`} className='text-sm font-semibold text-blue-600 hover:underline'>Download result</a>
          </div>
        ) : image ? (
          <div className='flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-white'>
            <img src={image} alt="Uploaded" className='w-full max-h-105 rounded-xl shadow-md object-contain' />
            <p className='text-slate-600 mt-3 text-sm text-center'>Click "Remove Background" to generate the cleaned preview below.</p>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center min-h-72 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12'>
            <ImageIcon className='w-9 h-9 text-slate-500' />
            <p className='text-slate-600 mt-3 text-sm text-center'>Upload an image, pick your output options, and the cleaned version will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RemoveBackground
