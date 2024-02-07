import {JSDOM} from 'jsdom';
import {addDays, differenceInDays, format} from "date-fns";
import {hr} from "date-fns/locale";

type Response = {
    html?: string;
    date?: string;
    error?: string;
}

export default async function fetchHtml(from: Date, to: Date): Promise<Response> {
    try {
        const diff = Math.floor(differenceInDays(to, from));
        const dayOffsets = Array.from({ length: diff+1 }, (_, i) => i);
        const days = await Promise.all(
            dayOffsets.map((dayOffset) => getHtmlForDate(addDays(from, dayOffset))));
        const joinString = '\n\n\n<br/><br/><br/><hr/><br/><br/><br/>\n\n\n'
        const html = days.join(joinString);
        const sadrzaj = `<!DOCTYPE html>
            <html lang="en"><body>
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


async function getHtmlForDate(date: Date) {
    const formattedDate = date.toISOString().slice(0, 10); // Extract up to the 10th character
    const [ year, month, day] = formattedDate.split('-');
    // const url = `https://www.hilp.hr/liturgija-dana/?god=${date.getFullYear()}&mj=${date.getMonth() + 1}&dan=${date.getDate()}`
    const url = `https://www.hilp.hr/liturgija-dana/?god=${year}&mj=${month}&dan=${day}`
    // console.log({url})
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(removeTabs(html));
    const liturgija = dom.window.document.querySelector(".content_txt.liturgija_txt");
    if (liturgija === null) {
        throw new Error("Failed to find liturgija element");
    }
    const naslov = `${format(date, 'EEEE', {locale: hr})} ${formattedDate}`
    liturgija.querySelector('.kalendar_left')?.remove();
    return `<h1>${naslov}</h1>\n${liturgija.outerHTML}`
}

function removeTabs(str: string) {
    return str.replace(/\t/g, '');
}