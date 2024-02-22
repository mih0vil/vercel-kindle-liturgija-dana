import {Button, Link} from "@adobe/react-spectrum";
import Image from "next/image";
import githubLogo from "./github-mark.svg"

export const GitHubRepo = () => (
    <Link href={"https://github.com/mih0vil/vercel-kindle-liturgija-dana"} target={"_blank"}>
        <Button variant={"secondary"} width={"100%"}>
            <Image src={githubLogo} alt={"Github logo"} style={{width: "1em", height: "1em", marginRight: "0.5em"}}/>
            Izvorni kod aplikacije
        </Button>
    </Link>
)