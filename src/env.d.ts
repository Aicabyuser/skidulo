/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_CLIENT_SECRET: string
  readonly VITE_GOOGLE_REDIRECT_URI: string
  readonly VITE_GOOGLE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    global: typeof globalThis
    Buffer: typeof Buffer
    process: {
      env: Record<string, string>
      version: string
      versions: Record<string, string>
      platform: string
      nextTick: (callback: Function) => void
    }
    gapi: typeof google.gapi
    google: typeof google
  }
} 