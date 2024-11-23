import { getTutorListById } from "@/feature/prisma/getTutorListById";
import { notFound } from "next/navigation";
import { TutorAccessLevelType } from "@prisma/client";
import Image from "next/image";
import type { Metadata } from "next";

// export async function generateMetaData({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
//   const { id } = await params;
//   const tutor = await getTutorListById(id);
//   return {
//     title: `aa${tutor?.title} | ジガクル | オンライン家庭教師のサブスク`,
//     description: `${tutor?.content}--ジガクルは月額定額の家庭教師サブスクです。お好きなプランからレベルに合わせたオンライン学習をサポートします。`,
//   };
// };

export const metadata: Metadata = {
  title: "講師紹介 | ジガクル | オンライン家庭教師のサブスク",
  description: "ジガクルは月額定額の家庭教師サブスクです。お好きなプランからレベルに合わせたオンライン学習をサポートします。",
};

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tutor = await getTutorListById(id);
  if(!tutor) {
    notFound();
  };

  return (
    <main className="max-w-screen-md mx-auto pb-10">
      <div className="bg-white border-2 rounded pt-4 pb-12 flex flex-col space-y-12 shadow-sm items-center p-12">
        <div className="relative w-[480px] h-[480px] border-2 flex-shrink-0 z-0">
          {tutor.accessLevel === TutorAccessLevelType.Special && (
            <div className="absolute bg-special text-base px-1 z-50">SPECIAL</div>
          )}
          {tutor.accessLevel === TutorAccessLevelType.Standard && (
            <div className="absolute bg-standard text-base px-1 z-50">STANDARD</div>
          )}
          <Image className="object-cover" src={tutor.image || "/images/no-image.jpeg"} fill sizes="480px" alt={"tutor image"} />
        </div>
        <div className="w-[480px]">
          <h2 className="text-2xl font-bold truncate">{tutor.title}</h2>
          <p className="text-gray-500 text-sm pt-2">担当教科：{tutor.subject}</p>
          <p className="text-gray-500 text-sm pt-2">担当時間：{tutor.time}</p>
          <p className="text-gray-500 text-sm pt-2 mb-6">担当曜日：{tutor.week}</p>
          <p className="text-gray-500 text-sm pt-2">{tutor.content}</p>
        </div>
      </div>
    </main>
  );
};
