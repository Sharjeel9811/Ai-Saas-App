import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import Creations from '../Components/Creations';
import { getCreationHistory, onCreationsUpdated, removeCreationHistory } from '../lib/creationsHistory';

const Dashboard = () => {
  const [creations, setCreations] = useState(getCreationHistory);

  useEffect(() => onCreationsUpdated(setCreations), []);

  const handleDeleteCreation = (creationId) => {
    setCreations(removeCreationHistory(creationId));
  };


  return (
    <div className='h-full p-3 sm:p-6 overflow-y-auto overflow-x-hidden'>
      <div className='flex justify-start gap-3 sm:gap-4 flex-wrap'>
        {/*Total Creations Card*/}
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center bg-linear-to-br from-white to-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-80 md:w-96 px-4 sm:px-6 py-5 sm:py-8 border border-blue-100'>
          <div className='flex flex-col gap-1'>
            <p className='text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide'>Creations Used</p>
            <h2 className='text-3xl sm:text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>{creations.length}</h2>
            <p className='text-xs sm:text-sm text-gray-500'>History items currently saved</p>
          </div>
          <div className='flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:scale-110 transition-transform duration-300 mt-3 sm:mt-0'>
            <Sparkles className='w-6 sm:w-7 h-6 sm:h-7' />
          </div>
        </div>





 </div>


 <div className='space-y-3'>
  <h3 className='text-lg font-semibold text-gray-700 mt-6 mb-4'>Recent Creations</h3>
  {creations.map((item)=>(
    <Creations key={item.id} item={item} onDelete={handleDeleteCreation} />
  ))}

  {creations.length === 0 ? (
    <div className='rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500'>
      No creation history yet.
    </div>
  ) : null}

 </div>

    </div>
  )
}

export default Dashboard
