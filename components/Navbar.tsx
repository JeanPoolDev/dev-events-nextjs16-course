'use client';

import Image from "next/image"
import Link from "next/link"
import posthog from "posthog-js"

const Navbar = () => {
  const handleNavClick = (label: string) => {
    posthog.capture('nav_link_clicked', { label });
  };

  return (
    <header>
      <nav>
        <Link href="/" className="logo" onClick={() => handleNavClick('logo')}>
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>Jp Events</p>
        </Link>

        <ul>
          <Link href="/" onClick={() => handleNavClick('Inicio')}>Inicio</Link>
          <Link href="/" onClick={() => handleNavClick('Eventos')}>Eventos</Link>
          <Link href="/" onClick={() => handleNavClick('Crear Eventos')}>Crear Eventos</Link>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar