
import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

async function handler(_req: Request): Promise<Response> {
  try {
    const user_guess = await extractGuess(_req);
    const word_to_find = "chien";
    const score = await similarity(user_guess, word_to_find);
    return responseBuilder(score, user_guess, word_to_find);
  } catch (e) {
    return new Response(`Error !\n${e.message}`, { status: 400 });
  }
}

const responseBuilder = (similarityScore: Number, userGuess: String, wordToFind: String) => {
  if (similarityScore > 0.5) {
    return new Response(`Similarity score between ${userGuess} and ${wordToFind} : ${similarityScore}, words are close !`);
  } else {
    return new Response(`Similarity score between ${userGuess} and ${wordToFind} : ${similarityScore}, words aren't close !`);
  }
}

const similarity = async (word1: String, word2: String) => {

  const body = {
    sim1: word1,
    sim2: word2,
    lang: "fr",
    type: "General Word2Vec",
  };
  console.log("body : ", body);
  const similarityResponse = await fetch(
    "http://nlp.polytechnique.fr/similarityscore",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const similarityResponseJson = await similarityResponse.json();
  return Number(similarityResponseJson.simscore);
}

const extractGuess = async (req: Request) => {
  const slackPayload = await req.formData();
  const guess = await slackPayload.get("text")?.toString();
  if (!guess) {
    throw Error("Guess is empty or null");
  }
  return guess;
};

serve(handler);

