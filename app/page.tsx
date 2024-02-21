import {Flex,} from "@adobe/react-spectrum";
import {CitanjeDanaForma} from "@/app/citanje-dana/CitanjeDanaForma";
import {availableMailsToSend} from "@/app/postmark/postmark";

/**
 * Glavna stranica
 * @constructor
 */
export default async function Home() {
    const sentMailsStats = await availableMailsToSend();

    return (
        <Flex direction={"row"} justifyContent={"center"} minHeight={"100vh"} alignItems={"center"}>
            <CitanjeDanaForma sentMailsStats={sentMailsStats}/>
        </Flex>
    );
}

