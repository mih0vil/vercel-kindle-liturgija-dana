import {mjesec} from "@/app/citanje-dana/citanje-dana-na-kindle";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

/**
 * API koji se mjesecno poziva i salje dokument na Kindle
 * @param request
 * @constructor
 */
export async function GET(request: Request) {
    try {
        // track('next-month');
        return Response.json(await mjesec(1))
    } catch (error) {
        console.error('Greska na /next-month', {error});
        return new Response('Nisam uspio', { status: 500 });
    }
}

