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

export type thinningOption = {
  _id: string;
  ratio: number;
};

export async function fetchSizeCoverage(): Promise<
  Record<"oil" | "water", number>
> {
  const res = await fetch("/api/admin/size");
  if (!res.ok) throw new Error("Failed to fetch size coverage");
  const data: SizeCoverage[] = await res.json();

  return {
    oil: data.find((item) => item.type === "oil")?.area || 0,
    water: data.find((item) => item.type === "water")?.area || 0,
  };
}
// ADD: Fetch thinner ratio per 4 litres
export async function fetchThinnerRatio(): Promise<number> {
  const res = await fetch("/api/admin/thinner");
  if (!res.ok) throw new Error("Failed to fetch thinner ratio");
  const data: thinningOption[] = await res.json();
  console.log("thinner", data);
  return data[0]?.ratio || 0;
  // assume the first one is active
}

// ADD: Thinner calculator
function calculateThinnerNeeded(
  totalLitres: number,
  ratioPer4L: number
): number {
  if (!ratioPer4L) return 0;
  return Math.ceil((totalLitres / 4) * ratioPer4L);
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

export function calculateLitres(
  area: number,
  coveragePerLitre: number,
  multiplier = 1
): number {
  const effectiveArea = area * multiplier;
  return Math.ceil(effectiveArea / coveragePerLitre);
}

export function calculatePackaging(
  litres: number,
  packagingSizes: number[]
): Record<number, number> {
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

  const [coverage, packagingSizes, artworkOptions, thinnerRatio] =
    await Promise.all([
      fetchSizeCoverage(),
      fetchPackagingOptions(),
      fetchArtworkOptions(),
      fetchThinnerRatio(),
    ]);

  // Helper packaging filters
  const undercoatPackaging = packagingSizes.filter(
    (size) => size === 1 || size === 4
  );
  const thinnerPackaging = packagingSizes.filter(
    (size) => size === 5 || size === 20
  );

  const getBreakdownWithNames = (
    litres: number,
    colorInput: { code: string; name?: string; percentage: number }[],
    allowedPackaging: number[]
  ) => {
    const breakdown = distributeLitresByColor(
      litres,
      colorInput,
      allowedPackaging
    );
    return breakdown.map((b) => {
      const color = colorInput.find((c) => c.code === b.colorCode);
      return {
        ...b,
        colorName: color?.name || b.colorCode,
      };
    });
  };

  // OIL PAINT
  const oilUndercoatLitres = calculateLitres(oilPaint.area, coverage.oil, 1);
  const oilTopcoatLitres = calculateLitres(oilPaint.area, coverage.oil, 2);

  const oilUndercoatBreakdown = getBreakdownWithNames(
    oilUndercoatLitres,
    oilPaint.undercoatColors,
    undercoatPackaging
  );

  const oilTopcoatBreakdown = getBreakdownWithNames(
    oilTopcoatLitres,
    oilPaint.topcoatColors,
    packagingSizes
  );

  const totalOilLitres = oilUndercoatLitres + oilTopcoatLitres;
  const oilThinnerLitres = calculateThinnerNeeded(totalOilLitres, thinnerRatio);

  // WATER PAINT
  const waterUndercoatLitres = calculateLitres(
    waterPaint.area,
    coverage.water,
    1
  );
  const waterTopcoatLitres = calculateLitres(
    waterPaint.area,
    coverage.water,
    2
  );

  const waterUndercoatBreakdown = getBreakdownWithNames(
    waterUndercoatLitres,
    waterPaint.undercoatColors,
    undercoatPackaging
  );

  const waterTopcoatBreakdown = getBreakdownWithNames(
    waterTopcoatLitres,
    waterPaint.topcoatColors,
    packagingSizes
  );

  // ARTWORK
  const artworksSummary = artworks.map((art) => {
    const matched = artworkOptions.find(
      (a) => a.name.toLowerCase() === art.name.toLowerCase()
    );

    const colors = art.colors?.length
      ? art.colors.map((color) => ({
          colorCode: color.colorCode,
          colorName: color.colorName,
          litres: color.litres,
          packaging: calculatePackaging(color.litres, packagingSizes),
        }))
      : (Array.isArray(matched?.colorCode)
          ? matched.colorCode
          : [matched?.colorCode || ""]
        )
          .filter(Boolean)
          .map((code) => ({
            colorCode: code,
            colorName: code,
            litres: 1,
            packaging: calculatePackaging(1, packagingSizes),
          }));

    return {
      id: matched?._id || art.id,
      name: art.name,
      colors,
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
      thinner: {
        litres: oilThinnerLitres,
        packaging: calculatePackaging(oilThinnerLitres, thinnerPackaging),
      },
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
