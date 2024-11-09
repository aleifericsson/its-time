import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import settings3d from './settings/settings3d.js'
import Settings from './settings/Settings.jsx'
import { useState } from 'react'

import './main.css'

import fireship3d from './settings/fireship3d'
import { isDevMode } from './content/ext-qol.jsx'
import Form from './settings/InputForm.jsx'
import { scrapePage } from './content/wiki-scraper.js'

function App() {

  
  const [message, setMessage] = useState("");
  

  if (!isDevMode()){ //runs on npm run build
    return (
      <>
        <Settings />
        <Form />
        <p>{message}</p>
      </>
    )
  }
  else{   //runs on npm run dev
    return (
      <>
        <Form changeMessage={setMessage} />
        <h1>Hello</h1>
        <p>{message}</p>
      </>
    )
  }
}

//settings3d()
//fireship3d()

scrapePage()

createRoot(document.getElementById('root')).render(<App />);
