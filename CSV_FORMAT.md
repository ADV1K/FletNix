# CSV Format for netflix_titles.csv

The application expects a CSV file named `netflix_titles.csv` in the root directory with the following columns:

## Required Columns

- `show_id` - Unique identifier for the show (string)
- `type` - Either "Movie" or "TV Show" (string)
- `title` - Title of the show (string)
- `release_year` - Year the show was released (number)

## Optional Columns

- `director` - Director name(s), comma-separated if multiple (string)
- `cast` - Cast members, comma-separated (string)
- `country` - Country of origin (string)
- `date_added` - Date added to Netflix (string)
- `rating` - Content rating (e.g., "R", "PG-13", "TV-MA") (string)
- `duration` - Duration (e.g., "90 min", "2 Seasons") (string)
- `listed_in` - Genres/categories, comma-separated (string)
- `description` - Show description (string)

## Example CSV Format

```csv
show_id,type,title,director,cast,country,date_added,release_year,rating,duration,listed_in,description
s1,Movie,Example Movie,John Doe,"Jane Smith, Bob Johnson",United States,January 1, 2020,2020,PG-13,90 min,"Action, Drama","A thrilling action movie..."
s2,TV Show,Example Series,Jane Director,"Actor One, Actor Two",United States,February 15, 2021,2021,TV-MA,2 Seasons,"Comedy, Romance","A hilarious comedy series..."
```

## Notes

- The CSV file should be UTF-8 encoded
- Comma-separated values within fields (like cast, listed_in) should be properly quoted
- Empty values are allowed for optional fields
- The seed script will automatically parse and import the data into MongoDB

## Getting the Dataset

You can find Netflix titles datasets on platforms like:
- Kaggle
- GitHub datasets
- Data.gov

Make sure the dataset matches the format described above.

