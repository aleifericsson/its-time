import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import { getCurrentPage, isDevMode } from './content/ext-qol.jsx'
import Form from './settings/InputForm.jsx'
import Stop from './settings/stop.jsx'
import Finished from './settings/finished.jsx'
import { getAllStorage } from './content/storage.js'

let url = ""

getAllStorage().then((result) => {
getCurrentPage().then(page =>{
  if (page && page.includes("wikipedia")){
    console.log("page:", page)
    url = page
    console.log(result.prompted)
    if (result.prompted){
      createRoot(document.getElementById('root')).render(
        <StrictMode>
          <Finished prompt={result.prompt}/>
        </StrictMode>,
      )
    }
    else{
      createRoot(document.getElementById('root')).render(
          <Form />
      )

    }
  }
  else{
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <Stop />
      </StrictMode>,
    )
  }
})
})

//settings3d()
//fireship3d()

export {url}