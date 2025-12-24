// types/audio.ts
export interface AudioAnalyzerData {
  frequencyData: Uint8Array;
  averageFrequency: number;
}

export interface ColorElementProps {
  id: number;
  shape: 'circle' | 'square' | 'rectangle';
  isActive: boolean;
  activeColor: string;
}