/* eslint-disable @typescript-eslint/no-explicit-any */
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generatePDFBuffer(
  quotation: any,
  ownerName: string = "Client"
): Promise<Buffer> {
  const summary = quotation.summary;
  const issueDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const clientName = ownerName ?? "Client";
  const quotationName =
    quotation.formData?.quotationName ?? "Unnamed Quotation";

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  let y = 780;

  const drawRow = (label: string, value: string, offset = 50) => {
    page.drawText(`${label}:`, {
      x: offset,
      y,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
    page.drawText(value, {
      x: offset + 120,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 18;
  };

  const drawSectionTitle = (title: string) => {
    y -= 12;
    page.drawText(title, {
      x: 50,
      y,
      size: 13,
      font,
      color: rgb(0, 0, 0.7),
    });
    y -= 10;
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 20;
  };

  const formatPackaging = (packaging: Record<number, number>) =>
    Object.entries(packaging)
      .map(([size, qty]) => `${qty} x ${size}L`)
      .join(", ");

  // Header Info
  page.drawText("PAINTWORKS QUOTATION", {
    x: 50,
    y,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  drawRow("Date", issueDate);
  drawRow("Quotation Name", quotationName);
  drawRow("Client", clientName);
  drawRow("Total Area", `${summary.totalArea} m²`);

  // Gloss Paint
  drawSectionTitle("Gloss Paint");
  drawRow("Area", `${summary.oil.area} m²`);
  drawRow("Undercoat Total Litres", `${summary.oil.undercoatLitres}`);
  summary.oil.undercoatBreakdown.forEach((item: any) => {
    drawRow(
      `Undercoat (${item.colorCode})`,
      `${item.litres} L — ${formatPackaging(item.packaging)}`
    );
  });
  drawRow("Topcoat Total Litres", `${summary.oil.topcoatLitres}`);
  summary.oil.topcoatBreakdown.forEach((item: any) => {
    drawRow(
      `Topcoat (${item.colorCode})`,
      `${item.litres} L — ${formatPackaging(item.packaging)}`
    );
  });

  if (summary.oil.thinner?.litres) {
    drawRow("Thinner Needed", `${summary.oil.thinner.litres} L`);
    drawRow(
      "Thinner Packaging",
      formatPackaging(summary.oil.thinner.packaging)
    );
  }

  // Water Paint
  drawSectionTitle("Water Paint");
  drawRow("Area", `${summary.water.area} m²`);
  drawRow("Undercoat Total Litres", `${summary.water.undercoatLitres}`);
  summary.water.undercoatBreakdown.forEach((item: any) => {
    drawRow(
      `Undercoat (${item.colorCode})`,
      `${item.litres} L — ${formatPackaging(item.packaging)}`
    );
  });
  drawRow("Topcoat Total Litres", `${summary.water.topcoatLitres}`);
  summary.water.topcoatBreakdown.forEach((item: any) => {
    drawRow(
      `Topcoat (${item.colorCode})`,
      `${item.litres} L — ${formatPackaging(item.packaging)}`
    );
  });

  // Artworks
  // Artworks
drawSectionTitle("Artworks");
if (summary.artworks?.length) {
  summary.artworks.forEach((art: any) => {
    page.drawText(`${art.name}:`, {
      x: 50,
      y,
      size: fontSize,
      font,
      color: rgb(0.1, 0.1, 0.6),
    });
    y -= 18;
    art.colors.forEach((color: any) => {
      drawRow(
        `- ${color.colorCode}`,
        `${color.litres} L — ${formatPackaging(color.packaging)}`,
        60
      );
    });
    y -= 8; // Add a small gap after each artwork block
  });
} else {
  drawRow("None", "-");
}


  // Footer Section
  const footerY = 40;
  const footerFontSize = 9;
  const timestamp = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  
  

  page.drawLine({
    start: { x: 50, y: footerY + 20 },
    end: { x: width - 50, y: footerY + 20 },
    thickness: 0.5,
    color: rgb(0.5, 0.5, 0.5),
  });

  page.drawText("Company: Dancah Technology ltd.", {
    x: 50,
    y: footerY,
    size: footerFontSize,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText("Email: info@dancahtechnologies.co.ke", {
    x: 50,
    y: footerY - 12,
    size: footerFontSize,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText("Tel: +254 794369806 | Nairobi, Kenya", {
    x: 50,
    y: footerY - 24,
    size: footerFontSize,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText(` ${timestamp}`, {
    x: width - 50,
    y: footerY,
    size: footerFontSize,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
