import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center space-y-4 pb-10">
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>お探しのページが見つかりませんでした</p>
      <Button asChild variant={"default"}>
        <Link href="/">戻る</Link>
      </Button>
    </main>
  );
}