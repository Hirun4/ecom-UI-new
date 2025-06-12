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

  return (
    <div className="p-4">
  <div className="md:w-[70%] w-full mx-auto">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      <select
        className="border-2 rounded-lg p-2 bg-white text-gray-700 shadow focus:ring-2 focus:ring-blue-200 transition"
        value={selectedFilter}
        onChange={handleOnChange}
      >
        <option value='Shipped'>Shipped</option>
        <option value='Delivered'>Delivered</option>
        <option value='PENDING'>Pending</option>
      </select>
    </div>
    {filteredOrders.length > 0 ? (
      filteredOrders.map((order, index) => (
        <div key={order.id || index} className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
          <div className="bg-gray-100 p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <p className="text-lg font-bold text-gray-900">Order #{order?.id}</p>
              <p className="text-sm text-gray-500">Tracking: {order?.trackingNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-800">{order?.customerName}</p>
              <p className="text-sm text-gray-500">{order?.address}</p>
            </div>
          </div>
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <div className="text-sm text-gray-600">
              <p>Ordered: {moment(order?.orderDate).format('MMMM DD YYYY')}</p>
              <p>Status: <span className="font-semibold">{order?.orderStatus}</span></p>
            </div>
            <button
              onClick={() => setSelectedOrder(order?.id)}
              className="text-blue-900 underline hover:text-blue-700 transition"
            >
              {selectedOrder === order?.id ? 'Hide Details' : 'View Details'}
            </button>
          </div>
          {selectedOrder === order?.id && order?.items?.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-b-2xl">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 border-b py-4 last:border-0">
                  {item?.url && (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg shadow"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item?.name}</p>
                    <p className="text-gray-600">Quantity: {item?.quantity}</p>
                    <p className="text-gray-600">Price: <span className="font-semibold">${item?.price}</span></p>
                  </div>
                </div>
              ))}
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-600">Delivery Fee: <span className="font-semibold">${order?.deliveryFee}</span></p>
                  <p className="font-bold text-lg text-gray-900">Total: ${order?.totalAmount}</p>
                </div>
                {order?.orderStatus !== 'CANCELLED' && getStepCount[order?.orderStatus] <= 2 && (
                  <button
                    onClick={() => onCancelOrder(order.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
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
      <p className="text-center text-gray-500 mt-4">No orders found</p>
    )}
  </div>
</div>

  );
};

export default Orders;