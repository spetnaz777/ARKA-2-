export type AutomationPreset = "chatbot" | "workflow" | "webdesign" | "agents";
export type GlowVariant = "cosmic" | "dawn" | "eclipse" | "aurora";

export interface Specimen {
  id: string;
  name: string;
  preset: AutomationPreset;
  glow: GlowVariant;
  complexity: number;
  symmetry: number;
  silicaContent: number; // Represents processing throughput/efficiency for automation
  lumens: number;        // Represents server request speed or response rate (ms)
  imageUrl: string;
  statusText: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  creator: string;
  preset: AutomationPreset;
  imageUrl: string;
}
