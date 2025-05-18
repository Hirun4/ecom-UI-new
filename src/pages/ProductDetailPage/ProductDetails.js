import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLoaderData, useLocation, useParams } from "react-router-dom";
import _ from "lodash";
import { MdAddShoppingCart } from "react-icons/md";
import Navigation from "../../components/Navigation/Navigation";

const ProductDetails = () => {
  const location = useLocation();
  const { id } = location.state;
  const [product, setProduct] = useState([]);
  const [sellsCount, setSellCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setStocks(data.stocks);
        // console.log(data);
      })
      .catch((err) => console.error(err));

      fetch(`http://localhost:8080/api/order1/products/count/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // setProduct(data);
        setSellCount(data.orderCount);
        // console.log(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  console.log(sellsCount);

  const handleClick = (size) => {
    setSelectedSize(size);
  };

  return (
    <>
      <div className="bg-[#CAF0F8] py-3 px-9">
        <Navigation />
      </div>
      <div className="w-full flex flex-col gap-10 px-10 py-10">
        <div className="flex">
          <div className="flex w-1/2 flex-col gap-10">
            <div className="flex full gap-5">
              <div className="flex w-[10%] h-[400px] flex-col gap-[25px]">
                <img
                  className="w-full h-[60px] object-cover"
                  src="/images/i1.jpg"
                  alt=""
                />
                <img
                  className="w-full h-[60px] object-cover"
                  src="/images/i1.jpg"
                  alt=""
                />
                <img
                  className="w-full h-[60px] object-cover"
                  src="/images/i1.jpg"
                  alt=""
                />
                <img
                  className="w-full h-[60px] object-cover"
                  src="/images/i1.jpg"
                  alt=""
                />
                <img
                  className="w-full h-[60px] object-cover"
                  src="/images/i1.jpg"
                  alt=""
                />
              </div>
              <img
                className="w-5/6 h-[400px] object-cover"
                src="/images/i1.jpg"
                alt=""
              />
            </div>
            <div className="flex flex-col gap-5 justify-center items-center">
              <h1 className="text-lg font-bold text-black">Shoe Sizes</h1>
              <img
                className="w-[500px] h-[700px] object-cover"
                src="/images/size.png"
                alt=""
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 w-1/2 px-10">
            <div>
              <h1 className="text-3xl font-bold text-black">{product.name}</h1>
              <p className="text-gray-500 text-sm font-light">category</p>
            </div>
            <p className="text-black text-sm w-[350px] font-light">
              {/* {product.description} */}
              The Nike Dunk Low Retro SE is a classic sneaker reimagined for
              modern style. With its sleek low-top design, premium materials,
              and standout color combinations, this shoe offers comfort and
              versatility for any occasion.
            </p>
            <div className="flex gap-3">
              <div className="bg-[#90E0EF] w-fit px-2 rounded-md">
                <span className="text-xs text-gray-500 font-light">
                  Sells <span className="text-black font-normal">{sellsCount}</span>
                </span>
              </div>
              {product.stock_status === "In Stock" ? (
                <div className="bg-green-100 w-fit px-2 rounded-md">
                  <span className="text-xs  text-green-800 font-light">
                    In Stock
                  </span>
                </div>
              ) : (
                <div className="bg-red-100 w-fit px-2 rounded-md">
                  <span className="text-xs  text-red-800 font-light">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <span className="text-xl font-bold text-[#03045E]">
                LKR {product.price}.00
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xl font-medium">Select Size</span>
              <div className="grid grid-cols-5 gap-2 w-[350px]">
                {stocks.map((stock) => {
                  const isAvailable = stock.quantity > 0;
                  const isSelected = selectedSize === stock.size;

                  return (
                    <button
                      key={stock.stock_id}
                      onClick={() => isAvailable && handleClick(stock.size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium 
                ${
                  isSelected
                    ? "border-black bg-gray-200"
                    : "border-gray-300 bg-white"
                }
                ${
                  isAvailable
                    ? "cursor-pointer text-black"
                    : "text-gray-400 cursor-not-allowed opacity-50"
                }`}
                      disabled={!isAvailable}
                    >
                      {stock.size}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-3">
              <button className="border flex items-center justify-center gap-3 rounded-md border-black hover:bg-white hover:text-black hover:border-black text-white bg-black transition duration-300 w-44 h-12">
                <MdAddShoppingCart className="text-xl" /> Add to Cart
              </button>
            </div>
            <div>
              <h1 className="text-lg font-bold text-black">Reviews(3)</h1>
              <div className="flex flex-col gap-3 p-5">

                <div className="flex flex-col gap-1">
                  <h1 className="text-sm font-bold text-black">John Doe</h1>
                  <p className="text-sm font-light pl-3 italic text-gray-500">
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, voluptatibus.""
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-sm font-bold text-black">John Doe</h1>
                  <p className="text-sm font-light pl-3 italic text-gray-500">
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, voluptatibus.""
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-sm font-bold text-black">John Doe</h1>
                  <p className="text-sm font-light pl-3 italic text-gray-500">
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, voluptatibus.""
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
        {/* second section */}
      </div>
    </>
  );
};

export default ProductDetails;
