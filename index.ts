
import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

async function handler(_req: Request): Promise<Response> {

  const score = await similarity("chat", "chien");
  return new Response(`Similarity score: ${score}`);
}

const similarity = async (word1, word2) => {

  const body = {
    sim1: word1,
    sim2: word2,
    lang: "fr",
    type: "General Word2Vec",
  };
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
serve(handler);

