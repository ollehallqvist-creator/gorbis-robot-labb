# Gorbis Robotlabb — fanrekonstruktion

En fristående, spelbar webbrekonstruktion inspirerad av SVT:s *Julkalendern: Gorbis Robotlabb* (2017). Projektet är ett fanprojekt och inte en officiell SVT-produkt.

## Testa lokalt

Öppna `index.html` i en modern webbläsare. Ingen byggprocess krävs. Three.js hämtas från CDN för riktig 3D-rendering; om CDN eller WebGL inte fungerar används den inbyggda Canvas-versionen som reserv.

## Kontroller

- **Dra med musen eller fingret** i spelrutan för att styra Gorbi genom labyrinten.
- På datorn fungerar även **WASD** eller **piltangenterna**.
- Tryck på **E**, **Enter** eller **mellanslag** för att försöka flytta lådan när du står nära den.
- Tryck på **Escape** för att pausa. Pausmenyn låter dig fortsätta, starta om eller gå tillbaka till labbet.
- **H** visar en ledtråd, **R** öppnar omstart, och **M** växlar ljudet.
- Tryck på knappen **HJÄLP** för att se kontrollerna igen.
- Tryck på knappen under spelrutan för att återvända till verkstaden.
- Klicka på reservdelsmaskinen i verkstaden för att välja delar som du hittat.
- Klicka på panelerna under roboten för att byta huvud, kropp, ben och färg.
- Klicka på **SPARFIL** högst upp för att välja mellan fem separata sparfiler.
- Öppna **HJÄLP** för att exportera en sparfil som JSON eller importera en tidigare säkerhetskopia. Importen ber om bekräftelse innan den ersätter vald sparfil.

## Funktioner i den här versionen

- Separat WebGL-renderer med Three.js: 3D-rum, riktningsstyrd ljussättning och skuggor, material, robotmodell med animerade hjul/armar, labyrintväggar, kugghjul, låda, tryckplatta, dörr samt en 3D-reservdelsmaskin med animerat handtag och utmatad del. Canvas-renderaren finns kvar som reserv om WebGL eller CDN inte är tillgängligt.
- Rubrikremsa för labbet och banorna samt klickbara komponentpilar/paneler visas som HTML-överlägg ovanpå 3D-scenen, så de inte försvinner när Canvas-reserven döljs.
- Originalinspirerad titelbild med stjärnfält, logotypbehandling, pulserande startikon och helskärmsläge.
- Välkomstrum ombyggt med djupare perspektiv, grön servicehiss, reservdelsdisplay, säkerhetsramp och golvmarkeringar.
- Robotbyggaren har en egen ljusgrå monteringsstudio med piedestal och reservdelsställ. Robotmodellen har riktningsstyrd ljussättning, skuggade emaljytor, fasade kanter och små mekaniska fästen för tydligare 3D-volym.
- Verkstad och robotbyggare med egenritad robotgrafik, sidopilar för att bläddra mellan delar och tydlig markering av vald komponent.
- Gorbi vänder sig i rörelseriktningen i labyrinten och får en enkel gångrörelse när spelaren styr.
- Robotens huvud och kropp har nu separata skuggade fasningar för tydligare mekanisk volym.
- 24 olika, procedurgenererade labyrintlayouter med perspektivritade väggar och golv.
- Sex rumsteman med separata färgpaletter och tonat omgivningsljus.
- Sju syntetiserade ljudsignaler för insamling, banavslut, låda, paketmaskin, hinder, reglage och utgång; ljudet kan stängas av och bygger inte på originalets ljudfiler.
- Samlarobjekt, tre typer av hinder, flyttbar låda, tryckplatta och utgång. Antalet hinder ökar gradvis mellan banorna, och hinder placeras inte ovanpå delar eller pusselobjekt.
- 72 samlingsdelar (24 huvuden, 24 kroppar och 24 uppsättningar ben) som låses upp genom banorna.
- 24 visuella variationer för varje delkategori, med extra antenner, paneler, linser, hjul och andra tillbehör.
- Sex varianter av låda/tryckplatta-pusslet, med olika startpositioner i slutkammaren.
- Reservdelsmaskin med ett handtag som dras ned och en separat paketlucka. Varje öppnat paket låser upp en specifik del i byggaren; tom maskin ger tydlig återkoppling.
- Robotbyggarens hylla visar de senast öppnade delarna, och endast öppnade delar kan väljas.
- Originalinspirerat banflöde: när alla tre delar samlats visas klar-dialogen direkt.
- Fem lokala sparfiler i webbläsarens `localStorage`, med JSON-export/import för säkerhetskopiering.
- Node-baserade regressionstester som kontrollerar alla 24 genererade labyrinter, robotdelarnas visuella variationer, ljudsignalerna och JavaScript-syntaxen.
- Tydlig progressionsmätare för upplåsta banor och sammanfattning i banväljaren.
- Kontextbaserade ledtrådar som ändras beroende på samlade delar och tryckplattans status.
- Bekräftelse innan omstart så att pågående framsteg inte försvinner av misstag.
- Hjälpmeny och förbättrad tangentbords-/skärmläsartext för spelrutan.
- Tangentbords- och pekstyrning utan externa bibliotek.

## Tester

Kör `node tests/check-inline-script.js`, `node tests/level-generation.test.js` och `node tests/robot-variants.test.js`, `node tests/sound-cues.test.js` och `node tests/title-screen.test.js`, `node tests/level-art.test.js`, `node tests/robot-builder.test.js`, `node tests/robot-materials.test.js`, `node tests/game-hud.test.js`, `node tests/three-renderer.test.js` med Node.js. De kontrollerar JavaScript-syntaxen, att de 24 labyrintlayouterna är unika, att alla mål går att nå, att svårighetsgraden ökar, att hinder inte överlappar objekt och att alla robotdelar har visuella varianter. GitHub Actions kör testerna vid push och pull request.

## Viktigt om likheten med originalet

Det här är fortfarande en **fanrekonstruktion**, inte en exakt 1:1-kopia. Miljöerna och roboten är ritade med egen Canvas-grafik och använder en 2.5D-perspektiveffekt i stället för originalets riktiga 3D-modeller, animationer, ljud och resurser. De 24 labyrinterna är egna banor inspirerade av den dokumenterade spelmekaniken, inte originalets ursprungliga banfiler.

## Referenser

- [PappasAppars recension från 2017](https://www.pappasappar.se/gorbis-robotlabb/) beskriver styrning genom att dra, tre samlingsdelar per bana, låda/tryckplatta, robotbyggaren och fem sparfiler.
- [Appbeskrivning och skärmbilder](https://apprecs.com/ios/1299061571/julkalendern%3A-gorbis-robotlabb) beskriver de 24 banorna och samlandet av robotdelar.
