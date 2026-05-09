import { useAuth } from '@clerk/clerk-react'
import { CheckCircle, FileText, Sparkles, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ProgressBar from '../Components/ProgressBar'
import { postAiTool } from '../lib/aiClient'
import { addCreationHistory } from '../lib/creationsHistory'
import { extractResumeText } from '../lib/resumeText'

const extractScoreFromReview = (text) => {
  const scoreMatch = text.match(/score[:\s]+(\d+(?:\.\d+)?)\s*(?:out of|\/)\s*10/i)
  if (scoreMatch) {
    return Math.min(10, Math.max(0, parseFloat(scoreMatch[1])))
  }
  return null
}

const getScoreColor = (score) => {
  if (score >= 8) return 'from-green-500 to-emerald-500'
  if (score >= 6) return 'from-blue-500 to-cyan-500'
  if (score >= 4) return 'from-yellow-500 to-orange-500'
  return 'from-red-500 to-rose-500'
}

const ReveiewResume = () => {
  const { getToken, userId } = useAuth()
  const reviewTypes = [
    'General',
    'Technical',
    'Creative',
    'Executive',
    'Entry Level'
  ]

  const focusAreas = [
    'Content',
    'Formatting',
    'Grammar',
    'Keywords',
    'Overall'
  ]

  const [selectedReviewType, setSelectedReviewType] = useState('General')
  const [selectedFocus, setSelectedFocus] = useState('Overall')
  const [resume, setResume] = useState(null)
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [output, setOutput] = useState('')
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

  // Complete progress when output arrives
  useEffect(() => {
    if (output && progress < 100) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(100);
    }
  }, [output, progress]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!resume) {
      setError('Please upload a resume file first.')
      return
    }

    setLoading(true)
    setError('')
    setOutput('')

    try {
      const resumeText = await extractResumeText(resume)
      const token = await getToken()

      const data = await postAiTool({
        path: '/api/ai/review-resume',
        token,
        body: {
          resumeText,
          reviewType: selectedReviewType,
          focusArea: selectedFocus,
          additionalInfo,
          fileName: resume.name,
        },
      })

      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(100);
      setOutput(data.content || '')
      addCreationHistory({
        userId,
        type: 'resume-review',
        prompt: `Review resume: ${resume.name}`,
        content: data.content || '',
      })
    } catch (requestError) {
      setError(requestError.message || 'Failed to review resume.')
    } finally {
      setLoading(false)
    }
  }

  const handleResumeUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setResume(file)
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 h-auto w-full'>
      {/* Left Side */}
      <div className='h-auto overflow-y-auto w-full min-w-0 bg-white p-4 sm:p-6 rounded-lg border-2 border-dashed border-gray-200 flex flex-col'>
        <div className='flex text-center gap-4 mb-6'>
          <Sparkles className='w-6 h-6 text-blue-500' />
          <h2 className='text-lg font-semibold text-gray-700'>Review Resume</h2>
        </div>

        <form onSubmit={handleSubmit} className='w-full space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Upload Resume</label>
            <div className='w-full'>
              <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  <Upload className='w-8 h-8 mb-2 text-gray-500' />
                  <p className='text-sm text-gray-500'>
                    {resume ? resume.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className='text-xs text-gray-400'>PDF, DOCX (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className='hidden'
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                />
              </label>
            </div>

            <h2 className='text-gray-700 mt-4 text-sm font-medium'>Review Type</h2>
            <div className='flex flex-wrap w-full gap-3 mt-3'>
              {reviewTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${selectedReviewType === type ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedReviewType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <h2 className='text-gray-700 mt-4 text-sm font-medium'>Focus Area</h2>
            <div className='flex flex-wrap w-full gap-3 mt-3'>
              {focusAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${selectedFocus === area ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedFocus(area)}
                >
                  {area}
                </button>
              ))}
            </div>

            <label className='block text-sm font-medium text-gray-700 mb-2 mt-4'>Additional Information (Optional)</label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Target job position, industry, specific areas of concern..."
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20'
            />

            <button className='flex items-center w-full mt-5 justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-700 text-white text-base font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <CheckCircle className='w-5 h-5 text-white'/>
              <h2>{loading ? 'Reviewing...' : 'Review Resume'}</h2>
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
                <h2 className='text-lg font-semibold text-slate-800'>Review Results</h2>
                <p className='text-xs text-slate-500'>Detailed feedback and improvement notes will appear here after analysis</p>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className='flex flex-col items-center justify-center h-96 rounded-xl border border-slate-200 bg-white'>
            <ProgressBar progress={progress} isVisible={true} />
          </div>
        ) : output ? (
          <div className='space-y-4'>
            {extractScoreFromReview(output) !== null && (
              <div className={`bg-linear-to-r ${getScoreColor(extractScoreFromReview(output))} p-6 rounded-xl shadow-lg text-white`}>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium opacity-90'>Resume Score</p>
                    <p className='text-4xl font-bold'>{extractScoreFromReview(output).toFixed(1)}</p>
                    <p className='text-sm opacity-90 mt-1'>out of 10</p>
                  </div>
                  <div className='w-24 h-24 rounded-full border-4 border-white border-opacity-30 flex items-center justify-center'>
                    <div className='text-center'>
                      <p className='text-2xl font-bold'>{(extractScoreFromReview(output) * 10).toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className='whitespace-pre-wrap text-slate-700 text-sm leading-7 p-4 rounded-xl border border-slate-200 bg-white max-h-96 overflow-y-auto'>{output}</div>
          </div>
        ) : resume ? (
          <div className='flex flex-col items-center justify-center min-h-72 rounded-xl border border-slate-200 bg-white px-6 py-12'>
            <FileText className='w-12 h-12 text-blue-500' />
            <p className='text-slate-700 mt-3 text-base font-semibold text-center'>{resume.name}</p>
            <p className='text-slate-600 mt-2 text-sm text-center'>Resume uploaded successfully. Click "Review Resume" to generate your feedback.</p>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center min-h-72 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12'>
            <FileText className='w-9 h-9 text-slate-500' />
            <p className='text-slate-600 mt-3 text-sm text-center'>Upload your resume, choose your review settings, and the analysis will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReveiewResume
