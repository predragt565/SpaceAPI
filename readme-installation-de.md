# SpaceAPI App – Installations- und Befehlsübersicht

Diese Anleitung beschreibt den Zweck jeder `.cmd`-Datei im SpaceAPI-Projekt und erklärt, wann sie verwendet werden sollte.

---

## **Typischer Ablauf**
1. **Entwicklung & Veröffentlichung:**  
   `publish.cmd` verwenden, um neue Image-Versionen zu bauen und hochzuladen.
2. **Bereitstellung auf einem anderen Rechner:**  
   `dockerhubpull.cmd` verwenden, um die App von Docker Hub herunterzuladen und zu starten.
3. **Lokale Dateien extrahieren (optional):**  
   `docker-extract.cmd` verwenden, um Backend-/Frontend-Dateien und `planets.json` lokal zu kopieren.
4. **App stoppen:**  
   `docker-down.cmd` verwenden, um Container zu stoppen und zu entfernen.
5. **App neu starten:**  
   `docker-restart.cmd` verwenden, um Container ohne Neubau zu starten.

---

## **1. `publish.cmd`**
- **Zweck:**  
  Baut, taggt und veröffentlicht die Backend- und Frontend-Docker-Images auf Docker Hub.
- **Wann verwenden:**  
  - Nach Änderungen am Quellcode (Backend/Frontend).
  - Wenn eine neue Image-Version (z. B. `v1.0.2`) veröffentlicht werden soll.
- **Hauptfunktionen:**  
  - Fragt nach Docker-Hub-Benutzernamen und Image-Tag.
  - Baut frische Images für Backend und Frontend.
  - Lädt die Images in dein Docker-Hub-Repository hoch.

---

## **2. `dockerhubpull.cmd`**
- **Zweck:**  
  Lädt vorgefertigte Backend- und Frontend-Images von Docker Hub herunter und startet sie lokal.
- **Wann verwenden:**  
  - Zum Bereitstellen der App auf einem Rechner, ohne den Quellcode neu zu bauen.
  - Für Produktionsbereitstellungen mit vorhandenen Images.
- **Hauptfunktionen:**  
  - Lädt Images automatisch mit dem angegebenen Docker-Hub-Benutzernamen und Tag herunter.
  - Erstellt Container und startet die App.

---

## **3. `docker-extract.cmd`**
- **Zweck:**  
  Extrahiert App-Dateien und Daten aus Docker-Images oder -Containern ins lokale Dateisystem.
- **Wann verwenden:**  
  - Wenn du eine lokale Kopie der Backend- und Frontend-Dateien aus den veröffentlichten Docker-Images benötigst.
  - Um die `planets.json` aus einem laufenden Backend-Container zu kopieren.
- **Hauptfunktionen:**  
  - Extrahiert Backend-`/app`-Dateien in `./backend`.
  - Extrahiert Frontend-Build-Dateien in `./frontend`.
  - Kopiert die aktuelle `planets.json` aus dem laufenden Backend-Container (falls vorhanden).

---

## **4. `docker-down.cmd`**
- **Zweck:**  
  Stoppt und entfernt alle laufenden Container, Netzwerke und Volumes, die mit der SpaceAPI-App verbunden sind.
- **Wann verwenden:**  
  - Vor einem Update oder Neubau von Containern.
  - Wenn du Ressourcen freigeben oder die gesamte App-Umgebung beenden möchtest.
- **Hauptfunktionen:**  
  - Führt `docker compose down` für das Projekt aus.
  - Entfernt Volumes bei Bedarf (abhängig von der Konfiguration).

---

## **5. `docker-restart.cmd`**
- **Zweck:**  
  Startet die SpaceAPI-Container neu, ohne Images neu zu bauen.
- **Wann verwenden:**  
  - Nach dem vorübergehenden Stoppen von Containern.
  - Wenn du die App mit der bestehenden Konfiguration und den Daten neu starten möchtest.
- **Hauptfunktionen:**  
  - Führt `docker compose restart` (oder vergleichbare Befehle) aus.
  - Baut oder lädt keine Images neu – verwendet lokale Images.

---
