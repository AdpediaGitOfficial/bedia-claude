import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Generates a copy of the gift voucher template with a coordinate grid overlaid.
 * Open the output PDF to read exact X,Y positions for text placement.
 * Grid lines every 50pts; major lines (100pt) are darker.
 */
export const generateCoordGrid = async (pageIndex = 0): Promise<string> => {
  const templatePath = path.join(process.cwd(), 'uploads/templates/gift-voucher-template.pdf');
  const existingPdfBytes = new Uint8Array(fs.readFileSync(templatePath));
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const page = pdfDoc.getPages()[pageIndex];
  const { width, height } = page.getSize();

  const STEP = 50;

  for (let x = 0; x <= width; x += STEP) {
    const isMajor = x % 100 === 0;
    page.drawLine({
      start: { x, y: 0 },
      end: { x, y: height },
      thickness: isMajor ? 0.6 : 0.3,
      color: isMajor ? rgb(1, 0, 0) : rgb(0.7, 0.3, 0.3),
      opacity: 0.5,
    });
    if (isMajor) {
      page.drawText(String(x), {
        x: x + 2,
        y: height - 12,
        size: 8,
        font,
        color: rgb(1, 0, 0),
        opacity: 0.9,
      });
    }
  }

  for (let y = 0; y <= height; y += STEP) {
    const isMajor = y % 100 === 0;
    page.drawLine({
      start: { x: 0, y },
      end: { x: width, y },
      thickness: isMajor ? 0.6 : 0.3,
      color: isMajor ? rgb(0, 0, 1) : rgb(0.3, 0.3, 0.8),
      opacity: 0.5,
    });
    if (isMajor) {
      page.drawText(String(y), {
        x: 2,
        y: y + 2,
        size: 8,
        font,
        color: rgb(0, 0, 1),
        opacity: 0.9,
      });
    }
  }

  // Draw a small red dot at origin (0,0) so you can orient the axes
  page.drawCircle({ x: 0, y: 0, size: 5, color: rgb(1, 0, 0) });

  page.drawText(
    `Page ${pageIndex + 1}  |  width=${width.toFixed(0)}  height=${height.toFixed(0)}  (PDF pts, origin = bottom-left)`,
    {
      x: 10,
      y: height - 20,
      size: 9,
      font,
      color: rgb(0, 0, 0),
      opacity: 0.85,
    },
  );

  const pdfBytes = await pdfDoc.save();
  const outPath = path.join(
    process.cwd(),
    'uploads/vouchers',
    `coord-grid-p${pageIndex + 1}-${Date.now()}.pdf`,
  );
  fs.writeFileSync(outPath, pdfBytes);
  return outPath;
};
