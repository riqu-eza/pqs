// helpers/quotationHelper.ts

type PaintType = 'oil' | 'water';

// Example of formula structure
type Formula = {
  paintType: PaintType;
  litersPerMeterSquared: number;  // How many m2 does 1 liter of paint cover
  packaging: { [key: number]: number }; // 1L, 4L, and 20L packaging
  thinnerRatio: number;  // Ratio of thinner per liter
};

const formulas: { [key in PaintType]: Formula } = {
  oil: {
    paintType: 'oil',
    litersPerMeterSquared: 10, // Example, modify accordingly
    packaging: { 1: 1, 4: 4, 20: 20 }, // Example
    thinnerRatio: 0.2,  // Example, modify accordingly
  },
  water: {
    paintType: 'water',
    litersPerMeterSquared: 12, // Example
    packaging: { 1: 1, 4: 4, 20: 20 }, // Example
    thinnerRatio: 0.15, // Example
  },
};

// CRUD Operations
export const getFormula = (paintType: PaintType): Formula => {
  return formulas[paintType];
};

export const setFormula = (
  paintType: PaintType,
  litersPerMeterSquared: number,
  packaging: { [key: number]: number },
  thinnerRatio: number
) => {
  formulas[paintType] = {
    paintType,
    litersPerMeterSquared,
    packaging,
    thinnerRatio,
  };
};

// Formula Calculation Example
export const calculateQuotation = (
  paintType: PaintType,
  area: number,  // Area in m2
  quantity: number, // Quantity of paint
  packagingSize: number
) => {
  const formula = getFormula(paintType);
  
  // Calculate total liters needed for area
  const litersNeeded = area / formula.litersPerMeterSquared;

  // Calculate how many packs of the specified size (1L, 4L, 20L) will be needed
  const packsNeeded = Math.ceil(litersNeeded / formula.packaging[packagingSize]);

  // Calculate how much thinner is required
  const thinnerRequired = litersNeeded * formula.thinnerRatio;

  return {
    litersNeeded,
    packsNeeded,
    thinnerRequired,
  };
};
