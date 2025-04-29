export type PaintSectionInput = {
    area: number;
    undercoatColor: string;
    topcoatColor: string;
    doubleArea?: boolean;
  };
  
  export type ArtworkInput = {
    name: string;
    litres: number;
  };
  
  export type QuotationInput = {
    totalArea: number;
    oilPaint: PaintSectionInput;
    waterPaint: PaintSectionInput;
    artwork: ArtworkInput;
  };
  