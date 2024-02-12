"use client"
import {Form} from "@react-spectrum/form";
import {
    Button,
    DateRangePicker,
    Flex,
    Heading,
    ProgressCircle,
    TextField,
    View
} from "@adobe/react-spectrum";
import {dohvatiPosaljiForm, DohvatiPosaljiResp} from "@/app/api/scripture-today/citanje-dana-na-kindle";
import {getLocalTimeZone, today} from "@internationalized/date";
import {useFormState} from "react-dom";
import {isDev} from "@/env-vars";
import {FormEvent, useEffect, useState} from "react";

const LoadingCircle = () => (
    <View><ProgressCircle aria-label="Loading…" isIndeterminate marginEnd={"size-250"} />Obrađujem podatke...</View>
)


export default function Home() {
    // const {pending} = useFormStatus() //ovo ne radi
    const [pending, setPending] = useState(false)
    const [state, formAction] = useFormState(dohvatiPosaljiForm, {} as DohvatiPosaljiResp)

    const now = today(getLocalTimeZone());
    const emailPattern = isDev ? undefined : ".+@kindle\\.com";
    const emailAddressKey = "emailAddress"
    const initialEmail = "@kindle.com";

    const lastEmail = () => {
        if (typeof window !== "undefined") {
            const email = localStorage.getItem(emailAddressKey);
            return email ?? initialEmail;
        } else {
            return initialEmail;
        }
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        setPending(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string | null
        if (email) {
            localStorage.setItem(emailAddressKey, email)
        }
    }

    useEffect(() => {
        setPending(false)
    }, [state]);


    return (
        <Flex direction={"row"} justifyContent={"center"} minHeight={"100vh"} alignItems={"center"}>
            <Form maxWidth="size-6000" validationBehavior="native" action={formAction} onSubmit={onSubmit}>
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
                           defaultValue={lastEmail()}
                           pattern={emailPattern}
                           description={"Ako želiš samo dohvatiti podatke bez slanja na Kindle, ostavi prazno"}
                />
                <Button variant={"accent"} type="submit" isDisabled={pending} isPending={pending} >Pošalji na Kindle</Button>

                {pending ? <LoadingCircle/> : <></>}
                {state.emailSentAt ? <View>Email je poslan u {state.emailSentAt}</View> : <></>}
                {state.html
                    ? <View>
                        <div dangerouslySetInnerHTML={{__html: state.html}}></div>
                    </View>
                    : <></>}
            </Form>
        </Flex>
    );
}

