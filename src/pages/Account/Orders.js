import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { cancelOrderAPI, fetchOrderAPI } from '../../api/userInfo';
import { selectUserInfo } from '../../store/features/user';
import moment from 'moment';
import { toast } from 'react-toastify';

import { getStepCount } from '../../utils/order-util';

const Orders = () => {
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();

  const [selectedFilter, setSelectedFilter] = useState(() => {
    return localStorage.getItem('orderFilter') || 'Shipped';
  });
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');

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
            status: (order?.status === 'PENDING' || order?.status === 'IN_PROGRESS' || order?.status === 'SHIPPED')
                   ? 'ACTIVE'
                   : order?.status === 'DELIVERED' ? 'COMPLETED' : order?.status,
            items: order?.orderItems?.map(orderItem => ({
              id: orderItem?.item_id,
              name: orderItem?.products?.[0]?.name,
              price: orderItem?.selling_price,
              quantity: orderItem?.quantity,
              url: orderItem?.products?.[0]?.image_url,
            })) || [],
            totalAmount: order?.orderItems?.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0) || 0,
            customerName: order?.customer_name,
            trackingNumber: order?.tracking_number,
            deliveryFee: order?.delivery_fee,
            address: order?.address
          }));
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

  const filteredOrders = orders.filter(order => order?.orderStatus === selectedFilter);

  // Helper to check if order is within 24 hours
  const canCancelOrder = (orderDate) => {
    if (!orderDate) return false;
    const now = Date.now();
    const created = new Date(orderDate).getTime();
    return (now - created) <= 24 * 60 * 60 * 1000; // 24 hours in ms
  };

  // Toggle details view
  const handleToggleDetails = (orderId) => {
    setSelectedOrder(prev => (prev === orderId ? '' : orderId));
  };

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
                  </div>
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