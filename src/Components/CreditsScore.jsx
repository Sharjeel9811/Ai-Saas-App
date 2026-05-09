import { Coins } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCreditsBalance, onCreditsUpdated } from '../lib/credits'

const CreditsScore = ({ cost }) => {
  const [credits, setCredits] = useState(getCreditsBalance())

  useEffect(() => {
    const unsubscribe = onCreditsUpdated((nextCredits) => {
      setCredits(nextCredits)
    })

    return unsubscribe
  }, [])

  return (
    <div className='inline-flex items-center gap-2 rounded-full border border-amber-200 bg-linear-to-r from-amber-50 to-yellow-50 px-3 py-1.5'>
      <Coins className='w-4 h-4 text-amber-600' />
      <div className='flex items-center gap-1.5'>
        <span className='text-xs font-semibold text-amber-800'>{credits} credits</span>
        {typeof cost === 'number' ? (
          <span className='text-[11px] text-amber-700/80'>({cost}/use)</span>
        ) : null}
      </div>
    </div>
  )
}

export default CreditsScore
