import {mjesec} from "@/app/api/scripture-today/citanje-dana-na-kindle";

// export const runtime = 'edge'; // 'nodejs' is the default
export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET(request: Request) {
    try {
        return Response.json(await mjesec(1))
    } catch (error) {
        console.error('Greska na /next-month', {error});
        return new Response('Nisam uspio', { status: 500 });
    }
}

