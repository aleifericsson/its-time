import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // This is the default and can be omitted
  dangerouslyAllowBrowser: true
});

export default async function generateMessage(userInput, scrapedText) {
  
  console.log("top")

  const example = `There have been several historical episodes of <span class='new-section'>governments of developing countries</span> borrowing in quantities beyond their ability to repay.`

  const finalPrompt = `In the following instructions, every sentence must be followed completely non-negotiably. For this prompt, I want you to be creative and think of potential outcomes caused by a factually incorrect statement's butterfly effect on the course of history. Once again, be creative. These are the relevant inputs:\n
  'input-text': an informative, non-fictional paragraph(s) (type string)\n
  'input-statement': sentence(s) containing a claim (type string)\n

  The value of 'input-text': "${scrapedText}"\n
  The value of 'input-statement': ${userInput}\n
  
  These are the expected outputs, which should be in correct JSON format:\n
  'flags': a sequence of flags containing metadata about the procedure (format is [error: 0/1, same: 0/1])\n
  'output-text': an informative paragraph (type string)\n
  'explanation': an array where each element represents an explanation for the corresponding emboldened segment, explaining concisely why the explicit changes to the original paragraph occurred as consequences of the input statement\n

  First, process the input statement, and understand the claims that it asserts. Then, use those claims to reason whether their validity would cause an impact on the input text. If they do not, return the same, unchanged input text and set the 'same' flag to 0. If they do, update them accordingly. If there is an error, such as the input statement not being intelligible, set the 'error' flag to 1. I want the output text to be largely identical to the original input text, except where there is a change of events caused by the butterfly effect. If you deem an input statement to have very low relevance to the input text, such that it does not alter it, try to find creative ways to alter it - such that at least 15% of the input text is altered, in order to observe that the functionality works.

  The initial configuration of flags is [error: 0, same: 0].
  You MUST use '<span class>' tags to enclose the altered parts of the text, not double asterisks ('**'). These tags MUST have a class of 'new-section'. An example is the '<span>' tags used in the following sentence: '${example}'\n\n

  You MUST NOT imply that the input statement is factually incorrect. Do not refer to the alternate timeline as if it is something out of the ordinary - it is the norm. In light of the given input statement, convert the input text to describe an alternate timeline affected by the compounding (butterfly) effects of the event mentioned in the input statement, the result of which will be return in the output text. Make bold educated guesses, even if you are not sure of their accuracy. You must alter the original paragraph with these educated guesses. Do not provide explicit hints that the input statement has taken place, but rather switch the events that would be affected in the alternate timeline.`;

  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: finalPrompt }],
    model: 'gpt-4o',
  });

  console.log(chatCompletion);

  const message = chatCompletion.choices[0].message.content;

  console.log(message)

  let result = message.slice(8, message.length - 4);

  console.log(result)

  return (JSON.parse(result))
}