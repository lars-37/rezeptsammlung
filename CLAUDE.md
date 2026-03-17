# Rezeptsammlung

## Projektbeschreibung
Persönliche Rezeptsammlungs-App zum Speichern, Bewerten und Verwalten von Rezepten. Zielgruppe: Einzelnutzer, die ihre Lieblingsrezepte digital organisieren möchten.

## Technologie-Stack
- **Frontend:** React 19 + Vite 6
- **Styling:** Tailwind CSS v4 (via Vite-Plugin)
- **Persistenz:** localStorage (kein Backend)
- **Sprache:** JavaScript (JSX)

## Dateistruktur
```
├── index.html                  # Einstiegspunkt
├── vite.config.js              # Vite + Tailwind Konfiguration
├── src/
│   ├── main.jsx                # React-Mount
│   ├── App.jsx                 # Hauptkomponente, State & View-Routing
│   ├── index.css               # Tailwind-Import
│   ├── hooks/
│   │   └── useLocalStorage.js  # Persistenz-Hook
│   └── components/
│       ├── RecipeList.jsx      # Rezept-Grid-Übersicht
│       ├── RecipeCard.jsx      # Einzelne Rezeptkarte
│       ├── RecipeForm.jsx      # Formular (Hinzufügen/Bearbeiten)
│       ├── RecipeDetail.jsx    # Detailansicht
│       └── StarRating.jsx      # Stern-Bewertungskomponente
│   └── utils/
│       └── exportPdf.js        # PDF-Export mit jsPDF
├── skills/
│   ├── ci-skill.md             # Corporate Identity Farben
│   └── skill-creator-skill.md  # Skill-Erstellung & Verwaltung
```

## Skills
- **simplify** — Code-Review: prüft geänderten Code auf Qualität, Wiederverwendung und Effizienz
- **pdf** — Rezepte als PDF exportieren (z.B. Rezeptbuch erstellen)
- **xlsx** — Rezeptdaten als Spreadsheet importieren/exportieren
- **docx** — Rezepte als formatiertes Word-Dokument ausgeben
- **pptx** — Rezept-Präsentationen erstellen (z.B. Kochkurs-Slides)
- **claude-api** — KI-Features einbauen (z.B. Rezeptvorschläge, automatische Tags)
- **schedule** — Geplante Tasks erstellen (z.B. wöchentlicher Rezept-Backup)
- **skill-creator** — Eigene Skills erstellen und optimieren

## Connectoren/APIs
- **Claude Preview** — Dev-Server starten, Screenshots, Live-Vorschau im Browser
- **Google Drive** — Rezepte in Google Drive sichern/synchronisieren
- **Canva** — Rezeptbilder und -karten designen, Vorlagen erstellen
- **Hedy** — Sitzungsdaten und Session-Kontext verwalten
