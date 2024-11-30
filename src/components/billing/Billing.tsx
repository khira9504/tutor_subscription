import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";
import { getUserInformation } from "@/feature/prisma/user";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import UserInformationList from "./UserInformationList";
import BillingPortalLink from "./BillingPortalLink";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Avatar } from "../ui/avatar";

type BillingProps = {
  session: Session;
};

export async function Billing({ session }: BillingProps) {
  const userInfo = await getUserInformation({ userId: session.user.id });
  if (userInfo === null) return <div>user === null</div>;

  return (
    <Card className="py-12 px-16 space-y-8">
      <CardContent>
        <div className="flex items-center">
          <div className="w-[120px]">
            <Avatar className={`w-[120px] h-[120px] border-2 border-gray-200 shadow-lg`}>
              <Image width={120} height={120} src={userInfo.image || "/avatar/noImage.jpeg"} alt="user image" />
            </Avatar>
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="font-bold text-xl">{userInfo.name}</div>
            <div className="text-base">({userInfo.email})</div>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <UserInformationList subscriptionData={userInfo.subscription} customerId={userInfo.customerId} />
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 p-4">
        <Suspense fallback={<Skeleton className="w-[325px] h-10" />}>
          <BillingPortalLink customerId={userInfo.customerId} />
        </Suspense>
        <Button asChild size={"sm"} variant={"link"}>
          <Link href="/refund-policy">返金ポリシー</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};