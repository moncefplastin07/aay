/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { tw } from "@twind";
import domtoimage from "https://esm.sh/dom-to-image@2.6.0";
import copy from "https://esm.sh/copy-to-clipboard@3.3.2";
import { copyBlobToClipboard } from "https://esm.sh/copy-image-clipboard@2.1.2";
import sowarNames from "../data/sowarNames.json" assert { type: "json" };
import Spinner from "../components/Spinner.tsx";

export default function Counter(props: any) {
  const [ayats, setAyats] = useState([]);
  const [arabicSoraName, setArabicSoraName] = useState("");
  const [ayatsRang, setAyatsRang] = useState({});
  const [copyToClipboardStatus, setCopyToClipboardCopyStatus] = useState(null);
  const [soraNumber, setSoraNumber] = useState("");
  const [ayaTafseer, setAyaTafseer] = useState({});
  const [showCopyToClipboardStatus, setShowCopyToClipboardStatus] = useState(
    false,
  );
  const [onWorking, setOnWorking] = useState(false);
  const getAyats = async (e) => {
    e.preventDefault();
    setOnWorking(true);
    const soraNumber = document.getElementById("soraNumber").value;
    const ayatsRangInput = document.getElementById("ayatRang").value;
    const [ayatsFrom, ayatsTo] = ayatsRangInput.split(",");
    const resp = await fetch(
      `api/sora/${soraNumber}?ayat=${ayatsFrom},${
        ayatsTo ? ayatsTo : ayatsFrom
      }`,
    );
    const soraAyats = await resp.json();
    setSoraNumber(soraNumber);
    setAyats(soraAyats);
    setArabicSoraName(soraAyats[0].sora_name_ar);
    setAyatsRang({
      from: Number(ayatsFrom),
      to: ayatsTo
        ? Number(ayatsFrom) + (soraAyats.length - 1)
        : Number(ayatsFrom),
    });
    setOnWorking(false);
    setAyaTafseer({});
    console.log(Number(ayatsFrom), Number(ayatsTo));
    if (!ayatsFrom || !ayatsTo || Number(ayatsFrom) == Number(ayatsTo)) {
      await getAyaTafseer(soraNumber, ayatsFrom);
    }
  };
  const saveAs = async () => {
    const url = window.URL;
    const blob = await nodeToBlobImage();
    const link = document.createElement("a");
    link.download =
      `الايات (${ayatsRang.from}, ${ayatsRang.to}) من سورة ${arabicSoraName}`;
    link.href = url.createObjectURL(blob);
    link.click();
  };
  const getAyaTafseer = async (soraNumber, ayaNumber) => {
    const response = await fetch(`api/tafseer/${soraNumber}?aya=${ayaNumber}`);
    setAyaTafseer(await response.json());
  };
  const nodeToBlobImage = async () => {
    const node = document?.getElementById("aya");
    const style = {
      transform: "scale(2)",
      transformOrigin: "top left",
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
      await copyBlobToClipboard(blob);
      setCopyToClipboardCopyStatus({ isCopied: true });
    } catch (error) {
      setCopyToClipboardCopyStatus({ isCopied: false });
    }
  };
  return (
    <div className={tw`my-5`}>
      <form onSubmit={getAyats} className={tw`text-right mb-5`}>
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
          className={tw`h-16 p-5 w-full border border-gray-200 text-right`}
          autocomplete={`false`}
          placeholder="اكتب آية البداية ثم آية النهاية تفصل بينهما فاصلة مثل: 1,26"
        />
      </form>
      {onWorking ? <Spinner /> : ""}
      {ayats && arabicSoraName
        ? (
          <div>
            <div
              className={tw`w-2xl font-lateef pb-10 font-bold`}
              style="background: #fff8ee; font-family: hafs"
              id="aya"
            >
              <div className={tw`relative`}>
                <img src="./bg.png" className={tw``} />
                <span
                  className={tw` absolute inset-0 flex items-center justify-center lg:text-5xl text-2xl`}
                >
                  {arabicSoraName}
                </span>
              </div>
              <div
                className={tw`px-8 md:px-16 text-2xl md:text-4xl text-center text-justify leading-normal md:leading-relaxed	 	`}
                dir="rtl"
                style=""
              >
                {ayats.map((aya) => (
                  <span className={tw`text-justify`}>
                    {aya.aya_text.replace(
                      /[\u0660-\u0669]{0,10}$/,
                      `﴿${aya.aya_no}﴾ `,
                    )}
                  </span>
                ))}
                {ayaTafseer.tafseerText
                  ? (
                    <div
                      className={tw`mt-8 p-5 border-t-2 border-gray-500 text-lg text-gray-800 leading-normal`}
                      style="font-family: Lateef, cursive;"
                    >
                      <b className={tw`font-extrabold`}>تفسير السعدي:</b>{" "}
                      {ayaTafseer.tafseerText}
                    </div>
                  )
                  : ""}
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
                      className={tw`absolute -left-32 bottom-10 bg-opacity-40 min-w-max mx-5 my-3  p-2 border-0 outline-none bg-white text-sm rounded-md ${
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
