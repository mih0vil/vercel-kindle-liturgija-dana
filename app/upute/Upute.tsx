import {ActionButton, Content, Dialog, DialogTrigger, Divider, Flex, Heading, Link, View} from "@adobe/react-spectrum";
import Info from "@spectrum-icons/workflow/Info";
import ChevronRightMedium from "@spectrum-icons/ui/ChevronRightMedium";
import Image from "next/image";

import emailAdresa from "./email adresa.png";

/**
 * Komponenta s uputama o korištenju aplikacije
 * @constructor
 */
export function Upute() {
    return (
        <DialogTrigger type="modal" mobileType="tray" isDismissable >
            <ActionButton><Info/> Upute </ActionButton>
            <Dialog>
                <Heading>Upute za primarnje dokumenta s čitanjima dana na Kindle</Heading>
                <Divider />
                <Content>
                    <View>
                        Svaki Kindle ima svoju email adresu na koju možete poslati dokumente.
                        Ova aplikacija koristi tu mogućnost pa čitanja dana šalje kao dokument putem elektroničke pošte
                        na Kindle uređaj. U svrhu zaštite, Amazon je omogućio primanje dokumenata samo s nekih email adresa.
                        Stoga je potrebno nadodati email adresu koju ova aplikacija koristi kao odobrenu adresu pošiljatelja.
                        Više informacija o tome na web stranici: &quot;
                        <Link href={"https://www.amazon.com/sendtokindle/email"} target={"_blank"}>Send to Kindle for Email</Link>&quot;
                    </View>

                    <Heading level={3}>
                        Koja je email adresa mog Kindle uređaja?
                    </Heading>
                    <Divider marginBottom={"size-200"}/>
                    <View>
                        Najbolje je pratiti upute s onog prethodnog linka. One kažu da odete na:
                        <Flex direction={"row"} wrap gap={"size-100"} alignItems={"center"} marginY={"size-100"}>
                            <Link href={"https://www.amazon.com/hz/mycd/digital-console/contentlist/pdocs/dateDsc"}
                                  target={"_blank"}>Manage Your Content & Devices</Link>
                            <ChevronRightMedium/> Preferences <ChevronRightMedium/> Personal Document Settings
                        </Flex>
                    </View>
                    <View>
                        Unutar dijela {'"Personal Document Settings"'} ima poglavlje {'"Send-to-Kindle E-Mail Settings"'}
                        gdje ćete pronaći email adresu svakog vašeg registriranog Kindle uređaja.
                        To je adresa na koju će se slati dokumenti i koju trebate unijeti u ovu aplikaciju.
                    </View>

                    <Heading level={3}>
                        Odobrene email adrese
                    </Heading>
                    <Divider marginBottom={"size-200"}/>
                    <View>
                        Na gore opisanoj Amazon stranici, malo niže se nalazi poglavlje {'"Approved Personal Document E-mail List"'}
                        gdje se nalazi popis odobrenih email adresa.
                        Ovdje trebate nadodati email adresu ove aplikacije, upravo ovu sa slike niže
                        (ovako treba izgledati na Amazon stranici):
                        <Image src={emailAdresa} alt={"Email adresa"}
                               objectFit={"contain"}
                               style={{width: "100%", height: "auto", maxWidth: "23em", display: "block", marginTop: "0.5em"}}
                        />

                    </View>

                    <Heading level={3}>
                        Liturgija dana
                    </Heading>
                    <Divider marginBottom={"size-200"}/>
                    <View>
                        Liturgiju dana možete čitati na <Link href={"https://www.hilp.hr/liturgija-dana"}
                                                              target={"_blank"}>ovoj stranici</Link>.
                        Ova aplikacija vuće sadržaj od tamo. 
                        Ako nema Kindle uređaj, možete maknuti obrisati tekst email adrese Kindle-a,
                        odabrati željeni period i stisnuti gumb za slanje.
                        Aplikacija će tada povući čitanja dana za svaki dan tog perioda te ih ispisati na dnu aplikacije.
                        To onda možete putem vašeg browsera spremiti, primjerice isprintati u PDF pa to onda kasnije
                        možete pročitati u trenutcima kada vam internet nije dostupan.
                    </View>

                </Content>
            </Dialog>
        </DialogTrigger>
    );
}