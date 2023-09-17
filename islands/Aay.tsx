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
  const [mofasser, setMofasser] = useState("saadi");
  const [responseStatus, setResponseStatus] = useState(200)
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
    const {status, ayats} = await resp.json();
    setResponseStatus(status)
    setSoraNumber(soraNumber);
    setAyats(ayats);
    setArabicSoraName(ayats[0].sora_name_ar);
    setAyatsRang({
      from: Number(ayatsFrom),
      to: ayatsTo
        ? Number(ayatsFrom) + (ayats.length - 1)
        : Number(ayatsFrom),
    });
    setOnWorking(false);
    setAyaTafseer({});
    
    
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
  const getAyaTafseer = async (soraNumber: any, ayaNumber: any) => {
    const  mofaserName = document.getElementById("mofasser")?.value || "saadi";
    setMofasser(mofaserName)
    const response = await fetch(`api/tafseer/${mofaserName}?sora=${soraNumber}&aya=${ayaNumber}`);
    setAyaTafseer(await response.json());
  };
  const changemofasser = async  ()=>{

    await getAyaTafseer(soraNumber,ayatsRang.from)
    
  }
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
      <div className={tw`text-center`}>{onWorking && responseStatus == 200 ? <Spinner /> : ( responseStatus == 200 ? "" : (<span className={tw`bg-red-200 text-red-500 rounded-md p-3 text-center`}>يبدو ان هناك مشكلة ما</span>))}</div>
      {ayats && arabicSoraName && responseStatus == 200
        ? (
          <div>
            <div
              className={tw`w-2xl font-lateef pb-10`}
              style="background: #fff8ee; font-family: f1 !important; text-align-last: center"
              id="aya"
            >
              <div className={tw`relative`}>
                <img src="./bg.png" className={tw``} />
                <span style={`font-family: hafs`}
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
                      <b className={tw`font-extrabold`}>تفسير {{saadi:"السعدي", baghawy:"البغوي", tabary:"الطبري",
                    qortobi:"القرطبي", katheer:"ابن كثير"}[mofasser]}:</b>{" "}
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
            <select id="mofasser" className={tw`mx-5 my-3 px-5 py-2 border border-gray-200 rounded-md font-sans font-extrabold`} onChange={async (e)=>{await changemofasser(e.target.value)}}>
              <option value="saadi">السعدي</option>
              <option value="tabary">الطبري</option>
              <option value="katheer">ابن كثير</option>
              <option value="qortobi">القرطبي</option>
              <option value="baghawy">البغوي</option>
            </select>
          </div>
        )
        : ""}
    </div>
  );
}
