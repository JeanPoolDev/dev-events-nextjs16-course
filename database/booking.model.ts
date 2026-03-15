import mongoose, { Document, Schema, Model, Types } from "mongoose";
import Event from "./event.model";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IBooking extends Document {
  eventId: Types.ObjectId; // references Event._id
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

// Simple but effective RFC-compliant email pattern.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
  {
    // Indexed for efficient lookups of all bookings belonging to a given event.
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => EMAIL_REGEX.test(v),
        message: (props: { value: string }) =>
          `"${props.value}" is not a valid email address.`,
      },
    },
  },
  { timestamps: true }
);

// ─── Pre-save Hook ────────────────────────────────────────────────────────────

/**
 * Verifies the referenced event exists before persisting the booking.
 * `exists()` issues a lean count query — much cheaper than `findById`.
 * Throws to abort the save if the event is not found.
 */
BookingSchema.pre("save", async function () {
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error(
      `Cannot create booking: event "${this.eventId}" does not exist.`
    );
  }
});

// ─── Model ────────────────────────────────────────────────────────────────────

// Reuse an already-compiled model to avoid Mongoose's
// "Cannot overwrite model once compiled" error during Next.js hot reloads.
const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking>) ||
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
