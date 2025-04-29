// app/api/quotation/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import quotationModel from '../../../../Models/quotation.model';
import { generatePDFBuffer } from '../../../../lib/pdfGenerator';
import { sendEmailWithAttachment } from '../../../../lib/emailSender';
import { verifyToken } from '../../../../lib/auth';
import { User } from '../../../../Models/user.model';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Extract and verify token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { userId: string };

    // ✅ Get user
    const user = await User.findById(decoded.userId).select('email');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // ✅ Get quotation
    const body = await req.json();
    const { quotationId } = body;
    console.log("quot id to be sent", quotationId );
    const quotation = await quotationModel.findById(quotationId);
    console.log("the quotation emailed", quotation);
    if (!quotation) {
      return NextResponse.json({ message: 'Quotation not found' }, { status: 404 });
    }

    // ✅ Generate PDF and send email
    const pdfBuffer = await generatePDFBuffer(quotation);
    await sendEmailWithAttachment({
      to: user.email,
      subject: 'Your Quotation PDF',
      text: 'Please find your quotation attached.',
      attachments: [{
        filename: 'quotation.pdf',
        content: pdfBuffer,
      }]
    });

    return NextResponse.json({ message: 'Email sent to ' + user.email }, { status: 200 });
  } catch (err) {
    console.error('Email sending failed:', err);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}
