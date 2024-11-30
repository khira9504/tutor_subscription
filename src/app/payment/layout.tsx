import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <footer className="py-6 w-full text-center">
        <Button asChild size={"sm"} variant={"link"}>
          <Link href="/policy">返金ポリシーはこちら</Link>
        </Button>
      </footer>
    </>
  );
};