import { Subscription, SubscriptionLevelType } from '@prisma/client'
import { Table, TableBody, TableCell, TableRow } from '../ui/table';
import { getShippingByCustomerId, isValidSubscription } from '@/feature/stripe/stripe';


export const getSubscriptionDetails = (subscription: Subscription | null) => {
  const name = subscription === null || !isValidSubscription({ subscription }) ? "-" : subscription.planLevel === SubscriptionLevelType.Special ? "上級コース" : "標準コース";
  const period = subscription === null || !isValidSubscription({ subscription }) ? "-" : subscription.period === "year" ? "年払い" : "月払い";
  const planName = subscription === null || !isValidSubscription({ subscription }) ? "-" : `${name}（${period}）`;
  const periodEnd = subscription === null || !isValidSubscription({ subscription }) ? "-" : subscription.currentPeriodEnd.toISOString().split("T")[0];
  const nextPeriodStart =  subscription === null || !isValidSubscription({ subscription }) ? "-" : subscription.cancelAtPeriodEnd ? "-" : periodEnd;
  const amount =  subscription === null || !isValidSubscription({ subscription }) ? "-" : subscription.cancelAtPeriodEnd ? "-" : `￥${subscription.amount.toLocaleString("en-US")}`;
  let status: string;

  if(!subscription) {
    status = "-";
  } else {
    switch (subscription.status) {
      case "active": {
        if (subscription.cancelAtPeriodEnd) {
          status = "キャンセル済み";
          break;
        };
        status = "有効";
        break;
      };
      case "trialing": {
        if (subscription.cancelAtPeriodEnd) {
          status = "お試し期間（キャンセル済み）";
          break;
        };
        status = "お試し期間";
        break;
      };
      case "past_due": {
        status = "支払いに問題が発生しています";
        break;
      };
      default: {
        status = "不明";
      };
    };
  };

  return { planName, periodEnd, nextPeriodStart, amount, status };
};

export default async function UserInformationList({ subscriptionData, customerId }: { subscriptionData: Subscription | null; customerId: string | null }) {
  let address  = "";
  if(!customerId) {
    address = "";
  } else {
    const addressInfo = await getShippingByCustomerId({ customerId: customerId });
    if(addressInfo && addressInfo.address) {
      const postalCode = addressInfo.address.postal_code;
      const state = addressInfo.address.state ?? "";
      const line1 = addressInfo.address.line1 ?? "";
      const line2 = addressInfo.address.line2 ?? "";
      address = `〒${postalCode} ${state}${line1}${line2}`;
    };
  };
  const { planName, periodEnd, nextPeriodStart, amount, status } = getSubscriptionDetails(subscriptionData);

  const rows = [
    { label: "住所", value: address },
    { label: "現在のプラン", value: planName },
    { label: "ステータス", value: status },
    { label: "有効期限", value: periodEnd },
    { label: "次回の更新日", value: nextPeriodStart },
    { label: "請求予定金額", value: amount },
  ];
  return (
    <Table>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            <TableCell align="center" className="font-medium">{row.label}</TableCell>
            <TableCell align="center">{row.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
