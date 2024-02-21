import {UTCDate} from "@date-fns/utc";
import {format, isBefore, startOfMonth} from "date-fns";


const apiKey = process.env.API_KEY ?? 'postavi api key';

const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-Postmark-Server-Token": apiKey,
};

/**
 * Generiči GET prema Postmark API
 * @param endpoint
 */
export async function postmarkApiGet(endpoint: string) {
    const requestOptions = {
        method: 'GET',
        headers: headers,
        cache: 'no-store'
    } as RequestInit;

    try {
        const res = await fetch(endpoint, requestOptions);
        const obj = await res.json();
        if (obj.ErrorCode) {
            throw obj;
        }
        return obj as object;
    } catch (error) {
        console.log({error});
        throw error;
    }
}

/**
 * Broj poslanih poruka u tekućem mjesecu
 */
async function numberOfSentEmails() {
    const now = new UTCDate();
    const start = startOfMonth(now);
    const from = format(start, 'yyyy-MM-dd');
    const to = format(now, 'yyyy-MM-dd');
    // console.log({from, to})
    const endpoint = `https://api.postmarkapp.com/stats/outbound?fromdate=${from}&todate=${to}`;
    const {Sent: sent} = (await postmarkApiGet(endpoint)) as { "Sent": number };
    return sent;
}

export type AvailableMailsToSendResp = {
    sentMails: number;
    totalMails: number;
    scheduledMails: number;
    debugEmails: number;
    remainingMails: number;
    canSendManually: boolean;
}

/**
 * Statistika o poslanim mailovima te koliko još mailove se može poslati u tekućem mjesecu
 */
export async function availableMailsToSend() {
    const sentMails = await numberOfSentEmails();
    const totalMails = 100;
    const now = new UTCDate();
    const scheduledDate = new UTCDate(now.getUTCFullYear(), now.getUTCMonth(), 20, 3);
    const scheduledThisMonth = isBefore(now, scheduledDate);
    const scheduledAddresses = process.env.KINDLE_EMAIL_ADDRESS?.split(",")?.length ?? 0;
    const scheduledMails = scheduledThisMonth ? scheduledAddresses : 0;
    const remainingMails = totalMails - sentMails - scheduledMails;
    const debugEmails = 10;
    // const debugEmails = 100; //za simulaciju kada nemamo dostupnih poruka
    const canSendManually = remainingMails >= debugEmails;
    // console.log({scheduledThisMonth, scheduledAddresses, kindle: process.env.KINDLE_EMAIL_ADDRESS, date: now.getUTCDate(), hours: now.getHours()})
    return {
        sentMails,
        totalMails,
        remainingMails,
        scheduledMails,
        canSendManually,
        debugEmails
    } as AvailableMailsToSendResp;
}
