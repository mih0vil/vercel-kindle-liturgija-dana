import {defaultTheme, Provider} from "@adobe/react-spectrum";

/**
 * Provideri za serverske komponente
 * @param children
 * @constructor
 */
export const Providers = ({children}: React.PropsWithChildren) => (
    <Provider theme={defaultTheme} locale={"hr"}>
        {children}
    </Provider>
)