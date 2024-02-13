"use server"
import fetchHtml from "@/app/citanje-dana/fetch-html";
import {sendEmail} from "@/app/postmark/send-email";
import {UTCDate} from "@date-fns/utc";
import {addDays, addMonths, format, formatISO, startOfMonth} from "date-fns";
import {hr} from "date-fns/locale";
import {parseDate} from "@internationalized/date";
import {availableMailsToSend} from "@/app/postmark/postmark";
import {track} from "@vercel/analytics";

export async function dohvatiPosaljiForm(previousState: Awaited<DohvatiPosaljiResp>, formData: FormData) {
    const startDate = formData.get("startDate")! as string;
    const endDate = formData.get("endDate")! as string;
    const email = formData.get("email")?.toString() ?? undefined;
    track('dohvatiPosaljiForm', {startDate, endDate, email: email ?? ''});
    const start = parseDate(startDate).toDate("UTC")
    const end = parseDate(endDate).toDate("UTC");
    const period = `${startDate} .. ${endDate}`
    if (email) {
        const stats = await availableMailsToSend();
        if (!stats.canSendManually) {
            return {
                error: "Ovaj mjesec više ne mogu slati mailove. Probaj ponovno sljedeći mjesec."
            } as DohvatiPosaljiResp
        }
    }
    return dohvatiPosalji(start, end, period, email);
}

export type DohvatiPosaljiResp = {
    html?: string
    naslov?: string
    email?: string
    emailSentAt?: string
    error?: string
}

export default async function dohvatiPosalji(start: Date, end: Date, period: string, recepient?: string) {
    const {html} = await fetchHtml(start, end);
    const naslov = `Liturgija dana ${period}`;
    if (recepient) {
        const email = await sendEmail(html ?? 'nisam uspio dohvati sadrzaj', period, recepient);
        return {
            html,
            naslov,
            emailSentAt: email.SubmittedAt,
        } as DohvatiPosaljiResp;
    } else {
        return {
            html,
            naslov
        } as DohvatiPosaljiResp;
    }
}


export async function mjesec(nadodajMjesec: number) {
    // const now = startOfToday()
    const now = new UTCDate();
    const start = startOfMonth(addMonths(now, nadodajMjesec));
    // const end = endOfMonth(start);
    const end = addDays(addMonths(start, 1), -1);
    const period = format(start, 'LLLL yyyy', {locale: hr});
    const recepient = process.env.KINDLE_EMAIL_ADDRESS ?? 'postavi email adresu kao varijablu KINDLE_EMAIL_ADDRESS';
    return await dohvatiPosalji(start, end, period, recepient);
}


export async function tjedanDanaNaKindle() {
    const now = new UTCDate();
    return await dohvatiPosalji(now, addDays(now, 8), `tjedan ${formatISO(now, {representation: 'date'})}`);
}
