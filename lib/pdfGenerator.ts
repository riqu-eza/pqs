/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generatePDFBuffer(quotation: any, ownerName: string = 'Client'): Promise<Buffer> {
  const summary = quotation.summary;
  const issueDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const clientName = ownerName ?? 'Client';
  const quotationName = quotation.formData?.quotationName ?? 'Unnamed Quotation';
  
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  let y = 800;

  const drawText = (text: string, options = {}) => {
    page.drawText(text, {
      x: 50,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
      ...(options as any),
    });
    y -= 18;
  };

  const drawSectionTitle = (title: string) => {
    drawText("");
    page.drawText(title, {
      x: 50,
      y,
      size: 13,
      font,
      color: rgb(0.2, 0.2, 0.6),
    });
    y -= 20;
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0.2, 0.2, 0.6),
    });
    y -= 10;
  };

  const formatPackaging = (packaging: Record<number, number>) =>
    Object.entries(packaging)
      .map(([size, qty]) => `${qty} x ${size}L`)
      .join(", ");

  // Header
  drawText("OFFICIAL PAINT QUOTATION", { size: 16 });
  y -= 10;
  drawText(`Date: ${issueDate}`);
  drawText(`Quotation Name: ${quotationName}`);
  drawText(`Client: ${clientName}`);
  drawText(`Total Area: ${summary.totalArea} m²`);

  // OIL PAINT SECTION
  drawSectionTitle("Gloss Paint");
  drawText(`Area: ${summary.oil.area} m²`);
  drawText(`Undercoat Total Litres: ${summary.oil.undercoatLitres}`);
  summary.oil.undercoatBreakdown.forEach((color: any) => {
    drawText(
      `- Undercoat (${color.colorCode}): ${color.litres}L — ${formatPackaging(
        color.packaging
      )}`
    );
  });
  drawText(`Topcoat Total Litres: ${summary.oil.topcoatLitres}`);
  summary.oil.topcoatBreakdown.forEach((color: any) => {
    drawText(
      `- Topcoat (${color.colorCode}): ${color.litres}L — ${formatPackaging(
        color.packaging
      )}`
    );
  });

  // WATER PAINT SECTION
  drawSectionTitle("Water Paint");
  drawText(`Area: ${summary.water.area} m²`);
  drawText(`Undercoat Total Litres: ${summary.water.undercoatLitres}`);
  summary.water.undercoatBreakdown.forEach((color: any) => {
    drawText(
      `- Undercoat (${color.colorCode}): ${color.litres}L — ${formatPackaging(
        color.packaging
      )}`
    );
  });
  drawText(`Topcoat Total Litres: ${summary.water.topcoatLitres}`);
  summary.water.topcoatBreakdown.forEach((color: any) => {
    drawText(
      `- Topcoat (${color.colorCode}): ${color.litres}L — ${formatPackaging(
        color.packaging
      )}`
    );
  });

  // ARTWORK SECTION
  drawSectionTitle("Artwork");
  if (summary.artworks.length === 0) {
    drawText("No artwork items specified.");
  } else {
    summary.artworks.forEach((art: any) => {
      drawText(
        `- ${art.name} (${art.colorCode}): ${art.litres}L — ${formatPackaging(
          art.packaging
        )}`
      );
    });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
