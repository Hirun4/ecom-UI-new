import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../store/features/cart';
import { NumberInput } from '../../components/NumberInput/NumberInput';
import { delteItemFromCartAction, updateItemToCartAction } from '../../store/actions/cartAction';
import DeleteIcon from '../../components/common/DeleteIcon';
import Modal from 'react-modal';
import { customStyles } from '../../styles/modal';
import { isTokenValid } from '../../utils/jwt-helper';
import { Link, useNavigate } from 'react-router-dom';
import EmptyCart from '../../assets/img/empty_cart.png';

const Cart = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const navigate = useNavigate();

  const onChangeQuantity = useCallback((value, productId, variantId) => {
    dispatch(updateItemToCartAction({
      productId: productId,
      variant_id: variantId,
      quantity: value
    }));
  }, [dispatch]);

  const onDeleteProduct = useCallback((productId, variantId) => {
    setModalIsOpen(true);
    setDeleteItem({
      productId: productId,
      variantId: variantId
    });
  }, []);

  const onCloseModal = useCallback(() => {
    setDeleteItem({});
    setModalIsOpen(false);
  }, []);

  const onDeleteItem = useCallback(() => {
    dispatch(delteItemFromCartAction(deleteItem));
    setModalIsOpen(false);
  }, [deleteItem, dispatch]);

  const subTotal = useMemo(() => {
    let value = 0;
    cartItems?.forEach(element => {
      value += element?.subTotal;
    });
    return value?.toFixed(2);
  }, [cartItems]);

  const discount = useMemo(() => {
    if (appliedCoupon) {
      return (subTotal * 0.1).toFixed(2);
    }
    return 0;
  }, [subTotal, appliedCoupon]);

  const finalTotal = useMemo(() => {
    return (subTotal - discount).toFixed(2);
  }, [subTotal, discount]);

  const isLoggedIn = useMemo(() => {
    return isTokenValid();
  }, []);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toLowerCase() === 'save10') {
      setAppliedCoupon({ code: couponCode, discount: 10 });
    }
  };

  const CustomNumberInput = ({ quantity, onChangeQuantity, max = 10 }) => {
    return (
      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        <button
          onClick={() => onChangeQuantity(Math.max(1, quantity - 1))}
          className="p-2 hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-800 disabled:opacity-50 w-8 h-8 flex items-center justify-center"
          disabled={quantity <= 1}
        >
          −
        </button>
        <span className="px-4 py-2 bg-white min-w-[50px] text-center font-medium">
          {quantity}
        </span>
        <button
          onClick={() => onChangeQuantity(Math.min(max, quantity + 1))}
          className="p-2 hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-800 disabled:opacity-50 w-8 h-8 flex items-center justify-center"
          disabled={quantity >= max}
        >
          +
        </button>
      </div>
    );
  };

  if (!cartItems?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-4xl text-gray-400">🛒</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Continue Shopping
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
              <span className="text-2xl">🛍️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b">
                <h2 className="text-xl font-semibold text-gray-800">Items in your cart</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cartItems.map((item, index) => (
                  <div key={`${item.productId}-${item.variant?.id}`} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative group">
                        <img
                          src={item?.thumbnail}
                          alt={item?.name}
                          className="w-24 h-24 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-200"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-800 truncate pr-4">{item?.name}</h3>
                          <button
                            onClick={() => onDeleteProduct(item?.productId, item?.variant?.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item?.variant?.size && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm">
                              Size: {item.variant.size}
                            </span>
                          )}
                          {item?.variant?.color && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm">
                              Color: {item.variant.color}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <CustomNumberInput
                              quantity={item?.quantity}
                              onChangeQuantity={(value) => onChangeQuantity(value, item?.productId, item?.variant?.id)}
                              max={10}
                            />
                            <span className="text-sm text-gray-500">×</span>
                            <span className="font-semibold text-gray-700">${item?.price}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-gray-800">${item?.subTotal}</div>
                            <div className="text-xs text-green-600 flex items-center gap-1">
                              <span>🎁</span>
                              Free shipping
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Coupon Code */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-orange-500 text-xl">🏷️</span>
                  <h3 className="font-semibold text-gray-800">Discount Coupon</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Enter your coupon code to get discount</p>
                
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-medium">{appliedCoupon.code}</span>
                    </div>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code (try SAVE10)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.discount}%)</span>
                      <span>-${discount}</span>
                    </div>
                  )}
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-gray-800">${finalTotal}</span>
                </div>

                {isLoggedIn ? (
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <span>🔒</span>
                    Secure Checkout
                  </button>
                ) : (
                  <Link
                    to="/v1/login"
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Login to Checkout
                    <span className="text-xl">→</span>
                  </Link>
                )}
              </div>

              {/* Continue Shopping */}
              <Link
                to="/"
                className="block w-full text-center py-3 text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 rounded-xl transition-all duration-200"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
