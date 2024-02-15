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

## Što sam naučio

* Za slanje e-mailova putem aplikacije, najzgodnije je koristiti neku cloud uslugu za slanje mailova kao što je Postmark.
  * Takve usluge zahtijevaju da imaš posebnu domenu na kojoj već imaš registriranu neku email adresu.
  * Ne možeš koristiti GMail za slanje emailova
* Vercel
  * ima vlastitu usluge koje mjeri performanse stranice (page insights)
  * ima analytics s kojima možeš pratiti statistiku posjeta stranica
  * može hostati NextJS aplikacije i ima serverless NodeJS funkcije (između ostalog)
  * lagano se namjesti da commit na Git pokreće build
    * jednom sam imao neku grešku, ne sjećam se točno što, ali build nije prošao i nisam mogao doći do tih logova, 
        samo sam na Gitu vidio da nešto ne radi dobro na osnovu neke ikonice statusa. Nije me to veselilo. 
  * besplatni logovi se dosta kratko čuvaju
* NextJS
  * server actions. Ne sviđa mi se što se podatci prenose preko FormData jer nisam našao neko elegantno rješenje za
    čitanje tih podataka iz FormData u TypeScript-u. Recimo, datum se prenosi kao string pa ga trebaš pretvarati u datum.
* Adobe Spectrum
  * htio sam isprobati i neki novi UI library. Lijepo izgleda. Ali djeluje kao framework. 
    Ne potiče se korištenje standardnog CSS-a, nego se koristi njihov sistem koji koristi atribute elemenata
    i breakpointove s različitim konfiguracijama.
  * Ima isto svoj library za datume
* Datumi u Server components
  * Namučio sam se s tim datumima koji se prenose između klijentskih i serverskih komponenti.
  * Za slučaj kad ne trebaš zone, čini mi se najjednostavnije koristiti UTC na serverskoj strani.
  * Koristio sam date-fns koji ima svašta.
    * Zadnji dan u mjesecu mi je smrdao zone pa sam koristio zaobilazni put, a ne njihovu funkciju 
