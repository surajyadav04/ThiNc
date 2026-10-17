export type AnatomyLayerId = 'surface' | 'bones' | 'tendons' | 'nerves' | 'joints';

export interface AnatomyLayer {
  id: AnatomyLayerId;
  label: string;
  sublabel: string;
  description: string;
  clinicalNote: string;
}

export interface Hotspot {
  id: string;
  name: string;
  position: [number, number, number];
  layer: AnatomyLayerId;
  region: 'wrist' | 'thumb' | 'fingers' | 'nerves';
  clinicalSummary: string;
  commonSymptoms: string[];
}

export interface SymptomArea {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  commonComplaints: string[];
  anatomicalStructures: string[];
  whenToSeekCare: string;
  hotspots: {
    title: string;
    description: string;
    x: number; // percentage for 2D diagram
    y: number;
  }[];
}

export interface ConditionInfo {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  overview: string;
  symptoms: string[];
  causes: string[];
  treatment: string[];
  faqs: { question: string; answer: string }[];
}
