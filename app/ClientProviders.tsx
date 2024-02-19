"use client";

import {useRouter} from 'next/navigation';
import {Provider, defaultTheme} from '@adobe/react-spectrum';

/**
 * Provideri za klijentske komponente
 * @param children
 * @constructor
 */
export function ClientProviders({children}: Readonly<React.PropsWithChildren>) {
    let router = useRouter();

    return (
        <Provider theme={defaultTheme} locale={"hr"} router={{navigate: router.push}}>
            {children}
        </Provider>
    );
}