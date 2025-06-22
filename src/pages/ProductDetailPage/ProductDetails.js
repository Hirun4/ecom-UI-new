import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdAddShoppingCart } from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Add this for dropdown icons
import { toast } from "react-toastify";
import Navigation from "../../components/Navigation/Navigation";
import { AuthContext } from "../../context/authContext";
import Footer from "../../components/Footer/Footer";
import { FaStar } from "react-icons/fa";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, selectedSize, quantity } = location.state || {};

  const { authState } = useContext(AuthContext);

  const [product, setProduct] = useState([]);
  const [sellsCount, setSellCount] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mainImage, setMainImage] = useState("");

  const [selectedSizeState, setSelectedSizeState] = useState(
    selectedSize || null
  );
  const [quantityState, setQuantityState] = useState(quantity || 1);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProduct(data);
        setStocks(data.stocks);
        setMainImage(data.image_url); // Set main image
      })
      .catch((err) => console.error(err));

    fetch(`http://localhost:8080/api/order1/products/count/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSellCount(data.orderCount);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/reviews/${id}`)
      .then((res) => res.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [id]);

  const getAvailableStock = () => {
    const stockObj = stocks.find((s) => s.size === selectedSizeState);
    return stockObj ? stockObj.quantity : 0;
  };

  const handleClick = (size) => {
    setSelectedSizeState(size);
    setQuantityState(1);
  };

  const handleQuantityChange = (delta) => {
    const available = getAvailableStock();
    let newQty = quantityState + delta;
    if (newQty < 1) newQty = 1;
    if (newQty > available) {
      toast.warning("Stock doesn't have enough quantity");
      newQty = available;
    }
    setQuantityState(newQty);
  };

  const handleAddToCart = async () => {
    if (!selectedSizeState) {
      toast.warning("Please select a size");
      return;
    }
    if (!authState.user) {
      toast.error("Please login to add items to cart");
      navigate("/v1/login");
      return;
    }
    if (quantityState > getAvailableStock()) {
      toast.warning("Stock doesn't have enough quantity");
      return;
    }

    setIsLoading(true);

    const userIdentifier = `0x${authState.user.id.replace(/-/g, "")}`;
    const cartItemRequest = {
      productId: id,
      size: selectedSizeState,
      quantity: quantityState,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/cart/add/${userIdentifier}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify(cartItemRequest),
        }
      );

      if (!response.ok) throw new Error("Failed to add item to cart");
      await response.json();
      toast.success("Item added to cart successfully!");
      setSelectedSizeState(null);
      setQuantityState(1);
    } catch (error) {
      toast.error(error.message || "Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  let otherImages = [];
  if (Array.isArray(product.other_images)) {
    otherImages = product.other_images;
  } else if (typeof product.other_images === "string") {
    try {
      otherImages = JSON.parse(product.other_images);
    } catch {
      otherImages = [];
    }
  }

  // Optional: Close the size chart when clicking outside
  useEffect(() => {
    if (!showSizeChart) return;
    const handleClick = (e) => {
      // Check if click is outside the size chart area
      if (!e.target.closest("#size-chart-dropdown")) {
        setShowSizeChart(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSizeChart]);

  // Add review handler
  const handleAddReview = async () => {
    if (!authState.user) {
      toast.error("Please login to add a review");
      return;
    }
    if (!newReview.rating) {
      toast.warning("Please select a rating");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          userId: authState.user.id,
          rating: newReview.rating,
          comment: newReview.comment,
          userName: authState.user.username,
        }),
      });
      if (!res.ok) throw new Error("Failed to add review");
      const added = await res.json();
      setReviews([added, ...reviews]);
      setNewReview({ rating: 0, comment: "" });
      toast.success("Review added!");
    } catch {
      toast.error("Failed to add review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete review handler
  const handleDeleteReview = async (reviewId) => {
    try {
      await fetch(
        `http://localhost:8080/api/reviews/${reviewId}?userId=${authState.user.id}`,
        { method: "DELETE" }
      );
      setReviews(reviews.filter((r) => r.id !== reviewId));
      toast.success("Review deleted!");
    } catch {
      toast.error("Failed to delete review");
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
                {/* Main image as first thumbnail */}
                {product.image_url && (
                  <img
                    className={`w-full h-[60px] object-cover cursor-pointer border ${
                      mainImage === product.image_url
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    src={product.image_url}
                    alt=""
                    onClick={() => setMainImage(product.image_url)}
                  />
                )}
                {/* Other images */}
                {otherImages.map((img, idx) => (
                  <img
                    key={idx}
                    className={`w-full h-[60px] object-cover cursor-pointer border ${
                      mainImage === img ? "border-black" : "border-transparent"
                    }`}
                    src={img}
                    alt=""
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
              <img
                className="w-5/6 h-[400px] object-cover"
                src={mainImage}
                alt=""
              />
            </div>
            {/* <div className="flex flex-col gap-5 justify-center items-center">
              <h1 className="text-lg font-bold text-black">Shoe Sizes</h1>
              <img
                className="w-[500px] h-[700px] object-cover"
                src="/src/upload/sizes.jpeg"
                alt=""
              />
            </div> */}
          </div>

          <div className="flex flex-col gap-5 w-1/2 px-10">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-black">{product.name}</h1>
              {/* View Size Chart Button moved to far right */}
              <div className="relative" id="size-chart-dropdown">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-full shadow bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold hover:from-cyan-400 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  onClick={() => setShowSizeChart((prev) => !prev)}
                  aria-expanded={showSizeChart}
                  aria-controls="size-chart-popover"
                >
                  <span>View Size Chart</span>
                  {showSizeChart ? (
                    <FaChevronUp className="transition-transform duration-200" />
                  ) : (
                    <FaChevronDown className="transition-transform duration-200" />
                  )}
                </button>
                {/* Popover Card */}
                <div
                  id="size-chart-popover"
                  className={`absolute right-0 mt-2 z-20 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 w-[370px] transition-all duration-300
          ${showSizeChart ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
        `}
                  style={{ willChange: "opacity, transform" }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">Size Chart</span>
                    <button
                      className="text-gray-400 hover:text-gray-700 text-xl"
                      onClick={() => setShowSizeChart(false)}
                      aria-label="Close size chart"
                    >
                      ×
                    </button>
                  </div>
                  <img
                    src={require("../../upload/sizes.jpeg")}
                    alt="Size Chart"
                    className="w-full h-auto rounded border"
                  />
                </div>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-light">
              {product.category}
            </p>
            <p className="text-black text-sm w-[350px] font-light">
              {product.description ||
                "The Nike Dunk Low Retro SE is a classic sneaker reimagined for modern style."}
            </p>
            <div className="flex gap-3">
              <div className="bg-[#90E0EF] w-fit px-2 rounded-md">
                <span className="text-xs text-gray-500 font-light">
                  Sells{" "}
                  <span className="text-black font-normal">{sellsCount}</span>
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
              {/* View Size Chart Dropdown Button */}
              {/* <div className="flex items-center gap-2 mb-1" id="size-chart-dropdown">
                <button
                  type="button"
                  className="flex items-center gap-1 text-blue-700 font-medium underline focus:outline-none"
                  onClick={() => setShowSizeChart((prev) => !prev)}
                >
                  View Size Chart
                  {showSizeChart ? (
                    <FaChevronUp className="ml-1" />
                  ) : (
                    <FaChevronDown className="ml-1" />
                  )}
                </button>
              </div> */}
              {/* Size Chart Image */}
              {/* {showSizeChart && (
                <div className="mb-2">
                  <img
                    src={require("../../upload/sizes.jpeg")}
                    alt="Size Chart"
                    className="w-[350px] h-auto border rounded shadow"
                  />
                </div>
              )} */}
              <span className="text-xl font-medium">Select Size</span>
              <div className="grid grid-cols-5 gap-2 w-[350px]">
                {stocks.map((stock) => {
                  const isAvailable = stock.quantity > 0;
                  const isSelected = selectedSizeState === stock.size;
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
            <div className="flex items-center gap-3 mt-2">
              <span className="text-md font-medium">Quantity</span>
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantityState <= 1}
              >
                -
              </button>
              <span className="px-3">{quantityState}</span>
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                onClick={() => handleQuantityChange(1)}
                disabled={
                  !selectedSizeState || quantityState >= getAvailableStock()
                }
              >
                +
              </button>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                className={`border flex items-center justify-center gap-3 rounded-md ${
                  isLoading || !selectedSizeState
                    ? "bg-gray-300 cursor-not-allowed"
                    : "border-black hover:bg-white hover:text-black hover:border-black text-white bg-black"
                } transition duration-300 w-44 h-12`}
                onClick={handleAddToCart}
                disabled={isLoading || !selectedSizeState}
              >
                <MdAddShoppingCart className="text-xl" />
                {isLoading ? "Adding..." : "Add to Cart"}
              </button>
            </div>
            {/* <div>
              <h1 className="text-lg font-bold text-black">Reviews(3)</h1>
              <div className="flex flex-col gap-3 p-5">
                <div className="flex flex-col gap-1">
                  <h1 className="text-sm font-bold text-black">John Doe</h1>
                  <p className="text-sm font-light pl-3 italic text-gray-500">
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit."
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-[#03045E]">Reviews</h2>
          {/* Add Review Form */}
          {authState.user && (
            <div className="mb-6 p-4 bg-white rounded-xl shadow flex flex-col gap-3">
              <span className="font-semibold text-gray-700">Add Your Review</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer text-2xl transition ${
                      newReview.rating >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setNewReview((r) => ({ ...r, rating: star }))}
                  />
                ))}
              </div>
              <textarea
                className="border rounded p-2 w-full resize-none focus:ring-2 focus:ring-blue-200"
                rows={3}
                placeholder="Share your thoughts..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((r) => ({ ...r, comment: e.target.value }))
                }
              />
              <button
                className="self-end bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-2 rounded-full font-semibold shadow hover:from-cyan-400 hover:to-blue-600 transition disabled:opacity-50"
                onClick={handleAddReview}
                disabled={isSubmitting || !newReview.rating}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}
          {/* Reviews List */}
          <div className="flex flex-col gap-4">
            {reviews.length === 0 && (
              <div className="text-gray-500 italic">No reviews yet.</div>
            )}
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 relative"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#03045E]">{review.userName}</span>
                  <span className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-lg ${
                          review.rating >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {review.createdAt?.slice(0, 10)}
                  </span>
                  {/* Delete button for own review */}
                  {authState.user && review.userId === authState.user.id && (
                    <button
                      className="ml-auto text-red-500 hover:text-red-700 text-sm font-semibold"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="text-gray-700">{review.comment}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-[#CAF0F8] ">
        <Footer />
      </div>
    </>
  );
};

export default ProductDetails;
