import { Trash2 } from 'lucide-react'

const Creations = ({ item, onDelete }) => {
  return (
    <div className='p-3 sm:p-4 max-w-5xl text-xs sm:text-sm border border-gray-200 bg-white rounded-lg shadow-sm'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4'>
        <div className='min-w-0 flex-1'>
          <h2 className='text-xs sm:text-base text-black font-medium truncate'>{item.prompt}</h2>
          <p className='text-xs sm:text-sm text-gray-500'>{item.type} - {new Date(item.created_at).toLocaleDateString()}</p>
        </div>
        <div className='flex items-center gap-2 shrink-0 w-full sm:w-auto'>
          <button className='bg-[#EFF6FF] border border-[#8FDBFE] text-[#1E40AF] px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm flex-1 sm:flex-none'>
            {item.type}
          </button>
          <button
            type='button'
            onClick={() => onDelete?.(item.id)}
            className='inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-600 transition-colors hover:bg-red-100 flex-1 sm:flex-none justify-center sm:justify-start'
            aria-label={`Delete ${item.type} creation`}
            title='Delete this creation'
          >
            <Trash2 className='w-3 h-3 sm:w-4 sm:h-4' />
            <span className='hidden sm:inline'>Delete</span>
          </button>
        </div>

      </div>

    </div>
  )
}

export default Creations
