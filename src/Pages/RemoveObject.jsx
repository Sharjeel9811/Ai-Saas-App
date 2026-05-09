import { useAuth } from '@clerk/clerk-react'
import { removeBackground } from '@imgly/background-removal'
import { Eraser, ImageIcon, Sparkles, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ProgressBar from '../Components/ProgressBar'
import { addCreationHistory } from '../lib/creationsHistory'

const RemoveObject = () => {
  const { getToken, userId } = useAuth()
  const qualityOptions = [
    'Standard',
    'High',
    'Ultra'
  ]

  const [selectedQuality, setSelectedQuality] = useState('Standard')
  const [image, setImage] = useState(null)
  const [instructions, setInstructions] = useState('')
  const [outputUrl, setOutputUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [progress, setProgress] = useState(0)
  const [processedUrl, setProcessedUrl] = useState('')
  const [processingDone, setProcessingDone] = useState(false)
  const progressIntervalRef = useRef(null)

  useEffect(() => {
    return () => {
      if (outputUrl && outputUrl.startsWith('blob:')) {
        URL.revokeObjectURL(outputUrl)
      }
      if (processedUrl && processedUrl.startsWith('blob:')) {
        URL.revokeObjectURL(processedUrl)
      }
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [outputUrl])

  // start/stop progress interval while loading
  useEffect(() => {
    if (loading) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return 90
          const inc = Math.floor(Math.random() * 10) + 5
          return Math.min(90, p + inc)
        })
      }, 400)
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }
  }, [loading])

  // when processing completes, fast-forward progress to 100 and reveal result
  useEffect(() => {
    if (processingDone) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      const t = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(t)
            return 100
          }
          return Math.min(100, p + 10)
        })
      }, 150)
    }
  }, [processingDone])

  // when progress reaches 100, show the processed output and reset loading
  useEffect(() => {
    if (progress === 100 && processedUrl) {
      setOutputUrl(processedUrl)
      setProcessedUrl('')
      setProcessingDone(false)
      setLoading(false)
      setTimeout(() => setProgress(0), 800)
    }
  }, [progress, processedUrl])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) {
      setError('Please upload an image first.')
      return
    }

    setLoading(true)
    setError('')
    setProgress(5)
    setProcessedUrl('')
    setProcessingDone(false)

    try {
      const token = await getToken()

      if (!token) {
        throw new Error('Please sign in to remove an object.')
      }

      // Fetch the image and process it with @imgly/background-removal
      const imageResponse = await fetch(image)
      const imageBlob = await imageResponse.blob()

      // Remove the background using @imgly package
      const cleanedBlob = await removeBackground(imageBlob)

      // Create a URL for the processed image and wait until progress reaches 100%
      const localImageUrl = URL.createObjectURL(cleanedBlob)
      setProcessedUrl(localImageUrl)
      setProcessingDone(true)

      addCreationHistory({
        userId,
        type: 'remove-object',
        prompt: instructions.trim() || 'remove the unwanted object from the scene',
        content: 'Object removed',
      })
    } catch (requestError) {
      setError(requestError.message || 'Failed to remove object.')
      setProcessingDone(false)
      setProgress(0)
      setLoading(false)
    } finally {
      // keep `loading` true until progress completes and UI shows result
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 h-auto w-full'>
      {/* Left Side */}
      <div className='h-auto overflow-y-auto w-full min-w-0 bg-white p-4 sm:p-6 rounded-lg border-2 border-dashed border-gray-200 flex flex-col'>
        <div className='flex text-center gap-4 mb-6'>
          <Sparkles className='w-6 h-6 text-blue-500' />
          <h2 className='text-lg font-semibold text-gray-700'>Remove Object</h2>
        </div>

        <form onSubmit={handleSubmit} className='w-full space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Upload Image</label>
            <div className='w-full'>
              <label className='flex flex-col items-center justify-center w-full min-h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden'>
                {image ? (
                  <div className='relative w-full'>
                    <img src={image} alt="Uploaded" className='w-full h-auto max-h-96 object-contain' />
                    <div className='absolute bottom-2 right-2 bg-white/90 px-3 py-1 rounded-full text-xs text-gray-600'>
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

            <label className='block text-sm font-medium text-gray-700 mb-2 mt-4'>Prompt / Keyword (Optional)</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Describe the object to remove, for example: person on the left, car in the background, signboard in front"
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20'
            />

            <h2 className='text-gray-700 mt-4 text-sm font-medium'>Processing Quality</h2>
            <div className='flex flex-wrap w-full gap-3 mt-3'>
              {qualityOptions.map((quality) => (
                <button
                  key={quality}
                  type="button"
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${selectedQuality === quality ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedQuality(quality)}
                >
                  {quality}
                </button>
              ))}
            </div>

            <button disabled={loading} className='flex items-center w-full mt-5 justify-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white text-base font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-70'>
              <Eraser className='w-5 h-5 text-white'/>
              <h2>{loading ? 'Processing...' : 'Remove Object'}</h2>
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
                <h2 className='text-lg font-semibold text-slate-800'>Refined Result</h2>
                <p className='text-xs text-slate-500'>Your object-free preview will appear here once processing is complete</p>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className='flex flex-col items-center justify-center h-96 rounded-xl border border-slate-200 bg-white'>
            <ProgressBar progress={progress} isVisible={true} />
          </div>
        ) : outputUrl ? (
          <div className='flex flex-col items-center justify-center gap-3 p-3 rounded-xl border border-slate-200 bg-white'>
            <img src={outputUrl} alt='Object removal preview' className='w-full max-h-128 rounded-xl shadow-md object-contain bg-slate-50' />
            <a href={outputUrl} target='_blank' rel='noreferrer' className='text-sm font-semibold text-blue-600 hover:underline'>Open cleanup preview</a>
          </div>
        ) : image ? (
          <div className='flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-white'>
            <img src={image} alt="Uploaded" className='w-full h-auto rounded-xl shadow-md' />
            <p className='text-slate-600 mt-3 text-sm text-center'>Click "Remove Object" to generate the cleaned preview below.</p>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center min-h-72 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12'>
            <ImageIcon className='w-9 h-9 text-slate-500' />
            <p className='text-slate-600 mt-3 text-sm text-center'>Upload an image, describe the object, and the cleaned result will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RemoveObject
