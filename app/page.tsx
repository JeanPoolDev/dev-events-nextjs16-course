import EventCard from "@/components/EventCard";
import ExplorerBtn from "@/components/ExplorerBtn"
import { events } from "@/lib/constants";

const Page = () => {
  return (
    <section>
      <h1 className="text-center">Los eventos de desarrolladores <br /> que no te puedes perder </h1>
      <p className="text-center mt-5">Hacktones, Conferencias, y Juntas, todo en un solo lugar</p>
      <ExplorerBtn />

      <div className="mt-20 space-y-7">
        <h3>Futuros Eventos</h3>

        <ul className="events">
          {
            events.map((event) => (
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