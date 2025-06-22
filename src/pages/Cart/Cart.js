import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/features/user";
import EmptyCart from "../../assets/img/empty_cart.png";
import DeleteIcon from "../../components/common/DeleteIcon";
import Modal from "react-modal";
import { customStyles } from "../../styles/modal";
import { AuthContext } from "../../context/authContext";
import Navigation from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";

const headers = [
  "Select",
  "Product Details",
  "Price",
  "Quantity",
  "Size",
  "SubTotal",
  "Action",
];

const Cart = () => {
  const { authState } = useContext(AuthContext);
  const userInfo = useSelector(selectUserInfo);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const userIdentifier = authState.user?.id
    ? `0x${authState.user.id.replace(/-/g, "")}`
    : "user123";

  const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    fetchCartItems();
  }, [userIdentifier]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/cart/${userIdentifier}`);
      setCartItems(response.data);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    try {
      await api.delete(`/api/cart/${userIdentifier}/items/${deleteItemId}`);
      setModalIsOpen(false);
      await fetchCartItems();
      setSelectedItems((prev) => prev.filter((id) => id !== deleteItemId));
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleItemSelection = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      toast.warn("Please select items to checkout");
      return;
    }
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );

    try {
      for (const item of selectedCartItems) {
        const res = await api.get(`/api/products/${item.product.product_id}`);
        const product = res.data;
        const stock = product.stocks.find((s) => s.size === item.size);
        if (!stock || stock.quantity < item.quantity) {
          toast.error(
            `Not enough stock for "${item.product.name}" (size ${
              item.size
            }). Available: ${stock ? stock.quantity : 0}`
          );
          return;
        }
      }
      navigate("/place-order", {
        state: {
          items: selectedCartItems,
          total: calculateSelectedTotal(),
        },
      });
    } catch (error) {
      toast.error("Error checking stock. Please try again.");
    }
  };

  const handleQuantityChange = async (cartItemId, delta) => {
    const item = cartItems.find((i) => i.id === cartItemId);
    if (!item) return;

    // Fetch latest stock for this product and size
    const res = await api.get(`/api/products/${item.product.product_id}`);
    const product = res.data;
    const stock = product.stocks.find((s) => s.size === item.size);

    let newQty = item.quantity + delta;
    if (newQty < 1) newQty = 1;
    if (stock && newQty > stock.quantity) {
      toast.warning("Not enough stock available");
      newQty = stock.quantity;
    }

    // Update quantity in backend
    await api.put(`/api/cart/${userIdentifier}/items/${cartItemId}`, {
      quantity: newQty,
    });

    fetchCartItems();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[300px] text-xl text-gray-700">
        Loading cart...
      </div>
    );

  return (
    <>
      <div className="bg-[#CAF0F8] py-3 px-9">
        <Navigation />
      </div>
      <div className="bg-gradient-to-br from-[#f8fafc] to-[#e0f7fa] min-h-screen py-8">
        <div className="max-w-5xl mx-auto">
          {error && (
            <div className="text-red-500 p-4 bg-red-50 rounded-xl mb-4">
              {error}
            </div>
          )}
          {cartItems.length > 0 ? (
            <>
              <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow mb-6">
                <p className="text-2xl font-bold text-gray-900">Shopping Bag</p>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === cartItems.length}
                    onChange={handleSelectAll}
                    className="w-5 h-5 accent-black rounded border-gray-400"
                  />
                  <span className="text-gray-700 font-medium">Select All</span>
                </div>
              </div>
              <div className="overflow-x-auto bg-white rounded-2xl shadow">
                <table className="w-full text-base">
                  <thead className="text-sm bg-black text-white uppercase">
                    <tr>
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="px-6 py-4 font-semibold text-center"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr
                        key={item.id}
                        className="bg-white border-b last:border-none hover:bg-gray-50 transition"
                      >
                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleItemSelection(item.id)}
                            className="w-5 h-5 accent-black rounded border-gray-400"
                          />
                        </td>
                        <td>
                          <div className="flex items-center gap-4 p-2">
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-20 h-20 object-cover rounded-xl border cursor-pointer"
                              onClick={() =>
                                navigate("/product", {
                                  state: {
                                    id: item.product.product_id,
                                    selectedSize: item.size,
                                    quantity: item.quantity,
                                  },
                                })
                              }
                            />
                            <div className="flex flex-col text-base text-gray-900">
                              <span
                                className="font-semibold cursor-pointer hover:underline"
                                onClick={() =>
                                  navigate("/product", {
                                    state: {
                                      id: item.product.product_id,
                                      selectedSize: item.size,
                                      quantity: item.quantity,
                                    },
                                  })
                                }
                              >
                                {item.product.name}
                              </span>
                              <span className="text-gray-500 text-sm">
                                Size: {item.size}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="text-center text-gray-700 font-medium">
                          ${item.product.price}
                        </td>
                        <td className="text-center text-gray-700">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="px-2 py-1 border rounded disabled:opacity-50"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="text-gray-900 font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              className="px-2 py-1 border rounded disabled:opacity-50"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              // Optionally, disable if at max stock
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-center text-gray-700">
                          {item.size}
                        </td>
                        <td className="text-center text-gray-900 font-bold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="text-center">
                          <button
                            className="flex justify-center items-center w-full hover:text-red-600 transition"
                            onClick={() => {
                              setDeleteItemId(item.id);
                              setModalIsOpen(true);
                            }}
                          >
                            <DeleteIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-8">
                <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
                  <div className="flex justify-between items-center mb-4 text-lg">
                    <span className="font-semibold text-gray-700">
                      Selected Total
                    </span>
                    <span className="font-bold text-xl text-black">
                      ${calculateSelectedTotal()}
                    </span>
                  </div>
                  <button
                    className={`w-full h-[48px] rounded-xl font-semibold text-lg transition ${
                      selectedItems.length > 0
                        ? "bg-black text-white hover:bg-gray-900"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                  >
                    Proceed to Checkout ({selectedItems.length} items)
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-16">
              <img
                src={EmptyCart}
                className="w-52 h-52 mb-6"
                alt="empty-cart"
              />
              <p className="text-3xl font-bold text-gray-700 mb-4">
                Your cart is empty
              </p>
              <Link
                to="/"
                className="inline-block px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition"
              >
                Continue Shopping
              </Link>
            </div>
          )}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            style={customStyles}
            contentLabel="Remove Item"
          >
            <p className="text-lg font-semibold mb-6">
              Are you sure you want to remove this item?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="h-[48px] px-6 border-2 border-gray-300 rounded-xl font-semibold bg-white hover:bg-gray-100 transition"
                onClick={() => setModalIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-black text-white w-[100px] h-[48px] rounded-xl font-semibold hover:bg-gray-900 transition"
                onClick={handleDeleteItem}
              >
                Remove
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Cart;
