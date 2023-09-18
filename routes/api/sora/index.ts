import { HandlerContext } from "$fresh/server.ts";

export const handler = async (_req: Request, _ctx: HandlerContext) => {
  const requestURL = new URL(_req.url);
  const searchQuery: string = requestURL.searchParams.get("q");
  const db_: [] = JSON.parse(await Deno.readTextFile("./data/sowar.json"));
  const sora = db_.filter((el) => {
    return el.aya_text.match(searchQuery) || el.aya_text_emlaey.match(searchQuery) ? el : "";
  });
  
  // if (query) {
    
  //   const result = sora.filter((el) => {
  //     // console.log(to , ">=", el.aya_no)
      
  //   })
  //   return new Response(JSON.stringify({
  //     status: ayats.length > 0 ? 200 : 404,
  //     ayats
  //   }), {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  // }

  return new Response(JSON.stringify({
    status: sora.length > 0 ? 200 : 404,
    ayats: sora
  }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
