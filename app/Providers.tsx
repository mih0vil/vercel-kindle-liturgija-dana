import {defaultTheme, Provider} from "@adobe/react-spectrum";
import {createLocalizedStringDictionary, LocalizedStringProvider} from "@adobe/react-spectrum/i18n";


const dictionary = createLocalizedStringDictionary([
    '@react-spectrum/datepicker',
    '@react-spectrum/contextualhelp',
]);

/**
 * Provideri za serverske komponente
 * @param children
 * @constructor
 */
export const Providers = ({children}: React.PropsWithChildren) => (
    <>
        <LocalizedStringProvider locale={"hr"} dictionary={dictionary}/>
        <Provider theme={defaultTheme} locale={"hr"}>
            {children}
        </Provider>
    </>
)
