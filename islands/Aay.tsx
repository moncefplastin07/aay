/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { tw } from "@twind";
import domtoimage from "https://esm.sh/dom-to-image@2.6.0";
import sowarNames from "../data/sowarNames.json" assert { type: "json" };
import { readText, writeText } from "https://deno.land/x/copy_paste/mod.ts";

export default function Counter(props: any) {
  const [ayats, setAyats] = useState([]);
  const [arabicSoraName, setArabicSoraName] = useState("");
  const [ayatsRang, setAyatsRang] = useState("");
  const [copyToClipboardStatus, setCopyToClipboardCopyStatus] = useState(null);
  const [showCopyToClipboardStatus, setShowCopyToClipboardStatus] = useState(
    false,
  );
  const getAyats = async (e) => {
    e.preventDefault();
    const soraNumber = document.getElementById("soraNumber").value;
    const ayatsRang = document.getElementById("ayatRang").value;
    const resp = await fetch(`api/sora/${soraNumber}?ayat=${ayatsRang}`);
    const soraAyats = await resp.json();
    setAyats(soraAyats);
    setArabicSoraName(soraAyats[0].sora_name_ar);
    setAyatsRang(ayatsRang);
  };
  const saveAs = async () => {
    const url = window.URL;
    const blob = await nodeToBlobImage();
    const link = document.createElement("a");
    link.download = `الايات (${ayatsRang}) من سورة ${arabicSoraName}`;
    link.href = url.createObjectURL(blob);
    link.click();
  };
  const nodeToBlobImage = async () => {
    const node = document?.getElementById("aya");
    const style = {
      transform: "scale(2)",
      transformOrigin: "top left",
      "font-family": "Lateef",
    };
    const scale = 2;
    const param = {
      height: node.offsetHeight * scale,
      width: node.offsetWidth * scale,
      quality: 1,
      style,
    };

    return await domtoimage.toBlob(
      document?.getElementById("aya"),
      param,
    );
  };
  const copyToClipboard = async () => {
    setShowCopyToClipboardStatus(true);
    setTimeout(() => {
      setShowCopyToClipboardStatus(false);
    }, 2200);
    try {
      const blob = await nodeToBlobImage();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setCopyToClipboardCopyStatus({ isCopied: true });
    } catch (error) {
      setCopyToClipboardCopyStatus({ isCopied: false });
    }
  };
  return (
    <div>
      <form onSubmit={getAyats} className={tw`text-right`}>
        <span
          className={tw`p-3 m-4 bg-green-50 border border-green-200 text-lg font-mono rounded-md font-extrabold`}
        >
          بقراءة حفص عن عاصم
        </span>
        <select
          id="soraNumber"
          className={tw`p-3 my-4 border border-gray-200 text-lg font-mono rounded-md font-extrabold`}
        >
          {sowarNames.map((sora) => (
            <option value={sora.surah}>{sora.surah} - {sora.name}</option>
          ))}
        </select>

        <input
          type="text"
          id="ayatRang"
          className={tw`h-16 p-5 w-full border border-gray-200`}
          autocomplete={`false`}
          placeholder="اكتب آية البداية ثم آية النهاية تفصل بينهما فاصلة مثل 1,26"
        />
      </form>
      {ayats && arabicSoraName
        ? (
          <div>
            <div
              className={tw`w-2xl font-lateef pb-10`}
              style="background: #fff8ee; font-family: hafs"
              id="aya"
            >
              <div className={tw`relative`}>
                <img src="./bg.png" className={tw``} />
                <span
                  className={tw` absolute inset-0 flex items-center justify-center text-5xl`}
                >
                  {arabicSoraName}
                </span>
              </div>
              <div
                className={tw`px-16 text-4xl text-center text-justify leading-normal 	`}
                dir="rtl"
                style="font-size: 2.212rem;"
              >
                {ayats.map((aya) => (
                  <span className={tw``}>
                    {aya.aya_text.replace(
                      /[\u0660-\u0669]{0,10}$/,
                      `﴿${aya.aya_no}﴾ `,
                    )}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={saveAs}
              className={tw`mx-5 my-3 px-5 py-2 border border-gray-200 rounded-md font-sans font-extrabold`}
            >
              حفظ كصورة
            </button>
            <button
              onClick={copyToClipboard}
              className={tw`mx-5 my-3 px-5 py-2 border border-gray-200 rounded-md font-sans font-extrabold relative`}
            >
              نسخ الى الحافظة
              {showCopyToClipboardStatus
                ? (copyToClipboardStatus
                  ? (
                    <span
                      className={tw`absolute bottom-10 bg-opacity-40 min-w-max mx-5 my-3  p-2 border-0 outline-none bg-white text-sm rounded-md ${
                        !copyToClipboardStatus?.isCopied
                          ? "text-red-500 border-red-200 bg-red-50"
                          : ""
                      }`}
                    >
                      {copyToClipboardStatus?.isCopied
                        ? "تم نسخ الصورة!"
                        : "تعذر نسخ الصورة حاول تحميلها على جهازك"}
                    </span>
                  )
                  : "")
                : ""}
            </button>
          </div>
        )
        : ""}
    </div>
  );
}
