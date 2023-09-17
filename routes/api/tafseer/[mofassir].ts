import { HandlerContext } from "$fresh/server.ts";

export const handler = async (_req: Request, _ctx: HandlerContext) => {
  const mofassir = _ctx.params.mofassir;
  const requestURL = new URL(_req.url);
  const soraNumber : string = requestURL.searchParams.get("sora");
  const ayaNumber: string = requestURL.searchParams.get("aya");
  const response = await fetch(
    `https://tafseer.deno.dev/${mofassir}/${soraNumber}/${ayaNumber}`,
  );
  return new Response(JSON.stringify(await response.json()), {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
