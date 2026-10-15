# Research: Gorbis Robotlabb

## Källor som hittills hittats

1. **PappasAppar – recension publicerad 1 december 2017**  
   https://www.pappasappar.se/gorbis-robotlabb/  
   Beskriver första start, robotbyggaren, banor, insamling och hinder. Sidan innehåller sex originalskärmbilder med exempel från labbet, robotanpassning och sidovybanor.

2. **Maximumandroid – Android gameplay-video, publicerad 2 december 2017**  
   https://www.youtube.com/watch?v=tFPJx4ghxgs  
   Potentiell viktig referens för att studera rörelse, kameran och interaktioner. Videon kunde identifieras i sökresultat men gick inte att öppna direkt via verktyget.

3. **Gro Play – projektbeskrivning**  
   https://groplay.com/services/  
   Bekräftar att Gro Play skapade app-spelet åt SVT till julkalendern *Jakten på tidskristallen* från 2017.

4. **AppRecs – appbeskrivning och funktioner**  
   https://apprecs.com/ios/1299061571/julkalendern%3A-gorbis-robotlabb  
   Beskriver 24 unika banor, pussel och hinder, samlande av robotdelar, färgläggning av robotar och stöd för upp till fem sparade spel.

## Dokumenterade mekaniker från recensionen

- Första starten leder till att spelaren bygger ihop sin första robot av tre tillgängliga delar.
- Spelaren styr roboten genom underjordiska gångar; recensionen beskriver att man drar med fingret.
- En bana kan ge upp till tre robotdelar.
- Det räcker att samla minst en del för att klara en bana och låsa upp fortsatt spel.
- Ett exempel på pussel är att flytta en låda till en sensor för att öppna en dörr.
- Insamlade delar används i en maskin i labbet och går sedan att kombinera fritt.
- Robotar kan färgläggas; upp till fem sparade spel kan finnas på samma enhet.
- Originalet har 24 unika banor som blir svårare över tid.

## Bildobservationer från originalets skärmbilder

- **Meny/labb:** mörk, grågrön industriell verkstad, rör, monitorer, maskiner och en liten robot i mitten.
- **Robotbyggare:** stor robot i mitten och vertikal hylla/lista med delar på höger sida.
- **Banor:** sidovy/plattformsformat, roboten är liten jämfört med miljön; stora rör, kedjor, kugghjul, hazardytor, sensorer och starkt färgade sektioner.
- **HUD:** tre delikoner syns längst ned till vänster i flera skärmbilder.
- **Visuell ton:** skuggig 3D-miljö, metall, betong, starkt gröna/röda/lila ljusaccentfärger.

## Säkerhet kring resurser och precision

Detta repo använder egna ritade former, CSS och Canvas i stället för att kopiera SVT:s appfiler, modeller eller skärmbilder. Prototypen är en mekanisk tolkning, inte en exakt pixelkopia. Ytterligare gameplay-granskning behövs innan man kan påstå att styrning, fysik eller banlayout matchar originalet.

## Vad som behöver verifieras härnäst

- Exakt hur dragstyrningen känns (direkt dragning, waypoint eller virtuell joystick).
- Hur roboten hoppar/klättrar och hur kamera följer spelaren.
- Exakt placering och funktion för lådor, sensorer, dörrar och fällor i första banan.
- Vilka robotdelar som finns och hur maskinen låser upp dem.
- De faktiska 24 banornas layouter och progression.
