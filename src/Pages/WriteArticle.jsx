import { useAuth } from '@clerk/clerk-react';
import { Edit, Hash, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ProgressBar from '../Components/ProgressBar';
import { postAiTool } from '../lib/aiClient';
import { addCreationHistory } from '../lib/creationsHistory';

const WriteArticle = () => {
  const { getToken, userId } = useAuth();

  const LengthSec = [
    { label: 'Short (100-300 words)', value: 'short' },
    { label: 'Medium (300-700 words)', value: 'medium' },
    { label: 'Long (700+ words)', value: 'long' },

  ]
  const [selectedLength, setselectedLength] = useState('short');
  const [input, setinput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);

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
      setTimeout(() => setProgress(0), 800);
    }
  }, [output, progress]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setError('Please enter an article topic.');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const token = await getToken();
      const data = await postAiTool({
        path: '/api/ai/generate-article',
        token,
        body: {
          topic: input,
          lenght: selectedLength,
        },
      });

      setOutput(data.content || '');
      addCreationHistory({
        userId,
        type: 'article',
        prompt: `Write an article about ${input} in ${selectedLength} format.`,
        content: data.content || '',
      });
    } catch (requestError) {
      setError(requestError.message || 'Failed to generate article.');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 h-auto w-full'>
      {/* Left Side */}
      <div className='h-auto overflow-y-auto w-full min-w-0 bg-white p-4 sm:p-6 rounded-lg border-2 border-dashed border-gray-200 flex flex-col'>

        <div className='flex text-center gap-4 mb-6'>
          <Sparkles className='w-6 h-6 text-blue-500' />
          <h2 className='text-lg font-semibold text-gray-700'>Write Your Article</h2>
        </div>

        <form onSubmit={handleSubmit} className='w-full space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Article Topic</label>
            <input value={input} onChange={(e) => setinput(e.target.value)} type="text" placeholder="The Future Of Artificial Intelligence is...." className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ' />

          <h2 className='text-gray-700 mt-3 text-sm font-medium'>Article Length</h2>
<div className='flex flex-wrap w-full gap-3 mt-3'>
  {LengthSec.map((item) => (
  <button key={item.value} type="button" className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${selectedLength===item.value ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`} onClick={()=>setselectedLength(item.value)} >
    {item.label}
   </button>
  ))}



</div>
<button disabled={loading} className='flex items-center w-full mt-5 justify-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white text-base font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-70'>
   <Edit className='w-5 h-5 text-white'/>
  <h2>{loading ? 'Generating...' : 'Generate Article'}</h2>
</button>

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
              <h2 className='text-lg font-semibold text-slate-800'>Article Result</h2>
              <p className='text-xs text-slate-500'>Your generated article will appear here after processing</p>
            </div>
          </div>
        </div>
       </div>
      {loading ? (
        <div className='flex flex-col items-center justify-center h-96 rounded-xl border border-slate-200 bg-white'>
          <ProgressBar progress={progress} isVisible={true} />
        </div>
      ) : error ? (
        <p className='text-red-600 text-sm'>{error}</p>
      ) : output ? (
        <div className='whitespace-pre-wrap text-slate-700 text-sm leading-7 p-4 rounded-xl border border-slate-200 bg-white'>{output}</div>
      ) : (
      <div className='flex flex-col items-center justify-center min-h-72 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12'>
        <Hash className='w-9 h-9 text-slate-500' />
        <p className='text-slate-600 mt-3 text-sm text-center'>Enter a topic, choose a length, and your article draft will appear here.</p>
        </div>
      )}
      </div>

    </div>
  )
}

export default WriteArticle
