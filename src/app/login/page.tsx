import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/form/LoginForm";

export default async function page() {
  const session = await getAuthSession();
  if(session?.user) {
    redirect("/");
  };

  return (
    <main className="flex justify-center">
      <LoginForm />
    </main>
  );
};
