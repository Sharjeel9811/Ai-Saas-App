import { useAuth } from '@clerk/clerk-react';
import { Edit, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ProgressBar from '../Components/ProgressBar';
import { postAiTool } from '../lib/aiClient';
import { addCreationHistory } from '../lib/creationsHistory';

const BlogTitles = () => {
  const { getToken, userId } = useAuth();
  const BlogCategory = [
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
    'Science',
  ];

  const [SelectedBlog, setSelectedBlog] = useState('General');
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
      setError('Please enter a keyword.');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const token = await getToken();
      const data = await postAiTool({
        path: '/api/ai/generate-blog-titles',
        token,
        body: {
          keyword: input,
          category: SelectedBlog,
        },
      });

      setOutput(data.content || '');
      addCreationHistory({
        userId,
        type: 'blog-title',
        prompt: `Generate 10 blog titles for ${input} in ${SelectedBlog} category.`,
        content: data.content || '',
      });
    } catch (requestError) {
      setError(requestError.message || 'Failed to generate blog titles.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 h-auto w-full'>
      <div className='h-auto overflow-y-auto w-full min-w-0 bg-white p-4 sm:p-6 rounded-lg border-2 border-dashed border-gray-200 flex flex-col'>
        <div className='flex text-center gap-4 mb-6'>
          <Sparkles className='w-6 h-6 text-blue-500' />
          <h2 className='text-lg font-semibold text-gray-700'>AI Blog Generator</h2>
        </div>

        <form onSubmit={handleSubmit} className='w-full space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Keyword</label>
            <input
              value={input}
              onChange={(e) => setinput(e.target.value)}
              type='text'
              placeholder='The Future Of Artificial Intelligence is....'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 '
            />

            <h2 className='text-gray-700 mt-3 text-sm font-medium'>Blog Category</h2>
            <div className='flex flex-wrap w-full gap-3 mt-3'>
              {BlogCategory.map((item) => (
                <button
                  key={item}
                  type='button'
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${SelectedBlog === item ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedBlog(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              disabled={loading}
              className='flex items-center w-full mt-5 justify-center gap-2 bg-linear-to-r from-green-300 to-green-600 text-white text-base font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-70'
            >
              <Edit className='w-5 h-5 text-white' />
              <h2>{loading ? 'Generating...' : 'Generate Blog'}</h2>
            </button>
          </div>
        </form>
      </div>

      <div className='h-auto w-full min-w-0 bg-white p-4 sm:p-6 rounded-lg border-dashed border-2 border-gray-200 overflow-y-auto'>
        <div>
          <div className='flex text-center gap-4 mb-6'>
            <Sparkles className='w-6 h-6 text-blue-500' />
            <h2 className='text-lg font-semibold text-gray-700'>Your Blog</h2>
          </div>
        </div>
        {loading ? (
          <div className='flex flex-col items-center justify-center h-96'>
            <ProgressBar progress={progress} isVisible={true} />
          </div>
        ) : error ? (
          <p className='text-red-600 text-sm'>{error}</p>
        ) : output ? (
          <div className='whitespace-pre-wrap text-gray-700 text-sm leading-7'>{output}</div>
        ) : (
          <div className='flex flex-col items-center justify-center min-h-72'>
            <Edit className='w-9 h-9 text-gray-500' />
            <p className='text-gray-500 mt-3 text-sm'>Your generated blog will appear here. Please enter a topic and select the category to generate your content.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogTitles
