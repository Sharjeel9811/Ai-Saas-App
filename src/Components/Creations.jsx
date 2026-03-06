import React from 'react'

const Creations = ({item}) => {
  return (
    <div className='p-4 max-w-5xl text-sm cursor-pointer border border-gray-200 text-white rounded-lg'>
      <div className='flex justify-between items-center gap-4'>
        <div>
          <h2 className='text-black'>{item.prompt}</h2>
          <p className='text-gray-500'>{item.type}-{new Date(item.created_at).toLocaleDateString()}</p>
        </div>
        <button className='bg-[#EFF6FF] border border-[#8FDBFE] text-[#1E40AF] px-4 py-1 rounded-full'>
          {item.type}

        </button>

      </div>

    </div>
  )
}

export default Creations
