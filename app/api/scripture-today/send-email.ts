import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(html: string) {
    try {
        const buffer = Buffer.from(html, 'utf-8');
        const content = buffer.toString('base64');
        const to = process.env.KINDLE_EMAIL_ADDRESS ?? 'postavi email adresu';
        // const naslov = `Liturgija dana ${new Date().toISOString()}`;
        const naslov = `Liturgija dana XXX`;
        const {data, error} = await resend.emails.send({
            from: '"Liturgija dana" <onboarding@resend.dev>',
            // to: 'delivered@resend.dev',
            to: to,
            subject: naslov,
            text: 'Automatska poruka',
            attachments: [
                {content: content, filename: `${naslov}.html`,},
                // {content: content, filename: `${naslov}.txt`,},
            ],
        });
        if (error) {
            console.error({error})
            return Response.json({error});
        }

        return Response.json({data});
    } catch (error) {
        console.error({error})
        return Response.json({error});
    }
}
