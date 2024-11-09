import { GoogleGenerativeAI } from "@google/generative-ai";

const inputParagraph = `Curry is an international dish with a sauce or gravy seasoned with spices, mainly derived from the interchange of Indian cuisine with European taste in food, starting with the Portuguese, followed by the Dutch and British, and then thoroughly internationalised. Many dishes that would be described as curries in English are found in the native cuisines of countries in Southeast Asia and East Asia.

A first step in the creation of curry was the arrival in India of spicy hot chili peppers, along with other ingredients such as tomatoes and potatoes, part of the Columbian exchange of plants between the Old World and the New World. During the British Raj, Anglo-Indian cuisine developed, leading to Hannah Glasse's 18th century recipe for "currey the India way" in England. Curry was then spread in the 19th century by indentured Indian sugar workers to the Caribbean, and by British traders to Japan. Further exchanges around the world made curry a fully international dish.

Many types of curry exist in different countries. In Southeast Asia, curry often contains a spice paste and coconut milk. In India, the spices are fried in oil or ghee to create a paste; this may be combined with a water-based broth, or sometimes with milk or coconut milk. In China and Korea, curries are based on a commercial curry powder. Curry restaurants outside their native countries often adapt their cuisine to suit local tastes; for instance, Thai restaurants in the West sell red, yellow, and green curries with chili peppers of those colours, often combined with additional spices of the same colours. In Britain, curry has become the national dish, with some types adopted from India, others modified or wholly invented, as with chicken tikka masala, created by British Bangladeshi restaurants in the 20th century.`

const i = 'Manchester United Football Club, commonly referred to as Man United (often stylised as Man Utd) or simply United, is a professional football club based in Old Trafford, Greater Manchester, England. They compete in the Premier League, the top tier of English football. Nicknamed the Red Devils, they were founded as Newton Heath LYR Football Club in 1878, but changed their name to Manchester United in 1902. After a spell playing in Clayton, Manchester, the club moved to their current stadium, Old Trafford, in 1910.'

const o = 'Manchester United Football Club, commonly referred to as Man United (often stylised as Man Utd) or simply United, is a professional football club based in Trafford Park, Greater Manchester, England. They compete in the Premier League, the top tier of English football. Nicknamed the Trafford Reds, they were founded as Newton Heath Railway FC in 1878 but changed their name to Manchester United in 1902. After a spell playing in the Hulme district of Manchester, the club moved to their current stadium, Trafford Park Grounds, in 1910, where they have remained ever since as a prominent fixture in English football.'

const r = 'Location and Stadium: "Trafford Park Grounds" is used as the name of the stadium, assuming this became the club\'s established home in the absence of any historical events prompting a move or redevelopment.\nNickname: "Trafford Reds" is used as an alternative nickname that might have naturally evolved in this timeline, as it reflects both locality and team colors without any post-conflict influence.'

// Access your API key as an environment variable (see "Set up your API key" above)
//console.log(process.env.GEMINI_API_KEY)
//const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const thing = ["LF5QYpkTv", "mQW1pALb", "AIzaSyBlqTVXE", "-cJnpBE4VxQ", "pBE4VxQ41hM", "aSyBlqTVd0OIk", "inQ3-A", "DxC-1", "Ba11S"]
const genAI = new GoogleGenerativeAI(thing[2]+thing[3]+thing[0]+thing[6]);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateMessage(inputStatement) {
  const sanityCheckPrompt = `For this prompt, I want you to be creative and think of potential outcomes caused by a factually incorrect statement's butterfly effect on the course of history. Once again, be creative. These are the relevant parameters:\n
  'input-text': an informative, non-fictional paragraph(s) (type string)\n
  'input-statement': sentence(s) containing a claim (type string)\n

  The value of 'input-text': "${inputParagraph}"\n
  The value of 'input-statement': ${inputStatement}\n
  
  These are the expected returns, which should be in a JSON format:\n
  'flags': a sequence of flags containing metadata about the procedure (format is [error: ])\n
  'output-text': an informative paragraph (type string)
  'explanation': list of the changes to the original paragraph as consequences of the input statement

  The initial configuration of flags is [error: 0, same: 0].\n\n

  You MUST NOT imply that the input statement is factually incorrect. In light of the given input statement, convert the input text to describe an alternate timeline affected by the compounding (butterfly) effects of the event mentioned in the input statement, the result of which will be return in the output text. Make bold educated guesses, even if you are not sure of their accuracy. You must alter the original paragraph with these educated guesses. Do not provide explicit hints that the input statement has taken place, but rather switch the events that would be affected in the alternate timeline.\n
  
  This is an example of expected functionality. For input \`${i}\`, the a satisfactory output is \`${o}\`. The given reasons are \`${r}\`.
  `;

  const changeParagraphPrompt = ``;
  console.log('system prompt:', sanityCheckPrompt)
  const result = await model.generateContent(sanityCheckPrompt);
  const response = await result.response;
  const text = response.text();
  console.log('output text:',text);
  console.log()
  return(text)
}
//when you want to make a new line, use <br/> in that position.
// parameters:  input paragraph
    //              input statement
    // //              flags
    // // returns:     output paragraph
    // //              flags

    // // flags represent important metadata about the output paragraph (e.g. is the same as the original, is the input statement meaningful english)
    // const systemPrompt = `For this prompt, these are the relevant parameters:\n'input-paragraph': string\n'input-statement': string\nWrite an alternate version of the following informative paragraph (to be identified as 'input paragraph'), such that the details of the paragraph are altered by a given statement (identified as 'input statement'). If the statement is 100% factually correct, set the output paragraph to the input paragraph and return the output paragraph without altering it. Otherwise, if the input statement is incorrect or is not clearly correct, set the input paragraph to be the input paragraph`;