import mongoose, { Document, Schema, Model } from "mongoose";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // stored as "YYYY-MM-DD" after normalization
  time: string; // stored as "HH:MM" (24-hour) after normalization
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a title into a URL-friendly slug.
 * e.g. "Hello World! 2025" → "hello-world-2025"
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // strip non-word characters except hyphens
    .replace(/[\s_]+/g, "-") // collapse whitespace/underscores into a single hyphen
    .replace(/--+/g, "-"); // collapse consecutive hyphens
}

/**
 * Normalises a time string to 24-hour "HH:MM" format.
 * Accepted inputs: "2:30 PM", "2:30pm", "14:30", "02:30"
 */
function normalizeTime(time: string): string {
  const cleaned = time.trim().toUpperCase();

  // 12-hour format: "2:30 PM" / "02:30AM"
  const match12 = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2];
    const period = match12[3];
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  // 24-hour format: "14:30" / "2:05"
  const match24 = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }
  }

  throw new Error(
    `Invalid time: "${time}". Expected "HH:MM" or "H:MM AM/PM".`
  );
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    // Populated automatically in the pre-save hook; unique index enforced below.
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      trim: true,
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
    },
  },
  { timestamps: true }
);

// ─── Pre-save Hook ────────────────────────────────────────────────────────────

EventSchema.pre("save", async function () {
  // Only regenerate the slug when the title is new or has changed,
  // avoiding unnecessary rewrites that would break existing URLs.
  if (this.isNew || this.isModified("title")) {
    this.slug = generateSlug(this.title);
  }

  // Validate and normalise date to "YYYY-MM-DD" ISO format.
  const parsed = new Date(this.date);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: "${this.date}"`);
  }
  this.date = parsed.toISOString().split("T")[0];

  // Normalise time to consistent 24-hour "HH:MM" format.
  this.time = normalizeTime(this.time);
});

// ─── Model ────────────────────────────────────────────────────────────────────

// Reuse an already-compiled model to avoid Mongoose's
// "Cannot overwrite model once compiled" error during Next.js hot reloads.
const Event: Model<IEvent> =
  (mongoose.models.Event as Model<IEvent>) ||
  mongoose.model<IEvent>("Event", EventSchema);

export default Event;
