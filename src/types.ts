export type ToolCategory = 'organize' | 'convert' | 'optimize' | 'security' | 'edit';

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolStep {
  title: string;
  description: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  badge?: string;
  iconName: string;
  shortDescription: string;
  longDescription: string;
  inputFormats: string[];
  outputFormat: string;
  acceptMimeTypes: string;
  allowMultiple: boolean;
  maxFileSizeMb: number;
  privacyNotice: string;
  features: string[];
  howToSteps: ToolStep[];
  useCases: string[];
  faqs: ToolFAQ[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  popular?: boolean;
}

export interface GuideArticle {
  slug: string;
  title: string;
  summary: string;
  readingTime: string;
  category: string;
  publishedDate: string;
  content: string[];
  relatedToolSlugs: string[];
}

export interface ProcessingResult {
  blob: Blob;
  filename: string;
  originalSize?: number;
  processedSize?: number;
  previewUrl?: string;
  previewType?: 'pdf' | 'image' | 'zip' | 'docx';
}

export interface PageInfo {
  pageNumber: number; // 1-based
  rotation: number; // 0, 90, 180, 270
  selected?: boolean;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

export interface AdConfig {
  enabled: boolean;
  client?: string;
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  testMode?: boolean;
}
