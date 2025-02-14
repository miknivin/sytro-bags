"use client";


export default function Quantity({ quantity, setQuantity }) {
  return (
    <div className="wg-quantity">
      <span
        className="btn-quantity minus-btn"
        onClick={() => setQuantity((prev) => (prev === 1 ? 1 : prev - 1))}
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
        onClick={() => setQuantity((prev) => prev + 1)}
      >
        +
      </span>
    </div>
  );
}
