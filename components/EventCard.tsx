'use client';

import { EventItem } from "@/types";
import Image from "next/image";
import Link from "next/link"
import posthog from "posthog-js"

interface Props {
  event: EventItem;
}

const EventCard = ({ event }: Props) => {

  const { title, image, slug, location, date, time } = event;

  const handleClick = () => {
    posthog.capture('event_card_clicked', {
      event_title: title,
      event_slug: slug,
      event_location: location,
      event_date: date,
    });
  };

  return (
    <Link href={`/events/${slug}`} id="event-card" onClick={handleClick}>
      <Image src={image} alt={title} width={410} height={300} className="poster" />

      <div className="flex flex-row gap-2">
        <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
        <p>{location}</p>
      </div>

      <p className="title">{title}</p>

      <div className="datetime">
        <div>
          <Image src="/icons/calendar.svg" alt="calendar" width={14} height={14} />
          <p>{date}</p>
        </div>
        <div>
          <Image src="/icons/clock.svg" alt="clock" width={14} height={14} />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  )
}

export default EventCard