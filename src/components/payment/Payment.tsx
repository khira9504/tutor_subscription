import { getAuthSession } from "@/lib/nextauth";
import PaymentList from "./PaymentList";
import { redirect } from "next/navigation";
import { getSubscriptionByUserId, isValidSubscription } from "@/feature/stripe/stripe";
import CourseChangeForm from "./CourseChangeForm";
import { Suspense } from "react";
import { SkeletonForm } from "./SkeletonForm";
import PurchaseForm from "./PurchaseForm";

export default async function Payment({ tutorId }: { tutorId: string | undefined; }) {
  const session = await getAuthSession();
  if(!session) redirect("/login");

  const subscription = await getSubscriptionByUserId({ userId: session.user.id });
  const isActive = subscription == null ? false : isValidSubscription({ subscription });

  return (
    <div className="w-full flex justify-center space-x-4">
      <Suspense fallback={<SkeletonForm />}>
        <PurchaseForm tutorId={ tutorId } />
      </Suspense>
      {isActive ? (
        <CourseChangeForm subscription={ subscription! } />
      ) : (
        <PaymentList />
      )}
    </div>
  );
};