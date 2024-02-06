import citanjeDanaKindle from "@/app/api/scripture-today/citanje-dana-na-kindle";

// export const runtime = 'edge'; // 'nodejs' is the default
export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET(request: Request) {
    const res = await citanjeDanaKindle()
    return new Response(res);
}
