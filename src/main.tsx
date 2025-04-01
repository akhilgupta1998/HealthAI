<<<<<<< HEAD
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { FirebaseProvider } from '@/contexts/FirebaseContext'
import ErrorBoundary from '@/components/ErrorBoundary'
=======

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
import './index.css'

// Set OpenAI API key for the whole application
if (typeof window !== 'undefined') {
  // Create a proper process object that includes required Process properties
  window.process = {
    env: {
      OPENAI_API_KEY: 'OPENAI_API_KEY_PLACEHOLDER '
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
  } as any;
}

<<<<<<< HEAD
// Speed up initial load by not using StrictMode in production
const AppWithProviders = (
  <ErrorBoundary>
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  </ErrorBoundary>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  process.env.NODE_ENV === 'development' ? (
    <React.StrictMode>
      {AppWithProviders}
    </React.StrictMode>
  ) : AppWithProviders
);
=======
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
