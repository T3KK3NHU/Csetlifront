
# CSETLI Frontend

A **CSETLI** egy közösségi média jellegű webalkalmazás frontend része, amely **React**, **Vite** és **Bootstrap** használatával készült.  
A felület lehetővé teszi a felhasználók számára a regisztrációt, bejelentkezést, bejegyzések létrehozását, kommentelést, ismerősök kezelését, üzenetküldést, valamint profilbeállítások módosítását.

## Projekt leírása

A projekt célja egy modern, egyszerűen használható, reszponzív közösségi platform létrehozása volt.  
A frontend kommunikál a backend API-val, és kezeli a felhasználói műveletek megjelenítését, például:

- regisztráció
- bejelentkezés
- bejegyzések megjelenítése
- új bejegyzés létrehozása
- kommentelés
- reakciók kezelése
- ismerősök kezelése
- privát üzenetküldés
- profilkép módosítása
- nyelvváltás magyar és angol között

---

## Használt technológiák

- **React**
- **Vite**
- **JavaScript**
- **Bootstrap**
- **React Router DOM**
- **CSS**
- **Fetch API**
- **LocalStorage**

—
# Design
!https://imgur.com/a/1mE3Vtd



## Fő funkciók






### Kezdőoldal
- belépési pont a felhasználók számára
- navigáció regisztrációhoz, bejelentkezéshez
 és a rólunk oldalhoz
- nyelvválasztó 





### Rólunk




### Regisztráció
- felhasználónév, e-mail, jelszó megadása
- profilkép feltöltése
- kliens oldali ellenőrzések
- backend API-n keresztüli regisztráció



### Bejelentkezés
- bejelentkezés e-maillel vagy felhasználónévvel
- hitelesítés backend API segítségével
- sikeres bejelentkezés után átirányítás a főoldalra



### Főoldal / Feed
- összes bejegyzés megjelenítése
- bejegyzésekhez tartozó profilképek és képek kezelése
- hozzászólások és reakciók kezelése
- új bejegyzés létrehozása modál ablakból
- mobilbarát információs panel



### Bejegyzések
- szöveges és képes posztok megjelenítése
- hosszabb szöveg esetén „több/kevesebb megjelenítése”
- like / emoji funkció
- kommentek megjelenítése külön modálban
- saját bejegyzés törlése


### Ismerősök / Emberek oldal
- más felhasználók listázása
- követés / ismerős hozzáadása
- követés megszüntetése
- állapot mentése localStorage-ba


### Üzenetek
- ismerőslista megjelenítése
- chatszoba létrehozása
- üzenetek lekérése
- új üzenet küldése
- automatikus frissítés
- mobilon is használható elrendezés

### Beállítások
- felhasználónév módosítás
- jelszó módosítása
- profilkép módosítása
- kijelentkezés
- fiók törlése
- nyelv módosítása 


### Nyelvkezelés
- magyar és angol nyelv támogatása
- a kiválasztott nyelv localStorage-ban mentődik
- újratöltés után is megmarad

---

## Mappastruktúra

A projekt felépítése nagyjából az alábbi logikát követi:

```bash
src/
│── Components/
│   ├── BaratokCard.jsx
│   ├── Button.jsx
│   ├── KepFeltoltesCard.jsx
│   ├── Language.jsx
│   ├── Navbar.jsx
│   ├── PeopleCard.jsx
│   ├── PostCard.jsx
│   ├── TextBox.jsx
│   └── UzenetekCard.jsx
│
│── pages/
│   ├── AboutusPage.jsx
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── MainMenu.jsx
│   ├── Messages.jsx
│   ├── People.jsx
│   ├── RegistrationPage.jsx
│   └── Settings.jsx
│
│── kepek/
│── style/
│   └── style.css
│
│── api.js
│── language.js

Telepítés
1. Repository klónozása
git clone https://github.com/FreyaNahIdwin/CSSETLI_FRONTEND.git
cd CSSETLI_FRONTEND

2. Függőségek telepítése
npm install

3. Fejlesztői szerver indítása
npm run dev

Backend kapcsolat
A frontend a backend API-val kommunikál fetch segítségével.
Ha helyi környezetben szeretnéd futtatni a projektet, akkor ezt módosítanod kell a saját backend címedre, például:
export const BASE = 'http://localhost:3000'




API műveletek
A frontend az alábbi főbb backend műveleteket használja:
regisztráció
bejelentkezés
felhasználónév módosítása
profilkép módosítása
jelszó módosítása
bejegyzés létrehozása
bejegyzések lekérése
komment küldése és lekérése
emoji küldése és számlálása
ismerősök lekérése
üzenetek lekérése és küldése
kijelentkezés
fiók törlése
felhasználók listázása

Oldalak
/
Kezdőoldal
/registration
Regisztrációs oldal
/login
Bejelentkezési oldal
/about
Rólunk oldal
/mainmenu
Fő feed / bejegyzések oldala
/messages
Üzenetek oldal
/people
Felhasználók / ismerősök oldal
/settings
Beállítások oldal

Komponensek röviden
Navbar
Felső navigációs sáv ikonokkal.
Button
Egyedi gomb komponens, amely több oldalon is újrahasznosítható.
TextBox
Egységes inputmező komponens.
PostCard
Egy bejegyzés teljes megjelenítését kezeli, beleértve:
szöveg
kép
like
kommentek
törlés
PeopleCard
Felhasználói kártya az emberek oldalon.
BaratokCard
Ismerősök megjelenítése az üzenetküldő felületen.
UzenetekCard
Bal és jobb oldali üzenetbuborékok megjelenítése.
KepFeltoltesCard
Új bejegyzés létrehozására szolgáló modál.
Language
Nyelvválasztó komponens.

Stílusok
A projekt egyedi CSS-t használ a Bootstrap mellett.
Jellemző stíluselemek:
sötét témájú háttér
piros-narancs színátmenetek
lekerekített kártyák
reszponzív elrendezés
mobilbarát megjelenítés
Főbb egyedi osztályok:
background
csetliColor
csetliColor2
bombo

Nyelvi támogatás
A projekt két nyelvet kezel:
magyar
angol
A nyelvi szövegek a language.js fájlban találhatók.
A kiválasztott nyelv localStorage-ban kerül mentésre.

Reszponzivitás
A felület mobilra is optimalizált:
kisebb kijelzőkön igazított margók és betűméretek
mobilbarát üzenetoldal
rugalmas grid rendszer
automatikusan méreteződő képek



Ismert fejlesztési lehetőségek
A projekt tovább fejleszthető például az alábbi területeken:
jobb hibakezelés a frontend oldalon
egységesebb komponensnév-használat
duplikált kódrészek kiszervezése
loading állapotok és felhasználóbarátabb visszajelzések
form validációk további erősítése
jobb állapotkezelés összetettebb nézetekhez
jobb hozzáférhetőség

Repository link
Frontend repository:
CSSETLI_FRONTEND

Készítette 
Plébán Tamás
Kincses László 
Tömöri Gábor
Megjegyzés
Ez a frontend projekt backend API-ra épül, ezért önmagában nem minden funkció használható.
A teljes működéshez szükség van a hozzá tartozó backend szerverre és adatbázisra is.
Backend repository:
https://github.com/FreyaNahIdwin/CSETLI_BACKEND





