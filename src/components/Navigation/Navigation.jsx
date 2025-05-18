import React from 'react'
import { Wishlist } from '../common/Wishlist'
import { AccountIcon } from '../common/AccountIcon'
import { CartIcon } from '../common/CartIcon'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import './Navigation.css';
import { useSelector } from 'react-redux'
import { countCartItems } from '../../store/features/cart'
import { Button } from 'react-admin'

const Navigation = ({variant="default"}) => {
  const cartLength = useSelector(countCartItems);
  const navigate = useNavigate();

  return (
    <nav className='flex bg-transparent items-center  justify-between gap-20 '>
      <div className='flex items-center gap-6'>
        {/* Logo */}
        <a className='text-3xl text-black font-bold gap-8' href='/'>ShopEase</a>
      </div>
      
      <div className='flex flex-wrap items-center gap-10'>
        {/* Nav items */}
        <ul className='flex gap-14 text-gray-600 '>
          <li><NavLink to='/' className={({ isActive }) =>`${isActive ? 'active-link' : ''} hover:text-black`}>Home</NavLink></li>
          <li><NavLink to='/men' className={({ isActive }) =>`${isActive ? 'active-link' : ''} hover:text-black`}>Categories</NavLink></li>
          <li><NavLink to='/women' className={({ isActive }) =>`${isActive ? 'active-link' : ''} hover:text-black`}>About Us</NavLink></li>
          <li><NavLink to='/kids' className={({ isActive }) =>`${isActive ? 'active-link' : ''} hover:text-black`}>Contact Us</NavLink></li>
        </ul>

      </div>

      <div>
        <NavLink to='/v1/login' className='py-2 px-4 cursor-pointer rounded-full text-white border-2 border-white hover:bg-white hover:text-black transition duration-300'>
          Login
        </NavLink>
      </div>

    </nav>
  )
}

export default Navigation