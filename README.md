# Fily - Moderner File Browser

Ein modernes, benutzerfreundliches File-Management-System gebaut mit Next.js und Mantine UI, das mit einem Java-Backend kommuniziert.

## ✨ Features

- **🔐 Login-System** - Sichere Authentifizierung (Demo: admin/admin)
- **📁 Ordner-Navigation** - Intuitive Breadcrumb-Navigation mit Animationen
- **📤 File-Upload** - Drag & Drop Unterstützung mit Live-Updates
- **📥 File-Download** - Direkte Downloads
- **📂 Ordner erstellen** - Neue Ordner anlegen
- **✏️ Umbenennen** - Dateien und Ordner umbenennen
- **🗑️ Löschen** - Dateien und Ordner löschen (rekursiv)
- **📱 Responsive Design** - Mobile-freundliche Benutzeroberfläche
- **� Theme Customization** - 8 verschiedene Farbschemata wählbar
- **�🌙 Dark/Light Mode** - Umschaltbar mit Live-Updates
- **✨ Smooth Animations** - Schöne Hover-Effekte und Übergangsanimationen
- **💾 Persistente Einstellungen** - Theme-Auswahl wird gespeichert

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Framework**: Mantine UI v8
- **Icons**: Tabler Icons
- **Backend**: Java (läuft auf localhost:8080)

## 📋 API-Endpunkte

Das Frontend kommuniziert mit folgenden Backend-Endpunkten:

| Aktion         | HTTP-Methode | Route                 | Parameter                            | Beschreibung                       |
| -------------- | ------------ | --------------------- | ------------------------------------ | ---------------------------------- |
| Inhalt listen  | GET          | `/api/files`          | `?path=ordner/unterordner`           | Zeigt Dateien/Ordner im Zielordner |
| Upload         | POST         | `/api/files/upload`   | `file` (FormData), `path` (optional) | Datei in Zielordner hochladen      |
| Download       | GET          | `/api/files/download` | `?path=datei.jpg`                    | Datei herunterladen                |
| Ordner anlegen | POST         | `/api/files/mkdir`    | `path=ordnername`                    | Neuen Ordner anlegen               |
| Löschen        | DELETE       | `/api/files`          | `?path=ordner/oderdtei`              | Datei/Ordner löschen (rekursiv)    |
| Umbenennen     | POST         | `/api/files/rename`   | `oldPath=...`, `newName=...`         | Datei/Ordner umbenennen            |

## 🚀 Installation & Start

### Voraussetzungen

- Node.js (v18 oder höher)
- Java-Backend läuft auf `localhost:8080`

### Installation

```bash
# Repository klonen
git clone [your-repo-url]
cd fily-frontend

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die Anwendung ist dann unter `http://localhost:3000` erreichbar.

## 🔧 Konfiguration

### Next.js Rewrites

Die Anwendung verwendet Next.js Rewrites, um API-Aufrufe an das Java-Backend weiterzuleiten:

```typescript
// next.config.ts
{
  source: '/api/:path*',
  destination: 'http://localhost:8080/api/:path*'
}
```

### Backend-Verbindung

Das Frontend erwartet, dass das Java-Backend auf `localhost:8080` läuft. Falls das Backend auf einem anderen Port läuft, kann dies in der `next.config.ts` angepasst werden.

### Theme-Konfiguration

Die Anwendung unterstützt verschiedene Themes:

**Verfügbare Farbschemata:**

- Blau (Standard)
- Grün
- Rot
- Lila
- Orange
- Türkis
- Rosa
- Cyan

**Theme-Persistenz:**

```typescript
// Einstellungen werden automatisch im localStorage gespeichert
localStorage.setItem("fily-color-scheme", "dark");
localStorage.setItem("fily-custom-color", "purple");
```

**Live Theme-Updates:**
Die Theme-Änderungen werden sofort ohne Page-Reload angewendet.

## 🎨 UI-Komponenten

### LoginScreen

- Einfache Anmeldemaske mit Animationen
- Demo-Credentials: `admin` / `admin`
- Validation und Error-Handling
- Gradient-Hintergrund und Hover-Effekte

### FileBrowser

- **Header**: Navigation, Settings-Button und Logout-Button
- **Sidebar**: Schnellzugriff auf Funktionen mit Hover-Animationen
- **Main Area**: File-Grid mit Karten-Layout und Stagger-Animationen
- **Modals**: Upload, Ordner erstellen, Umbenennen mit Slide-Animationen

### Settings

- **Theme Switcher**: Dark/Light Mode mit sofortiger Aktualisierung
- **Color Picker**: 8 verschiedene Akzentfarben zur Auswahl
- **Persistent Storage**: Einstellungen werden lokal gespeichert

### File-Operationen

- **Upload**: Drag & Drop mit Mantine Dropzone und Live-Updates
- **Download**: Automatischer Download-Start
- **Context Menu**: Rechtsklick-Optionen für jede Datei/Ordner
- **Hover Effects**: Smooth Card-Animationen und Icon-Skalierung

### Animationen

- **Page Transitions**: Fade-in und Slide-up Animationen
- **Hover Effects**: Lift-Effekte für Karten und Buttons
- **Modal Animations**: Slide-up Übergänge für alle Modals
- **Loading States**: Skeleton-Loading für bessere UX

## 📱 Responsive Design

Die Anwendung ist vollständig responsive und funktioniert auf:

- Desktop (alle Breakpoints)
- Tablet (kollabierbare Sidebar)
- Mobile (optimierte Touch-Navigation)

## 🔒 Sicherheit

- Alle API-Aufrufe werden über Next.js Rewrites geleitet
- CORS-Headers sind konfiguriert
- File-Path Validation auf Backend-Seite
- Sichere File-Operationen

## 🚀 Production Build

```bash
# Production Build erstellen
npm run build

# Production Server starten
npm start
```

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit deine Änderungen (`git commit -m 'Add some amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

## 🆘 Support

Bei Fragen oder Problemen erstelle bitte ein Issue im Repository.

---

**Entwickelt mit ❤️ und modernen Web-Technologien**
