import React from "react";
import { GrDeliver } from "react-icons/gr";
import { BsCollection } from "react-icons/bs";
import { BiTimer } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function HomeCard() {
  const navigate = useNavigate();
  
    const shownow=()=>{
      navigate('/shopnow');
    }
  return (
    <div className="w-full px-9 py-9 flex flex-col gap-16">
      <div className="flex justify-between">
        <div className="w-[30%] h-[100px] bg-white shadow-lg border border-[#e1e1e1] rounded-lg flex  justify-around items-center">
          <GrDeliver className="text-4xl" />
          <div>
            <span className="text-lg font-bold">Cash on Delivery</span>
            <p className="text-gray-500">Pay when you receive your order!</p>
          </div>
        </div>
        <div className="w-[30%] h-[100px] bg-white shadow-lg border border-[#e1e1e1] rounded-lg flex  justify-around items-center">
          <BsCollection className="text-4xl" />
          <div>
            <span className="text-lg font-bold">Wide Shoes Collection</span>
            <p className="text-gray-500">
              Find the perfect fit for every style!
            </p>
          </div>
        </div>
        <div className="w-[30%] h-[100px] bg-white shadow-lg border border-[#e1e1e1] rounded-lg flex  justify-around items-center">
          <BiTimer className="text-4xl" />
          <div>
            <span className="text-lg font-bold">Fast Shipping Service</span>
            <p className="text-gray-500">
              Get your order delivered in on time!
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        {/* Search bar */}
        <div onClick={shownow} className=" rounded-full w-[30%] flex overflow-hidden">
          <input
            type="text"
            className="px-4 py-2 bg-[#CAF0F8] w-full outline-none"
            placeholder="Search anything ..."
          />
        </div>
      </div>
    </div>
  );
}

export default HomeCard;
