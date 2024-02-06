import fetchHtml from "@/app/api/scripture-today/fetch-html";
import {sendEmail} from "@/app/api/scripture-today/send-email";

export default async function citanjeDanaKindle() {
    const {html} = await fetchHtml();
    const email = await sendEmail(html ?? 'nisam uspio dohvati sadrzaj');
}