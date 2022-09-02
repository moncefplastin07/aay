/** @jsx h */
import { h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { tw } from "@twind";
import Aay from "../islands/Aay.tsx";

export default function Home() {
  return (
    <div className={tw`p-4 mx-auto max-w-screen-md`}>
      <Head>
        <title>آي - نسخ آيات سور القران الكريم على شكل صفحة كتاب (برواية حفص عن عاصم)</title>
        <link rel="stylesheet" href="./fonts/fonts.css" type="text/css" crossOrigin="anonymous"/>
      </Head>
      <Aay></Aay>
    </div>
  );
}
