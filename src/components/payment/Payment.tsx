import { getStripePrices } from "@/feature/stripe/stripe";
import PaymentItem from "./PaymentItem";

export default async function Payment() {
  const prices = await getStripePrices();

  return (
    <div className="w-full flex justify-center space-x-4">
      {prices.map((price, idx) => (
        <div key={`price-${idx}`}>
          <PaymentItem price={price} />
        </div>
      ))}
    </div>
  );
};