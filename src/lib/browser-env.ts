declare global {
  interface Window {
    global: typeof globalThis
    process: {
      env: Record<string, string>
    }
  }
}

// Ensure we have a proper global object
if (typeof window !== 'undefined') {
  // Set up global
  if (!window.global) {
    window.global = globalThis
  }

  // Set up process
  if (!window.process) {
    window.process = {
      env: {},
    }
  }
}

export {} 