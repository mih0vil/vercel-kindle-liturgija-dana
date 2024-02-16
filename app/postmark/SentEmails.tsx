import {Content, ContextualHelp, Heading, Meter, View, Text, Flex, InlineAlert} from "@adobe/react-spectrum";
import {AvailableMailsToSendResp} from "@/app/postmark/postmark";


type SentEmailsProps = {
    sentMailsStats: AvailableMailsToSendResp
}

/**
 * Komponenta sa statistikom poslanih mailova ovoga mjeseca i informacijama koliko se još mailova može poslati
 * @param sentMailsStats
 * @constructor
 */
export async function SentEmails({sentMailsStats}: Readonly<SentEmailsProps>) {
    const variant: "critical" | "positive" | "warning" = sentMailsStats.canSendManually ? "positive" : "critical"
    return (<>
        {sentMailsStats.canSendManually ? <></> : <InlineAlert variant="negative">
            <Heading>Ovaj mjesec ne mogu više slati e-mailove</Heading>
            <Content>
                Usluga koju koristimo za slanje mailova nam nudi samo određenu količinu emailova svaki mjesec koje smo potrošili.
                Ipak, možete dohvatiti čitanja dana za neki period i spremiti to ručno na svoj uređaj pa koristiti kasnije.
                Ovaj mjesec smo poslali {sentMailsStats.sentMails} od ukupno dostupnih {sentMailsStats.totalMails} poruka.
                Planiramo do kraja mjeseca poslati još {sentMailsStats.scheduledMails} automatski generirane poruke.
                Za potrebe razvoja aplikacija uvijek ostavimo bar {sentMailsStats.debugEmails} dostupnih poruka u mjesecu.
            </Content>
        </InlineAlert>}
        <Flex direction={"row"}>
            <View>Mogu poslati još {sentMailsStats.remainingMails} mailova ovaj mjesec. Više info </View>
            <ContextualHelp variant="info">
                <Heading>Objašnjenje</Heading>
                <Content>
                    <Text>
                        Svaki mjesec se automatski šalje određen broj mailova, zbog toga treba određen broj mailova biti slobodan
                        da se mogu oni poslati. Ako nema više slobodnih mailova, pričekajte početak sljedećeg mjeseca.
                        Ovaj mjesec smo poslali {sentMailsStats.sentMails} od ukupno dostupnih {sentMailsStats.totalMails} poruka.
                        Planiramo do kraja mjeseca poslati još {sentMailsStats.scheduledMails} automatski generirane poruke.
                        Za potrebe razvoja aplikacija uvijek ostavimo bar {sentMailsStats.debugEmails} dostupnih poruka u mjesecu.
                    </Text>
                </Content>
            </ContextualHelp>
        </Flex>
        <Meter
            label="Broj poslanih e-mailova ovaj mjesec"
            valueLabel={`${sentMailsStats.sentMails} od ${sentMailsStats.totalMails} poruka`}
            value={sentMailsStats.sentMails / sentMailsStats.totalMails * 100} variant={variant}/>
    </>)
}