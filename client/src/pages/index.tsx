import Head from "next/head";
import { useState } from "react";
import ImageGrid from "~/components/ImageGrid";

import { api } from "~/utils/api";

export default function Home() {
  const [pixels, setPixels] = useState<number[]>();

  api.post.camData.useSubscription(undefined, {
    onData(val) {
      console.log(val);
      setPixels(val);
    },
  });

  return (
    <>
      <Head>
        <title>Thandai</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-black sm:text-[5rem]">
            Thand<span className="text-[hsl(280,100%,70%)]">ai</span>
          </h1>
          {pixels?.length && <ImageGrid pixels={pixels} />}
        </div>
      </main>

      <div className="grid grid-cols-8 gap-0"></div>
    </>
  );
}
