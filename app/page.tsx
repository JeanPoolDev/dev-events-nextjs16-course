import EventCard from "@/components/EventCard";
import ExplorerBtn from "@/components/ExplorerBtn";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  'use cache';
  cacheLife('hours');

  const response = await fetch(`${BASE_URL}api/events`);
  const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center">Los eventos de desarrolladores <br /> que no te puedes perder </h1>
      <p className="text-center mt-5">Hacktones, Conferencias, y Juntas, todo en un solo lugar</p>
      <ExplorerBtn />

      <div className="mt-20 space-y-7">
        <h3>Futuros Eventos</h3>

        <ul className="events">
          {
            events && events.length > 0 && events.map((event: IEvent) => (
              <li key={event.title}>
                <EventCard event={event} />
              </li>
            ))
          }
        </ul>
      </div>

    </section>
  )
}

export default Page