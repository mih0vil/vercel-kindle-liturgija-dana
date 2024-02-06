"use server"
import fetchHtml from "@/app/api/scripture-today/fetch-html";
import {sendEmail} from "@/app/api/scripture-today/send-email";

export default async function citanjeDanaKindle() {
    const {html, date} = await fetchHtml();
    const email = await sendEmail(html ?? 'nisam uspio dohvati sadrzaj', date);
    // console.log({email});
    // return `Liturgija dana ${date} \n ${html}`;
    return `Liturgija dana ${date} poslana ${email.SubmittedAt}  \n ${html}`;
}