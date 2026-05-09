import { Menu, X } from 'lucide-react'
import { Outlet } from 'react-router-dom'

import { SignIn, useUser } from '@clerk/clerk-react'
import { useState } from 'react'
import SideBar from '../Components/SideBar'
import { assets } from '../assets/assets/assets'

const Layout = () => {
  const [sidebar, setsidebar] = useState(false)
  const {user}=useUser();



  return  user?(
    <div className='flex flex-col items-start justify-start h-screen relative bg-white text-slate-900 overflow-hidden'>

      <nav className='min-h-14 flex justify-between items-center w-full px-4 py-3 border-b bg-white border-gray-200'>
        <img src={assets.logo} alt="" className='w-32 sm:w-44' />

        <div className='flex items-center gap-3'>
          {sidebar?(
            <X className='w-6 h-6 cursor-pointer md:hidden' onClick={()=>setsidebar(false)}/>
          ):(<Menu className='w-6 h-6 cursor-pointer md:hidden' onClick={()=>setsidebar(true)}/>)}
        </div>


      </nav>

      <div className='flex w-full flex-1 overflow-hidden overflow-x-hidden relative'>
        {sidebar ? (
          <button
            type='button'
            aria-label='Close sidebar overlay'
            className='fixed inset-0 z-40 bg-black/30 md:hidden'
            onClick={() => setsidebar(false)}
          />
        ) : null}
        <div className='absolute md:relative w-56 h-full top-0 left-0 z-50'>
          <SideBar sidebar={sidebar}/>
        </div>
        <div className='flex-1 p-2 sm:p-3 md:p-4 overflow-y-auto w-full md:w-auto'>
          <Outlet/>
        </div>
      </div>
    </div>

  ):(
  <div className='flex items-center justify-center h-screen my-12 cursor-pinter'>
 <SignIn/>
  </div>



  )
}

export default Layout
