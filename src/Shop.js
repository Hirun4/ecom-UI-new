import React, { useEffect } from 'react'
import HeroSection from './components/HeroSection/HeroSection'
import NewArrivals from './components/Sections/TodayDeals'
import Category from './components/Sections/Categories/Category'
import content from './data/content.json';
import Footer from './components/Footer/Footer'
import { fetchCategories } from './api/fetchCategories';
import { useDispatch } from 'react-redux';
import { loadCategories } from './store/features/category';
import { setLoading } from './store/features/common';
import Navigation from './components/Navigation/Navigation';
import HomeCard from './components/HomeCard';
import TodayDeals from './components/Sections/TodayDeals';

const Shop = () => {

  const dispatch = useDispatch();



  useEffect(()=>{
    //dispatch(setLoading(true));
    fetchCategories().then(res=>{
      dispatch(loadCategories(res));
    }).catch(err=>{

    }).finally(()=>{
      dispatch(setLoading(false));
    })
  },[dispatch]);

  return (
    <>
    
      {/* <Navigation /> */}
      <HeroSection />
      <HomeCard/>
      <TodayDeals />
      <Category />
      <Footer content={content?.footer}/>
    </>
  )
}

export default Shop