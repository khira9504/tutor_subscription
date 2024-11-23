import { getAuthSession } from "@/lib/nextauth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { Avatar } from "../ui/avatar";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default async function Navigation() {
  const session = await getAuthSession();
  const handleClick = async() => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-white mb-8 text-gray-800 shadow-lg">
      <div className="flex items-center justify-between h-16 px-12">
        <div className="block">
          <Link href="/" className="text-xl font-bold">ジガクル</Link>
        </div>
        <div>
          { session?.user ? (
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="w-40 h-40 border-2 border-gray-200 shadow-lg">
                    <Image width={40} height={40} src={session.user.image || "/avatar/noImage.jpeg"} alt="user image" />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white p-2" align="end">
                  <div className="w-[250px] flex flex-col items-center pt-2 pb-6">
                    <Avatar className="w-120 h-120 border-2 border-gray-200 shadow-lg">
                      <Image width={120} height={120} src={session.user.image || "/avatar/noImage.jpeg"} alt="user image" />
                    </Avatar>
                    <div className="my-2 text-base">{session.user.name || ""}</div>
                    <div className="text-sm">{session.user.email || ""}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <button className="w-full text-left" onClick={async () => handleClick()}>ログアウト</button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/login" className="rounded bg-[#313131] px-4 py-2 text-white hover:opacity-[.6]">ログイン</Link>
          )}
        </div>
      </div>
    </header>
  );
};
