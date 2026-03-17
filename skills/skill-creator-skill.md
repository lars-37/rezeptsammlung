# Skill: Skill Creator

## Zweck
Erstelle, verbessere und verwalte Skills für die Rezeptsammlung-App. Ein Skill ist eine wiederverwendbare Anleitung (Markdown-Datei), die Claude beibringt, eine bestimmte Aufgabe zuverlässig auszuführen.

## Wann diesen Skill verwenden?
- Nutzer will einen neuen Skill erstellen
- Nutzer will einen bestehenden Skill verbessern oder testen
- Nutzer fragt "mach daraus einen Skill" nach einem gelungenen Workflow
- Nutzer will wissen, welche Skills sinnvoll wären

## Skill-Verzeichnis
Alle Skills liegen unter:
```
projekt_1/skills/
├── ci-skill.md           # Corporate Identity / Farben
├── skill-creator-skill.md # Dieser Skill (Meta-Skill)
└── [weitere-skills].md
```

## Skill-Vorlage

Jeder neue Skill folgt dieser Struktur:

```markdown
# Skill: [Name]

## Zweck
Was macht dieser Skill? (1-2 Sätze)

## Wann verwenden?
- Konkrete Auslöser / Trigger-Phrasen
- Situationen, in denen der Skill hilft

## Voraussetzungen
- Benötigte npm-Pakete, APIs, Tools
- Abhängigkeiten zu anderen Skills

## Anleitung
Schritt-für-Schritt-Workflow:
1. ...
2. ...
3. ...

## Beispiele
Input → Output Beispiele für typische Anwendungsfälle

## CI-Konformität
Verwende immer die Farben aus `skills/ci-skill.md`:
- Primär: #8CA0B8 (Blau)
- Buttons/Aktionen: #5A7A9E / #4A6580
- Akzente: #00AEEF (Hellblau)
- Sterne/Highlights: #00AEEF
```

## Workflow: Neuen Skill erstellen

### 1. Intent klären
Frage den Nutzer:
- Was soll der Skill können?
- Wann soll er ausgelöst werden?
- Was ist das erwartete Ergebnis?

### 2. Skill schreiben
- Verwende die Vorlage oben
- Halte die Anleitung unter 200 Zeilen — knapp und präzise
- Erkläre das **Warum** hinter den Anweisungen, nicht nur das Was
- Vermeide übermäßig strenge MUST/NEVER-Regeln — erkläre stattdessen die Begründung

### 3. Testen
- Formuliere 2-3 realistische Test-Prompts
- Führe sie aus und prüfe das Ergebnis
- Frage den Nutzer: "Passt das so, oder soll ich etwas anpassen?"

### 4. Iterieren
- Feedback einarbeiten
- Erneut testen
- Wiederholen bis der Nutzer zufrieden ist

### 5. In CLAUDE.md eintragen
Nach Fertigstellung den neuen Skill im Skills-Abschnitt der CLAUDE.md registrieren:
```markdown
## Skills
- **[skill-name]** — Kurzbeschreibung was der Skill tut
```

## Bestehende Skills verbessern

1. Skill-Datei lesen und verstehen
2. Konkretes Problem identifizieren (triggert nicht, falsches Ergebnis, unvollständig)
3. Gezielte Änderung vornehmen — nicht alles umschreiben
4. Mit denselben Test-Prompts erneut prüfen

## Skill-Ideen für die Rezeptsammlung

| Skill | Beschreibung | Priorität |
|---|---|---|
| **pdf** | Rezepte als PDF exportieren | ✅ Umgesetzt |
| **ci** | Corporate Identity Farben | ✅ Umgesetzt |
| **import-url** | Rezept von URL importieren (Chefkoch etc.) | Hoch |
| **backup** | localStorage als JSON sichern/wiederherstellen | Hoch |
| **supabase** | Migration von localStorage zu Supabase | Mittel |
| **i18n** | Mehrsprachigkeit (DE/EN) | Niedrig |

## Tipps für gute Skills

- **Spezifisch statt generisch** — ein Skill pro Aufgabe, nicht ein Mega-Skill für alles
- **Beispiele einbauen** — ein gutes Beispiel sagt mehr als zehn Regeln
- **CI beachten** — jeder Skill, der UI oder Dokumente erzeugt, nutzt die Farben aus ci-skill.md
- **Abhängigkeiten dokumentieren** — welche npm-Pakete, welche APIs werden gebraucht?
- **Generalisieren** — der Skill soll nicht nur für ein Beispiel funktionieren, sondern für viele ähnliche Anfragen
