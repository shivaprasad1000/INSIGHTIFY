import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';
import { CATEGORIES, DEFAULT_CATEGORY_VALUE } from '../config/categories';

const API_KEY = import.meta.env.VITE_API_KEY;

// This provides a clearer error in the browser console if the API key is missing.
if (!API_KEY) {
  console.error("VITE_API_KEY is not configured. Please create a .env file and set the key.");
}

// Initialize ai to null if the key is missing. This prevents the app from crashing on load.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const reviewAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        overallSummary: {
            type: Type.STRING,
            description: "A concise, neutral summary of the overall feedback from all reviews, written in an executive tone. This should be 2-3 sentences max."
        },
        sentimentDistribution: {
            type: Type.OBJECT,
            description: "The percentage breakdown of review sentiment.",
            properties: {
                positivePercentage: { type: Type.NUMBER, description: "Percentage of positive reviews (0-100)." },
                neutralPercentage: { type: Type.NUMBER, description: "Percentage of neutral reviews (0-100)." },
                negativePercentage: { type: Type.NUMBER, description: "Percentage of negative reviews (0-100)." },
            },
            required: ["positivePercentage", "neutralPercentage", "negativePercentage"],
        },
        categoryInsights: {
            type: Type.ARRAY,
            description: "A list of 3-5 distinct categories of feedback discovered from the reviews. Do not repeat categories.",
            items: {
                type: Type.OBJECT,
                properties: {
                    categoryName: { type: Type.STRING, description: "A short, descriptive name for the category (e.g., 'Battery Life', 'Shipping Issues')." },
                    summary: { type: Type.STRING, description: "A detailed summary of all feedback related to this specific category." },
                    reviewCount: { type: Type.INTEGER, description: "The total number of reviews that mention this category." },
                    positiveCount: { type: Type.INTEGER, description: "The number of positive reviews in this category." },
                    negativeCount: { type: Type.INTEGER, description: "The number of negative reviews in this category." },
                },
                required: ["categoryName", "summary", "reviewCount", "positiveCount", "negativeCount"],
            }
        },
        categoryIntersections: {
            type: Type.ARRAY,
            description: "An analysis of the intersections between the top 2 or 3 most frequent categories from the list above. Each item represents a segment of a Venn diagram. Include items for single categories (the parts of the circles that don't overlap) and for the intersections.",
            items: {
                type: Type.OBJECT,
                properties: {
                    categories: { type: Type.ARRAY, description: "A list of category names in this segment. An array with one name represents a non-overlapping part of a circle. An array with multiple names represents an intersection.", items: { type: Type.STRING } },
                    reviewCount: { type: Type.INTEGER, description: "The number of reviews in this specific segment." },
                    positiveCount: { type: Type.INTEGER, description: "Number of positive reviews in this segment." },
                    negativeCount: { type: Type.INTEGER, description: "Number of negative reviews in this segment." },
                },
                required: ["categories", "reviewCount", "positiveCount", "negativeCount"]
            }
        },
    },
    required: ["overallSummary", "sentimentDistribution", "categoryInsights", "categoryIntersections"],
};


export const analyzeReviews = async (reviewsText: string, categoryValue: string): Promise<AnalysisResult> => {
  // Check for the 'ai' instance at the time of the call, not on app load.
  if (!ai) {
    throw new Error("Gemini AI client is not initialized. Please check your VITE_API_KEY configuration in your .env file.");
  }

  const category = CATEGORIES.find(c => c.value === categoryValue) || CATEGORIES.find(c => c.value === DEFAULT_CATEGORY_VALUE)!;

  const prompt = `
    You are a world-class AI system for market research and product review analysis.
    Your task is to perform a deep analysis of the following product reviews for a product in the "${category.label}" category.

    **Analysis Steps:**
    1.  **Read and Understand:** Read all provided reviews thoroughly.
    2.  **Per-Review Analysis:** For each individual review, determine its primary sentiment (Positive, Neutral, or Negative) and identify the main topics or categories it discusses (e.g., "Performance", "Price", "Shipping", "Customer Support", "Product Defect"). A single review can belong to multiple categories.
    3.  **Aggregate Sentiments:** Calculate the overall percentage of reviews that are Positive, Neutral, and Negative. The total should sum to 100.
    4.  **Discover Key Categories:** Identify the top 3 to 5 most frequently discussed categories across all reviews. For each of these top categories, provide:
        a. A descriptive name ('categoryName').
        b. A summary of what customers are saying about it.
        c. The total number of reviews mentioning it ('reviewCount').
        d. The count of positive and negative reviews within that category.
    5.  **Analyze Category Intersections (for Venn Diagram):**
        a. Take the **top 2 or 3** most frequent categories from the step above.
        b. Calculate the number of reviews in each possible segment of a Venn diagram for these categories.
        c. For example, for categories A and B, you must provide data for:
            - Reviews in A ONLY.
            - Reviews in B ONLY.
            - Reviews in both A AND B.
        d. For each segment, provide the total review count and the breakdown of positive/negative reviews.
        e. Represent each segment as an object in the 'categoryIntersections' array. The 'categories' field should contain the names of the categories for that segment.
    6.  **Overall Summary:** Write a brief, executive-level summary of the key findings.
    7.  **Format Output:** Return the entire analysis in a single JSON object that strictly adheres to the provided schema. Ensure all fields are populated correctly. The sum of percentages in 'sentimentDistribution' must be 100. The counts in 'categoryIntersections' should be logical and consistent.

    The reviews are:
    ---
    ${reviewsText}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reviewAnalysisSchema,
        temperature: 0.1,
      },
    });

    const jsonText = (response.text ?? '').trim();
    const result: AnalysisResult = JSON.parse(jsonText);

    // Basic validation
    if (!result.sentimentDistribution || !result.categoryInsights || !result.categoryIntersections) {
      throw new Error("The AI model returned an incomplete data structure.");
    }
    
    const { positivePercentage, neutralPercentage, negativePercentage } = result.sentimentDistribution;
    const totalPercentage = Math.round(positivePercentage + neutralPercentage + negativePercentage);
    if(totalPercentage > 101 || totalPercentage < 99) {
        console.warn(`Percentages sum to ${totalPercentage}.`);
        // Don't throw error, just log it. It might be a rounding issue.
    }

    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("Failed to analyze reviews. The AI model returned an invalid format. Please try again.");
    }
    throw new Error("Failed to analyze reviews. An error occurred. Please check your API key and network connection.");
  }
};
