import React, { useCallback, useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdAddShoppingCart } from "react-icons/md";
import { toast } from 'react-toastify';
import Navigation from "../../components/Navigation/Navigation";
import { AuthContext } from '../../context/authContext';
import Footer from "../../components/Footer/Footer";

const ProductDetails = () => {
  const location = useLocation();
  const { id } = location.state;
  const { authState } = useContext(AuthContext);
  
  const [product, setProduct] = useState([]);
  const [sellsCount, setSellCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity] = useState(1); // Default quantity is 1

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setStocks(data.stocks);
      })
      .catch((err) => console.error(err));

    fetch(`http://localhost:8080/api/order1/products/count/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSellCount(data.orderCount);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleClick = (size) => {
    setSelectedSize(size);
    setError(null);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }

    if (!authState.user) {
      setError("Please login to add items to cart");
      return;
    }

    setIsLoading(true);
    setError(null);

    const userIdentifier = `0x${authState.user.id.replace(/-/g, '')}`;
    
    const cartItemRequest = {
      productId: id,
      size: selectedSize,
      quantity: quantity
    };

    try {
      const response = await fetch(`http://localhost:8080/api/cart/add/${userIdentifier}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(cartItemRequest)
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const data = await response.json();
      console.log('Added to cart:', data);
      toast.success('Item added to cart successfully!');
      setSelectedSize(null); // Reset size selection
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.message);
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
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
              {product.description || "The Nike Dunk Low Retro SE is a classic sneaker reimagined for modern style."}
            </p>
            <div className="flex gap-3">
              <div className="bg-[#90E0EF] w-fit px-2 rounded-md">
                <span className="text-xs text-gray-500 font-light">
                  Sells <span className="text-black font-normal">{sellsCount}</span>
                </span>
              </div>
              {product.stock_status === "In Stock" ? (
                <div className="bg-green-100 w-fit px-2 rounded-md">
                  <span className="text-xs text-green-800 font-light">
                    In Stock
                  </span>
                </div>
              ) : (
                <div className="bg-red-100 w-fit px-2 rounded-md">
                  <span className="text-xs text-red-800 font-light">
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
              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-5 gap-2 w-[350px]">
                {stocks.map((stock) => {
                  const isAvailable = stock.quantity > 0;
                  const isSelected = selectedSize === stock.size;

                  return (
                    <button
                      key={stock.stock_id}
                      onClick={() => isAvailable && handleClick(stock.size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium 
                        ${isSelected ? "border-black bg-gray-200" : "border-gray-300 bg-white"}
                        ${isAvailable ? "cursor-pointer text-black" : "text-gray-400 cursor-not-allowed opacity-50"}`}
                      disabled={!isAvailable}
                    >
                      {stock.size}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className={`border flex items-center justify-center gap-3 rounded-md ${
                  isLoading || !selectedSize
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'border-black hover:bg-white hover:text-black hover:border-black text-white bg-black'
                } transition duration-300 w-44 h-12`}
                onClick={handleAddToCart}
                disabled={isLoading || !selectedSize}
              >
                <MdAddShoppingCart className="text-xl" />
                {isLoading ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>

            {/* Reviews section */}
            <div>
              <h1 className="text-lg font-bold text-black">Reviews(3)</h1>
              <div className="flex flex-col gap-3 p-5">
                <div className="flex flex-col gap-1">
                  <h1 className="text-sm font-bold text-black">John Doe</h1>
                  <p className="text-sm font-light pl-3 italic text-gray-500">
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit."
                  </p>
                </div>
                {/* ... other reviews ... */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#CAF0F8] py-3 px-9">
        <Footer />
      </div>
    </>
  );
};

export default ProductDetails;