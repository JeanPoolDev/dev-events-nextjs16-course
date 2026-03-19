'use client';

import { useState } from "react";

const BookEvents = () => {

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTimeout(() => {
      setSubmitted(true)
    }, 1000)

  }

  return (
    <div id="book-event">
      {submitted ? (
        <p>Gracias por Registrarte.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Dirección de Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu Correo Electronico"
              id="email"
            />
          </div>
          <button type="submit" className="button-submit">Enviar</button>
        </form>
      )}
    </div>
  )
}

export default BookEvents