"use server"
import fetchHtml from "@/app/api/scripture-today/fetch-html";
import {sendEmail} from "@/app/api/scripture-today/send-email";
import {UTCDate} from "@date-fns/utc";
import {addDays, addMonths, format, formatISO, startOfMonth} from "date-fns";
import {hr} from "date-fns/locale";

export default async function citanjeDanaKindle(from: Date, to: Date, period: string) {
    const {html} = await fetchHtml(from, to);
    const email = await sendEmail(html ?? 'nisam uspio dohvati sadrzaj', period);
    // console.log({email});
    // return `Liturgija dana ${period} \n ${html}`;
    return `Liturgija dana ${period} poslana ${email.SubmittedAt}  \n ${html}`;
}


export async function sljedeciMjesec() {
    // const now = startOfToday()
    const now = new UTCDate();
    const start = startOfMonth(addMonths(now, 1));
    // const end = endOfMonth(start);
    const end = addDays(addMonths(start, 1), -1);
    const period = format(start, 'LLLL yyyy', {locale: hr});
    return await citanjeDanaKindle(start, end, period);
}


export async function tjedanDanaNaKindle() {
    const now = new UTCDate();
    return await citanjeDanaKindle(now, addDays(now, 8), `tjedan ${formatISO(now, {representation: 'date'})}`);
}
