"use server"
import fetchHtml from "@/app/api/scripture-today/fetch-html";
import {sendEmail} from "@/app/api/scripture-today/send-email";

export default async function citanjeDanaKindle(from: Date, to: Date, period: string) {
    const {html} = await fetchHtml(from, to);
    const email = await sendEmail(html ?? 'nisam uspio dohvati sadrzaj', period);
    // console.log({email});
    // return `Liturgija dana ${period} \n ${html}`;
    return `Liturgija dana ${period} poslana ${email.SubmittedAt}  \n ${html}`;
}