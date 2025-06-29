import React from 'react'

const categoriesData = [

]

const Categories = ({types}) => {
  return (
    <div className='flex'>
      {types?.map(type=>{
        return (
          <div className='flex items-center p-1'>
            <label htmlFor={type?.code} className='px-2 text-[14px] text-gray-600'>{type?.name}</label>
            <input type='checkbox' name={type?.code} className='border rounded-xl w-4 h-4 accent-black text-black'/>
          </div>
        )
      })}
    </div>
  )
}

export default Categories