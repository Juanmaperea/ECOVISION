import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { HistoryProvider } from './context/HistoryContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <HistoryProvider>
          <App />
        </HistoryProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
