
import InvoiceSection from "@/components/invoice/InvoiceSection";
import React from "react";

export default function Page({ params }) {
  const { id } = params;

  return (
    <>
      <div className="wrapper-invoice">
        <InvoiceSection orderId={id} />
      </div>
    </>
  );
}
