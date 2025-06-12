import React, { useEffect, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "./PriceFilter.css";

const PriceFilter = ({ max, min }) => {
  const [range, setRange] = useState({
    min: min,
    max: max,
  });

  // Update range when props change
  useEffect(() => {
    setRange({
      min: min,
      max: max,
    });
  }, [min, max]);

  return (
    <div className="flex flex-row items-center gap-5 py-2 w-full">
      <p className="text-[16px] text-black whitespace-nowrap">Price :</p>

      <div className="border rounded-lg h-8 max-w-[100px] w-[100px] flex items-center ">
        <span className="pl-2 text-gray-600">$</span>
        <input
          type="number"
          value={range.min}
          className="outline-none px-2 text-gray-600 bg-transparent w-full"
          disabled
          placeholder="min"
        />
      </div>

      <div className="flex-1 w-[200px] ">
        <RangeSlider
          className={"custom-range-slider"}
          min={min}
          max={max}
          value={[range.min, range.max]}
          onInput={(values) =>
            setRange({
              min: values[0],
              max: values[1],
            })
          }
        />
      </div>

      <div className="border rounded-lg h-8 max-w-[100px] w-[100px] flex items-center">
        <span className="pl-2 text-gray-600">$</span>
        <input
          type="number"
          value={range.max}
          className="outline-none px-2 text-gray-600 bg-transparent w-full"
          disabled
          placeholder="max"
        />
      </div>
    </div>
  );
};

export default PriceFilter;
