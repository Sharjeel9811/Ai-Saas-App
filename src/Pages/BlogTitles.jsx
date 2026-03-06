import { Edit, Sparkles } from 'lucide-react';
import { useState } from 'react';

const BlogTitles = () => {
   const BlogCategory=[
   'General',
   'Technology',
   'Health',
   'Travel',
   'Food',
   'Education',
   'Finance',
   'Lifestyle',
   'Entertainment',
   'Sports',
   'Science'
  ]
   const [SelectedBlog, setSelectedBlog] = useState('General');
    const [input, setinput] = useState('');
    const handleSubmit=(e)=>{
    e.preventDefault();


    }
  return (
    <div className='grid md:grid-cols-2 gap-6 h-auto '>
      {/* Left Side */}
      <div className='h-auto overflow-y-scroll w-full md:w-md bg-white p-6 rounded-lg border-2 border-dashed border-gray-200 flex flex-col'>

        <div className='flex text-center gap-4 mb-6'>
          <Sparkles className='w-6 h-6 text-blue-500' />
          <h2 className='text-lg font-semibold text-gray-700'>AI Blog Generator</h2>
        </div>

        <form onSubmit={handleSubmit} className='w-full space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Keyword</label>
            <input value={input} onChange={(e) => setinput(e.target.value)} type="text" placeholder="The Future Of Artifical Intelligence is...." className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ' />

          <h2 className='text-gray-700 mt-3 text-sm font-medium'>Blog Length</h2>
<div className='flex flex-wrap w-full gap-3 mt-3'>
  {BlogCategory.map((item)=>(
   <button type="button" className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${SelectedBlog===item ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`} onClick={()=>setSelectedBlog(item)} >
    {item}
   </button>
  ))}



</div>
<button className='flex items-center w-full mt-5 justify-center gap-2 bg-gradient-to-r from-green-300 to-green-600 text-white text-base font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer'>
   <Edit className='w-5 h-5 text-white'/>
    <h2>Generate Blog</h2>
</button>





          </div>
        </form>

      </div>

      {/* Right Side */}
      <div className='h-auto w-full md:w-md bg-white p-6 rounded-lg border-dashed border-2 border-gray-200 overflow-y-scroll'>
       <div>
        <div className='flex text-center gap-4 mb-6'>
          <Sparkles className='w-6 h-6 text-blue-500' />
          <h2 className='text-lg font-semibold text-gray-700'>Your Blog</h2>
        </div>
       </div>
      <div className='flex flex-col items-center justify-center h-full'>
        <Edit className='w-9 h-9 text-gray-500' />
        <p className='text-gray-500 mt-3 text-sm'>Your generated blog will appear here. Please enter a topic and select the desired length to generate your content.</p>
        </div>
      </div>

    </div>
  )
}

export default BlogTitles
