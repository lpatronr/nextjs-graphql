import { ReactNode } from "react";

export default function Body({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-900 text-white">
      <div className="bg-neutral-800">{children}</div>
    </main>
  );
}
