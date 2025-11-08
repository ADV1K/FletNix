import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    show_id: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Movie', 'TV Show'],
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    director: String,
    cast: [String],
    country: String,
    date_added: String,
    release_year: {
      type: Number,
      required: true,
      index: true,
    },
    rating: String,
    duration: String,
    listed_in: [String],
    description: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for search performance
showSchema.index({ title: 'text', cast: 'text' });
showSchema.index({ type: 1, rating: 1 });

export default mongoose.model('Show', showSchema);

