// Single entry point for all database models.
// Import from "@/database" instead of individual model files.
export { default as Event } from "./event.model";
export { default as Booking } from "./booking.model";

// Named type exports for use in Server Actions, Route Handlers, etc.
export type { IEvent } from "./event.model";
export type { IBooking } from "./booking.model";
