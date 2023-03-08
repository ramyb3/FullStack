import { useFunctions } from "../other/functions";
import { Button } from "../other/main";
import { useState } from "react";

export const genres = [
  "Action",
  "Adventure",
  "Anime",
  "Comedy",
  "Crime",
  "Drama",
  "Espionage",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Legal",
  "Medical",
  "Music",
  "Mystery",
  "Romance",
  "Science-Fiction",
  "Sports",
  "Supernatural",
  "Thriller",
  "War",
  "Western",
];

export const checkGenres = (e) => {
  return Array.from(e.target.selectedOptions, (option) => option.value);
};

export default function AddMovie(props) {
  const { movieReq } = useFunctions();
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({
    name: "",
    genres: [],
    image: "",
    date: "",
  });

  return (
    <div className="box flex-column" style={{ gap: "10px" }}>
      <h2>Add Movie Page</h2>
      <input
        placeholder="Enter Movie Name"
        type="text"
        onChange={(e) => setMovie({ ...movie, name: e.target.value })}
      />
      Select the genres of the movie:
      <select
        style={{ width: "200px", textAlign: "center", marginTop: "-8px" }}
        multiple="multiple"
        onChange={(e) => setMovie({ ...movie, genres: checkGenres(e) })}
      >
        {genres.map((genre, index) => {
          return (
            <option key={index} value={genre}>
              {genre}
            </option>
          );
        })}
      </select>
      <input
        placeholder="Enter Movie Image Link"
        type="url"
        onChange={(e) => setMovie({ ...movie, image: e.target.value })}
      />
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Enter the date the movie premiered:
        <input
          type="date"
          onChange={(e) => setMovie({ ...movie, date: e.target.value })}
        />
      </span>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => movieReq("", movie, "add", props.refresh, setLoading)}
        >
          Save
        </button>
        <Button link="" text="Cancel" onClick={props.refresh} />
      </div>
      {loading ? <h3>Loading...</h3> : null}
    </div>
  );
}
