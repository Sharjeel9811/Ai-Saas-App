import { useClerk, useUser } from '@clerk/clerk-react';
import { Eraser, FileText, Hash, Home, Image, LogOut, Scissors, SquarePen, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';


const navitems=[
  {
    to:'/ai',label:'Dashboard',icon:<Home/>,

  },
    {
    to:'/ai/write-article',label:'Write Article',icon:<SquarePen/>,

  },
    {
    to:'/ai/blog-titles',label:'Blog Titles',icon:<Hash/>,

  },
  {to:'/ai/generate-images',label:'Generate Images',icon:<Image/>},{
    to:'/ai/remove-background',label:'Remove Background',icon:<Eraser/>
  },{
    to:'/ai/remove-object',label:'Remove Object',icon:<Scissors/>
  },
  {
    to:'/ai/review-resume',label:'Review Resume',icon:<FileText/>
  },
  {
    to:'/ai/community',label:'Community',icon:<Users/>
  }
]
const SideBar = ({sidebar}) => {
  const {user}=useUser();
  const { signOut } = useClerk();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className={`w-56 bg-white flex flex-col ${sidebar?'translate-x-0':'-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-gray-200 h-full z-50 md:z-auto`}>

      <div className='w-full flex flex-col justify-between h-full px-4 py-3'>
        <div>
          {user && (
            <div className='flex flex-col items-center gap-1.5 pb-3 mb-3'>
              <img src={user.imageUrl} alt="" className='w-10 h-10 rounded-full object-cover'/>
              <p className='text-sm font-semibold text-gray-900'>{user.firstName}</p>
            </div>
          )}

          <nav className='space-y-1.5'>
            {navitems.map((item,index)=>(
              <Link
                to={item.to}
                key={index}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.to)
                    ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white font-medium shadow-md'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className='w-5 h-5 shrink-0'>{item.icon}</span>
                <span className='text-sm font-medium'>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className='border-t border-gray-200 pt-2.5 pb-1 space-y-1.5'>


          <button
            onClick={handleSignOut}
            className='w-full flex  gap-3 px-2.5 py-2 rounded-lg   transition-all duration-200 bg-red-600 hover:bg-red-700 text-white cursor-pointer items-center justify-center'
          >
            <LogOut className='w-4 h-4  '/>
            <span className='text-sm  font-medium'>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SideBar
