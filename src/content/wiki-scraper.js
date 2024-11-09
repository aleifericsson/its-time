import { getCurrentPage } from "./ext-qol";

export default async function scrapePage(){ //ONLY AVAILABLE FROM SETTINGS SCRIPT
    return getCurrentPage().then(async (result) => {
        if (result.includes("wikipedia.org/wiki")) {
            const articleName = result.split("/wiki/")[1];
            const raw_wiki_url = `https://en.wikipedia.org/w/api.php?titles=${articleName}&action=query&prop=extracts&exlimit=1&explaintext=1&formatversion=2&format=json&origin=*`
            let text = "a"
            await fetch(raw_wiki_url)
                .then(blob => blob.json())
                .then(result => {
                    const raw_text = result.query.pages[0].extract
                    const intro = raw_text.split("==")[0]
                    text = intro
                })
            console.log(text)
            return text
        } else {
            return("ERROR");
        }        
    })
}