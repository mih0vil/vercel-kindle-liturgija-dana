"use client"

import {dohvatiPosaljiForm, DohvatiPosaljiResp} from "@/app/citanje-dana/citanje-dana-na-kindle";
import {Form} from "@react-spectrum/form";
import {Badge, Button, DateRangePicker, Heading, ProgressCircle, TextField, View} from "@adobe/react-spectrum";
import {FormEvent, useEffect, useState} from "react";
import {useFormState} from "react-dom";
import {getLocalTimeZone, today} from "@internationalized/date";
import {isDev} from "@/env-vars";
import {AvailableMailsToSendResp} from "@/app/postmark/postmark";
import {Upute} from "@/app/upute/Upute";
import {DownloadHtml} from "@/app/citanje-dana/DownloadHtml";
import {SentEmails} from "@/app/postmark/SentEmails";
import {GitHubRepo} from "@/app/components/GitHubRepo";

/**
 * Loading komponenta
 * @constructor
 */
const LoadingCircle = () => (
    <View><ProgressCircle aria-label="Loading…" isIndeterminate marginEnd={"size-250"} />Obrađujem podatke...</View>
)

const emailAddressKey = "emailAddress"
const initialEmail = "@kindle.com";

/**
 * Email s kojim se inicijalizira email primatelja. Ako je zabulježen u localstorage, uzima taj.
 */
const lastEmail = () => {
    if (typeof window !== "undefined") {
        const email = localStorage.getItem(emailAddressKey);
        return email ?? initialEmail;
    } else {
        return initialEmail;
    }
}

interface CitanjeDanaFormaProps {
    sentMailsStats: AvailableMailsToSendResp
}

/**
 * Fora s glavne stranice
 * @param sentMailsStats statistika o poslanim mailovima
 * @param SentMails komponenta s info o poslanim mailovima
 * @constructor
 */
export function CitanjeDanaForma({sentMailsStats}: Readonly<CitanjeDanaFormaProps>) {
    // const {pending} = useFormStatus() //ovo ne radi
    const [pending, setPending] = useState(false)
    const [state, formAction] = useFormState(dohvatiPosaljiForm, {} as DohvatiPosaljiResp)

    const now = today(getLocalTimeZone());
    const emailPattern = isDev ? undefined : ".+@kindle\\.com";

    useEffect(() => {
        setPending(false)
    }, [state]);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        setPending(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string | null
        if (email) {
            localStorage.setItem(emailAddressKey, email)
        }
    }

    return (
        <Form maxWidth="size-6000" marginX={"size-100"}
              validationBehavior="native"
              action={formAction} onSubmit={onSubmit}>
            <Heading level={1}>
                Pošalji čitanja dana za određeni vremenski period
            </Heading>
            <View marginBottom={"size-250"}>
                Aplikacija šalje jedan dokument s čitanjima (liturgijska čitanja) dana za svaki dan odabranog
                vremenskog perioda na Kindle uređaj.
                Čitanja se šalju na Kindle e-mail adresu.
                Tako možete unaprijed preuzeti čitanja dana za neki period i spremiti ih na uređaj pa ih kasnije
                čitati bez spajanja na internet.
            </View>

            <DateRangePicker startName={"startDate"} endName={"endDate"} label="Vremenski period" isRequired
                             defaultValue={{start: now, end: now}}
                             validate={({start, end}) => {
                                 return end.compare(start)+1 <= 40 ? true : "Raspon datuma može biti najviše 40 dana"
                             }}
            />

            <TextField name={"email"} type={"email"} label="Email adresa tvog Kindle-a"
                       defaultValue={sentMailsStats.canSendManually ? lastEmail() : ""}
                       isDisabled={!sentMailsStats.canSendManually}
                       pattern={emailPattern}
                       description={"Ako želiš samo dohvatiti podatke bez slanja na Kindle, ostavi ovaj podatak praznim."}
            />
            <Button variant={"accent"} type="submit" isDisabled={pending} isPending={pending} >Pošalji na Kindle</Button>
            <SentEmails sentMailsStats={sentMailsStats}/>
            <Upute/>
            <GitHubRepo/>
            {state.html ? <DownloadHtml  content={state.html} filename={`${state.naslov}.html`}/> : <></>}

            {pending ? <LoadingCircle/> : <></>}
            {state.error ? <Badge variant="negative">{state.error}</Badge> : <></>}
            {state.emailSentAt ? <View>Email je poslan u {state.emailSentAt}</View> : <></>}
            {state.html
                ? <View>
                    <div dangerouslySetInnerHTML={{__html: state.html}}></div>
                </View>
                : <></>}
        </Form>
    );
}
