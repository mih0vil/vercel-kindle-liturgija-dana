/**
 * Pretvaranje stringa u base64. Koristi se za pretvorbu primljenog HTML dokumenta
 * @param html
 * @param encoding
 */
function convertStringToBase64(html: string, encoding: BufferEncoding = 'utf-8') {
    const buffer = Buffer.from(html, encoding);
    return buffer.toString('base64');
}


/**
 * Slanje emaila s HTML dokumentom kao privitkom putem Postmark API
 * @param html
 * @param period
 * @param recepient
 */
export async function sendEmail(html: string, period: string, recepient: string) {
    const content = convertStringToBase64(html);
    const from = process.env.SENDER ?? 'postavi email adresu';
    const apiKey = process.env.API_KEY ?? 'postavi api key';
    const naslov = `Liturgija dana ${period}`;

    const endpoint = 'https://api.postmarkapp.com/email';
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": apiKey,
    };
    const data = {
        "From": from,
        "To": "",
        // "Cc": "copied@example.com",
        "Bcc": recepient,
        "Subject": naslov,
        "Tag": "Digest",
        // "HtmlBody": "<b>Hello</b> <img src=\"cid:image.jpg\"/>",
        "TextBody": `Liturgijsko čitanje dana poslano s aplikacije ${process.env.BASE_URL} \n\n\n\n\n`,
        // "ReplyTo": "reply@example.com",
        "TrackOpens": true,
        "TrackLinks": "None",
        "Attachments": [
            {
                "Name": `${naslov}.html`,
                "Content": content,
                "ContentType": "text/html"
            },
        ],
        // "Metadata": {
        //     "color":"blue",
        //     "client-id":"12345"
        // },
        // "MessageStream": "outbound"
        "MessageStream": "broadcast"
    };
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    };

    try {
        const res = await fetch(endpoint, requestOptions);
        const obj = await res.json();
        if (obj.ErrorCode) {
            throw obj;
        }
        return obj;
    } catch (error) {
        console.log({error});
        throw error;
    }
}
