export type DetectionResponse = {
  object_name: string;
  confidence: number;
  recommended_bin: string;
  explanation: string;
  tips: string[];
  warning?: string | null;
};
