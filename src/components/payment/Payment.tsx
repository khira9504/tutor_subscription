import { getAuthSession } from "@/lib/nextauth";
import PaymentList from "./PaymentList";
import { redirect } from "next/navigation";
import { getSubscriptionByUserId, isValidSubscription } from "@/feature/stripe/stripe";
import CourseChangeForm from "./CourseChangeForm";

export default async function Payment() {
  const session = await getAuthSession();
  if(!session) redirect("/login");

  const subscription = await getSubscriptionByUserId({ userId: session.user.id });
  const isActive = subscription === null ? false : isValidSubscription({ subscription });

  return (
    <div className="w-full flex justify-center space-x-4">
      {isActive ? (
        <CourseChangeForm subscription={ subscription! } />
      ) : (
        <PaymentList />
      )}
    </div>
  );
};