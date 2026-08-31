import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme.js'
import AppHeader from './components/layout/AppHeader.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/**
     * ThemeProvider is a component from Material-UI that allows you to apply the custom theme
     * to your application. Here, we are wrapping the App component with the ThemeProvider.
     */}
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      {/* <AppHeader></AppHeader> */}
      <App />
    </ThemeProvider>
  </StrictMode>,
)
