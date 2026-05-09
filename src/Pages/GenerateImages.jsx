import { useAuth } from '@clerk/clerk-react'
import { Image, Sparkles, Wand2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ProgressBar from '../Components/ProgressBar'
import { addCreationHistory } from '../lib/creationsHistory'

const GenerateImages = () => {
  const { getToken, userId } = useAuth()
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
  const [outputUrl, setOutputUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const progressIntervalRef = useRef(null)

  // Progress animation while loading
  useEffect(() => {
    if (loading) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(10);
      progressIntervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return 90;
          const inc = Math.floor(Math.random() * 15) + 5;
          return Math.min(90, p + inc);
        });
      }, 500);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(0);
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [loading]);

  useEffect(() => {
    return () => {
      if (outputUrl.startsWith('blob:')) {
        URL.revokeObjectURL(outputUrl)
      }
    }
  }, [outputUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!prompt.trim()) {
      setError('Please describe the image you want to generate.')
      return
    }

    setError('')
    setLoading(true)

    const generateImage = async () => {
      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Please sign in to generate an image.')
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/ai/generate-image?prompt=${encodeURIComponent(prompt.trim())}&style=${encodeURIComponent(selectedStyle)}`,
          {
            method: 'GET',
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to generate image.')
        }

        const imageBlob = await response.blob()
        const imageUrl = URL.createObjectURL(imageBlob)
        setOutputUrl(imageUrl)
        setProgress(100)
        addCreationHistory({
          userId,
          type: 'image',
          prompt: `Generate image of ${prompt.trim()} in ${selectedStyle} style.`,
          content: 'Generated image',
        })
      } catch (requestError) {
        setError(requestError.message || 'Failed to generate image.')
      } finally {
        setLoading(false)
      }
    }

    void generateImage()
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 h-auto w-full'>
      {/* Left Side */}
      <div className='h-auto overflow-y-auto w-full min-w-0 bg-white p-4 sm:p-6 rounded-lg border-2 border-dashed border-gray-200 flex flex-col'>
        <div className='flex text-center gap-4 mb-6'>
          <Sparkles className='w-6 h-6 text-blue-500' />
          <h2 className='text-lg font-semibold text-gray-700'>Generate AI Images</h2>
        </div>

        <form onSubmit={handleSubmit} className='w-full space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Prompt / Keyword</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Use a clear keyword or prompt, like: futuristic city, flying cars, sunset"
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-25'
            />

            <h2 className='text-gray-700 mt-3 text-sm font-medium'>Image Style / Keyword Modifier</h2>
            <div className='flex flex-wrap w-full gap-3 mt-3'>
              {imageStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${selectedStyle === style ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedStyle(style)}
                >
                  {style}
                </button>
              ))}
            </div>

            <button disabled={loading} className='flex items-center w-full mt-5 justify-center gap-2 bg-linear-to-r from-pink-500 to-orange-500 text-white text-base font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-70'>
              <Wand2 className='w-5 h-5 text-white'/>
              <h2>{loading ? 'Generating...' : 'Generate Image'}</h2>
            </button>

            {error ? <p className='text-red-600 text-sm'>{error}</p> : null}
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
                <h2 className='text-lg font-semibold text-slate-800'>Image Result</h2>
                <p className='text-xs text-slate-500'>Your generated image will appear here after processing</p>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className='flex flex-col items-center justify-center h-96 rounded-xl border border-slate-200 bg-white'>
            <ProgressBar progress={progress} isVisible={true} />
          </div>
        ) : outputUrl ? (
          <div className='flex flex-col items-center justify-center h-full gap-4 p-3 rounded-xl border border-slate-200 bg-white'>
            <img src={outputUrl} alt='Generated artwork' className='w-full max-h-128 rounded-xl shadow-md object-contain bg-slate-50' />
            <div className='flex flex-wrap items-center justify-center gap-3'>
              <a
                href={outputUrl}
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100'
              >
                Open full image
              </a>
              <a
                href={outputUrl}
                download='generated-image.png'
                className='inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800'
              >
                Download image
              </a>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center min-h-72 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12'>
            <Image className='w-9 h-9 text-slate-500' />
            <p className='text-slate-600 mt-3 text-sm text-center'>Describe the image you want, choose a style, and your generated result will show up here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GenerateImages
