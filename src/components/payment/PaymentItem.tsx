import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import Stripe from 'stripe';
import { Suspense } from 'react';
import { Skeleton } from '../ui/skeleton';
import PaymentButton from './PaymentButton';

export default function PaymentItem({ price }: { price: Stripe.Price }) {
  const product = price.product as Stripe.Product;

  return (
    <Card className="bg-white max-w-xs flex flex-col items-center h-[500px]">
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
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <PaymentButton price={ price } />
        </Suspense>
      </CardFooter>
    </Card>
  );
};
