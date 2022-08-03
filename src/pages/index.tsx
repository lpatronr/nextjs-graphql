import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Next.js GraphQL</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen w-screen flex-col items-center justify-center gap-8 bg-neutral-900 text-white">
        <h1 className="text-5xl text-yellow-400">Next.js GraphQL</h1>
        <Link href="/urql">
          <a className="text-3xl">
            <button className="rounded-lg bg-blue-600 px-4 py-2 shadow-2xl">urql</button>
          </a>
        </Link>
      </main>
    </>
  );
};

export default Home;
