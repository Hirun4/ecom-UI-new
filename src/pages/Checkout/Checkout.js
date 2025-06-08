import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import { toast } from 'react-toastify';
import Navigation from '../../components/Navigation/Navigation';

const WHATSAPP_NUMBER = '0729827098';

const PlaceOrder = () => {
  const { authState } = useContext(AuthContext);
  const userInfo = authState.user;
  const location = useLocation();
  const navigate = useNavigate();
  const { items, total } = location.state || { items: [], total: 0 };

  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [useExistingPromo, setUseExistingPromo] = useState(false);
  const [existingPromoPrice, setExistingPromoPrice] = useState(0);

  const addressObj = userInfo?.addressList?.[0];
  const addressString = addressObj
    ? `${addressObj.street}, ${addressObj.city}, ${addressObj.state}, ${addressObj.zipCode}`
    : '';
  const district = addressObj?.city || '';

  // Fetch all previous promo prices for this user
  useEffect(() => {
    const fetchExistingPromo = async () => {
      if (!userInfo?.phoneNumber) return;
      try {
        const res = await axios.get(
          `http://localhost:8080/api/order1/orders/by-phone/${userInfo.phoneNumber}`
        );
        let promoSum = 0;
        if (Array.isArray(res.data)) {
          res.data.forEach(order => {
            if (Array.isArray(order.orderItems)) {
              order.orderItems.forEach(item => {
                if (item.promo_price && !isNaN(item.promo_price)) {
                  promoSum += Number(item.promo_price);
                }
              });
            }
          });
        }
        setExistingPromoPrice(promoSum);
      } catch {
        setExistingPromoPrice(0);
      }
    };
    fetchExistingPromo();
  }, [userInfo?.phoneNumber]);

  // Calculate current promo price (subtotal * 0.02)
  const getCurrentPromoPrice = () => {
    return Math.round(Number(total) * 0.02);
  };

  // Place order logic (correct promo logic + deduct existing promo from one item)
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // 1. If user uses existing promo, clear all previous promo prices in backend
      if (useExistingPromo && existingPromoPrice > 0) {
        await axios.put(
          `http://localhost:8080/api/order1/clear-promo/${userInfo.phoneNumber}`
        );
      }

      // 2. Always save current promo price to the first item (for future use)
      const currentPromoPrice = getCurrentPromoPrice();
      const orderItems = items.map((item, idx) => {
        let promo_price = 0;
        let final_price = Number(item.product.price) * item.quantity;
        if (idx === 0) {
          promo_price = currentPromoPrice;
          // Deduct existing promo from first item if using existing promo
          if (useExistingPromo && existingPromoPrice > 0) {
            final_price = Math.max(0, final_price - existingPromoPrice);
          }
        }
        return {
          product_id: item.product.product_id,
          size: item.size,
          quantity: item.quantity,
          buying_price: item.product.price,
          selling_price: item.product.price,
          discount: 0,
          buying_price_code: item.product.buying_price_code || '',
          origin_country: item.product.origin_country || '',
          promo_price,
          final_price,
          phone_number: userInfo?.phoneNumber
        };
      });

      const orderRequest = {
        customer_name: `${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`.trim(),
        address: addressString,
        phone_number: userInfo?.phoneNumber,
        district: district,
        delivery_fee: 0,
        orderItems
      };

      await axios.post(
        `http://localhost:8080/api/order1?paymentMethod=${paymentMethod}`,
        orderRequest
      );

      toast.success('Order placed!');
      navigate('/account-details/orders');
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello, I have placed a bank transfer order. Here is my payment slip for order by ${userInfo?.firstName} ${userInfo?.lastName}.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <>
      <div className="bg-[#CAF0F8] py-3 px-9">
        <Navigation />
      </div>
      <div style={{
        maxWidth: 1000,
        margin: '40px auto',
        padding: 32,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 32, fontWeight: 700, fontSize: 28, color: '#222' }}>
          Checkout
        </h2>
        <form onSubmit={handlePlaceOrder}>
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Contact Details</h3>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>Full Name: </span>
              {userInfo?.firstName} {userInfo?.lastName}
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>Phone Number: </span>
              {userInfo?.phoneNumber ?? "None"}
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>Email: </span>
              {userInfo?.email}
            </div>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Address</h3>
            {userInfo?.addressList?.length ? (
              userInfo.addressList.map((address, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f5f7fa',
                    border: '1px solid #e0e0e0',
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 8
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{address?.name}</div>
                  <div>{address?.phoneNumber}</div>
                  <div>{address?.street}, {address?.city}, {address?.state}</div>
                  <div>{address?.zipCode}</div>
                </div>
              ))
            ) : (
              <div style={{ color: '#888' }}>No address found.</div>
            )}
          </section>

          <section style={{ marginBottom: 32 }}>
            <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>Payment Method:</label>
            <div style={{ display: 'flex', gap: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="radio"
                  value="CASH_ON_DELIVERY"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                />
                Cash on Delivery
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="radio"
                  value="BANK_TRANSFER"
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setPaymentMethod('BANK_TRANSFER')}
                />
                Bank Transfer
              </label>
            </div>
            {paymentMethod === 'BANK_TRANSFER' && (
              <div style={{ marginTop: 16 }}>
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  style={{
                    background: '#25D366',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '10px 20px',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <span style={{ fontSize: 20 }}>📎</span>
                  Send Payment Slip via WhatsApp
                </button>
                <div style={{ color: '#888', fontSize: 13, marginTop: 6 }}>
                  After placing your order, click this button to send your payment slip to us on WhatsApp.
                </div>
              </div>
            )}
          </section>

          <section>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Order Items</h3>
            <div style={{ marginBottom: 12 }}>
              <label>
                <input
                  type="checkbox"
                  checked={useExistingPromo}
                  onChange={e => setUseExistingPromo(e.target.checked)}
                  disabled={existingPromoPrice <= 0}
                  style={{ marginRight: 8 }}
                />
                Use existing promo price (Total: ${existingPromoPrice})
              </label>
            </div>
            <ul style={{
              background: '#f9f9f9',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              border: '1px solid #eee'
            }}>
              {items.map((item, idx) => (
                <li key={item.id} style={{ marginBottom: 8 }}>
                  <strong>{item.product.name}</strong> - Size: {item.size} x {item.quantity} = <b>${(item.product.price * item.quantity).toFixed(2)}</b>
                </li>
              ))}
            </ul>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>
              Subtotal: ${total}
            </div>
          </section>
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: 14,
              background: submitting ? '#ccc' : '#222',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 18,
              fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              marginTop: 12
            }}
          >
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </>
  );
};

export default PlaceOrder;