import { QuotationInput } from "../Types/quotation";

export function calculateOilPaintArea(input: QuotationInput): number {
  const { area, doubleArea } = input.oilPaint;
  return doubleArea ? area * 2 : area;
}

export function getQuotationSummary(input: QuotationInput) {
  return {
    totalArea: input.totalArea,
    oilPaintArea: calculateOilPaintArea(input),
    oilUndercoat: input.oilPaint.undercoatColor,
    oilTopcoat: input.oilPaint.topcoatColor,
    waterPaintArea: input.waterPaint.area,
    waterUndercoat: input.waterPaint.undercoatColor,
    waterTopcoat: input.waterPaint.topcoatColor,
    artwork: input.artwork,
  };
}
