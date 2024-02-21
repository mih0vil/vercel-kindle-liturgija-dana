"use server"
import fetchHtml from "@/app/citanje-dana/fetch-html";
import {sendEmail} from "@/app/postmark/send-email";
import {UTCDate} from "@date-fns/utc";
import {addDays, addMonths, format, startOfMonth} from "date-fns";
import {hr} from "date-fns/locale";
import {parseDate} from "@internationalized/date";
import {availableMailsToSend, AvailableMailsToSendResp} from "@/app/postmark/postmark";

/**
 * Server action prima informacije s forme te vraća odgovor od {@link dohvatiPosalji}.
 * Ako je potrebno slati email, provjerava je li quota prekoračena
 * @param previousState
 * @param formData
 */
export async function dohvatiPosaljiForm(previousState: Awaited<DohvatiPosaljiResp>, formData: FormData) {
    try {
        const startDate = formData.get("startDate")! as string;
        const endDate = formData.get("endDate")! as string;
        const email = formData.get("email")?.toString() ?? undefined;
        // track('dohvatiPosaljiForm', {startDate, endDate, email: email ?? ''});
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
    } catch (error) {
        console.error('dohvatiPosaljiForm', {error})
        return {error: 'Oprostite, dogodila se greška u obradi'} as DohvatiPosaljiResp
    }
}


export type DohvatiPosaljiResp = {
    html?: string
    naslov?: string
    email?: string
    emailSentAt?: string
    sentEmailsStats?: AvailableMailsToSendResp
    error?: string
}

/**
 * Generira dokument preko {@link fetchHtml} koji se šalje na Kindle ako je unesena email adresa primatelja
 * @param start
 * @param end
 * @param period
 * @param recepient email adresa primatelja
 * @return Naslov emaila, HTML dokument i vrijeme slanja emaila
 */
export default async function dohvatiPosalji(start: Date, end: Date, period: string, recepient?: string) {
    try {
        const {html} = await fetchHtml(start, end);
        const naslov = `Liturgija dana ${period}`;
        if (recepient) {
            const email = await sendEmail(html ?? 'nisam uspio dohvati sadrzaj', period, recepient);
            const sentEmailsStats = await availableMailsToSend();
            return {
                html,
                naslov,
                emailSentAt: email.SubmittedAt,
                sentEmailsStats,
            } as DohvatiPosaljiResp;
        } else {
            return {
                html,
                naslov
            } as DohvatiPosaljiResp;
        }
    } catch (error) {
        console.error('dohvatiPosalji', {error})
        return {error: 'Oprostite, dogodila se greška u obradi'} as DohvatiPosaljiResp
    }
}

/**
 * Generira dokument za ovaj ili sljedeći mjesec
 * @param nadodajMjesec 0 za ovaj mjesec, 1 za sljedeći mjesec, N za N mjeseci nakon ovog
 */
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

