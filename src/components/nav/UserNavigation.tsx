"use client";
import { type User } from "next-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar } from "../ui/avatar";
import Image from "next/image";
import { signOut } from "next-auth/react";

type UserNavigationProps = {
  user: Pick<User, "name" | "image" | "email">
}

export default async function UserNavigation({ user }: UserNavigationProps) {
  const handleClick = async() => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex items-center space-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="w-[40px] h-[40px] border-2 border-gray-200 shadow-lg">
            <Image width={40} height={40} src={user.image || "/avatar/noImage.jpeg"} alt="user image" />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white p-2" align="end">
          <div className="w-[250px] flex flex-col items-center pt-2 pb-6">
            <Avatar className="w-[120px] h-[120px] border-2 border-gray-200 shadow-lg">
              <Image width={120} height={120} src={user.image || "/avatar/noImage.jpeg"} alt="user image" />
            </Avatar>
            <div className="my-2 text-base">{user.name || ""}</div>
            <div className="text-sm">{user.email || ""}</div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <button className="w-full text-left" onClick={async () => handleClick()}>ログアウト</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
