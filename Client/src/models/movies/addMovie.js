import { apiCalls, useSessionCheck } from "../other/functions";
import { Button } from "../other/main";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AddMovie(props) {
  const navigate = useNavigate();
  const { sessionCheck } = useSessionCheck();
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({
    name: "",
    genres: [],
    image: "",
    date: "",
  });

  useEffect(() => {
    sessionCheck(props.data);
  }, []);

  const addMovie = async () => {
    if (movie.name !== "" && movie.genres.length > 0 && movie.date !== "") {
      setLoading(true);
      await apiCalls("post", "addMovie", movie);
      navigate("/main/movies");
    } else {
      alert("YOU MUST FILL ALL THE FORM!!");
    }
  };

  const checkGenres = (e) => {
    const genres = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setMovie({ ...movie, genres });
  };

  const genres = [
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

  return (
    <div className="box flex" style={{ gap: "10px" }}>
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
        onChange={(e) => checkGenres(e)}
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
        <button onClick={addMovie}>Save</button>
        <Button link="/main/movies" text="Cancel" />
      </div>
      {loading ? <h3>Loading...</h3> : null}
    </div>
  );
}
