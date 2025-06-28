/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string
    // Add more as needed:
    // readonly VITE_APP_NAME: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  