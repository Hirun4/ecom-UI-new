import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({
  key,
  id,
  imagePath,
  title,
  category,
  Price,
  height,
  width,
  inStock,
}) => {
  const navigate=useNavigate();

  const handlenavigate=()=>{
    navigate(`/product`,{ state: { id } });

  }

  return (
    <div onClick={handlenavigate} className="flex flex-col bg-white border cursor-pointer hover:scale-105 transition duration-300 h-fit border-[#e1e1e1] w-[220px] rounded-lg overflow-hidden">
      <img
        className=""
        width={width ?? "220px"}
        height={height ?? "220px"}
        src={imagePath}
        alt="Jeans"
      />
      <div className="flex justify-between items-center p-1">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <p className="text-[16px] font-medium">{title}</p>
            {category && (
              <p className="text-[12px]  text-gray-600">{category}</p>
            )}
            <div>
              {inStock == "In Stock" ? (
                <p className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  In Stock
                </p>
              ) : (
                <p className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  Out of Stock
                </p>
              )}
            </div>
          </div>
          {Price && (
            <span className="text-[16px] font-bold text-[#03045E]">
              LKR {Price}.00
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
