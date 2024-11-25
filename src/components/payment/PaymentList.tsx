import { getStripePrices } from "@/feature/stripe/stripe";
import PaymentItem from "./PaymentItem";

export default async function PaymentList() {
  const prices = await getStripePrices();

  return (
    <>
      {prices.map((price, idx) => (
        <div key={`price-${idx}`}>
          <PaymentItem price={price} />
        </div>
      ))}
    </>
  );
};
