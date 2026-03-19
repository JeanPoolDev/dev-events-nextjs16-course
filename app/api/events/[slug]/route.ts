import { Event } from "@/database";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(req: NextResponse, { params }: RouteParams): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const { slug } = await params;

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json({ message: 'El slug es obligatorio' }, { status: 400 });
    }

    const sanitizedSlug = slug.trim().toLocaleLowerCase();

    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    if (!event) {
      return NextResponse.json({ message: `Event con slug ${sanitizedSlug} no encontrado` }, { status: 400 });
    }

    return NextResponse.json({ message: 'Evento encontrado con exito', event }, { status: 200 });


  } catch (error) {
    return NextResponse.json({ message: `Algo sucedio con la llamada GET ${error}` }, { status: 400 });
  }
}