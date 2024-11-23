import TutorList from "@/components/tutor/TutorList";
import { TutorListSkeleton } from "@/components/tutor/TutorListSkeleton";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="max-w-screen-md mx-auto pb-10">
      <Suspense fallback={ <TutorListSkeleton /> }>
        <TutorList />
      </Suspense>
    </main>
  );
}
