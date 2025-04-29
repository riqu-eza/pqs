/* eslint-disable @typescript-eslint/no-explicit-any */
import { PDFDocument, rgb } from 'pdf-lib';

export async function generatePDFBuffer(quotation: any): Promise<Buffer> {
  const summary = quotation.summary; // 👈 Extract summary from the quotation

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const fontSize = 12;
  let y = 800;

  const drawText = (text: string) => {
    page.drawText(text, { x: 50, y, size: fontSize, color: rgb(0, 0, 0) });
    y -= 20;
  };

  drawText('PAINT QUOTATION SUMMARY');
  drawText('----------------------------');
  drawText(`Total Area: ${summary.totalArea} m²`);

  // Oil Paint Section
  drawText('');
  drawText('Oil Paint:');
  drawText(`- Area: ${summary.oil.area} m²`);
  drawText(`- Double Area: ${summary.oil.doubleArea ? 'Yes' : 'No'}`);
  drawText(`- Undercoat Color: ${summary.oil.undercoatColor}`);
  drawText(`- Topcoat Color: ${summary.oil.topcoatColor}`);
  drawText(`- Total Litres: ${summary.oil.litres}`);
  drawText(`- Packaging: ${Object.entries(summary.oil.packaging).map(([size, qty]) => `${qty} x ${size}L`).join(', ')}`);

  // Water Paint Section
  drawText('');
  drawText('Water Paint:');
  drawText(`- Area: ${summary.water.area} m²`);
  drawText(`- Undercoat Color: ${summary.water.undercoatColor}`);
  drawText(`- Topcoat Color: ${summary.water.topcoatColor}`);
  drawText(`- Total Litres: ${summary.water.litres}`);
  drawText(`- Packaging: ${Object.entries(summary.water.packaging).map(([size, qty]) => `${qty} x ${size}L`).join(', ')}`);

  // Artwork Section
  drawText('');
  drawText('Artwork:');
  drawText(`- Name: ${summary.artwork.name}`);
  drawText(`- Litres: ${summary.artwork.litres}`);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
