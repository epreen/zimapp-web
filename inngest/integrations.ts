// /inngest/integrations.ts

import OpenAI from "openai";
import { CohereClient } from "cohere-ai";
import { AssemblyAI } from "assemblyai";

// -------------------------
// ASSEMBLY AI
// -------------------------

const assembly = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

// Wrapper
export const assemblyAI = {
    async transcribe(url: string) {
        const response = await assembly.transcripts.transcribe({ audio_url: url });
        return response.text || "";
    },
  
    async moderate(url: string) {
        const response = await assembly.transcripts.transcribe({
            audio_url: url,
            content_safety: true,
        });
  
        const labels = response.content_safety_labels;
        const issues = labels?.results ?? [];
        const safe = issues.length === 0;

        return { safe, issues };
    },
  };

// -------------------------
// OPENAI
// -------------------------

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

// Wrapper
export const openai = {
    async generateVideoMetadata(transcript: string) {
        const response = await openaiClient.responses.create({
            model: "gpt-4.1-mini",
            input: `
            You are analyzing a promotional business video.
            Generate:
            - a short title
            - category suggestions
            - keywords
            - predicted engagement score from 0-1
            Transcript:
            ${transcript}
            `,
        });
        const json = response.output_text;
        return JSON.parse(json);
    },

    async rewriteListing(description: string) {
        const response = await openaiClient.responses.create({
            model: "gpt-4.1-mini",
            input: `
            You are an expert e-commerce copywriter.
            Rewrite the following product description to be more engaging and SEO-friendly.
            Also suggest 5–10 keywords and one category.
            
            Description:
            ${description}
            `,
        });

        const json = response.output_text;
        return JSON.parse(json); // expect { description, keywords, category }
    },
};

// -------------------------
// COHERE
// -------------------------

const cohereClient = new CohereClient({
    token: process.env.COHERE_API_KEY!,
});

// Wrapper
export const cohere = {
    async generateTags(text: string) {
        const response = await cohereClient.generate({
            model: "command-a",
            prompt: `
            Extract 5–10 short tags from the following text:
            ${text}
            Return as a JSON array of strings.
            `,
            maxTokens: 150,
        });

        const output = response.generations[0].text.trim();

        try {
            return JSON.parse(output);
        } catch {
            return [];
        }
    },
};