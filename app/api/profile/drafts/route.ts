// app/api/drafts/route.ts
import { Draft } from '../../../../Models/draft.model';

export async function GET(req: NextRequest) {
  await connectDB();
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const decoded: any = verifyToken(token);
    const drafts = await Draft.find({ userId: decoded.userId }).sort({ createdAt: -1 });
    return NextResponse.json({ drafts });
  } catch {
    return NextResponse.json({ message: 'Error fetching drafts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const decoded: any = verifyToken(token);
    const body = await req.json();
    const newDraft = await Draft.create({ ...body, userId: decoded.userId, createdAt: new Date() });
    return NextResponse.json({ draft: newDraft });
  } catch {
    return NextResponse.json({ message: 'Error saving draft' }, { status: 500 });
  }
}
