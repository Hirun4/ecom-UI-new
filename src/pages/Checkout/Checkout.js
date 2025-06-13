import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import Navigation from "../../components/Navigation/Navigation";

const WHATSAPP_NUMBER = "0729827098";
const DELIVERY_FEE = 400.0;

const PlaceOrder = () => {
  const { authState } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { items, total } = location.state || { items: [], total: 0 };

  const [userInfo, setUserInfo] = useState(authState.user);
  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [useExistingPromo, setUseExistingPromo] = useState(false);
  const [existingPromoPrice, setExistingPromoPrice] = useState(0);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!authState.token) return;
      try {
        const res = await axios.get(
          "http://localhost:8080/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        setUserInfo(res.data);
      } catch (err) {
        setUserInfo(authState.user);
      }
    };
    fetchUserInfo();
  }, [authState.token, authState.user]);

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

  // Calculate the total to display
  const displayTotal =
    useExistingPromo && existingPromoPrice > 0
      ? Math.max(0, Number(total) + DELIVERY_FEE - existingPromoPrice)
      : Number(total) + DELIVERY_FEE;

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
          final_price += DELIVERY_FEE;
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
        customer_name: `${userInfo?.firstName || ""} ${
          userInfo?.lastName || ""
        }`.trim(),
        address: addressString,
        phone_number: userInfo?.phoneNumber,
        district: district,
        delivery_fee: DELIVERY_FEE,
        orderItems,
      };

      await axios.post(
        `http://localhost:8080/api/order1?paymentMethod=${paymentMethod}`,
        orderRequest
      );

      const userIdentifier = userInfo?.id
        ? `0x${userInfo.id.replace(/-/g, "")}`
        : "user123";

      for (const item of items) {
        try {
          await axios.delete(
            `http://localhost:8080/api/cart/${userIdentifier}/items/${item.id}`
          );
        } catch (err) {}
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

  const handleAddAddress = () => {
    navigate("/account-details/profile");
  };

  const hasAddress = userInfo?.addressList && userInfo.addressList.length > 0;

  return (
    <>
      <div className="bg-[#CAF0F8] py-3 px-9">
        <Navigation />
      </div>
      <div
        style={{
          maxWidth: 1000,
          margin: "40px auto",
          padding: 32,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 32,
            fontWeight: 700,
            fontSize: 28,
            color: "#222",
          }}
        >
          Checkout
        </h2>
        <form onSubmit={handlePlaceOrder}>
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
              Contact Details
            </h3>
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
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
              Address
            </h3>
            {hasAddress ? (
              userInfo.addressList.map((address, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#f5f7fa",
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{address?.name}</div>
                  <div>{address?.phoneNumber}</div>
                  <div>
                    {address?.street}, {address?.city}, {address?.state}
                  </div>
                  <div>{address?.zipCode}</div>
                </div>
              ))
            ) : (
              <div style={{ color: "#888" }}>No address found.</div>
            )}
          </section>

          <section style={{ marginBottom: 32 }}>
            <label
              style={{ fontWeight: 500, marginBottom: 8, display: "block" }}
            >
              Payment Method:
            </label>
            <div style={{ display: "flex", gap: 24 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="radio"
                  value="CASH_ON_DELIVERY"
                  checked={paymentMethod === "CASH_ON_DELIVERY"}
                  onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                  disabled={!hasAddress}
                />
                Cash on Delivery
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="radio"
                  value="BANK_TRANSFER"
                  checked={paymentMethod === "BANK_TRANSFER"}
                  onChange={() => setPaymentMethod("BANK_TRANSFER")}
                  disabled={!hasAddress}
                />
                Bank Transfer
              </label>
            </div>
            {paymentMethod === "BANK_TRANSFER" && hasAddress && (
              <div style={{ marginTop: 16 }}>
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  style={{
                    background: "#25D366",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 20px",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 20 }}>📎</span>
                  Send Payment Slip via WhatsApp
                </button>
                <div style={{ color: "#888", fontSize: 13, marginTop: 6 }}>
                  After placing your order, click this button to send your
                  payment slip to us on WhatsApp.
                </div>
              </div>
            )}
          </section>

          <section>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
              Order Items
            </h3>
            <div style={{ marginBottom: 12 }}>
              <label>
                <input
                  type="checkbox"
                  checked={useExistingPromo}
                  onChange={(e) => setUseExistingPromo(e.target.checked)}
                  disabled={existingPromoPrice <= 0 || !hasAddress}
                  style={{ marginRight: 8 }}
                />
                Use existing promo price (Total: ${existingPromoPrice})
              </label>
            </div>
            <ul
              style={{
                background: "#f9f9f9",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
                border: "1px solid #eee",
              }}
            >
              {items.map((item, idx) => (
                <li key={item.id} style={{ marginBottom: 8 }}>
                  <strong>{item.product.name}</strong> - Size: {item.size} x{" "}
                  {item.quantity} ={" "}
                  <b>${(item.product.price * item.quantity).toFixed(2)}</b>
                </li>
              ))}
            </ul>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
              Subtotal: ${total}
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              Delivery Fee: ${DELIVERY_FEE.toFixed(2)}
            </div>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 16 }}>
              Total: ${displayTotal.toFixed(2)}
              {useExistingPromo && existingPromoPrice > 0 && (
                <span style={{ color: "#009688", fontSize: 14, marginLeft: 8 }}>
                  (Promo applied: -${existingPromoPrice})
                </span>
              )}
            </div>
          </section>
          {error && (
            <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
          )}
          {hasAddress ? (
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: 14,
                background: submitting ? "#ccc" : "#222",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 18,
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
                marginTop: 12,
              }}
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddAddress}
              style={{
                width: "100%",
                padding: 14,
                background: "#0077b6",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 18,
                fontWeight: 600,
                cursor: "pointer",
                marginTop: 12,
              }}
            >
              Add Address to Place the Order
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default PlaceOrder;