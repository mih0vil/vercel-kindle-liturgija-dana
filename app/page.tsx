'use client'

import citanjeDanaKindle from "@/app/api/scripture-today/citanje-dana-na-kindle";
import { useFormState } from "react-dom";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export default function Home() {
    const [data, formAction] = useFormState(citanjeDanaKindle, '');
    // console.log({data})
    return (
        <form action={formAction} className={`w-full flex ${data ? '' : 'h-screen'} flex-col items-center justify-center`}>
            <button type={"submit"} className={"btn-primary"}>Pošalji čitanje dana na Kindle</button>
            <div dangerouslySetInnerHTML={{__html: data}}/>
        </form>
    );
}
