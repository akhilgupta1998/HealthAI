import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { FirebaseProvider } from '@/contexts/FirebaseContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import './index.css'

// Set OpenAI API key for the whole application
if (typeof window !== 'undefined') {
  // Create a proper process object that includes required Process properties
  window.process = {
    env: {
      OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY
    },
    // Add minimum required Process properties
    stdout: null as any,
    stderr: null as any,
    stdin: null as any,
    argv: [] as string[],
    argv0: '',
    execArgv: [] as string[],
    execPath: '',
    abort: () => {},
    chdir: () => {},
    cwd: () => '',
    exit: () => {},
    // Add other required properties as needed
  } as any; // Use type assertion since we're not implementing all Process properties
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <FirebaseProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FirebaseProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
