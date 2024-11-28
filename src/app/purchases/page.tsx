import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPurchaseInfo } from "@/feature/prisma/purchase";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";


export default async function page() {
  const session = await getAuthSession();
  if(!session) redirect("/login");

  const userId = session.user.id;
  const purchasesInfo = await getPurchaseInfo({ userId });
  if(purchasesInfo.length == 0) return <p>購入履歴がありませんでした</p>

  return (
    <main className="max-w-screen-md mx-auto">
      <div className="space-y-4">
        {purchasesInfo.map((p) => (
          <Card key={`purchase-${p.id}`}>
            <CardHeader>
              <CardTitle>「{p.tutor.title}」の記事の購入</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between">
              <div>
                <p>購入日: {p.createdAt as unknown as ReactNode}</p>
                <p>￥{p.amount}円</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};
