export const KEYWORD_EXTENSION_MAP: Record<string, string[]> = {
  // --- Bilder ---
  image: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tif", "tiff"],
  bild: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tif", "tiff"],
  photo: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tif", "tiff"],
  picture: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tif", "tiff"],
  foto: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tif", "tiff"],
  photo_fr: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tif", "tiff"], // Französisch "photo"
  dessin: ["jpg", "jpeg", "png", "gif", "bmp", "svg"], // Französisch "Zeichnung"
  graphique: ["jpg", "jpeg", "png", "gif", "bmp", "svg"], // Französisch "Grafik"

  // --- Videos ---
  video: ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"],
  video_de: ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"],
  vidéo: ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"], // fr
  film: ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"],
  movie: ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"],

  // --- Musik / Audio ---
  music: ["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a"],
  musik: ["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a"],
  audio: ["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a"],
  chanson: ["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a"], // fr
  lied: ["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a"],
  son: ["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a"], // fr "Ton"
  morceau: ["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a"], // fr "Stück"

  // --- Dokumente ---
  document: ["pdf", "doc", "docx", "odt", "rtf", "txt", "md"],
  dokument: ["pdf", "doc", "docx", "odt", "rtf", "txt", "md"],
  dokumente: ["pdf", "doc", "docx", "odt", "rtf", "txt", "md"],
  doc: ["pdf", "doc", "docx", "odt", "rtf", "txt", "md"],
  texte: ["pdf", "doc", "docx", "odt", "rtf", "txt", "md"], // fr
  fichier: ["pdf", "doc", "docx", "odt", "rtf", "txt", "md"], // fr "Datei"
  rapport: ["pdf", "doc", "docx", "odt"], // fr "Bericht"
  note: ["txt", "md", "rtf", "docx", "doc"],

  // --- Tabellen ---
  excel: ["xls", "xlsx", "ods", "csv"],
  tabelle: ["xls", "xlsx", "ods", "csv"],
  table: ["xls", "xlsx", "ods", "csv"],
  tableau: ["xls", "xlsx", "ods", "csv"], // fr
  sheet: ["xls", "xlsx", "ods", "csv"],

  // --- Präsentationen ---
  powerpoint: ["ppt", "pptx", "odp"],
  präsentation: ["ppt", "pptx", "odp"],
  presentation: ["ppt", "pptx", "odp"],
  diashow: ["ppt", "pptx", "odp"],
  présentation: ["ppt", "pptx", "odp"], // fr

  // --- PDFs ---
  pdf: ["pdf"],
  acrobat: ["pdf"],

  // --- Code ---
  code: [
    "js",
    "ts",
    "py",
    "java",
    "cpp",
    "c",
    "cs",
    "html",
    "css",
    "json",
    "sh",
    "php",
    "rb",
    "go",
    "rs",
  ],
  skript: ["js", "ts", "sh", "bat", "py"],
  script: ["js", "ts", "sh", "bat", "py"],
  programm: ["js", "ts", "py", "java", "cpp", "c", "cs", "go", "rs"],
  python: ["py"],
  java: ["java"],
  typescript: ["ts"],
  ts: ["ts"],
  js: ["js"],
  javascript: ["js"],
  html: ["html", "htm"],
  css: ["css"],
  json: ["json"],

  // --- Archive ---
  archive: ["zip", "rar", "7z", "tar", "gz", "bz2"],
  archiv: ["zip", "rar", "7z", "tar", "gz", "bz2"],
  compressed: ["zip", "rar", "7z", "tar", "gz", "bz2"],
  komprimiert: ["zip", "rar", "7z", "tar", "gz", "bz2"],
  zip: ["zip"],
  rar: ["rar"],

  // --- Sonstiges ---
  backup: ["bak", "backup", "zip", "tar", "gz"],
  sicherung: ["bak", "backup", "zip", "tar", "gz"],
  log: ["log", "txt"],

  // --- System ---
  system: ["sys", "dll", "ini", "cfg", "conf"],
  config: ["ini", "cfg", "conf", "json", "xml", "yaml", "yml"],
  einstellung: ["ini", "cfg", "conf", "json", "xml", "yaml", "yml"],

  // --- Bilder (extra Varianten) ---
  jpeg: ["jpg", "jpeg"],
  png: ["png"],
  gif: ["gif"],
  svg: ["svg"],
};
