"use client";
import { setQuantityChange } from "@/redux/features/cartSlice";
import { useDispatch } from "react-redux";

export default function Quantity({ quantity, setQuantity }) {
  const dispatch = useDispatch();

  return (
    <div className="wg-quantity">
      <span
        className="btn-quantity minus-btn"
        onClick={() => {
          setQuantity((prev) => (prev === 1 ? 1 : prev - 1));
          dispatch(setQuantityChange({ isIncreasing: false }));
        }}
      >
        -
      </span>
      <input
        min={1}
        type="text"
        onChange={(e) => setQuantity(Number(e.target.value))}
        name="number"
        value={quantity}
      />
      <span
        className="btn-quantity plus-btn"
        onClick={() => {
          setQuantity((prev) => prev + 1);
          dispatch(setQuantityChange({ isIncreasing: true }));
        }}
      >
        +
      </span>
    </div>
  );
}
