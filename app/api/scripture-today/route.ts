import fetchHtml from "@/app/api/scripture-today/fetch-html";

// export const runtime = 'edge'; // 'nodejs' is the default
export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET(request: Request) {
    const {html} = await fetchHtml();
    return new Response(`${html}`);
}
