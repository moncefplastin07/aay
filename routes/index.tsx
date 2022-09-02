/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Aay from "../islands/Aay.tsx";

export default function Home() {
  return (
    <div className={tw`p-4 mx-auto max-w-screen-md`}>
      <link
        rel="stylesheet"
        href="./fonts/fonts.css"
        type="text/css"
        crossOrigin="anonymous"
      />
      <Aay></Aay>
    </div>
  );
}
