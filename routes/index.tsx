/** @jsx h */
import { h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { tw } from "@twind";
import Aay from "../islands/Aay.tsx";

export default function Home() {
  return (
    <div className={tw`py-7 mx-auto max-w-screen-md text-right`}>
      <Head>
        <title>
          آي - نسخ آيات سور القران الكريم على شكل صفحة كتاب (برواية حفص عن عاصم)
        </title>
        <link
          rel="stylesheet"
          href="./fonts/fonts.css"
          type="text/css"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lateef&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        >
        </link>
      </Head>
      <span className={tw`text-xl`} style="font-family: hafs;">
        <span
          className={tw`text-3xl text-white bg-green-300 rounded-md py px-4`}
        >
          آي
        </span>{" "}
        - نسخ آيات سور القران الكريم على شكل صفحة كتاب (برواية حفص عن عاصم)
      </span>
      <Aay></Aay>
    </div>
  );
}
