import React, { useEffect, useState, useContext } from 'react';
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
    "Select", "Product Details", "Price", "Quantity", "Size", "SubTotal", "Action"
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
        ? `0x${authState.user.id.replace(/-/g, '')}` 
        : "user123";

    const api = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            'Content-Type': 'application/json'
        }
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
            setSelectedItems(prev => prev.filter(id => id !== deleteItemId));
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };

    const handleItemSelection = (itemId) => {
        setSelectedItems(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            }
            return [...prev, itemId];
        });
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedItems(cartItems.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const calculateSelectedTotal = () => {
        return cartItems
            .filter(item => selectedItems.includes(item.id))
            .reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
            .toFixed(2);
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('Please select items to checkout');
            return;
        }
        const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
        navigate("/place-order", {
            state: {
                items: selectedCartItems,
                total: calculateSelectedTotal()
            }
        });
    };

    if (loading) return <div>Loading cart...</div>;

    return (
        <>
            <div className="bg-[#CAF0F8] py-3 px-9">
                <Navigation />
            </div>
            <div className='p-4'>
                {error && (
                    <div className="text-red-500 p-4">
                        Error: {error}
                    </div>
                )}

                {cartItems.length > 0 ? (
                    <>
                        <div className='flex justify-between items-center p-4'>
                            <p className='text-xl text-black'>Shopping Bag</p>
                            <div className='flex items-center gap-2'>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.length === cartItems.length}
                                    onChange={handleSelectAll}
                                    className="w-4 h-4"
                                />
                                <span>Select All</span>
                            </div>
                        </div>
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
                                {cartItems.map((item) => (
                                    <tr key={item.id} className='p-4 bg-white border-b'>
                                        <td className='text-center'>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleItemSelection(item.id)}
                                                className="w-4 h-4"
                                            />
                                        </td>
                                        <td>
                                            <div className='flex p-4'>
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    className='w-[120px] h-[120px] object-cover'
                                                />
                                                <div className='flex flex-col text-sm px-2 text-gray-600'>
                                                    <p>{item.product.name}</p>
                                                    <p>Size: {item.size}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='text-center text-sm text-gray-600'>
                                            ${item.product.price}
                                        </td>
                                        <td className='text-center text-sm text-gray-600'>
                                            {item.quantity}
                                        </td>
                                        <td className='text-center text-sm text-gray-600'>
                                            {item.size}
                                        </td>
                                        <td className='text-center text-sm text-gray-600'>
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </td>
                                        <td>
                                            <button
                                                className='flex justify-center items-center w-full'
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
                        <div className='flex justify-end bg-gray-200 p-8'>
                            <div className='mr-20 pr-8'>
                                <div className='flex gap-8 text-lg'>
                                    <p className='w-[120px]'>Selected Total</p>
                                    <p>${calculateSelectedTotal()}</p>
                                </div>
                                <button
                                    className={`w-full items-center h-[48px] border rounded-lg mt-2 text-white 
                                        ${selectedItems.length > 0 
                                            ? 'bg-black hover:bg-gray-800' 
                                            : 'bg-gray-400 cursor-not-allowed'}`}
                                    onClick={handleCheckout}
                                    disabled={selectedItems.length === 0}
                                >
                                    Proceed to Checkout ({selectedItems.length} items)
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='w-full items-center text-center'>
                        <div className='flex justify-center'>
                            <img src={EmptyCart} className='w-[240px] h-[240px]' alt='empty-cart'/>
                        </div>
                        <p className='text-3xl font-bold'>Your cart is empty</p>
                        <div className='p-4'>
                            <Link to="/" className='w-full p-2 items-center h-[48px] bg-black border rounded-lg mt-2 text-white hover:bg-gray-800'>
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    style={customStyles}
                    contentLabel="Remove Item"
                >
                    <p>Are you sure you want to remove this item?</p>
                    <div className='flex justify-between p-4'>
                        <button
                            className='h-[48px]'
                            onClick={() => setModalIsOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className='bg-black text-white w-[80px] h-[48px] border rounded-lg'
                            onClick={handleDeleteItem}
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
