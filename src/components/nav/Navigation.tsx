import { getAuthSession } from "@/lib/nextauth";
import Link from "next/link";
import UserNavigation from "./UserNavigation";

export default async function Navigation() {
  const session = await getAuthSession();

  return (
    <header className="bg-white mb-8 text-gray-800 shadow-lg">
      <div className="flex items-center justify-between h-16 px-12">
        <div className="block">
          <Link href="/" className="text-xl font-bold">ジガクル</Link>
        </div>
        <div>
          { session?.user ? (
            <UserNavigation user={ session.user } />
          ) : (
            <Link href="/login" className="rounded bg-[#313131] px-4 py-2 text-white hover:opacity-[.6]">ログイン</Link>
          )}
        </div>
      </div>
    </header>
  );
};
