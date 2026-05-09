import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets/assets'

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`fixed z-50 w-full flex justify-between items-center px-4 py-3 sm:px-20 xl:px-32 transition-all duration-300 bg-white/95 border-b border-gray-200 shadow-sm ${isScrolled ? 'shadow-md' : ''}`}>
      <img src={assets.logo} alt='Logo' className='w-32 sm:w-44' onClick={() => navigate('/')} />

      <div className='flex items-center gap-3'>
        {user ? (
          <UserButton />
        ) : (
          <button className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition' onClick={openSignIn}>
            Get Started <ArrowRight className='w-4 h-4' />
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar
