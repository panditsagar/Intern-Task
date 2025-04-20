import React from 'react'

export const Hiring = () => {
  return (
    <div className='m-1 p-2 border-1'>
        <h1 className='p-2 text-xl text-green-700'>Hiring</h1>
        <div className='flex gap-4 px-4 py-1 border-b bg-white'>
            <button className='px-4 py-2 hover:border-b-2 border-green-700 font-semibold'>Job openings</button>
            <button className='px-4 py-2 hover:border-b-2 border-green-700 font-semibold'>Candidates</button>
            <button className='px-4 py-2 hover:border-b-2 border-green-700 font-semibold'>Talent Pools</button>
        </div>
    </div>
  )
}
