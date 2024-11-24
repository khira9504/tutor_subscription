import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { TutorAccessLevelType } from "@prisma/client";

export default async function TutorList() {
  const getAllTutorList = async() => {
    try {
      const getLists = await prisma?.tutor.findMany({ orderBy: [{ updatedAt: "desc" }] });
      return getLists;
    } catch(err) {
      throw err;
    };
  };

  const tutors = await getAllTutorList();

  return (
    <div className="space-y-6">
      {tutors.map((tutor, i) => (
        <div key={`tutor${i}`}>
        <div className="bg-white">
          <Link href={`/tutors/${tutor.id}`} className="border-2 rounded p-4 flex space-x-4 cursor-pointer hover:scale-[1.01] transition duration-300 shadow-md hover:shadow-lg">
            <div className="relative w-40 h-40 border-2 flex-shrink-0 z-0">
              {tutor.accessLevel === TutorAccessLevelType.Special && (
                <div className="absolute bg-special text-xs px-1 z-50">上級コース</div>
              )}
              {tutor.accessLevel === TutorAccessLevelType.Standard && (
                <div className="absolute bg-standard text-xs px-1 z-50">標準コース</div>
              )}
              <Image className="object-cover" src={tutor.image || "/images/no-image.jpeg"} fill sizes="160px" alt={"tutor image"} />
            </div>
            <div className="h-40 flex-1 overflow-hidden">
              <h2 className="text-2xl font-bold truncate">{tutor.title}</h2>
              <p className="text-gray-500 text-sm pt-2">{tutor.content}</p>
            </div>
          </Link>
        </div>
        </div>
      ))}
    </div>
  );
};
