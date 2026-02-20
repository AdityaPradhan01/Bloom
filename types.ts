
export interface Ingredient {
  name: string;
  purpose: string;
  healthImpact: 'positive' | 'neutral' | 'negative';
}

export interface NutritionValue {
  label: string;
  amount: string;
  unit: string;
  level: 'low' | 'moderate' | 'high';
}

export interface VisualMarker {
  location: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  productName: string;
  healthScore: number;
  composition: Ingredient[];
  processingMethod: string;
  quantities: NutritionValue[];
  visualMarkers: VisualMarker[];
  detailedBreakdown: string;
  dailyImpact: {
    shortTerm: string;
    longTerm: string;
    verdict: 'Excellent' | 'Good' | 'Fair' | 'Caution' | 'Avoid';
  };
  capturedImage?: string; // Base64
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: {
    diet: string;
    allergies: string[];
    monitoring: string[];
    theme: 'light' | 'dark';
  };
  history: AnalysisResult[];
}

export enum AppState {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  SETTINGS = 'SETTINGS'
}
