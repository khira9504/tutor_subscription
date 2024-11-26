import React, { Suspense } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Subscription, SubscriptionLevelType } from "@prisma/client";
import { Button } from "../ui/button";
import { getAuthSession } from "@/lib/nextauth";
import { getUserById } from "@/feature/prisma/user";
import { getBillingPortalURL } from "@/feature/stripe/stripe";

export default async function CourseChangeForm({ subscription }: { subscription: Subscription }) {
  const session = await getAuthSession();
  if (!session) return null;
  const user = await getUserById({ userId: session.user.id });
  if (!user || !user.customerId) return null;

  const url = await getBillingPortalURL({ customerId: user.customerId, returnPath: "/payment"});
  const planLevel = subscription.planLevel === SubscriptionLevelType.Special ? "上級コース" : "標準コース";

  return (
    <Card className="bg-white max-w-xs flex flex-col items-center h-[500px] hover:scale-[1.05] transition duration-300">
      <CardHeader className="space-y-2 h-32">
        <CardTitle className="text-center">プラン変更</CardTitle>
      </CardHeader>
      <CardContent className="mt-12">
        <p>{`現在のプランは ${planLevel} です。`}</p>
      </CardContent>
      <CardFooter className="mt-auto w-full">
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <Button className="w-full cursor-pointer font-bold text-base" asChild>
            <a href={url}>プランを変更する</a>
          </Button>
        </Suspense>
      </CardFooter>
    </Card>
  );
};