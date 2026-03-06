import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets/assets';

const Hero = () => {
  const navigate=useNavigate();

  return (
    <div className='relative min-h-screen w-full overflow-hidden bg-[url(/gradientBackground.png)] bg-cover bg-center bg-no-repeat'>

      {/* Content */}
      <div className='relative px-4 sm:px-20 xl:px-32 pt-32 pb-20 flex flex-col items-center justify-center min-h-screen'>

        <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-8 border border-gray-200'>
          <Sparkles className='w-4 h-4 text-blue-600' />
          <span className='text-sm font-medium text-gray-700'>AI-Powered Content Creation</span>
        </div>


        <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center leading-tight mb-6 max-w-5xl'>
          Create Amazing Content
          <br />
          With <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>AI Tools</span>
        </h1>


        <p className='text-lg sm:text-xl md:text-2xl text-gray-600 text-center max-w-3xl mb-10'>
          Generate high-quality content in seconds with our advanced AI tools.
          <span className='block mt-2'>Transform your ideas into reality.</span>
        </p>

        {/* CTA Buttons */}
        <div className='flex flex-col sm:flex-row items-center gap-4'>
          <button
            onClick={()=>navigate('/ai')}
            className='group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base font-semibold px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer'
          >
            <span className='relative z-10'>Start Creating Now</span>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity'></div>
          </button>

          <button className='bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:border-blue-600 hover:text-blue-600 hover:shadow-lg px-8 py-4 text-base font-semibold transition-all duration-300 hover:scale-105 cursor-pointer'>
            Watch Demo
          </button>
        </div>

        <div className='mt-10 flex items-center gap-2 text-gray-500 text-sm justify-center'>
          <img src={assets.user_group} alt="" className=' h-8' />
          <span className='flex items-center '>Trusted by 10k+ users</span>
        </div>


      </div>
    </div>
  )
}

export default Hero
