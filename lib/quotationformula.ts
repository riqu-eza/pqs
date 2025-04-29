import { QuotationInput } from "../Types/quotation";

export type SizeCoverage = {
  _id: string;
  type: 'oil' | 'water';
  area: number;
};

export type PackagingOption = {
  _id: string;
  litres: number;
};

export async function fetchSizeCoverage(): Promise<Record<'oil' | 'water', number>> {
  const res = await fetch('/api/admin/size');
  if (!res.ok) throw new Error('Failed to fetch size coverage');
  const data: SizeCoverage[] = await res.json();

  return {
    oil: data.find(item => item.type === 'oil')?.area || 0,
    water: data.find(item => item.type === 'water')?.area || 0
  };
}

export async function fetchPackagingOptions(): Promise<number[]> {
  const res = await fetch('/api/admin/packaging');
  if (!res.ok) throw new Error('Failed to fetch packaging options');
  const data: PackagingOption[] = await res.json();
  return data.map(p => p.litres).sort((a, b) => b - a);
}

export function calculateLitres(area: number, coveragePerLitre: number, double?: boolean): number {
  const effectiveArea = double ? area * 2 : area;
  return Math.ceil(effectiveArea / coveragePerLitre);
}

export function calculatePackaging(litres: number, packagingSizes: number[]): Record<number, number> {
  const breakdown: Record<number, number> = {};
  let remaining = litres;

  for (const size of packagingSizes) {
    const count = Math.floor(remaining / size);
    if (count > 0) {
      breakdown[size] = count;
      remaining -= count * size;
    }
  }

  if (remaining > 0) {
    const smallest = packagingSizes[packagingSizes.length - 1];
    breakdown[smallest] = (breakdown[smallest] || 0) + 1;
  }

  return breakdown;
}

/**
 * Final quotation summary combining area, colors, litres, and packaging.
 */
export async function getQuotationSummary(input: QuotationInput) {
  const { oilPaint, waterPaint, artwork, totalArea } = input;

  const [coverage, packagingSizes] = await Promise.all([
    fetchSizeCoverage(),
    fetchPackagingOptions()
  ]);

  const oilLitres = calculateLitres(oilPaint.area, coverage.oil, oilPaint.doubleArea);
  const waterLitres = calculateLitres(waterPaint.area, coverage.water);

  const oilPackaging = calculatePackaging(oilLitres, packagingSizes);
  const waterPackaging = calculatePackaging(waterLitres, packagingSizes);

  return {
    totalArea,
    oil: {
      area: oilPaint.area,
      doubleArea: oilPaint.doubleArea,
      undercoatColor: oilPaint.undercoatColor,
      topcoatColor: oilPaint.topcoatColor,
      litres: oilLitres,
      packaging: oilPackaging
    },
    water: {
      area: waterPaint.area,
      undercoatColor: waterPaint.undercoatColor,
      topcoatColor: waterPaint.topcoatColor,
      litres: waterLitres,
      packaging: waterPackaging
    },
    artwork
  };
}
