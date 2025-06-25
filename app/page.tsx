import CartExample from "@/components/Cart/CartExample";
import Loading from "@/components/Loading/Loading";

import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <main className="h-full min-h-screen">
        <CartExample />
      </main>
    </Suspense>
  );
}