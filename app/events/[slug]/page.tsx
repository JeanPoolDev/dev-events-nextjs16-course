import EventDetails from "@/components/EventDetails";
import { Suspense } from "react";


const EventPage = async ({ params }: { params: Promise<{ slug: string }> }) => {

  const slug = params.then((p) => p.slug);

  return (
    <main>
      <Suspense fallback={<div>Cargando...</div>}>
        <EventDetails params={slug} />
      </Suspense>
    </main>
  )

}

export default EventPage