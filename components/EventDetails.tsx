import BookEvents from "@/components/BookEvents";
import EventCard from "@/components/EventCard";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { Event } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";



const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>{tag}</div>
    ))}
  </div>
)

const EventDetails = async ({ params }: { params: Promise<string> }) => {

  'use cache';
  cacheLife('hours');
  const slug = await params;

  const response = await fetch(`${BASE_URL}api/events/${slug}`);

  const { event: { title, description, overview, image, location, date, time, mode, audience, agenda, organizer, tags } } = await response.json();

  if (!description) return notFound();

  const booking = 10;

  const similarEvents: Event[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>Descripción del Evento: {title}</h1>
        <p>{description}</p>
      </div>

      <div className="details">

        <div className="content">
          <Image src={image} alt="Event Banner" width={800} height={800} className="banner" />

          <section className="flex-col-gap-2">
            <h2>Descripción General</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Detalles del Evento</h2>

            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>Sobre el Organizador</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />

        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>Reserva tu lugar</h2>
            {booking > 0 ? (
              <p className="text-sm">
                {booking} Personas registradas para este evento.
              </p>
            ) : (
              <p className="text-sm">
                Se el primero en reservar en este evento.
              </p>
            )}
            <BookEvents />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Eventos Similares</h2>
        <div className="events">
          {similarEvents.length > 0 && similarEvents.map((similarEvent: Event) => (
            <EventCard key={similarEvent.title} event={similarEvent} />
          ))}
        </div>
      </div>

    </section>
  )
}

export default EventDetails