import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { getTutorById } from "@/feature/prisma/tutor";
import { TutorAccessLevelType } from "@prisma/client";
import { SPECIAL_PRICE, STANDARD_PRICE } from "@/feature/price/price";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { getPurchaseCheckoutURL } from "@/feature/stripe/stripe";
import { Button } from "../ui/button";

export default async function PurchaseForm({ tutorId }: { tutorId: string | undefined; }) {
  if (tutorId == undefined) return null;
  const tutor = await getTutorById(tutorId);
  if (tutor == null) return null;
  const session = await getAuthSession();
  if (session == null) redirect("/login");

  const paymentUrl = (await getPurchaseCheckoutURL({ userId: session.user.id, tutor })) || "/";
  const tutorPrice = tutor?.accessLevel === TutorAccessLevelType.Special ? SPECIAL_PRICE : STANDARD_PRICE;

  return (
    <>
      <Card className="bg-white w-[320px] flex flex-col items-center h-[500px]">
        <CardHeader className="space-y-2 h-32 w-full">
          <CardTitle className="text-center w-full">1回コースの購入</CardTitle>
          <CardDescription className="w-full">{`${tutor?.title}さんのコースを一度切り購入できます`}</CardDescription>
        </CardHeader>
        <CardContent className="mt-12">
          <div className="text-xl font-bold text-gray-700">{`￥${tutorPrice.toLocaleString("en-US")}円`}</div>
        </CardContent>
        <CardFooter className="mt-auto w-full">
          <Button className="w-full cursor-pointer font-bold text-base hover:opacity-[.6]" variant={"default"} asChild>
            <a href={paymentUrl}>購入する</a>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};