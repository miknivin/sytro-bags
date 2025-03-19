"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useCreateNewOrderMutation } from "@/redux/api/orderApi";
import CartFooter from "./checkout/CartFooter";
import { countries } from "@/data/countries.js";
import { states } from "@/data/states.js";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/features/cartSlice";
export default function Checkout() {
  const indiaPhoneRegex = /^[6-9][0-9]{9}$/; // 10 digits, starts with 6-9
  const uaePhoneRegex =
    /^(50|52|54|55|56|58|3[235678]|6[24578]|7[0245689]|9[2456789])[0-9]{7}$/; // UAE valid prefixes with 9 digits

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dispatch = useDispatch();
  const router = useRouter();
  const [subtotal, setSubtotal] = useState(0);
  const [countryId, setCountryId] = useState("101");
  const [stateId, setStateId] = useState(countryId === "101" && "19");
  const [filteredStates, setFilteredStates] = useState([]);
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    state: stateId === "19" ? "Kerala" : "",
    city: "",
    phoneNo: "",
    zipCode: "",
    country: "India",
    orderNotes: "",
    paymentMethod: "COD",
  });

  const cartItems = useSelector((state) => state.cart.cartItems);
  const [createNewOrder, { isLoading, error }] = useCreateNewOrderMutation();

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.id]: true });
  };
  useEffect(() => {
    setSubtotal(
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    );
  }, [cartItems]);

  useEffect(() => {
    //console.log(cartItems, "cartItems");

    setFilteredStates(
      states.filter((state) => state.country_id.toString() === countryId)
    );
  }, [countryId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e = null, paymentMode = "COD") => {
    if (e && paymentMode === "COD") e?.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    const orderData = {
      shippingInfo: {
        ...formData,
        fullName,
        email,
      },
      orderItems: cartItems,
      paymentMethod: paymentMode,
      itemsPrice: subtotal,
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount: subtotal,
      orderNotes: formData.orderNotes || "",
    };

    try {
      await createNewOrder(orderData).unwrap();
      Swal.fire({
        icon: "success",
        title: "Order Placed Successfully!",
        text: "Thank you for your purchase. Your order has been placed.",
        confirmButtonText: "OK",
      }).then(() => {
        dispatch(clearCart());
        router.push("/my-account-orders");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Order Failed!",
        text: "There was an error placing your order. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="tf-page-cart-wrap layout-2">
          <div className="tf-page-cart-item">
            <h5 className="fw-5 mb_20">Billing details</h5>
            <form onSubmit={handleSubmit} className="form-checkout">
              <div className="box grid-2">
                <fieldset className="fieldset">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    required
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.firstName && !formData.firstName && (
                    <div className="text-danger">First name is required</div>
                  )}
                </fieldset>
                <fieldset className="fieldset">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    required
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {touched.lastName && !formData.lastName && (
                    <div className="text-danger">First name is required</div>
                  )}
                </fieldset>
              </div>
              <div className="box grid-2">
                <fieldset className="fieldset mb-2">
                  <label htmlFor="phoneNo">Phone Number</label>
                  <input
                    required
                    type="text"
                    id="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onInput={handleBlur}
                  />
                  {touched.phoneNo &&
                    !(
                      indiaPhoneRegex.test(formData.phoneNo.trim()) ||
                      uaePhoneRegex.test(formData.phoneNo.trim())
                    ) && (
                      <div className="text-danger">
                        Invalid phone number format
                        {formData.phoneNo.trim().startsWith("0") && (
                          <small> -It should NOT start with 0</small>
                        )}
                      </div>
                    )}
                </fieldset>

                <fieldset className="fieldset mb-2">
                  <label htmlFor="email">Email</label>
                  <input
                    required
                    type="email"
                    id="email"
                    value={email}
                    onBlur={handleBlur}
                    onChange={handleEmailChange}
                  />
                  {touched.email && !emailRegex.test(email) && (
                    <div className="text-danger">Invalid email format</div>
                  )}
                </fieldset>
              </div>

              <fieldset className="fieldset mb-3">
                <label htmlFor="country">Country</label>
                <div className="select-custom">
                  <select
                    className="tf-select w-100"
                    id="country"
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                    onBlur={() => setTouched({ ...touched, country: true })}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                {touched.country && !countryId && (
                  <div className="text-danger">Country is required</div>
                )}
              </fieldset>

              <fieldset className="fieldset mb-3">
                <label htmlFor="state">State</label>
                <div className="select-custom">
                  <select
                    id="state"
                    className="tf-select w-100"
                    value={stateId}
                    onChange={(e) => {
                      const selectedState = filteredStates.find(
                        (state) => state.id === e.target.value
                      );
                      setStateId(e.target.value);
                      setFormData({
                        ...formData,
                        state: selectedState ? selectedState.name : "",
                      }); // Also update formData.state with state name
                    }}
                    onBlur={() => setTouched({ ...touched, state: true })}
                  >
                    <option value="">Select State</option>
                    {filteredStates.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                {touched.state && !stateId && (
                  <div className="text-danger">State is required</div>
                )}
              </fieldset>

              <fieldset className="fieldset mb-3">
                <label htmlFor="city">City</label>
                <input
                  required
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={() => setTouched({ ...touched, city: true })}
                />
                {touched.city && !formData.city && (
                  <div className="text-danger">City is required</div>
                )}
              </fieldset>

              <fieldset className="fieldset mb-3">
                <label htmlFor="address">Address</label>
                <input
                  required
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={() => setTouched({ ...touched, address: true })}
                />
                {touched.address && !formData.address && (
                  <div className="text-danger">Address is required</div>
                )}
              </fieldset>

              <fieldset className="fieldset mb-3">
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  required
                  type="text"
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  onBlur={() => setTouched({ ...touched, zipCode: true })}
                />
                {touched.zipCode && !formData.zipCode && (
                  <div className="text-danger">Zip Code is required</div>
                )}
              </fieldset>
              <fieldset className="fieldset">
                <label htmlFor="orderNotes" class="non-mandatory">
                  Order Notes (optional)
                </label>
                <textarea
                  id="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleChange}
                />
              </fieldset>
              {error && <p>Error placing order</p>}
            </form>
          </div>
          <CartFooter
            cartItems={cartItems}
            subtotal={subtotal}
            formData={formData}
            email={email}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
}
