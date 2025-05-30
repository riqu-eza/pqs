import { NextRequest } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import quotationModel from '../../../../Models/quotation.model';
import { generatePDFBuffer } from '../../../../lib/pdfGenerator';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing quotation ID', { status: 400 });
  }

  try {
    await connectDB();

    const quotation = await quotationModel.findById(id).lean();
    if (!quotation) {
      return new Response('Quotation not found', { status: 404 });
    }
    const pdfBuffer = await generatePDFBuffer(quotation);
    // Convert Node.js Buffer to Uint8Array for Response
    const pdfUint8Array = new Uint8Array(pdfBuffer);
    return new Response(pdfUint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=quotation-${id}.pdf`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
