import { useNavigate } from 'react-router-dom';
import { AiToolsData } from '../../assets/assets/assets';
import { useUser } from '@clerk/clerk-react';

const Tools = () => {
  const navigate = useNavigate();
  const {user}=useUser();


  return (
    <div className='px-4 my-24 sm:w-full xl:px-32'>
      <h1 className='font-bold text-center text-4xl'>Powerful AI Tools</h1>
      <p className='text-gray-500 text-center mt-4 text-lg'>Explore our wide range of AI tools designed to boost your productivity and creativity.</p>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16'>
        {AiToolsData.map((tool, index) => {
          const IconComponent = tool.Icon;
          return (
            <div
              key={index}
              className='group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:ring-2 hover:ring-blue-600  '
              onClick={() =>user&& navigate(tool.path)}
            >

              <div
                className='w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'
                style={{ background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})` }}
              >
                <IconComponent className='w-8 h-8 text-white' />
              </div>

              <h2 className='text-xl font-bold mb-3 text-gray-800'>{tool.title}</h2>
              <p className='text-gray-600 text-sm leading-relaxed'>{tool.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Tools
