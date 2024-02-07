'use client'

import {tjedanDanaNaKindle} from "@/app/api/scripture-today/citanje-dana-na-kindle";
import { useFormState, useFormStatus } from "react-dom";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export default function Home() {
    // const [data, formAction] = useFormState(sljedeciMjesec, '');
    const [data, formAction] = useFormState(tjedanDanaNaKindle, '');
    // console.log({data});

    return (
        <form action={formAction} className={`w-full flex ${data ? '' : 'h-screen'} flex-col items-center justify-center`}>
            <button type={"submit"} className={"btn-primary"}>Pošalji čitanje dana na Kindle</button>
            <Podatci data={data}/>
        </form>
    );
}


function Podatci({data}: { data: string }) {
    const {pending} = useFormStatus();

    return (pending ?
            <p>Učitavam podatke sa stranice...</p>
            : <div dangerouslySetInnerHTML={{__html: data}}/>
    )
}

