"use client";
import { Suspense, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useCreateNewOrderMutation } from "@/redux/api/orderApi";
import FullScreenSpinner from "@/components/common/FullScreenSpinner";
import CartFooter from "./checkout/CartFooter";
import { countries } from "@/data/countries.js";
import { states } from "@/data/states.js";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/features/cartSlice";
import { getLocationByPincode } from "@/utlis/getPinCodeDetails";
export default function Checkout() {
  const indiaPhoneRegex = /^[6-9][0-9]{9}$/; // 10 digits, starts with 6-9
  const uaePhoneRegex =
    /^(50|52|54|55|56|58|3[235678]|6[24578]|7[0245689]|9[2456789])[0-9]{7}$/; // UAE valid prefixes with 9 digits

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dispatch = useDispatch();
  const router = useRouter();
  const [subtotal, setSubtotal] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [countryId, setCountryId] = useState("101");
  const [stateId, setStateId] = useState(countryId === "101" && "19");
  const [filteredStates, setFilteredStates] = useState([]);

  const [touched, setTouched] = useState({});
  const user = useSelector((state) => state.auth.user);
  const indianPinCodeRegex = /^[1-9][0-9]{5}$/;
  // const [email, setEmail] = useState(user.email || "");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    address: "",
    state: stateId === "19" ? "Kerala" : "",
    city: "",
    phoneNo: user?.phone ? user.phone.replace(/^\+?91/, "") : "",
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
    if (appliedCoupon) {
      let discount = 0;
      if (appliedCoupon.discountType === "percentage") {
        discount = (subtotal * appliedCoupon.discountValue) / 100;
        if (
          appliedCoupon.maximumDiscount &&
          discount > appliedCoupon.maximumDiscount
        ) {
          discount = appliedCoupon.maximumDiscount;
        }
      } else {
        discount = appliedCoupon.discountValue;
      }
      setDiscountAmount(discount);
      setTotalAmount(subtotal - discount);
    } else {
      setDiscountAmount(0);
      setTotalAmount(subtotal);
    }
  }, [subtotal, appliedCoupon]);

  useEffect(() => {
    //console.log(cartItems, "cartItems");

    setFilteredStates(
      states.filter((state) => state.country_id.toString() === countryId)
    );
  }, [countryId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleZipCodeChange = async (e) => {
    let { value } = e.target;
    // Automatically remove non-numeric characters while typing
    value = value.replace(/\D/g, "");
    // Prevent user from entering more than 6 digits
    if (value.length > 6) {
      value = value.slice(0, 6);
    }

    setFormData({ ...formData, zipCode: value });

    if (indianPinCodeRegex.test(value)) {
      const location = await getLocationByPincode(value);
      if (location) {
        setFormData((prev) => ({
          ...prev,
          country: "India",
          state: location.state,
          city: location.city,
        }));
      }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e = null, paymentMode = "COD") => {
    if (e && paymentMode === "COD") e?.preventDefault();

    // --- Form Validation ---
    if (!formData.firstName || !formData.address || !formData.city) {
      Swal.fire({
        icon: "error",
        title: "Missing Information!",
        text: "Please fill in all required fields (Name, Address, City).",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email!",
        text: "Please enter a valid email address.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (
      !(
        indiaPhoneRegex.test(formData.phoneNo.trim()) ||
        uaePhoneRegex.test(formData.phoneNo.trim())
      )
    ) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number!",
        text: "Please enter a valid phone number format.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!indianPinCodeRegex.test(formData.zipCode.trim())) {
      Swal.fire({
        icon: "error",
        title: "Invalid PIN Code!",
        text: "Please enter a valid 6-digit Indian PIN code.",
        confirmButtonText: "OK",
      });
      return;
    }
    // -----------------------

    const invalidSlingBags = cartItems.filter(
      (item) =>
        item.category === "custom_sling_bag" &&
        (!item.customNameToPrint || item.customNameToPrint.trim() === "")
    );
    if (invalidSlingBags.length > 0) {
      const productNames = invalidSlingBags.map((item) => item.name).join(", ");
      Swal.fire({
        icon: "error",
        title: "Invalid Order!",
        text: `Please provide a name for the following custom sling bag products: ${productNames}`,
        confirmButtonText: "OK",
      });
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    const orderData = {
      shippingInfo: {
        ...formData,
        fullName,
        // email,
      },
      orderItems: cartItems,
      paymentMethod: paymentMode,
      itemsPrice: subtotal,
      taxAmount: 0,
      shippingAmount: 0,
      discountAmount: discountAmount,
      totalAmount: totalAmount,
      couponCode: appliedCoupon?.code || "",
      couponDiscountType: appliedCoupon?.discountType || "",
      couponDiscountValue: appliedCoupon?.discountValue || 0,
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
                  <label htmlFor="lastName" className="non-mandatory">
                    Last Name
                  </label>
                  <input
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
                    value={formData?.phoneNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onInput={handleBlur}
                  />
                  {touched?.phoneNo &&
                    !(
                      indiaPhoneRegex.test(formData?.phoneNo.trim()) ||
                      uaePhoneRegex.test(formData?.phoneNo.trim())
                    ) && (
                      <div className="text-danger">
                        Invalid phone number format
                        {formData?.phoneNo.trim().startsWith("0") && (
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
                    value={formData?.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched?.email && !emailRegex.test(formData?.email) && (
                    <div className="text-danger">Invalid email format</div>
                  )}
                </fieldset>
              </div>

              <fieldset className="fieldset mb-3">
                <label htmlFor="zipCode">Pin Code</label>
                <input
                  required
                  type="text"
                  id="zipCode"
                  maxLength="6"
                  value={formData.zipCode}
                  onChange={handleZipCodeChange}
                  onBlur={() => setTouched({ ...touched, zipCode: true })}
                />
                {touched.zipCode && !formData.zipCode && (
                  <div className="text-danger">Pin Code is required</div>
                )}
                {touched.zipCode && formData.zipCode && formData.zipCode.length !== 6 && (
                  <div className="text-danger">PIN code must be 6 digits</div>
                )}
                {touched.zipCode &&
                  formData.zipCode &&
                  formData.zipCode.length === 6 &&
                  !indianPinCodeRegex.test(formData.zipCode) && (
                    <div className="text-danger">
                      Enter a valid Indian PIN code
                    </div>
                  )}
              </fieldset>

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
          <Suspense fallback={<FullScreenSpinner />}>
            <CartFooter
              cartItems={cartItems}
              subtotal={subtotal}
              discountAmount={discountAmount}
              totalAmount={totalAmount}
              appliedCoupon={appliedCoupon}
              setAppliedCoupon={setAppliedCoupon}
              formData={formData}
              // email={email}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
