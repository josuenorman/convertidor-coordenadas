import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

const rootElement = document.querySelector('#root')
createRoot(rootElement).render(<App />)
