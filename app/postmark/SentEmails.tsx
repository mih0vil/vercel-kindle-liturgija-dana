"use client"

import {Content, ContextualHelp, Heading, Meter, View, Text, Flex, InlineAlert} from "@adobe/react-spectrum";
import {AvailableMailsToSendResp} from "@/app/postmark/postmark";


type SentEmailsProps = {
    sentMailsStats: AvailableMailsToSendResp
}

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
            <View>Poslano je {sentMailsStats.sentMails} mailova ovaj mjesec. Više info </View>
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
            label="Koliko mogu još e-mailova poslati ovaj mjesec"
            valueLabel={`${sentMailsStats.remainingMails} od ${sentMailsStats.totalMails} poruka`}
            value={sentMailsStats.remainingMails} variant={variant}/>
    </>)
}