import { MessageCircle, Search, Sparkles, ThumbsUp, Users } from 'lucide-react'
import { useState } from 'react'

const Community = () => {
  const categories = [
    'All',
    'Questions',
    'Showcase',
    'Tips & Tricks',
    'Feature Requests',
    'Bug Reports'
  ]

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const samplePosts = [
    {
      id: 1,
      author: 'Sarah Johnson',
      title: 'Amazing results with the AI image generator!',
      preview: 'Just tried the new image generation feature and I\'m blown away...',
      likes: 24,
      comments: 8,
      category: 'Showcase'
    },
    {
      id: 2,
      author: 'Mike Chen',
      title: 'How to get better article results?',
      preview: 'I\'m struggling to get the desired tone in my articles...',
      likes: 12,
      comments: 15,
      category: 'Questions'
    },
    {
      id: 3,
      author: 'Emily Rodriguez',
      title: 'Pro tip: Use specific prompts for better images',
      preview: 'After experimenting, I found that being very specific helps...',
      likes: 45,
      comments: 22,
      category: 'Tips & Tricks'
    }
  ]

  return (
    <div className='grid md:grid-cols-3 gap-6 h-auto'>
      {/* Left Sidebar - Categories */}
      <div className='md:col-span-1 h-auto w-full bg-white p-6 rounded-lg border-2 border-dashed border-gray-200'>
        <div className='flex text-center gap-4 mb-6'>
          <Users className='w-6 h-6 text-blue-500' />
          <h2 className='text-lg font-semibold text-gray-700'>Categories</h2>
        </div>

        <div className='flex flex-col gap-2'>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 text-left cursor-pointer ${selectedCategory === category ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className='mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
          <h3 className='text-sm font-semibold text-blue-900 mb-2'>Community Guidelines</h3>
          <ul className='text-xs text-blue-700 space-y-1'>
            <li>• Be respectful and kind</li>
            <li>• Share constructive feedback</li>
            <li>• No spam or self-promotion</li>
            <li>• Help others learn and grow</li>
          </ul>
        </div>
      </div>

      {/* Main Content - Posts */}
      <div className='md:col-span-2 h-auto overflow-y-scroll w-full bg-white p-6 rounded-lg border-dashed border-2 border-gray-200'>
        <div>
          <div className='flex text-center gap-4 mb-6'>
            <Sparkles className='w-6 h-6 text-blue-500' />
            <h2 className='text-lg font-semibold text-gray-700'>Community Discussions</h2>
          </div>

          {/* Search Bar */}
          <div className='mb-6 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions..."
              className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* New Post Button */}
          <button className='flex items-center w-full mb-6 justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-base font-semibold px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer'>
            <MessageCircle className='w-5 h-5 text-white'/>
            <h2>Start New Discussion</h2>
          </button>

          {/* Posts List */}
          <div className='space-y-4'>
            {samplePosts.length > 0 ? (
              samplePosts.map((post) => (
                <div key={post.id} className='p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer'>
                  <div className='flex items-start justify-between mb-2'>
                    <div>
                      <h3 className='text-base font-semibold text-gray-800'>{post.title}</h3>
                      <p className='text-xs text-gray-500 mt-1'>by {post.author}</p>
                    </div>
                    <span className='px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full'>
                      {post.category}
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 mb-3'>{post.preview}</p>
                  <div className='flex items-center gap-4 text-sm text-gray-500'>
                    <div className='flex items-center gap-1'>
                      <ThumbsUp className='w-4 h-4' />
                      <span>{post.likes}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <MessageCircle className='w-4 h-4' />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex flex-col items-center justify-center py-12'>
                <Users className='w-12 h-12 text-gray-400' />
                <p className='text-gray-500 mt-3 text-sm text-center'>No discussions found. Be the first to start a conversation!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Community
