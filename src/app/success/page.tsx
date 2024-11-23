import Link from "next/link";

export default function page() {
  return (
    <div className="text-center max-w-[300px] mx-auto">
      <p className="mb-[10px]">申し込みが完了しました</p>
      <Link className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 py-[10px] block" href="/">トップへ戻る</Link>
    </div>
  );
};
