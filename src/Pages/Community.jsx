import { MessageCircle, Reply, Search, Sparkles, ThumbsUp, TrendingUp, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

const COMMUNITY_STORAGE_KEY = 'ai_saas_community_posts'

const initialPosts = [
  {
    id: 1,
    author: 'Sarah Johnson',
    avatar: 'S',
    title: 'Amazing results with the AI image generator!',
    preview: 'Just tried the new image generation feature and I\'m blown away by the quality and speed...',
    likes: 124,
    comments: 32,
    category: 'Showcase',
    views: 523,
    timeAgo: '2h ago'
  },
  {
    id: 2,
    author: 'Mike Chen',
    avatar: 'M',
    title: 'How to get better article results?',
    preview: 'I\'m struggling to get the desired tone in my articles. Any tips from the community?',
    likes: 45,
    comments: 67,
    category: 'Questions',
    views: 234,
    timeAgo: '4h ago'
  },
  {
    id: 3,
    author: 'Emily Rodriguez',
    avatar: 'E',
    title: 'Pro tip: Use specific prompts for better images',
    preview: 'After experimenting, I found that being very specific with your prompts helps get consistent...',
    likes: 234,
    comments: 45,
    category: 'Tips & Tricks',
    views: 892,
    timeAgo: '1d ago'
  },
  {
    id: 4,
    author: 'Alex Kumar',
    avatar: 'A',
    title: 'Feature request: Batch processing',
    preview: 'Would love to see batch processing for generating multiple images at once',
    likes: 89,
    comments: 23,
    category: 'Feature Requests',
    views: 156,
    timeAgo: '3d ago'
  }
]

const hydratePosts = (posts) => posts.map((post) => ({
  ...post,
  likedByMe: Boolean(post.likedByMe),
  commentsList: Array.isArray(post.commentsList) ? post.commentsList : [],
}))

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
  const [posts, setPosts] = useState(() => {
    const rawPosts = window.localStorage.getItem(COMMUNITY_STORAGE_KEY)
    if (!rawPosts) return initialPosts

    try {
      const parsedPosts = JSON.parse(rawPosts)
      return Array.isArray(parsedPosts) && parsedPosts.length > 0 ? hydratePosts(parsedPosts) : initialPosts
    } catch {
      return initialPosts
    }
  })

  const [commentDrafts, setCommentDrafts] = useState({})

  useEffect(() => {
    window.localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(posts))
  }, [posts])

  const handleCreateDiscussion = () => {
    const newTitle = window.prompt('Enter a discussion title')
    if (!newTitle?.trim()) return

    const newPreview = window.prompt('Add a short description')
    if (!newPreview?.trim()) return

    const fallbackCategory = selectedCategory === 'All' ? 'Questions' : selectedCategory
    const newPost = {
      id: Date.now(),
      author: 'You',
      title: newTitle.trim(),
      preview: newPreview.trim(),
      likes: 0,
      comments: 0,
      category: fallbackCategory,
    }

    setPosts((currentPosts) => [newPost, ...currentPosts])
  }

  const handleLikePost = (postId) => {
    setPosts((currentPosts) => currentPosts.map((post) => {
      if (post.id !== postId) return post

      const likedByMe = !post.likedByMe
      const likes = Math.max(0, (post.likes || 0) + (likedByMe ? 1 : -1))

      return {
        ...post,
        likedByMe,
        likes,
      }
    }))
  }

  const handleCommentSubmit = (postId) => {
    const commentText = (commentDrafts[postId] || '').trim()
    if (!commentText) return

    setPosts((currentPosts) => currentPosts.map((post) => {
      if (post.id !== postId) return post

      const nextComments = [
        ...(post.commentsList || []),
        {
          id: Date.now(),
          author: 'You',
          text: commentText,
          createdAt: new Date().toISOString(),
        },
      ]

      return {
        ...post,
        commentsList: nextComments,
        comments: nextComments.length,
      }
    }))

    setCommentDrafts((currentDrafts) => ({
      ...currentDrafts,
      [postId]: '',
    }))
  }

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const query = searchQuery.trim().toLowerCase()

    if (!query) return matchesCategory

    const matchesSearch = [post.title, post.preview, post.author, post.category]
      .join(' ')
      .toLowerCase()
      .includes(query)

    return matchesCategory && matchesSearch
  })

  return (
    <div className='w-full bg-linear-to-b from-slate-900 via-slate-900 to-slate-800 min-h-screen'>
      {/* Hero Section */}
      <div className='bg-linear-to-r from-slate-900 via-purple-900/50 to-slate-900 py-8 sm:py-12 px-4 sm:px-6 border-b border-slate-700/50'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center'>
              <Sparkles className='w-6 h-6 text-white' />
            </div>
            <h1 className='text-4xl font-bold text-white'>Community Hub</h1>
          </div>
          <p className='text-slate-300 text-lg mb-6'>Connect, share, and grow with thousands of AI creators</p>

          {/* Stats */}
          <div className='grid grid-cols-3 gap-4 max-w-md'>
            <div className='bg-white/5 border border-white/10 rounded-xl p-3'>
              <p className='text-2xl font-bold text-white'>{filteredPosts.length}+</p>
              <p className='text-xs text-slate-400'>Discussions</p>
            </div>
            <div className='bg-white/5 border border-white/10 rounded-xl p-3'>
              <p className='text-2xl font-bold text-white'>2.4K</p>
              <p className='text-xs text-slate-400'>Active Members</p>
            </div>
            <div className='bg-white/5 border border-white/10 rounded-xl p-3'>
              <p className='text-2xl font-bold text-white'>8.2K</p>
              <p className='text-xs text-slate-400'>Total Posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6'>
          {/* Sidebar */}
          <div className='md:col-span-1 space-y-6'>
            {/* Categories Card */}
            <div className='bg-slate-800 border border-slate-700 rounded-2xl p-6 sticky top-6'>
              <h2 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
                <Users className='w-5 h-5 text-purple-400' />
                Categories
              </h2>
              <div className='space-y-2'>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${selectedCategory === category ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Guidelines */}
              <div className='mt-6 pt-6 border-t border-slate-700'>
                <h3 className='text-sm font-bold text-white mb-3'>Community Guidelines</h3>
                <ul className='text-xs text-slate-400 space-y-2'>
                  <li className='flex gap-2'><span className='text-purple-400'>•</span> Be respectful</li>
                  <li className='flex gap-2'><span className='text-purple-400'>•</span> Share knowledge</li>
                  <li className='flex gap-2'><span className='text-purple-400'>•</span> No spam</li>
                  <li className='flex gap-2'><span className='text-purple-400'>•</span> Help others</li>
                </ul>
              </div>
            </div>

            {/* Trending Card */}
            <div className='bg-slate-800 border border-slate-700 rounded-2xl p-6'>
              <h2 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
                <TrendingUp className='w-5 h-5 text-pink-400' />
                Trending
              </h2>
              <div className='space-y-3'>
                {filteredPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className='p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors cursor-pointer'>
                    <p className='text-xs font-semibold text-slate-300 line-clamp-2'>{post.title}</p>
                    <p className='text-xs text-slate-500 mt-1'>{post.views} views</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className='md:col-span-3 space-y-4'>
            {/* Search + Create */}
            <div className='space-y-3'>
              <div className='relative'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500' />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions..."
                  className='w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                />
              </div>

              <button onClick={handleCreateDiscussion} className='w-full flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all'>
                <MessageCircle className='w-5 h-5' />
                Start New Discussion
              </button>
            </div>

            {/* Posts */}
            <div className='space-y-3'>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div key={post.id} className='bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:shadow-lg transition-all hover:shadow-purple-500/10'>
                    <div className='flex gap-4'>
                      {/* Avatar */}
                      <div className='shrink-0'>
                        <div className='w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg'>
                          {post.avatar}
                        </div>
                      </div>

                      {/* Content */}
                      <div className='flex-1 min-w-0'>
                        {/* Header */}
                        <div className='flex items-start justify-between gap-2 mb-2'>
                          <div>
                            <p className='text-sm font-semibold text-white'>{post.author}</p>
                            <p className='text-xs text-slate-400'>{post.timeAgo}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            post.category === 'Showcase' ? 'bg-blue-500/20 text-blue-300' :
                            post.category === 'Questions' ? 'bg-yellow-500/20 text-yellow-300' :
                            post.category === 'Tips & Tricks' ? 'bg-green-500/20 text-green-300' :
                            post.category === 'Feature Requests' ? 'bg-purple-500/20 text-purple-300' :
                            'bg-slate-500/20 text-slate-300'
                          }`}>
                            {post.category}
                          </span>
                        </div>

                        {/* Title & Preview */}
                        <h3 className='text-base font-bold text-white mb-2 hover:text-purple-400 transition-colors cursor-pointer'>{post.title}</h3>
                        <p className='text-sm text-slate-300 mb-4 line-clamp-2'>{post.preview}</p>

                        {/* Actions */}
                        <div className='flex flex-wrap items-center gap-4 mb-4'>
                          <button
                            type='button'
                            onClick={() => handleLikePost(post.id)}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${post.likedByMe ? 'bg-pink-500/20 text-pink-400' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                          >
                            <ThumbsUp className='w-4 h-4' />
                            <span className='text-sm font-medium'>{post.likes}</span>
                          </button>
                          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700 text-slate-400'>
                            <MessageCircle className='w-4 h-4' />
                            <span className='text-sm font-medium'>{post.comments}</span>
                          </div>
                          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700 text-slate-400 text-sm'>
                            👁️ {post.views}
                          </div>
                        </div>

                        {/* Comments Section */}
                        <div className='border-t border-slate-700 pt-4'>
                          <div className='flex gap-2 mb-3'>
                            <input
                              type='text'
                              value={commentDrafts[post.id] || ''}
                              onChange={(e) => setCommentDrafts((currentDrafts) => ({ ...currentDrafts, [post.id]: e.target.value }))}
                              placeholder='Share your thoughts...'
                              className='flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500'
                            />
                            <button
                              type='button'
                              onClick={() => handleCommentSubmit(post.id)}
                              className='bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors flex items-center gap-1'
                            >
                              <Reply className='w-4 h-4' />
                              Reply
                            </button>
                          </div>

                          {(post.commentsList || []).length > 0 && (
                            <div className='space-y-2'>
                              <p className='text-xs text-slate-500 font-semibold'>Latest comments</p>
                              {(post.commentsList || []).slice(-2).map((comment) => (
                                <div key={comment.id} className='rounded-lg bg-slate-700/50 px-3 py-2 text-sm text-slate-300'>
                                  <div className='flex items-center justify-between gap-2 mb-1'>
                                    <span className='font-semibold text-slate-200'>{comment.author}</span>
                                    <span className='text-xs text-slate-500'>{new Date(comment.createdAt).toLocaleString()}</span>
                                  </div>
                                  <p>{comment.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='flex flex-col items-center justify-center py-16 bg-slate-800/50 border border-slate-700 rounded-xl'>
                  <Users className='w-12 h-12 text-slate-600 mb-3' />
                  <p className='text-slate-300 font-medium mb-1'>No discussions found</p>
                  <p className='text-slate-500 text-sm text-center'>Try a different category or search term</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Community
