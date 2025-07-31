import {JSDOM} from 'jsdom';
import {addDays, differenceInDays, format} from "date-fns";
import {hr} from "date-fns/locale";
import {unstable_cache} from "next/cache";

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
        const dayOffsets = Array.from({length: diff + 1,}, (_, i) => i);
        const days = await Promise.all(
            // dayOffsets.map((dayOffset) => getHtmlForDate(addDays(from, dayOffset))));
            dayOffsets.map((dayOffset) => cachedHtmlForDate(addDays(from, dayOffset))));
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
    const response = await fetch(url, {cache: "force-cache", next: {revalidate: 60*60*24*7}});
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
    const liturgija = findLiturgijaElement(dom.window.document.body);
    if (liturgija === null) {
        const error = new Error("Failed to find liturgija element");
        console.log({error, date, url})
        return `<h1>${formattedDate}</h1>\nNisam uspio dohvatiti podatke, provjeri greške na serveru`;
    }
    cleanDom(liturgija);
    // const naslov = `${format(date, 'EEEE', {locale: hr})} ${formattedDate}`
    // const naslov = formattedDate
    // return `<!--<h1>${naslov}</h1>\n${liturgija.outerHTML}-->`
    return liturgija.outerHTML;
}

/**
 * Cachirani HTML za određeni dan
 */
const cachedHtmlForDate = unstable_cache(async (date: Date) => getHtmlForDate(date),
    [], {
        tags: ['htmlForDate'],
        revalidate: 60*60*24*7*2, //2 tjedna
})


function removeTabs(str: string) {
    return str.replace(/\t/g, '');
}

/**
 * Formatirani datum za URL od liturgije dana
 * @param date
 */
function dateForUrl(date: Date) {
    //return date of format: ponedjeljak-24-2-2025
    return format(date, "eeee-d-M-yyyy", {locale: hr})
}


const elementiLiturgije = ['imendan', 'psalam', 'evanđelje'];


/**
 * Pronađi najdublji DOM element koji ima sve potrebne elemente za čitanje
 * @param parent
 */
function findLiturgijaElement(parent: Element): Element | null {
    const text = parent.textContent?.toLowerCase();
    if (!text || !elementiLiturgije.every(t => text.includes(t))) return null;
    //ako netko od djece ima sve potrebne elemente citanja, onda vrati to dijete
    for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        const res = findLiturgijaElement(child);
        if (res) return res;
    }
    return parent;
}

/**
 * Makni elemente koji imaju samo neke praznine
 * @param parent
 */
function cleanDom(parent: Node) {
    const q = [] as Node[]
    parent.childNodes.forEach(child => {
        if (child.nodeName !== 'BR' && (!child.textContent || child.textContent.trim().length < 2)) {
            q.push(child)
        } else {
            cleanDom(child);
        }
    })
    q.forEach(node => node.parentNode?.removeChild(node))
}