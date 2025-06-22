import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { cancelOrderAPI, fetchOrderAPI } from '../../api/userInfo';
import { selectUserInfo } from '../../store/features/user';
import moment from 'moment';
import { toast } from 'react-toastify';
import { getStepCount } from '../../utils/order-util';
import axios from 'axios';

const CLOUDINARY_UPLOAD_PRESET = 'wbe5nvfe';
const CLOUDINARY_CLOUD_NAME = 'duzjnk48v';

const Orders = () => {
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();

  const [selectedFilter, setSelectedFilter] = useState(() => {
    return localStorage.getItem('orderFilter') || 'Shipped';
  });
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundForm, setRefundForm] = useState({
    reason: '',
    bankAccountNumber: '',
    bankBranch: '',
    bankName: '',
  });
  const [refundOrder, setRefundOrder] = useState(null);
  const [refundImages, setRefundImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [refundStatuses, setRefundStatuses] = useState({}); // { [refundRequestId]: status }

  const fetchOrders = useCallback(() => {
    if (!userInfo?.phoneNumber) return;
    dispatch(setLoading(true));
    fetchOrderAPI(userInfo.phoneNumber)
      .then(res => {
        if (Array.isArray(res)) {
          const displayOrders = res.map(order => ({
            id: order?.order_id,
            orderDate: order?.created_at,
            orderStatus: order?.status,
            deliveryMethod: order?.delivery_method,
            status: (order?.status === 'PENDING' || order?.status === 'IN_PROGRESS' || order?.status === 'SHIPPED')
                   ? 'ACTIVE'
                   : order?.status === 'DELIVERED' ? 'COMPLETED' : order?.status,
            items: order?.orderItems?.map(orderItem => ({
              id: orderItem?.item_id,
              name: orderItem?.products?.[0]?.name,
              price: orderItem?.selling_price,
              quantity: orderItem?.quantity,
              url: orderItem?.products?.[0]?.image_url,
              finalPrice: orderItem?.final_price,
            })) || [],
            totalAmount: order?.orderItems?.reduce((sum, item) => sum + (item.final_price), 0) || 0,
            refundAmount: order?.orderItems?.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0) || 0,
            customerName: order?.customer_name,
            trackingNumber: order?.tracking_number,
            deliveryFee: order?.delivery_fee,
            address: order?.address,
            refundRequests: order?.refundRequests || [],
          }));
          console.log('Fetched orders:', displayOrders);
          setOrders(displayOrders);
        }
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch, userInfo?.phoneNumber]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOnChange = useCallback((evt) => {
    const value = evt?.target?.value;
    setSelectedFilter(value);
    localStorage.setItem('orderFilter', value);
  }, []);

  const onCancelOrder = useCallback((id) => {
    dispatch(setLoading(true));
    cancelOrderAPI(id)
      .then(() => {
        toast.success('Order cancelled successfully!');
        fetchOrders();
      })
      .catch(err => {
        toast.error('Error cancelling order');
        console.error('Error cancelling order:', err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch, fetchOrders]);

  // Filter logic: status is string, so match as is
  const filteredOrders = orders.filter(order => order?.orderStatus === selectedFilter);

  const canCancelOrder = (orderDate) => {
    if (!orderDate) return false;
    const now = Date.now();
    const created = new Date(orderDate).getTime();
    return (now - created) <= 24 * 60 * 60 * 1000;
  };

  const handleToggleDetails = (orderId) => {
    setSelectedOrder(prev => (prev === orderId ? '' : orderId));
    setShowRefundForm(false);
    setRefundOrder(null);
    setRefundImages([]);
  };

  const handleRefundClick = (order) => {
    setShowRefundForm(true);
    setRefundOrder(order);
    setRefundForm({
      reason: '',
      bankAccountNumber: '',
      bankBranch: '',
      bankName: '',
    });
    setRefundImages([]);
  };

  const handleRefundFormChange = (e) => {
    setRefundForm({ ...refundForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setRefundImages(files);
  };

  const uploadImagesToCloudinary = async (images) => {
    const urls = [];
    for (const image of images) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) urls.push(data.secure_url);
    }
    return urls;
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    if (!refundOrder) return;
    setUploading(true);
    try {
      let imageUrls = [];
      if (refundImages.length > 0) {
        imageUrls = await uploadImagesToCloudinary(refundImages);
      }
      const payload = {
        orderId: refundOrder.id,
        reason: refundForm.reason,
        bankAccountNumber: refundForm.bankAccountNumber,
        bankBranch: refundForm.bankBranch,
        bankName: refundForm.bankName,
        refundAmount: refundOrder.refundAmount,
        imageUrls,
      };
      console.log('Submitting refund request payload:', payload);
      const response = await axios.post('http://localhost:8080/api/refund-requests', payload);
      console.log('Refund request response:', response.data);
      toast.success('Refund request submitted!');
      setShowRefundForm(false);
      setRefundOrder(null);
      setRefundImages([]);
      fetchOrders();
    } catch (err) {
      console.error('Refund request error:', err);
      toast.error('Failed to submit refund request');
    } finally {
      setUploading(false);
    }
  };

  // Fetch refund status for a refund request ID
  const fetchRefundStatus = async (refundRequestId) => {
    if (!refundRequestId) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/refund-requests/${refundRequestId}`);
      console.log(`Fetched refund status for request ID ${refundRequestId}:`, res.data);
      setRefundStatuses(prev => ({
        ...prev,
        [refundRequestId]: res.data.status
      }));
    } catch (err) {
      console.error(`Error fetching refund status for request ID ${refundRequestId}:`, err);
      setRefundStatuses(prev => ({
        ...prev,
        [refundRequestId]: null
      }));
    }
  };

  useEffect(() => {
    // Only fetch for delivered orders
    orders.forEach(order => {
      if (order.orderStatus === 'Delivered') {
        axios.get(`http://localhost:8080/api/refund-requests/order/${order.id}`)
          .then(res => {
            // Since only one refund request per order, use res.data directly
            const refundRequest = res.data;
            setRefundStatuses(prev => ({
              ...prev,
              [order.id]: refundRequest?.status || null
            }));
            console.log(`Order #${order.id} refund status:`, refundRequest?.status);
          })
          .catch(err => {
            setRefundStatuses(prev => ({
              ...prev,
              [order.id]: null
            }));
            console.error(`Error fetching refund request for order ${order.id}:`, err);
          });
      }
    });
  }, [orders]);

  return (
    <div className='p-4'>
      <div className='md:w-[70%] w-full'>
        <div className='flex justify-between'>
          <h1 className='text-2xl mb-4'>My Orders</h1>
          <select
            className='border-2 rounded-lg mb-4 p-2'
            value={selectedFilter}
            onChange={handleOnChange}
          >
            <option value='PENDING'>Pending</option>
            <option value='Shipped'>Shipped</option>
            <option value='Delivered'>Delivered</option>
          </select>
        </div>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div key={order.id || index} className='mb-8 bg-white rounded-lg shadow'>
              <div className='bg-gray-100 p-4 rounded-t-lg'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-lg font-bold'>Order #{order?.id}</p>
                    <p className='text-sm text-gray-600'>Tracking: {order?.trackingNumber}</p>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium'>{order?.customerName}</p>
                    <p className='text-sm text-gray-600'>{order?.address}</p>
                  </div>
                </div>
                <div className='flex justify-between mt-2'>
                  <div className='text-sm text-gray-600'>
                    <p>Ordered: {moment(order?.orderDate).format('MMMM DD YYYY')}</p>
                    <p>Status: {order?.orderStatus}</p>
                  </div>
                  <button
                    onClick={() => handleToggleDetails(order?.id)}
                    className='text-blue-900 underline'
                  >
                    {selectedOrder === order?.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>
              {selectedOrder === order?.id && order?.items?.length > 0 && (
                <div className='p-4'>
                  {order.items.map((item, idx) => (
                    <div key={idx} className='flex gap-4 border-b py-4 last:border-0'>
                      {item?.url && (
                        <img
                          src={item.url}
                          alt={item.name}
                          className='w-24 h-24 object-cover rounded'
                        />
                      )}
                      <div className='flex-1'>
                        <p className='font-medium'>{item?.name}</p>
                        <p className='text-gray-600'>Quantity: {item?.quantity}</p>
                        <p className='text-gray-600'>Price: ${item?.price}</p>
                      </div>
                    </div>
                  ))}
                  <div className='mt-4 flex justify-between items-center'>
                    <div>
                      <p className='text-gray-600'>Delivery Fee: ${order?.deliveryFee}</p>
                      <p className='font-bold text-lg'>Total: ${order?.totalAmount}</p>
                    </div>
                    {order?.orderStatus !== 'CANCELLED' &&
                      getStepCount[order?.orderStatus] <= 2 &&
                      canCancelOrder(order?.orderDate) && (
                        <button
                          onClick={() => onCancelOrder(order.id)}
                          className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700'
                        >
                          Cancel Order
                        </button>
                      )}
                    {order?.orderStatus === 'Delivered' && order?.deliveryMethod === 'Courier' && !showRefundForm && (() => {
  // Get the latest refund request (assuming refundRequests is sorted by date ascending)
  const latestRefund = order.refundRequests && order.refundRequests.length > 0
    ? order.refundRequests[order.refundRequests.length - 1]
    : null;

  console.log(`Order #${order.id} latestRefund:`, latestRefund);

  const status = refundStatuses[order.id];

  if (status === 'APPROVED') {
    return (
      <div className='flex flex-col items-end'>
        <button
          className='bg-green-600 text-white px-6 py-2 rounded-lg cursor-default mb-2'
          disabled
        >
          Approved
        </button>
        <span className='text-green-700 text-sm'>
          Your refund money will be credited to your bank account soon.
        </span>
      </div>
    );
  } else if (status === 'REJECTED') {
    return (
      <button
        className='bg-red-600 text-white px-6 py-2 rounded-lg cursor-default'
        disabled
      >
        Rejected
      </button>
    );
  } else if (status === 'PENDING') {
    return (
      <button
        className='bg-yellow-500 text-white px-6 py-2 rounded-lg cursor-default'
        disabled
      >
        Pending
      </button>
    );
  } else {
    return (
      <button
        onClick={() => handleRefundClick(order)}
        className='bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 ml-4'
      >
        Request Refund
      </button>
    );
  }
})()}
                  </div>
                  {showRefundForm && refundOrder?.id === order.id && (
                    <form className='mt-6 p-4 border rounded bg-gray-50' onSubmit={handleRefundSubmit}>
                      <h3 className='text-lg font-bold mb-4'>Refund Request</h3>
                      <div className='mb-3'>
                        <label className='block mb-1 font-medium'>Refund Reason</label>
                        <input
                          type='text'
                          name='reason'
                          value={refundForm.reason}
                          onChange={handleRefundFormChange}
                          required
                          className='w-full border rounded p-2'
                        />
                      </div>
                      <div className='mb-3'>
                        <label className='block mb-1 font-medium'>Bank Account Number</label>
                        <input
                          type='text'
                          name='bankAccountNumber'
                          value={refundForm.bankAccountNumber}
                          onChange={handleRefundFormChange}
                          required
                          className='w-full border rounded p-2'
                        />
                      </div>
                      <div className='mb-3'>
                        <label className='block mb-1 font-medium'>Bank Branch</label>
                        <input
                          type='text'
                          name='bankBranch'
                          value={refundForm.bankBranch}
                          onChange={handleRefundFormChange}
                          required
                          className='w-full border rounded p-2'
                        />
                      </div>
                      <div className='mb-3'>
                        <label className='block mb-1 font-medium'>Bank Name</label>
                        <input
                          type='text'
                          name='bankName'
                          value={refundForm.bankName}
                          onChange={handleRefundFormChange}
                          required
                          className='w-full border rounded p-2'
                        />
                      </div>
                      <div className='mb-3'>
                        <label className='block mb-1 font-medium'>Refund Amount</label>
                        <input
                          type='text'
                          value={`$${refundOrder.refundAmount}`}
                          readOnly
                          className='w-full border rounded p-2 bg-gray-100'
                        />
                      </div>
                      <div className='mb-3'>
                        <label className='block mb-1 font-medium'>Upload Images (max 4)</label>
                        <input
                          type='file'
                          accept='image/*'
                          multiple
                          onChange={handleImageChange}
                          disabled={uploading}
                        />
                        <div className='flex gap-2 mt-2'>
                          {refundImages.length > 0 && Array.from(refundImages).map((img, idx) => (
                            <img
                              key={idx}
                              src={URL.createObjectURL(img)}
                              alt='preview'
                              className='w-16 h-16 object-cover rounded'
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        type='submit'
                        className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700'
                        disabled={uploading}
                      >
                        {uploading ? 'Submitting...' : 'Approve Refund'}
                      </button>
                    </form>
                  )}
                  {order.refundRequests && order.refundRequests.length > 0 && (
                    <div className='mt-4'>
                      {console.log(`Order #${order.id} refundRequests:`, order.refundRequests)}
                      <h4 className='font-bold mb-2'>Refund Requests</h4>
                      {order.refundRequests.map((req, idx) => (
                        <div key={idx} className='mb-2 p-2 border rounded bg-gray-100'>
                          <div className='mb-1 text-sm'>Status: {req.status}</div>
                          <div className='mb-1 text-sm'>Reason: {req.reason}</div>
                          <div className='mb-1 text-sm'>Amount: ${req.refundAmount}</div>
                          <div className='flex gap-2 mt-1'>
                            {req.imageUrls && req.imageUrls.map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt='refund'
                                className='w-16 h-16 object-cover rounded'
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className='text-center text-gray-500 mt-4'>No orders found</p>
        )}
      </div>
    </div>
  );
};

export default Orders;