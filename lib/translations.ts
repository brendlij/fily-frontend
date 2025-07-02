export type Language = "de" | "en" | "fr";

export const translations = {
  de: {
    // Header
    refresh: "Aktualisieren",
    logout: "Abmelden",
    settings: "Einstellungen",

    // Sort options
    sortName: "Name",
    sortType: "Typ",
    sortModified: "Geändert",
    sortSize: "Größe",
    sortAscending: "Aufsteigend",
    sortDescending: "Absteigend",
    sortBy: "Sortieren nach",

    // Login & Registration
    username: "Benutzername",
    password: "Passwort",
    confirmPassword: "Passwort bestätigen",
    login: "Anmelden",
    yourUsername: "Ihr Benutzername",
    yourPassword: "Ihr Passwort",
    confirmYourPassword: "Passwort wiederholen",
    passwordMismatch: "Passwörter stimmen nicht überein",
    signInToContinue: "Melden Sie sich an, um fortzufahren",
    fillAllFields: "Bitte füllen Sie alle Felder aus",
    loginSuccessful: "Anmeldung erfolgreich!",
    registrationSuccessful: "Registrierung erfolgreich!",
    registrationNotAllowed:
      "Registrierung nicht erlaubt, da bereits Benutzer existieren",
    createdAsAdmin: "Sie wurden als Administrator-Benutzer angelegt!",
    registrationSuccessLoginFailed:
      "Registrierung erfolgreich, aber automatischer Login fehlgeschlagen. Bitte manuell anmelden.",
    invalidCredentials: "Ungültige Anmeldedaten",
    loginFailed: "Anmeldung fehlgeschlagen",
    serverConnectionFailed:
      "Verbindung zum Server fehlgeschlagen. Bitte überprüfen Sie, ob der Server läuft.",

    // Navigation
    home: "Home",
    back: "Zurück",
    newFolder: "Neuer Ordner",
    uploadFile: "Datei hochladen",

    // Search
    fuzzySearch: "Erweiterte Suche",
    fuzzySearchDescription: "Aktiviert unscharfe Suche und Keyword-Erkennung",

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

    fileViewer: "Datei Betrachter",
    fileCouldNotLoad: "Datei konnte nicht geladen werden",
    invalidJsonFormat: "Ungültiges JSON-Format",
    unsupportedFileType: "Nicht unterstützter Dateityp",
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
    warning: "Hinweis",
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

    // Auth
    sessionExpired:
      "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.",
  },
  en: {
    // Header
    refresh: "Refresh",
    logout: "Logout",
    settings: "Settings",

    // Sort options
    sortName: "Name",
    sortType: "Type",
    sortModified: "Modified",
    sortSize: "Size",
    sortAscending: "Ascending",
    sortDescending: "Descending",
    sortBy: "Sort by",

    // Login & Registration
    username: "Username",
    password: "Password",
    confirmPassword: "Confirm Password",
    login: "Login",
    yourUsername: "Your username",
    yourPassword: "Your password",
    confirmYourPassword: "Confirm your password",
    passwordMismatch: "Passwords do not match",
    signInToContinue: "Sign in to continue",
    fillAllFields: "Please fill in all fields",
    loginSuccessful: "Login successful!",
    registrationSuccessful: "Registration successful!",
    registrationNotAllowed: "Registration not allowed as users already exist",
    createdAsAdmin: "You have been created as an admin user!",
    registrationSuccessLoginFailed:
      "Registration successful, but automatic login failed. Please log in manually.",
    invalidCredentials: "Invalid credentials",
    loginFailed: "Login failed",
    serverConnectionFailed:
      "Failed to connect to server. Please check if the server is running.",

    // Navigation
    home: "Home",
    back: "Back",
    newFolder: "New Folder",
    uploadFile: "Upload File",

    // Search
    fuzzySearch: "Advanced Search",
    fuzzySearchDescription: "Enables fuzzy search and keyword detection",

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
    warning: "Note",
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

    // Auth
    sessionExpired: "Your session has expired. Please log in again.",
  },
  fr: {
    // Header
    refresh: "Actualiser",
    logout: "Déconnexion",
    settings: "Paramètres",

    // Sort options
    sortName: "Nom",
    sortType: "Type",
    sortModified: "Modifié",
    sortSize: "Taille",
    sortAscending: "Croissant",
    sortDescending: "Décroissant",
    sortBy: "Trier par",

    // Login & Registration
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    login: "Connexion",
    yourUsername: "Votre nom d'utilisateur",
    yourPassword: "Votre mot de passe",
    confirmYourPassword: "Confirmer votre mot de passe",
    passwordMismatch: "Les mots de passe ne correspondent pas",
    signInToContinue: "Connectez-vous pour continuer",
    fillAllFields: "Veuillez remplir tous les champs",
    loginSuccessful: "Connexion réussie !",
    registrationSuccessful: "Inscription réussie !",
    registrationNotAllowed:
      "Inscription non autorisée car des utilisateurs existent déjà",
    createdAsAdmin:
      "Vous avez été créé en tant qu'utilisateur administrateur !",
    registrationSuccessLoginFailed:
      "Inscription réussie, mais échec de la connexion automatique. Veuillez vous connecter manuellement.",
    invalidCredentials: "Identifiants invalides",
    loginFailed: "Échec de la connexion",
    serverConnectionFailed:
      "Échec de la connexion au serveur. Veuillez vérifier si le serveur est en cours d'exécution.",

    // Navigation
    home: "Accueil",
    back: "Retour",
    newFolder: "Nouveau Dossier",
    uploadFile: "Télécharger un fichier",

    // Search
    fuzzySearch: "Recherche Avancée",
    fuzzySearchDescription:
      "Active la recherche floue et la détection de mots-clés",

    // Tooltips
    toHome: "Aller à l'accueil",
    createNewFolder: "Créer un nouveau dossier",
    uploadFiles: "Télécharger des fichiers",
    oneStepBack: "Revenir en arrière",
    actions: "Actions",

    // File types
    folder: "Dossier",
    file: "Fichier",

    // Actions
    download: "Télécharger",
    downloadAsZip: "Télécharger en ZIP",
    rename: "Renommer",
    delete: "Supprimer",

    // Modals
    uploadFilesModal: "Télécharger des fichiers",
    createNewFolderTitle: "Créer un nouveau dossier",
    renameTitle: "Renommer",
    confirmDelete: "Confirmer la suppression",

    // Form labels
    folderName: "Nom du dossier",
    newName: "Nouveau nom",
    enterFolderName: "Entrez le nom du dossier",
    enterNewName: "Entrez le nouveau nom",

    // Buttons
    cancel: "Annuler",
    create: "Créer",
    save: "Enregistrer",

    // Upload
    dragDropFiles: "Déposez les fichiers ici ou cliquez pour sélectionner",
    multipleSupported: "Plusieurs fichiers sont supportés",
    uploading: "Téléchargement",
    completed: "terminé",

    // Messages
    success: "Succès",
    warning: "Remarque",
    error: "Erreur",
    filesCouldNotLoad: "Impossible de charger les fichiers",
    connectionFailed: "La connexion au serveur a échoué",
    uploaded: "a été téléchargé",
    uploadFailed: "Échec du téléchargement",
    uploadCompleted: "Téléchargement terminé",
    filesSuccessfullyUploaded: "fichiers téléchargés avec succès",
    deleted: "a été supprimé",
    deleteFailed: "Échec de la suppression",
    renamed: "a été renommé",
    renameFailed: "Échec du renommage",
    folderCreated: "a été créé",
    folderCreateFailed: "Impossible de créer le dossier",
    downloading: "est en cours de téléchargement",
    downloadFailed: "Échec du téléchargement",
    zipDownloadFailed: "Échec du téléchargement ZIP",

    // Delete confirmation
    deleteConfirmation: "vraiment supprimer ?",
    deleteWarningFolder:
      "Ce dossier et tous les fichiers qu'il contient seront définitivement supprimés.",
    deleteWarningFile: "Ce fichier sera définitivement supprimé.",

    // Settings
    settingsTitle: "Paramètres",
    theme: "Thème",
    colorScheme: "Schéma de couleurs",
    accentColor: "Couleur d'accent",
    language: "Langue",
    light: "Clair",
    dark: "Sombre",
    german: "Deutsch",
    english: "English",

    // Color names for tooltips
    blue: "Bleu",
    green: "Vert",
    red: "Rouge",
    grape: "Violet",
    orange: "Orange",
    teal: "Turquoise",
    pink: "Rose",
    cyan: "Cyan",

    // Auth
    sessionExpired: "Votre session a expiré. Veuillez vous reconnecter.",
  },
} as const;

export type TranslationKey = keyof typeof translations.de;
