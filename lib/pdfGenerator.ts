/* eslint-disable @typescript-eslint/no-explicit-any */
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";



export async function generatePDFBuffer(
  quotation: any,
): Promise<Buffer> {
  const summary = quotation.summary;
  const issueDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
    const clientName = "SignWritter"; // Hardcoded here
  const quotationName =
    quotation.formData?.quotationName?.trim() || "Unnamed Quotation";

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  let y = 780;
  const lineHeight = 18;

  const drawText = (
    text: string,
    x: number,
    yPos: number,
    size = fontSize,
    color = rgb(0, 0, 0)
  ) => {
    page.drawText(text, { x, y: yPos, size, font, color });
  };

  const drawRow = (label: string, value: string, offset = 50) => {
    drawText(`${label}:`, offset, y, fontSize, rgb(0.2, 0.2, 0.2));
    drawText(value, offset + 130, y, fontSize, rgb(0, 0, 0));
    y -= lineHeight;
  };

  const drawSectionTitle = (title: string) => {
    y -= 12;
    drawText(title, 50, y, 14, rgb(0.1, 0.1, 0.6));
    y -= 10;
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 20;
  };

  const drawBreakdown = (title: string, breakdown: any[]) => {
    if (breakdown.length) {
      breakdown.forEach((item) => {
        drawRow(
          `${title} (${item.colorCode} - ${item.colorName})`,
          `${item.litres}L — ${formatPackaging(item.packaging)}`,
          60
        );
      });
    } else {
      drawRow(`${title} Breakdown`, "None", 60);
    }
  };

  const formatPackaging = (packaging: Record<string, number> = {}) =>
    Object.entries(packaging)
      .map(([size, qty]) => `${qty} × ${size}L`)
      .join(", ");

  // Header
  drawText("PAINTWORKS QUOTATION", 50, y, 16, rgb(0, 0, 0));
  y -= 30;

  drawRow("Date", issueDate);
  drawRow("Quotation Name", quotationName);
  drawRow("Client", clientName);
  drawRow("Total Area", `${summary.totalArea} m²`);

  // Gloss Paint (Oil)
  if (summary.oil.area > 0) {
    drawSectionTitle("Gloss Paint (Oil)");

    drawRow("Area", `${summary.oil.area} m²`);
    drawRow("Undercoat Total", `${summary.oil.undercoatLitres} L`);
    drawBreakdown("Colors", summary.oil.undercoatBreakdown);

    drawRow("Topcoat Total", `${summary.oil.topcoatLitres} L`);
    drawBreakdown("Colors", summary.oil.topcoatBreakdown);

    if (summary.oil.thinner?.litres > 0) {
      drawRow("Solvents", `${summary.oil.thinner.litres} L`);
      drawRow("Solvent Packaging", formatPackaging(summary.oil.thinner.packaging));
    }
  }

  // Water Paint (Vinly matt)
  if (summary.water.area > 0) {
    drawSectionTitle("Vinly matt Paint (Water)");

    drawRow("Area", `${summary.water.area} m²`);
    drawRow("Undercoat Total", `${summary.water.undercoatLitres} L`);
    drawBreakdown("Colors", summary.water.undercoatBreakdown);

    drawRow("Topcoat Total", `${summary.water.topcoatLitres} L`);
    drawBreakdown("Colors", summary.water.topcoatBreakdown);
  }

  // Artworks
  drawSectionTitle("Artworks");

  if (summary.artworks && summary.artworks.length > 0) {
    summary.artworks.forEach((art: any) => {
      drawText(`${art.name}:`, 50, y, fontSize, rgb(0.1, 0.1, 0.6));
      y -= lineHeight;

      if (art.colors.length > 0) {
        art.colors.forEach((color: any) => {
          drawRow(
            `- ${color.colorCode} (${color.colorName})`,
            `${color.litres} L — ${formatPackaging(color.packaging)}`,
            60
          );
        });
      } else {
        drawRow("- No colors", "-", 60);
      }

      y -= 8;
    });
  } else {
    drawRow("None", "-");
  }

  // Footer
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

  drawText("Company: Dancah Technology Ltd.", 50, footerY, footerFontSize);
  drawText("Email: info@dancahtechnologies.co.ke", 50, footerY - 12, footerFontSize);
  drawText("Tel: +254 794369806 | Nairobi, Kenya", 50, footerY - 24, footerFontSize);
  drawText(`${timestamp}`, width - 50, footerY, footerFontSize);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
