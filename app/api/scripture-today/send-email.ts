function convertStringToBase64(html: string, encoding: BufferEncoding = 'utf-8') {
    const buffer = Buffer.from(html, encoding);
    return buffer.toString('base64');
}


//send POST request with headers and JSON body using fetch
export async function sendEmail(html: string, date: string='') {
    const content = convertStringToBase64(html);
    const from = process.env.SENDER ?? 'postavi email adresu';
    const to = process.env.KINDLE_EMAIL_ADDRESS ?? 'postavi email adresu';
    const apiKey = process.env.API_KEY ?? 'postavi api key';
    // const naslov = `Liturgija dana ${new Date().toISOString()}`;
    const naslov = `Liturgija dana ${date}`;

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
        "Bcc": to,
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
