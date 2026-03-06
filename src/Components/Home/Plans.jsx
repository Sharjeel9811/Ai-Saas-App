import React from 'react'
import {PricingTable} from '@clerk/clerk-react';


const Plans = () => {
  return (
    <div className='my-30 px-4 sm:px-20 max-w-4xl mx-auto sm:my-auto'>
<h1 className='font-bold text-4xl sm:text-5xl text-center'>Choose Your Plans</h1>
<p className='text-center text-gray-600 mt-4 text-lg'>Select the plan that best fits your needs and budget.</p>

<div className='mt-10 cursor-pointer '>
<PricingTable/>
</div>




    </div>
  )
}

export default Plans
