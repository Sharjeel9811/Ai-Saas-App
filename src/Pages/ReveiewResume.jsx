import { CheckCircle, FileText, Sparkles, Upload } from 'lucide-react'
import { useState } from 'react'

const ReveiewResume = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle resume review logic
  }

  const handleResumeUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setResume(file)
    }
  }

  return (
    <div className='grid md:grid-cols-2 gap-6 h-auto'>
      {/* Left Side */}
      <div className='h-auto overflow-y-scroll w-full md:w-md bg-white p-6 rounded-lg border-2 border-dashed border-gray-200 flex flex-col'>
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
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${selectedReviewType === type ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`}
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
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${selectedFocus === area ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`}
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
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]'
            />

            <button className='flex items-center w-full mt-5 justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-base font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <CheckCircle className='w-5 h-5 text-white'/>
              <h2>Review Resume</h2>
            </button>
          </div>
        </form>
      </div>

      {/* Right Side */}
      <div className='h-auto w-full md:w-md bg-white p-6 rounded-lg border-dashed border-2 border-gray-200 overflow-y-scroll'>
        <div>
          <div className='flex text-center gap-4 mb-6'>
            <Sparkles className='w-6 h-6 text-blue-500' />
            <h2 className='text-lg font-semibold text-gray-700'>Review Results</h2>
          </div>
        </div>
        {resume ? (
          <div className='flex flex-col items-center justify-center h-full'>
            <FileText className='w-12 h-12 text-blue-500' />
            <p className='text-gray-700 mt-3 text-base font-semibold text-center'>{resume.name}</p>
            <p className='text-gray-500 mt-2 text-sm text-center'>Resume uploaded successfully! Click "Review Resume" to get AI-powered feedback.</p>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full'>
            <FileText className='w-9 h-9 text-gray-500' />
            <p className='text-gray-500 mt-3 text-sm text-center'>Your resume review and suggestions will appear here. Upload your resume and select review preferences to get AI-powered feedback.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReveiewResume
