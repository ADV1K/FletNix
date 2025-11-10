import mongoose from 'mongoose';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Show from '../models/Show.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fletnix';
// In Docker, CSV is mounted at /app/netflix_titles.csv, otherwise use relative path
const CSV_PATH = process.env.CSV_PATH || (process.env.NODE_ENV === 'production' 
  ? '/app/netflix_titles.csv' 
  : path.join(__dirname, '../../netflix_titles.csv'));

async function seedDatabase() {
  try {
    // Don't connect/disconnect - use existing connection from app.js
    // Check if data already exists
    const count = await Show.countDocuments();
    if (count > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    // Read CSV file
    console.log(`Reading CSV from: ${CSV_PATH}`);
    if (!fs.existsSync(CSV_PATH)) {
      throw new Error(`CSV file not found at: ${CSV_PATH}`);
    }

    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');

    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    console.log(`Found ${records.length} records in CSV`);

    // Transform and insert records
    const shows = [];

    for (const record of records) {
      const show = {
        show_id: record.show_id,
        type: record.type === 'Movie' || record.type === 'TV Show' ? record.type : 'Movie',
        title: record.title || '',
        release_year: parseInt(record.release_year) || 0,
      };

      if (record.director) show.director = record.director;
      if (record.cast) {
        show.cast = record.cast.split(',').map((c) => c.trim()).filter(Boolean);
      }
      if (record.country) show.country = record.country;
      if (record.date_added) show.date_added = record.date_added;
      if (record.rating) show.rating = record.rating;
      if (record.duration) show.duration = record.duration;
      if (record.listed_in) {
        show.listed_in = record.listed_in.split(',').map((g) => g.trim()).filter(Boolean);
      }
      if (record.description) show.description = record.description;

      shows.push(show);
    }

    // Insert in batches
    const batchSize = 1000;
    for (let i = 0; i < shows.length; i += batchSize) {
      const batch = shows.slice(i, i + batchSize);
      await Show.insertMany(batch, { ordered: false });
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(shows.length / batchSize)}`);
    }

    console.log(`Successfully seeded ${shows.length} shows`);
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

// Run if called directly (standalone mode - needs its own connection)
if (import.meta.url === `file://${path.resolve(process.argv[1])}` || process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB for seeding');
      await seedDatabase();
      await mongoose.disconnect();
      console.log('Seeding completed');
      process.exit(0);
    } catch (error) {
      console.error('Seeding failed:', error);
      await mongoose.disconnect().catch(() => {});
      process.exit(1);
    }
  })();
}

export { seedDatabase };

