'use client'

import {mjesec, tjedanDanaNaKindle} from "@/app/api/scripture-today/citanje-dana-na-kindle";
import { useFormState, useFormStatus } from "react-dom";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export default function Home() {
    return (
        <div className={"m-2 flex flex-col min-h-screen items-center justify-around"}>
            <PosaljiTjedan/>
            <PosaljiMjesec/>
        </div>
    );
}


function Podatci({data}: { data: string }) {
    const {pending} = useFormStatus();

    return (pending ?
            <p>Učitavam podatke sa stranice...</p>
            : <div dangerouslySetInnerHTML={{__html: data}}/>
    )
}

function PosaljiTjedan() {
    const [data, formAction] = useFormState(tjedanDanaNaKindle, '');

    return (
        <form action={formAction} className={`w-full flex flex-col items-center justify-center`}>
            <button type={"submit"} className={"btn-primary"}>Pošalji tjedan na Kindle</button>
            <Podatci data={data}/>
        </form>
    );

}

async function posaljiMjesec(previousState: string, formData: FormData) {
    const offset = parseInt(formData.get("brojMjeseci")!.toString());
    return mjesec(offset);
}

function PosaljiMjesec() {
    const [data, formAction] = useFormState(posaljiMjesec, '');

    return (
        <form action={formAction} className={`w-full flex flex-col items-center justify-center`}>
            <input name="brojMjeseci" type={"number"} min={0} required={true}
                   placeholder={"0 za ovaj mjesec, 1 za sljedeći mjesec"}
                   className={"w-80"}
            />
            <button type={"submit"} className={"btn-primary"}>Pošalji mjesec na Kindle</button>
            <Podatci data={data}/>
        </form>
    );

}