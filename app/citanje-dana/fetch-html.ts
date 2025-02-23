import {JSDOM} from 'jsdom';
import {addDays, differenceInDays, format} from "date-fns";
import {hr} from "date-fns/locale";

type Response = {
    html?: string;
    date?: string;
    error?: string;
}

/**
 * Generira HTML dokument za određeno razdoblje, za svaki dan tog razdoblja
 * @param from
 * @param to
 */
export default async function generateDocument(from: Date, to: Date): Promise<Response> {
    try {
        const diff = Math.floor(differenceInDays(to, from));
        const dayOffsets = Array.from({ length: diff+1 }, (_, i) => i);
        const days = await Promise.all(
            dayOffsets.map((dayOffset) => getHtmlForDate(addDays(from, dayOffset))));
        const joinString = '\n\n\n<br/><br/><br/><hr/><br/><br/><br/>\n\n\n'
        const html = days.join(joinString);
        const sadrzaj = `<!DOCTYPE html>
            <html lang="en"><head><meta charset="utf-8"/><title>Liturgija dana</title></head><body>
                ${html}
            </body></html>
        `;
        // const sadrzaj = `${liturgija.textContent}\n\n\n${liturgija.outerHTML}`
        // console.log({sadrzaj})
        return {html: sadrzaj};
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        return {error: 'Failed to scrape data'};
    }
}

/**
 * Dohvati HTML sa stranice
 * @param formattedDate
 */
async function fetchHtmlContent(formattedDate: string) {
    // const url = `https://hilp.hr/liturgija-dana/ponedjeljak-24-2-2025/`
    const url = `https://hilp.hr/liturgija-dana/${formattedDate}/`.replace('č', 'c');
    // console.log({url})
    const response = await fetch(url, {cache: "force-cache"});
    const html = await response.text();
    return {html, url};
}

/**
 * Dohvaća HTML za određeni dan te izdvaja onaj dio koji sadrži čitanje dana
 * @param date
 */
async function getHtmlForDate(date: Date) {
    const formattedDate = dateForUrl(date);
    const {html, url} = await fetchHtmlContent(formattedDate);
    const dom = new JSDOM(removeTabs(html));
    const liturgija = dom.window.document.querySelector("#main-content .et_pb_text_inner");
    if (liturgija === null) {
        const error = new Error("Failed to find liturgija element");
        console.log({error, date, url})
        return `<h1>${formattedDate}</h1>\nNisam uspio dohvatiti podatke, provjeri greške na serveru`;
    }
    // const naslov = `${format(date, 'EEEE', {locale: hr})} ${formattedDate}`
    const naslov = formattedDate
    return `<h1>${naslov}</h1>\n${liturgija.outerHTML}`
}

function removeTabs(str: string) {
    return str.replace(/\t/g, '');
}

/**
 * Formatirani datum za URL od liturgije dana
 * @param date
 */
function dateForUrl(date: Date) {
    //return date of format: ponedjeljak-24-2-2025
    return format(date, "eeee-d-M-yyyy", { locale: hr })
}