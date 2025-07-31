import {tjedanSljedecegMjeseca} from "@/app/citanje-dana/citanje-dana-na-kindle";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

/**
 * API koji se mjesecno poziva i salje dokument na Kindle
 * @param request
 * @constructor
 */
export async function GET(request: Request,
                          { params }: { params: Promise<{ week: number }> }) {
    try {
        const { week } = await params
        return Response.json(await tjedanSljedecegMjeseca(week))
    } catch (error) {
        console.error('Greska na /current-month', {error});
        return new Response('Nisam uspio', { status: 500 });
    }
}

