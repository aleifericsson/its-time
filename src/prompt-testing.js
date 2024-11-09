import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // This is the default and can be omitted
  dangerouslyAllowBrowser: true
});

export default async function generateMessage(prompt) {

  const inputParagraph = `Curry is an international dish with a sauce or gravy seasoned with spices, mainly derived from the interchange of Indian cuisine with European taste in food, starting with the Portuguese, followed by the Dutch and British, and then thoroughly internationalised. Many dishes that would be described as curries in English are found in the native cuisines of countries in Southeast Asia and East Asia.`;

  const finalPrompt = `For this prompt, I want you to be creative and think of potential outcomes caused by a factually incorrect statement's butterfly effect on the course of history. Once again, be creative. These are the relevant inputs:\n
  'input-text': an informative, non-fictional paragraph(s) (type string)\n
  'input-statement': sentence(s) containing a claim (type string)\n

  The value of 'input-text': "${inputParagraph}"\n
  The value of 'input-statement': ${prompt}\n
  
  These are the expected outputs, which should be in a JSON format:\n
  'flags': a sequence of flags containing metadata about the procedure (format is [error: 0/1, same: 0/1])\n
  'output-text': an informative paragraph (type string)\n
  'explanation': detailed explanation of the explicit changes to the original paragraph as consequences of the input statement\n

  First, process the input statement, and understand the claims that it asserts. Then, use those claims to reason whether their validity would cause an impact on the input text. If they do not, return the same, unchanged input text and set the 'same' flag to 0. If they do, update them accordingly. If there is an error, such as the input statement not being intelligible, set the 'error' flag to 1.

  The initial configuration of flags is [error: 0, same: 0].
  Format the changes such that parts that are changed are emboldened.\n\n

  You MUST NOT imply that the input statement is factually incorrect. Do not refer to the alternate timeline as if it is something out of the ordinary - it is the norm. In light of the given input statement, convert the input text to describe an alternate timeline affected by the compounding (butterfly) effects of the event mentioned in the input statement, the result of which will be return in the output text. Make bold educated guesses, even if you are not sure of their accuracy. You must alter the original paragraph with these educated guesses. Do not provide explicit hints that the input statement has taken place, but rather switch the events that would be affected in the alternate timeline.`;

  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: finalPrompt }],
    model: 'gpt-4o',
  });

  console.log(chatCompletion);
  return chatCompletion.choices[0].message.content
}