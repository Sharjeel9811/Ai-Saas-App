import { Sparkles } from 'lucide-react'

const ProgressBar = ({ progress, isVisible }) => {
  if (!isVisible) return null

  return (
    <div className='flex flex-col items-center justify-center w-full h-full gap-4 sm:gap-6 p-4 sm:p-8'>
      <div className='flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4'>
        <Sparkles className='w-5 h-5 sm:w-6 sm:h-6 text-blue-500 animate-spin' />
        <h3 className='text-base sm:text-lg font-semibold text-slate-700'>Processing...</h3>
      </div>

      {/* Progress Bar Container */}
      <div className='w-full max-w-xs'>
        <div className='relative w-full h-2 sm:h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner'>
          {/* Progress Fill */}
          <div
            className='h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out shadow-lg'
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Text */}
        <div className='flex justify-between items-center mt-2 sm:mt-3 gap-2 sm:gap-4'>
          <span className='text-xs sm:text-sm font-medium text-slate-600'>Processing</span>
          <span className='text-xs sm:text-sm font-bold text-blue-600 min-w-12 text-right'>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Loading Dots Animation */}
      <div className='flex gap-1 sm:gap-2 mt-3 sm:mt-4'>
        <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce' style={{ animationDelay: '0s' }} />
        <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }} />
        <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full animate-bounce' style={{ animationDelay: '0.4s' }} />
      </div>

      <p className='text-xs text-slate-500 text-center mt-2 sm:mt-3'>
        This may take a few moments. Please wait...
      </p>
    </div>
  )
}

export default ProgressBar
