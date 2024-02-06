function convertStringToBase64(html: string, encoding: BufferEncoding = 'utf-8') {
    const buffer = Buffer.from(html, encoding);
    const content = buffer.toString('base64');
    return content;
}


//send POST request with headers and JSON body using fetch
export async function sendEmail(html: string) {
    const content = convertStringToBase64(html);
    const to = process.env.KINDLE_EMAIL_ADDRESS ?? 'postavi email adresu';
    const apiKey = process.env.API_KEY ?? 'postavi api key';
    // const naslov = `Liturgija dana ${new Date().toISOString()}`;
    const naslov = `Liturgija-dana-postmark`;

    const endpoint = 'https://api.postmarkapp.com/email';
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": apiKey,
    };
    const data = {
        "From": to,
        "To": to,
        // "Cc": "copied@example.com",
        // "Bcc": "blind-copied@example.com",
        "Subject": naslov,
        "Tag": "Digest",
        // "HtmlBody": "<b>Hello</b> <img src=\"cid:image.jpg\"/>",
        "TextBody": "Procitaj",
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
        "MessageStream": "outbound"
        // "MessageStream": "broadcast"
    };
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    };

    try {
        const res = await fetch(endpoint, requestOptions);
        const data = await res.json();
        console.log({data});
        return data;
    } catch (error) {
        console.log({error});
    }
}
