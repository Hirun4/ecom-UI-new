import React, { useContext, useState, useEffect } from "react";
import HeroImg from "../../assets/img/hero-img.png";
import Navigation from "../Navigation/Navigation";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const imageLinks = [
    "/images/1.png",
    "/images/2.png",
    "/images/3.png"
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % imageLinks.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [imageLinks.length]);

  const shownow = () => {
    navigate('/shopnow');
  };
  const newarrivals = () => {
    navigate('/newarrivals');
  };

  return (
    <div className="w-full h-screen bg-white relative ">
      {/* Navigation at the top */}
      <div className="absolute top-0 left-0 w-full py-6 px-9 z-50">
        <Navigation />
      </div>

      <div className="bg-cyan-400 h-full w-[55%] absolute right-0 rounded-l-full shadow-2xl"></div>
      <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center w-full  px-9">
        <div className="flex flex-col gap-5 w-[65%]">
          <h1 className="text-black text-5xl font-bold">
            Step Into Style{" "}
            <span className="text-[#03045E]">Trendy Footwear</span>
          </h1>
          <p className="w-[50%] text-xl font-light">
            Discover the perfect blend of style and comfort with our latest shoe
            collection. From casual sneakers to elegant heels, find your ideal
            pair today. Shop now!
          </p>
          <button onClick={shownow} className="border rounded mt-6 border-black hover:bg-white hover:text-black hover:border-black  text-white bg-black transition duration-300 w-44 h-12">
            Shop Now
          </button>
        </div>
        <div className="flex justify-start items-center absolute right-28 h-full ">
          <img 
            onClick={newarrivals}
            src={imageLinks[currentImage]}
            alt="hero-img"
            className="h-[60%] drop-shadow-2xl cursor-pointer object-contain z-20 rotate-[335deg] hover:scale-105 transition duration-500"
          />
          <p className="absolute z-10 right-0 text-white text-8xl w-[350px] font-extrabold bottom-[55px]">
            New Arrivals
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
