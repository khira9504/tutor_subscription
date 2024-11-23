import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import Stripe from 'stripe';
import { getLevelFromMetadata } from '@/feature/stripe/stripe';
import { Button } from '../ui/button';

export default function PaymentItem({ price }: { price: Stripe.Price }) {
  const product = price.product as Stripe.Product;
  const buttonVariant = getLevelFromMetadata(product.metadata) === "Special" ? "special" : "standard";

  return (
    <Card className="bg-white max-w-xs flex flex-col items-center h-[500px] hover:scale-[1.05] transition duration-300">
      <CardHeader className="space-y-2 h-32">
        <CardTitle className="text-center">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-12">
        <div className="text-xl font-bold text-gray-700">
          ￥{(price.unit_amount || 0).toLocaleString("en-US")}円 / 月
        </div>
      </CardContent>
      <CardFooter className="mt-auto w-full">
        <Button className="w-full cursor-pointer font-bold text-base" variant={buttonVariant} asChild>
          <a>コースに登録する</a>
        </Button>
      </CardFooter>
    </Card>
  );
};
