"use client";

import { useEffect } from "react";

type ErrorProp = {
  err: Error & { digest?: string },
  reset: () => void;
};

export default function error({ err, reset }: ErrorProp) {
  useEffect(() => {
    console.error(err);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center">
      <h2 className="text-center">エラー</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={() => reset()}
      >
        リトライ
      </button>
    </main>
  );
};
