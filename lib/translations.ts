export type Language = "de" | "en";

export const translations = {
  de: {
    // Header
    title: "Fily - File Browser",
    refresh: "Aktualisieren",
    logout: "Abmelden",
    settings: "Einstellungen",

    // Login
    username: "Benutzername",
    password: "Passwort",
    login: "Anmelden",
    yourUsername: "Ihr Benutzername",
    yourPassword: "Ihr Passwort",
    signInToContinue: "Melden Sie sich an, um fortzufahren",
    fillAllFields: "Bitte füllen Sie alle Felder aus",
    loginSuccessful: "Anmeldung erfolgreich!",
    invalidCredentials: "Ungültige Anmeldedaten",
    loginFailed: "Anmeldung fehlgeschlagen",

    // Navigation
    home: "Home",
    back: "Zurück",
    newFolder: "Neuer Ordner",
    uploadFile: "Datei hochladen",

    // Tooltips
    toHome: "Zur Startseite",
    createNewFolder: "Neuen Ordner erstellen",
    uploadFiles: "Dateien hochladen",
    oneStepBack: "Einen Ordner zurück",
    actions: "Aktionen",

    // File types
    folder: "Ordner",
    file: "Datei",

    // Actions
    download: "Download",
    downloadAsZip: "Als ZIP herunterladen",
    rename: "Umbenennen",
    delete: "Löschen",

    // Modals
    uploadFilesModal: "Dateien hochladen",
    createNewFolderTitle: "Neuen Ordner erstellen",
    renameTitle: "Umbenennen",
    confirmDelete: "Löschen bestätigen",

    // Form labels
    folderName: "Ordnername",
    newName: "Neuer Name",
    enterFolderName: "Ordnername eingeben",
    enterNewName: "Neuen Namen eingeben",

    // Buttons
    cancel: "Abbrechen",
    create: "Erstellen",
    save: "Speichern",

    // Upload
    dragDropFiles: "Dateien hier ablegen oder klicken zum Auswählen",
    multipleSupported: "Mehrere Dateien werden unterstützt",
    uploading: "Uploading",
    completed: "abgeschlossen",

    // Messages
    success: "Erfolg",
    error: "Fehler",
    filesCouldNotLoad: "Dateien konnten nicht geladen werden",
    connectionFailed: "Verbindung zum Server fehlgeschlagen",
    uploaded: "wurde hochgeladen",
    uploadFailed: "Upload fehlgeschlagen",
    uploadCompleted: "Upload abgeschlossen",
    filesSuccessfullyUploaded: "Dateien erfolgreich hochgeladen",
    deleted: "wurde gelöscht",
    deleteFailed: "Löschen fehlgeschlagen",
    renamed: "wurde umbenannt",
    renameFailed: "Umbenennen fehlgeschlagen",
    folderCreated: "wurde erstellt",
    folderCreateFailed: "Ordner konnte nicht erstellt werden",
    downloading: "wird heruntergeladen",
    downloadFailed: "Download fehlgeschlagen",
    zipDownloadFailed: "ZIP-Download fehlgeschlagen",

    // Delete confirmation
    deleteConfirmation: "wirklich löschen?",
    deleteWarningFolder:
      "Dieser Ordner und alle enthaltenen Dateien werden permanent gelöscht.",
    deleteWarningFile: "Diese Datei wird permanent gelöscht.",

    // Settings
    settingsTitle: "Einstellungen",
    theme: "Design",
    colorScheme: "Farbschema",
    accentColor: "Akzentfarbe",
    language: "Sprache",
    light: "Hell",
    dark: "Dunkel",
    german: "Deutsch",
    english: "English",

    // Color names for tooltips
    blue: "Blau",
    green: "Grün",
    red: "Rot",
    grape: "Lila",
    orange: "Orange",
    teal: "Türkis",
    pink: "Rosa",
    cyan: "Cyan",
  },
  en: {
    // Header
    title: "Fily - File Browser",
    refresh: "Refresh",
    logout: "Logout",
    settings: "Settings",

    // Login
    username: "Username",
    password: "Password",
    login: "Login",
    yourUsername: "Your username",
    yourPassword: "Your password",
    signInToContinue: "Sign in to continue",
    fillAllFields: "Please fill in all fields",
    loginSuccessful: "Login successful!",
    invalidCredentials: "Invalid credentials",
    loginFailed: "Login failed",

    // Navigation
    home: "Home",
    back: "Back",
    newFolder: "New Folder",
    uploadFile: "Upload File",

    // Tooltips
    toHome: "Go to home",
    createNewFolder: "Create new folder",
    uploadFiles: "Upload files",
    oneStepBack: "Go back one folder",
    actions: "Actions",

    // File types
    folder: "Folder",
    file: "File",

    // Actions
    download: "Download",
    downloadAsZip: "Download as ZIP",
    rename: "Rename",
    delete: "Delete",

    // Modals
    uploadFilesModal: "Upload Files",
    createNewFolderTitle: "Create New Folder",
    renameTitle: "Rename",
    confirmDelete: "Confirm Delete",

    // Form labels
    folderName: "Folder Name",
    newName: "New Name",
    enterFolderName: "Enter folder name",
    enterNewName: "Enter new name",

    // Buttons
    cancel: "Cancel",
    create: "Create",
    save: "Save",

    // Upload
    dragDropFiles: "Drop files here or click to select",
    multipleSupported: "Multiple files are supported",
    uploading: "Uploading",
    completed: "completed",

    // Messages
    success: "Success",
    error: "Error",
    filesCouldNotLoad: "Files could not be loaded",
    connectionFailed: "Connection to server failed",
    uploaded: "was uploaded",
    uploadFailed: "Upload failed",
    uploadCompleted: "Upload completed",
    filesSuccessfullyUploaded: "files successfully uploaded",
    deleted: "was deleted",
    deleteFailed: "Delete failed",
    renamed: "was renamed",
    renameFailed: "Rename failed",
    folderCreated: "was created",
    folderCreateFailed: "Folder could not be created",
    downloading: "is downloading",
    downloadFailed: "Download failed",
    zipDownloadFailed: "ZIP download failed",

    // Delete confirmation
    deleteConfirmation: "really delete?",
    deleteWarningFolder:
      "This folder and all contained files will be permanently deleted.",
    deleteWarningFile: "This file will be permanently deleted.",

    // Settings
    settingsTitle: "Settings",
    theme: "Theme",
    colorScheme: "Color Scheme",
    accentColor: "Accent Color",
    language: "Language",
    light: "Light",
    dark: "Dark",
    german: "Deutsch",
    english: "English",

    // Color names for tooltips
    blue: "Blue",
    green: "Green",
    red: "Red",
    grape: "Purple",
    orange: "Orange",
    teal: "Teal",
    pink: "Pink",
    cyan: "Cyan",
  },
} as const;

export type TranslationKey = keyof typeof translations.de;
