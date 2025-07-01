# Fily – Modern File Browser Frontend

A modern, user-friendly file management system built with Next.js and Mantine UI, communicating with a Java backend.

## Features

- Secure authentication (demo: admin/admin)
- Folder navigation with breadcrumbs and smooth animations
- File upload with drag & drop support and live updates
- Direct file download
- Create new folders
- Rename files and folders
- Delete files and folders (recursive)
- Responsive design (desktop, tablet, mobile)
- Customizable color themes (8 presets)
- Dark/Light mode toggle
- Persistent settings (theme and color scheme saved)
- Fast, intuitive UI with transitions and loading indicators

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **UI Framework:** Mantine UI v8
- **Icons:** Tabler Icons
- **Backend:** Java (running on localhost:8080)

## API Endpoints

The frontend communicates with the following backend endpoints:

| Action        | HTTP Method | Route                 | Parameters                       | Description                       |
| ------------- | ----------- | --------------------- | -------------------------------- | --------------------------------- |
| List files    | GET         | `/api/files`          | `?path=folder/subfolder`         | List files and folders            |
| Upload        | POST        | `/api/files/upload`   | `file` (FormData), `path` (opt.) | Upload file to folder             |
| Download      | GET         | `/api/files/download` | `?path=filename`                 | Download file or folder           |
| Create folder | POST        | `/api/files/mkdir`    | `path=foldername`                | Create new folder                 |
| Delete        | DELETE      | `/api/files`          | `?path=folder/or/file`           | Delete file or folder (recursive) |
| Rename        | POST        | `/api/files/rename`   | `oldPath=...`, `newName=...`     | Rename file or folder             |

## Installation & Setup

### Prerequisites

- Node.js v18 or later
- Java backend running on `localhost:8080`

### Setup

```bash
# Clone the repository
git clone [your-repo-url]
cd fily-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Configuration

### Next.js Rewrites

API requests are proxied to the Java backend using Next.js rewrites:

```typescript
// next.config.ts
{
  source: '/api/:path*',
  destination: 'http://localhost:8080/api/:path*'
}
```

Update this if your backend runs on a different port.

### Theme Configuration

- 8 color schemes: blue (default), green, red, purple, orange, teal, pink, cyan
- Themes and color preferences are saved in `localStorage`
- Dark/Light mode toggle with instant update

```typescript
// Settings are stored in localStorage
localStorage.setItem("fily-color-scheme", "dark");
localStorage.setItem("fily-custom-color", "purple");
```

## Main Components

- **LoginScreen:** Simple authentication with demo credentials (`admin`/`admin`), error handling, animated background
- **FileBrowser:** Header navigation, settings, logout, file grid with transitions, modals for upload, create folder, and rename
- **Settings:** Theme switcher and color picker, persistent preferences
- **File Operations:** Upload (drag & drop), download, rename, delete, context menu
- **Responsive UI:** Works on desktop, tablet, and mobile with adaptive layout

## Security

- All API calls routed through Next.js rewrites (no CORS issues)
- File path validation on the backend
- Secure file operations and error handling

## Production Build

```bash
npm run build
npm start
```

## Contribution

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on GitHub.

---

Built with modern web technologies and attention to user experience.
