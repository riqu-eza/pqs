export type ColorCodeInput = {
  code: string;
  percentage: number;
};

export type PaintSectionInput = {
  area: number;
  undercoatColors: ColorCodeInput[];
  topcoatColors: ColorCodeInput[];
  doubleArea?: boolean;
};

export type ArtworkInput = {
  colorCode: string; // or appropriate type
  name: string;
  litres: number;
  id: string;
};

export type QuotationInput = {
  quotationName: string;
  totalArea: number;
  oilPaint: PaintSectionInput;
  waterPaint: PaintSectionInput;
  artworks: ArtworkInput[];
};
