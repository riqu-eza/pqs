/* eslint-disable @typescript-eslint/no-unused-vars */
export type ColorCodeInput = {
  code: string;
  name?: string;
  percentage: number;
};


export type PaintSectionInput = {
  area: number;
  undercoatColors: ColorCodeInput[];
  topcoatColors: ColorCodeInput[];
  doubleArea?: boolean;
};

// Update your ArtworkInput type
export type ArtworkColor = {
  colorCode: string;
  colorName: string;
  litres: number;
};

export type ArtworkInput = {
  id: string;
  name: string;
  colors: ArtworkColor[];
};


// Update your color selection type
type PaintColor = {
  code: string;
  name: string; // Add this
  percentage: number;
};

export type QuotationInput = {
  quotationName: string;
  totalArea: number;
  oilPaint: PaintSectionInput;
  waterPaint: PaintSectionInput;
  artworks: ArtworkInput[];
};
