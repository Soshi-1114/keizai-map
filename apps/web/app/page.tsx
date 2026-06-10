import { Suspense } from "react";
import { MainView } from "@/components/MainView";

export default function Home() {
  return (
    <Suspense>
      <MainView />
    </Suspense>
  );
}
