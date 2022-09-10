import { HandlerContext } from "$fresh/server.ts";

export const handler = async (_req: Request, _ctx: HandlerContext) => {
  const soraNumber = _ctx.params.num;
  const db_: [] = JSON.parse(await Deno.readTextFile("./data/sowar.json"));
  const sora = db_.filter((el) => {
    return el.sora == soraNumber ? el : "";
  });
  const requestURL = new URL(_req.url);
  const ayat: string = requestURL.searchParams.get("ayat");
  if (ayat) {
    const [start, to] = ayat.split(",");
    const ayats = sora.filter((el) => {
      // console.log(to , ">=", el.aya_no)
      return Number(start) <= el.aya_no ? el : "";
    }).filter((el) => Number(to) >= el.aya_no ? el : "");
    return new Response(JSON.stringify(ayats), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify(sora), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
