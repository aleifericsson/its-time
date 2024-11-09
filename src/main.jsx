import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import settings3d from './settings/settings3d.js'
import Settings from './settings/Settings.jsx'
import './main.css'
import fireship3d from './settings/fireship3d'
import { isDevMode } from './content/ext-qol.jsx'
import Fiber from './settings/fiber.jsx'
import { generateMessage } from './prompt-testing.js'

if (!isDevMode()){
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Settings />
      <h1>hello</h1>
      <Fiber />
    </StrictMode>,
  )
}
else{   
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <p>{await generateMessage('Britain never colonised India.')}</p>
      <Fiber />
    </StrictMode>,
  )
}

//settings3d()
fireship3d()