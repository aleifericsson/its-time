import { url } from "../main";
import { getCurrentPage } from "./ext-qol";
import { create, find, render, write } from "./qol";

async function scrapePage(){ //ONLY AVAILABLE  FROM SETTINGS SCRIPT
        let result = url
        console.log("url", result)
        let articleName = ""
        if (result.includes("wikipedia.org/wiki")) {
            articleName = result.split("/wiki/")[1];
        }
        else if (result.includes("wikipedia.org/w")){
            articleName = result.split("/w/")[1];
        }
        else{
            return("ERROR")
        }
            const raw_wiki_url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exlimit=1&explaintext=1&formatversion=2&format=json&titles=${articleName}`
            let text = "a"
            try {
                const response = await fetch(raw_wiki_url, {
                    method: 'GET',  // The default method is GET, but it's good practice to specify it
                    headers: {
                        'Accept': 'application/json',  // Inform the server that we expect a JSON response
                        'Content-Type': 'application/json',
                    },
                    // Allow cross-origin requests by setting `origin=*`
                    mode: 'cors',  // Enable CORS
                });
        
                // Check if the response is OK
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
        
                // Parse the response as JSON
                console.log(response)

                const data = await response.json();
                const raw_text = data.query.pages[0].extract;
        
                // Get the intro (first part before the first "==")
                const intro = raw_text.split("==")[0];
                text = intro;
        
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            return text;
}

const changeText = (sample_text, explanations) =>{
    console.log("changed")
    const textele = find(".mw-content-ltr.mw-parser-output")
    const infobox = find(".infobox")
    const newtext = create("p")
    if (textele){
        console.log(1);
        const figure = textele.querySelector("figure")
        write(textele, " ")
        console.log(2)
        if (infobox){
            render(textele, infobox)
        } 
        if (figure){
            console.log("error here")
            render(textele, figure)
        }
        console.log(3)
        render(textele, newtext)
        newtext.innerHTML = sample_text;
        const newSections = document.querySelectorAll(".new-section");
        console.log(newSections)
        newSections.forEach((element, index) => {
            if (explanations[index]) { // Ensure explanation exists for the element
                element.setAttribute('data-tooltip', explanations[index]);
            }
        });
    }
    else{
        console.log("nah")
    }
}

export {scrapePage, changeText}