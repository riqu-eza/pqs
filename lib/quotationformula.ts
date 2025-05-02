import { QuotationInput } from "../Types/quotation";

export type SizeCoverage = {
  _id: string;
  type: "oil" | "water";
  area: number;
};

export type PackagingOption = {
  _id: string;
  litres: number;
};

export type ArtworkOption = {
  _id: string;
  name: string;
  colorCode: string;
};

export async function fetchSizeCoverage(): Promise<Record<"oil" | "water", number>> {
  const res = await fetch("/api/admin/size");
  if (!res.ok) throw new Error("Failed to fetch size coverage");
  const data: SizeCoverage[] = await res.json();

  return {
    oil: data.find((item) => item.type === "oil")?.area || 0,
    water: data.find((item) => item.type === "water")?.area || 0,
  };
}

export async function fetchPackagingOptions(): Promise<number[]> {
  const res = await fetch("/api/admin/packaging");
  if (!res.ok) throw new Error("Failed to fetch packaging options");
  const data: PackagingOption[] = await res.json();
  return data.map((p) => p.litres).sort((a, b) => b - a);
}

export async function fetchArtworkOptions(): Promise<ArtworkOption[]> {
  const res = await fetch("/api/admin/artwork");
  if (!res.ok) throw new Error("Failed to fetch artwork options");
  return await res.json();
}

export function calculateLitres(area: number, coveragePerLitre: number, multiplier = 1): number {
  const effectiveArea = area * multiplier;
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

// For coats only — no need for artwork options
function distributeLitresByColor(
  totalLitres: number,
  colors: { code: string; percentage: number }[],
  packagingSizes: number[]
) {
  return colors.map((color) => {
    const litres = Math.ceil((color.percentage / 100) * totalLitres);
    const packaging = calculatePackaging(litres, packagingSizes);
    return {
      colorCode: color.code,
      colorName: color.code, // For coats, just use code as name
      litres,
      packaging,
    };
  });
}

/**
 * Final quotation summary combining area, colors, litres, and packaging.
 */
export async function getQuotationSummary(input: QuotationInput) {
  const { oilPaint, waterPaint, artworks, totalArea } = input;

  const [coverage, packagingSizes, artworkOptions] = await Promise.all([
    fetchSizeCoverage(),
    fetchPackagingOptions(),
    fetchArtworkOptions(),
  ]);

  // OIL PAINT: Undercoat = 1 coat, Topcoat = 2 coats (always)
  const oilUndercoatLitres = calculateLitres(oilPaint.area, coverage.oil, 1);
  const oilTopcoatLitres = calculateLitres(oilPaint.area, coverage.oil, 2); // always double

  const oilUndercoatBreakdown = distributeLitresByColor(
    oilUndercoatLitres,
    oilPaint.undercoatColors,
    packagingSizes
  );
  const oilTopcoatBreakdown = distributeLitresByColor(
    oilTopcoatLitres,
    oilPaint.topcoatColors,
    packagingSizes
  );

  // WATER PAINT: Undercoat = 1 coat, Topcoat = 2 coats (always)
  const waterUndercoatLitres = calculateLitres(waterPaint.area, coverage.water, 1);
  const waterTopcoatLitres = calculateLitres(waterPaint.area, coverage.water, 2);

  const waterUndercoatBreakdown = distributeLitresByColor(
    waterUndercoatLitres,
    waterPaint.undercoatColors,
    packagingSizes
  );
  const waterTopcoatBreakdown = distributeLitresByColor(
    waterTopcoatLitres,
    waterPaint.topcoatColors,
    packagingSizes
  );

  // ARTWORKS: Use artworkOptions to get proper name & code
  const artworksSummary = artworks.map((art) => {
    const matched = artworkOptions.find(
      (a) => a.name.toLowerCase() === art.name.toLowerCase()
    );
    const litres = art.litres;
    return {
      id: matched?._id || art.id,
      name: art.name,
      colorCode: matched?.colorCode ?? "N/A",
      litres,
      packaging: calculatePackaging(litres, packagingSizes),
    };
  });

  return {
    totalArea,
    oil: {
      area: oilPaint.area,
      undercoatLitres: oilUndercoatLitres,
      topcoatLitres: oilTopcoatLitres,
      undercoatBreakdown: oilUndercoatBreakdown,
      topcoatBreakdown: oilTopcoatBreakdown,
    },
    water: {
      area: waterPaint.area,
      undercoatLitres: waterUndercoatLitres,
      topcoatLitres: waterTopcoatLitres,
      undercoatBreakdown: waterUndercoatBreakdown,
      topcoatBreakdown: waterTopcoatBreakdown,
    },
    artworks: artworksSummary,
  };
}

