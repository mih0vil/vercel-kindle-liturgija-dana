import {defaultTheme, Provider} from "@adobe/react-spectrum";

export const Providers = ({children}: React.PropsWithChildren) => (
    <Provider theme={defaultTheme} locale={"hr"}>
        {children}
    </Provider>
)