import {Flex,} from "@adobe/react-spectrum";
import {CitanjeDanaForma} from "@/app/citanje-dana/CitanjeDanaForma";
import {availableMailsToSend} from "@/app/postmark/postmark";
import {SentEmails} from "@/app/postmark/SentEmails";


export default async function Home() {
    const sentMailsStats = await availableMailsToSend();

    return (
        <Flex direction={"row"} justifyContent={"center"} minHeight={"100vh"} alignItems={"center"}>
            <CitanjeDanaForma sentMailsStats={sentMailsStats} SentMails={<SentEmails sentMailsStats={sentMailsStats}/>}/>
        </Flex>
    );
}

