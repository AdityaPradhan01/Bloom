
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeProductBack = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Analyze this product label image with high-fidelity technical precision.
    Return a structured JSON object.
    
    1. productName: The commercial name of the product.
    2. healthScore: Integer 0-100 based on nutritional density and chemical safety.
    3. composition: Array of {name, purpose, healthImpact}.
    4. processingMethod: A concise technical description of how it was manufactured (e.g. "Ultra-pasteurized and homogenized").
    5. quantities: Array of {label, amount, unit, level}. Focus on critical items like Sugars, Saturated Fat, Sodium.
    6. visualMarkers: Array of {location, issue, severity}. Be spatially descriptive (e.g. "Upper half ingredient block").
    7. detailedBreakdown: A technical 3-paragraph summary.
    8. dailyImpact: {shortTerm, longTerm, verdict}. verdict must be one of: 'Excellent', 'Good', 'Fair', 'Caution', 'Avoid'.
    
    Constraint: If parts of the text are unreadable, make the most educated guess based on context. 
    If the image is completely unreadable, blurry, or not a product label, set productName to "Unknown" and describe the issue in detailedBreakdown (e.g., "The image is too blurry to read the ingredients").
    Strictness: Return ONLY valid JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            healthScore: { type: Type.NUMBER },
            composition: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  healthImpact: { type: Type.STRING, enum: ['positive', 'neutral', 'negative'] }
                },
                required: ['name', 'purpose', 'healthImpact']
              }
            },
            processingMethod: { type: Type.STRING },
            quantities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  amount: { type: Type.STRING },
                  unit: { type: Type.STRING },
                  level: { type: Type.STRING, enum: ['low', 'moderate', 'high'] }
                },
                required: ['label', 'amount', 'unit', 'level']
              }
            },
            visualMarkers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  location: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
                }
              }
            },
            detailedBreakdown: { type: Type.STRING },
            dailyImpact: {
              type: Type.OBJECT,
              properties: {
                shortTerm: { type: Type.STRING },
                longTerm: { type: Type.STRING },
                verdict: { type: Type.STRING, enum: ['Excellent', 'Good', 'Fair', 'Caution', 'Avoid'] }
              },
              required: ['shortTerm', 'longTerm', 'verdict']
            }
          },
          required: ['productName', 'healthScore', 'composition', 'processingMethod', 'quantities', 'visualMarkers', 'detailedBreakdown', 'dailyImpact']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("EMPTY_RESPONSE");
    
    const parsed = JSON.parse(text);
    
    // Basic validation that we actually got a product
    if (parsed.productName.toLowerCase().includes("unknown") || parsed.productName === "" || parsed.healthScore === 0) {
      // If the model couldn't find a product name, it might be a bad image
      if (parsed.detailedBreakdown.toLowerCase().includes("blurry") || parsed.detailedBreakdown.toLowerCase().includes("unreadable")) {
        throw new Error("IMAGE_BLURRY");
      }
      if (parsed.detailedBreakdown.toLowerCase().includes("not a label") || parsed.detailedBreakdown.toLowerCase().includes("no ingredients")) {
        throw new Error("NOT_A_LABEL");
      }
    }

    return { 
      ...parsed, 
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      capturedImage: `data:image/jpeg;base64,${base64Image}` 
    };
  } catch (error: any) {
    console.error("Gemini Analysis Failure:", error);
    
    let message = "Optical fault: The image was too blurry or unreadable. Please ensure good lighting and focus.";
    
    const errorMsg = error.message || "";
    
    if (errorMsg === "IMAGE_BLURRY") {
      message = "Focus error: The captured image is too blurry for precise ingredient decoding. Please hold steady and try again.";
    } else if (errorMsg === "NOT_A_LABEL") {
      message = "Subject error: No valid product label or ingredient list detected. Please scan the back of the product packaging.";
    } else if (errorMsg === "EMPTY_RESPONSE") {
      message = "Processing error: The analysis engine returned no data. This usually happens with extremely low-quality images.";
    } else if (errorMsg.includes('SAFETY')) {
      message = "Security block: The image content was flagged by safety filters. Please ensure you are only scanning product labels.";
    } else if (errorMsg.includes('429')) {
      message = "System congestion: Too many requests are being processed. Please wait 10 seconds before your next scan.";
    } else if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('failed to fetch')) {
      message = "Uplink failure: Network connection unstable. Please check your signal and try again.";
    } else if (errorMsg.includes('quota')) {
      message = "Resource limit: API quota exceeded. Please try again later.";
    }
    
    throw new Error(message);
  }
};
