import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../store/features/user'; 
import EmptyCart from '../../assets/img/empty_cart.png';
import DeleteIcon from '../../components/common/DeleteIcon';
import Modal from 'react-modal';
import { customStyles } from '../../styles/modal';
import { AuthContext } from '../../context/authContext';
import Navigation from '../../components/Navigation/Navigation';
import Footer from '../../components/Footer/Footer';


const headers = [
    "Product Details", "Price", "Quantity", "Size", "SubTotal", "Action"
];

const Cart = () => {
    const {authState}=useContext(AuthContext);
    console.log("Cart component initialized");
    console.log("user:",authState.user);
    
     const userInfo = useSelector(selectUserInfo);
    const [cartItems, setCartItems] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();
   
    console.log("Current userInfo:", userInfo);
    
   const userIdentifier = authState.user?.id 
    ? `0x${authState.user.id.replace(/-/g, '')}` 
    : "user123"; 
console.log("Using userIdentifier:", userIdentifier);

    
    const api = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            'Content-Type': 'application/json'
            
        }
    });

    useEffect(() => {
        console.log("useEffect triggered for cart fetching");
        fetchCartItems();
    }, [userIdentifier]);

    const fetchCartItems = async () => {
        console.log("Starting fetchCartItems");
        setLoading(true);
        try {
            console.log(`Making GET request to: /api/cart/${userIdentifier}`);
            const response = await api.get(`/api/cart/${userIdentifier}`);
            console.log("Cart API Response:", response);
            console.log("Cart Items Data:", response.data);
            setCartItems(response.data);
            setError(null);
        } catch (error) {
            console.error('Error in fetchCartItems:', error);
            console.log('Error config:', error.config);
            console.log('Error response:', error.response);
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
            console.log("fetchCartItems completed");
        }
    };

    const handleDeleteItem = async () => {
        console.log("Starting handleDeleteItem for ID:", deleteItemId);
        try {
            console.log(`Making DELETE request to: /api/cart/${userIdentifier}/items/${deleteItemId}`);
            const response = await api.delete(`/api/cart/${userIdentifier}/items/${deleteItemId}`);
            console.log("Delete API Response:", response);
            
            setModalIsOpen(false);
            await fetchCartItems();
            console.log("Item deleted successfully");
        } catch (error) {
            console.error('Error in handleDeleteItem:', error);
            console.log('Delete error config:', error.config);
            console.log('Delete error response:', error.response);
            setError(error.response?.data?.message || error.message);
        }
    };

    const openDeleteModal = (itemId) => {
        console.log("Opening delete modal for item:", itemId);
        setDeleteItemId(itemId);
        setModalIsOpen(true);
    };

    const calculateSubTotal = () => {
        console.log("Calculating subtotal for items:", cartItems);
        const total = cartItems.reduce((sum, item) => {
            const itemTotal = item.product.price * item.quantity;
            console.log(`Item ${item.id} subtotal: ${itemTotal}`);
            return sum + itemTotal;
        }, 0);
        console.log("Final total:", total);
        return total.toFixed(2);
    };

    console.log("Current component state:", {
        cartItems,
        loading,
        error,
        modalIsOpen,
        deleteItemId
    });

    if (loading) {
        console.log("Rendering loading state");
        return <div>Loading cart...</div>;
    }

    return (
        <>
        <div className="bg-[#CAF0F8] py-3 px-9">
        <Navigation />
      </div>
        <div className='p-4'>
            {error && (
                <div className="text-red-500 p-4">
                    {console.log("Rendering error:", error)}
                    Error: {error}
                </div>
            )}

            {cartItems.length > 0 ? (
                <>
                    {console.log("Rendering cart with items:", cartItems.length)}
                    <p className='text-xl text-black p-4'>Shopping Bag</p>
                    <table className='w-full text-lg'>
                        <thead className='text-sm bg-black text-white uppercase'>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} scope='col' className='px-6 py-3'>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => {
                                console.log("Rendering cart item:", item);
                                return (
                                    <tr key={item.id} className='p-4 bg-white border-b'>
                                        <td>
                                            <div className='flex p-4'>
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    className='w-[120px] h-[120px] object-cover'
                                                    onError={(e) => {
                                                        console.log("Image load error:", e);
                                                        e.target.src = 'fallback-image-url';
                                                    }}
                                                />
                                                <div className='flex flex-col text-sm px-2 text-gray-600'>
                                                    <p>{item.product.name}</p>
                                                    <p>Size: {item.size}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p className='text-center text-sm text-gray-600'>
                                                ${item.product.price}
                                            </p>
                                        </td>
                                        <td>
                                            <p className='text-center text-sm text-gray-600'>
                                                {item.quantity}
                                            </p>
                                        </td>
                                        <td>
                                            <p className='text-center text-sm text-gray-600'>
                                                {item.size}
                                            </p>
                                        </td>
                                        <td>
                                            <p className='text-center text-sm text-gray-600'>
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                        </td>
                                        <td>
                                            <button
                                                className='flex justify-center items-center w-full'
                                                onClick={() => {
                                                    console.log("Delete button clicked for item:", item.id);
                                                    openDeleteModal(item.id);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className='flex justify-end bg-gray-200 p-8'>
                        <div className='mr-20 pr-8'>
                            <div className='flex gap-8 text-lg'>
                                <p className='w-[120px]'>SubTotal</p>
                                <p>${calculateSubTotal()}</p>
                            </div>
                            <button
                                className='w-full items-center h-[48px] bg-black border rounded-lg mt-2 text-white hover:bg-gray-800'
                                onClick={() => {
                                    console.log("Checkout button clicked");
                                    navigate("/checkout");
                                }}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className='w-full items-center text-center'>
                    {console.log("Rendering empty cart state")}
                    <div className='flex justify-center'>
                        <img src={EmptyCart} className='w-[240px] h-[240px]' alt='empty-cart'/>
                    </div>
                    <p className='text-3xl font-bold'>Your cart is empty</p>
                    <div className='p-4'>
                        <Link
                            to="/"
                            className='w-full p-2 items-center h-[48px] bg-black border rounded-lg mt-2 text-white hover:bg-gray-800'
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => {
                    console.log("Modal closed");
                    setModalIsOpen(false);
                }}
                style={customStyles}
                contentLabel="Remove Item"
            >
                <p>Are you sure you want to remove this item?</p>
                <div className='flex justify-between p-4'>
                    <button
                        className='h-[48px]'
                        onClick={() => {
                            console.log("Modal cancel clicked");
                            setModalIsOpen(false);
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className='bg-black text-white w-[80px] h-[48px] border rounded-lg'
                        onClick={() => {
                            console.log("Modal confirm delete clicked");
                            handleDeleteItem();
                        }}
                    >
                        Remove
                    </button>
                </div>
            </Modal>
        </div>
        <div className="bg-[#CAF0F8] py-3 px-9">
        <Footer />
      </div>
        </>
    );
};

export default Cart;