import {JSDOM} from 'jsdom';

type Response = {
    html?: string;
    error?: string;
}

const url = 'https://www.hilp.hr/liturgija-dana/'

export default async function fetchHtml(): Promise<Response> {

    try {
        const response = await fetch(url);
        const html = await response.text();
        const dom = new JSDOM(removeTabs(html));
        const liturgija = dom.window.document.querySelector(".content_txt.liturgija_txt");
        if (liturgija === null) {
            return {error: 'Failed to find liturgija element'};
        }
        liturgija.querySelector('.kalendar_left')?.remove();
        const sadrzaj = `<!DOCTYPE html>
            <html lang="en"><body>
                ${liturgija.outerHTML}  
            </body></html>
        `;
        // const sadrzaj = `${liturgija.textContent}\n\n\n${liturgija.outerHTML}`
        return {html: sadrzaj};
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        return {error: 'Failed to scrape data'};
    }
}

function removeTabs(str: string) {
    return str.replace(/\t/g, '');
}