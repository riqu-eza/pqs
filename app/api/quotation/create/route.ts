import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import quotationModel from "../../../../Models/quotation.model";
import { User } from "../../../../Models/user.model"; // ✅ Correct import
import { verifyToken } from "../../../../lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token || "") as { userId: string };

    await connectDB();

    const user = await User.findById(decoded.userId); // ✅ Correct usage
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { formData, summary } = body;

    if (!formData || !summary) {
      return NextResponse.json(
        { message: "Missing formData or summary" },
        { status: 400 }
      );
    }

    const quotation = await quotationModel.create({
      formData,
      summary,
      owner: user._id,
    });

    return NextResponse.json(
      { message: "Quotation saved", quotation },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error saving quotation:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token || "") as { userId: string };

    await connectDB();

    const quotations = await quotationModel.find({ owner: decoded.userId });

    return NextResponse.json({ quotations }, { status: 200 });
  } catch (err) {
    console.error("Error fetching quotations:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
