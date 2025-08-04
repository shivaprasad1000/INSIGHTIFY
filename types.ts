export interface SentimentDistribution {
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
}

export interface CategoryInsight {
  categoryName: string;
  summary: string;
  reviewCount: number;
  positiveCount: number;
  negativeCount: number;
}

export interface CategoryIntersection {
  categories: string[];
  reviewCount: number;
  positiveCount: number;
  negativeCount: number;
}

export interface AnalysisResult {
  overallSummary: string;
  sentimentDistribution: SentimentDistribution;
  categoryInsights: CategoryInsight[];
  categoryIntersections: CategoryIntersection[];
}

export enum Status {
  Idle = 'IDLE',
  Processing = 'PROCESSING',
  Success = 'SUCCESS',
  Error = 'ERROR',
}

export interface AppState {
  status: Status;
  analysisResult: AnalysisResult | null;
  error: string | null;
  fileName: string | null;
  selectedCategory: string;
}
