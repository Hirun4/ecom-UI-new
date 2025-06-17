import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import Navigation from "../../components/Navigation/Navigation";

// Icon components (replace with your icon library or SVGs as needed)
const UserIcon = () => <span role="img" aria-label="User">👤</span>;
const PhoneIcon = () => <span role="img" aria-label="Phone">📞</span>;
const EmailIcon = () => <span role="img" aria-label="Email">✉️</span>;
const MapPinIcon = () => <span role="img" aria-label="Address">📍</span>;
const CashIcon = () => <span role="img" aria-label="Cash">💵</span>;
const BankIcon = () => <span role="img" aria-label="Bank">🏦</span>;
const CreditCardIcon = () => <span role="img" aria-label="Card">💳</span>;
const ShoppingCartIcon = () => <span role="img" aria-label="Cart">🛒</span>;
const TagIcon = () => <span role="img" aria-label="Promo">🏷️</span>;
const LockIcon = () => <span role="img" aria-label="Lock">🔒</span>;
const WhatsAppIcon = () => <span role="img" aria-label="WhatsApp">🟢</span>;

const WHATSAPP_NUMBER = "0729827098";

const ProgressBar = ({ currentStep, totalSteps }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <div
          key={idx}
          className={`flex-1 h-1.5 rounded-full transition-colors duration-300
            ${idx < currentStep ? "bg-cyan-400" : "bg-gray-200"}`}
        />
      ))}
    </div>
    <div className="text-right text-xs text-gray-500 mt-1">
      Step {currentStep} of {totalSteps}
    </div>
  </div>
);

const PlaceOrder = () => {
  const { authState } = useContext(AuthContext);
  const userInfo = authState.user;
  const location = useLocation();
  const navigate = useNavigate();
  const { items, total } = location.state || { items: [], total: 0 };

  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [useExistingPromo, setUseExistingPromo] = useState(false);
  const [existingPromoPrice, setExistingPromoPrice] = useState(0);

  const addressObj = userInfo?.addressList?.[0];
  const addressString = addressObj
    ? `${addressObj.street}, ${addressObj.city}, ${addressObj.state}, ${addressObj.zipCode}`
    : "";
  const district = addressObj?.city || "";

  useEffect(() => {
    const fetchExistingPromo = async () => {
      if (!userInfo?.phoneNumber) return;
      try {
        const res = await axios.get(
          `http://localhost:8080/api/order1/orders/by-phone/${userInfo.phoneNumber}`
        );
        let promoSum = 0;
        if (Array.isArray(res.data)) {
          res.data.forEach((order) => {
            if (Array.isArray(order.orderItems)) {
              order.orderItems.forEach((item) => {
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

  const getCurrentPromoPrice = () => {
    return Math.round(Number(total) * 0.02);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (useExistingPromo && existingPromoPrice > 0) {
        await axios.put(
          `http://localhost:8080/api/order1/clear-promo/${userInfo.phoneNumber}`
        );
      }

      const currentPromoPrice = getCurrentPromoPrice();
      const orderItems = items.map((item, idx) => {
        let promo_price = 0;
        let final_price = Number(item.product.price) * item.quantity;
        if (idx === 0) {
          promo_price = currentPromoPrice;
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
          buying_price_code: item.product.buying_price_code || "",
          origin_country: item.product.origin_country || "",
          promo_price,
          final_price,
          phone_number: userInfo?.phoneNumber,
        };
      });

      const orderRequest = {
        customer_name: `${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`.trim(),
        address: addressString,
        phone_number: userInfo?.phoneNumber,
        district: district,
        delivery_fee: 0,
        orderItems,
      };

      await axios.post(
        `http://localhost:8080/api/order1?paymentMethod=${paymentMethod}`,
        orderRequest
      );

      const userIdentifier = authState.user?.id
        ? `0x${authState.user.id.replace(/-/g, "")}`
        : "user123";

      for (const item of items) {
        try {
          await axios.delete(
            `http://localhost:8080/api/cart/${userIdentifier}/items/${item.id}`
          );
        } catch (err) {
          // Optionally handle error
        }
      }

      toast.success("Order placed!");
      navigate("/account-details/orders");
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
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <>
      <div className="bg-cyan-100 py-3 px-9">
        <Navigation />
      </div>
      <div className="max-w-3xl mx-auto my-10 p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-center mb-8 font-bold text-3xl text-gray-800 flex items-center justify-center gap-2">
          <ShoppingCartIcon /> Checkout
        </h2>
        <form onSubmit={handlePlaceOrder}>
          {/* Contact Details */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <UserIcon /> Contact Details
            </h3>
            <div className="mb-2 flex items-center gap-2">
              <UserIcon /> <span className="font-medium">Full Name:</span>
              {userInfo?.firstName} {userInfo?.lastName}
            </div>
            <div className="mb-2 flex items-center gap-2">
              <PhoneIcon /> <span className="font-medium">Phone Number:</span>
              {userInfo?.phoneNumber ?? "None"}
            </div>
            <div className="mb-2 flex items-center gap-2">
              <EmailIcon /> <span className="font-medium">Email:</span>
              {userInfo?.email}
            </div>
          </section>

          {/* Address */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <MapPinIcon /> Address
            </h3>
            {userInfo?.addressList?.length ? (
              userInfo.addressList.map((address, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-2"
                >
                  <div className="font-semibold">{address?.name}</div>
                  <div className="flex items-center gap-2"><PhoneIcon /> {address?.phoneNumber}</div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon /> {address?.street}, {address?.city}, {address?.state}
                  </div>
                  <div>{address?.zipCode}</div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No address found.</div>
            )}
          </section>

          {/* Payment Method */}
          <section className="mb-8">
            <label className="font-medium mb-2 block flex items-center gap-2">
              <CreditCardIcon /> Payment Method:
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="CASH_ON_DELIVERY"
                  checked={paymentMethod === "CASH_ON_DELIVERY"}
                  onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                  className="accent-cyan-500"
                />
                <CashIcon /> Cash on Delivery
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="BANK_TRANSFER"
                  checked={paymentMethod === "BANK_TRANSFER"}
                  onChange={() => setPaymentMethod("BANK_TRANSFER")}
                  className="accent-cyan-500"
                />
                <BankIcon /> Bank Transfer
              </label>
            </div>
            {paymentMethod === "BANK_TRANSFER" && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="bg-green-500 text-white rounded-md px-5 py-2 font-semibold flex items-center gap-2 hover:bg-green-600 transition"
                >
                  <WhatsAppIcon /> Send Payment Slip via WhatsApp
                </button>
                <div className="text-gray-500 text-xs mt-2">
                  After placing your order, click this button to send your payment slip to us on WhatsApp.
                </div>
              </div>
            )}
          </section>

          {/* Order Items */}
          <section>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <ShoppingCartIcon /> Order Items
            </h3>
            <div className="mb-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useExistingPromo}
                  onChange={(e) => setUseExistingPromo(e.target.checked)}
                  disabled={existingPromoPrice <= 0}
                  className="accent-cyan-500"
                />
                <TagIcon /> Use existing promo price (Total: ${existingPromoPrice})
              </label>
            </div>
            <ul className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
              {items.map((item, idx) => (
                <li key={item.id} className="mb-2">
                  <strong>{item.product.name}</strong> - Size: {item.size} x{" "}
                  {item.quantity} ={" "}
                  <b>${(item.product.price * item.quantity).toFixed(2)}</b>
                </li>
              ))}
            </ul>
            <div className="font-bold text-xl mb-4">
              Subtotal: ${total}
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 mb-4">{error}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 rounded-md text-lg font-bold mt-3 transition
              ${submitting ? "bg-gray-300 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-cyan-600"}`}
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </>
  );
};

export default PlaceOrder;
