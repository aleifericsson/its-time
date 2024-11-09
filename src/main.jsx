import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import settings3d from './settings/settings3d.js'
import Settings from './settings/Settings.jsx'

import './main.css'

import fireship3d from './settings/fireship3d'
import { getCurrentPage, isDevMode } from './content/ext-qol.jsx'
import Form from './settings/InputForm.jsx'
import { scrapePage } from './content/wiki-scraper.js'
import Stop from './settings/stop.jsx'

getCurrentPage().then(page =>{
  if (page && page.includes("wikipedia")){
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <Form />
      </StrictMode>,
    )
  }
  else{
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <Stop />
      </StrictMode>,
    )
  }
})


//settings3d()
//fireship3d()

//scrapePage()
