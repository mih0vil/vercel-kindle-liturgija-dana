# Slanje čitanja dana na Kindle


Cilj mi je napraviti aplikaciju koja će slati dnevna čitanja na Kindle.
Kindle ima posebnu email adresu na koju mogu poslati privitak, primjerice .docx ili .html ili .epub.
Stoga je plan pročitati tekst s weba, izdvojiti željeni HTML element sa stranice, spremiti to kao novi HTML i poslati ga emailom.
Zapravo, bilo bi zgodno i da pošaljem u jednom dokumentu čitanja dana za cijeli tjedan.

Kroz ovaj projekt želim isprobati Bard i Vercel, a shvatio sam da moram i isprobati usluge za slanje emailove.

## Radna okolina

* NodeJS 18.19.0
* Account na https://postmarkapp.com/ radi slanja emaila

### env vars

Napraviti datoteku `.env.local` i popuniti sa željenim vrijednostima

```
API_KEY=Postmark API kljuc
KINDLE_EMAIL_ADDRESS=adrese na koje sa salje odvojene zarezom 
SENDER=adresa s koje se salje
BASE_URL=URL do aplikacije
VERCEL_URL=*.vercel.app   koristi se samo lokalno
```
