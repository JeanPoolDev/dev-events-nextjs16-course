'use client';

import Image from "next/image"
import posthog from "posthog-js"

const ExplorerBtn = () => {
  return (
    <button onClick={() => { console.log('equisde'); posthog.capture('explore_events_clicked'); }} id="explore-btn" className="mt-7 mx-auto">
      <a href="#events">
        Explora Eventos
        <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
      </a>
    </button>
  )
}

export default ExplorerBtn