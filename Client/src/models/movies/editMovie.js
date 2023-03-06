import { Button } from "../other/main";
import { apiCalls, useSessionCheck } from "../other/functions";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditMovie(props) {
  const navigate = useNavigate();
  const { sessionCheck } = useSessionCheck();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({
    genres: [],
    name: "",
    id: "",
    image: "",
    date: "",
  });

  useEffect(() => {
    const getMovie = async () => {
      const resp = await apiCalls("get", `editMovie/${params.id}`);

      setMovie({
        genres: resp[0].Genres,
        name: resp[0].Name,
        id: resp[0]._id,
        image: resp[0].Image,
        date: resp[1],
      });

      setLoading(false);
    };

    sessionCheck(props.data);
    setLoading(true);
    getMovie();
  }, []);

  const updateMovie = async () => {
    if (movie.name !== "" && movie.genres.length > 0 && movie.date !== "") {
      setLoading(true);
      await apiCalls("post", "updateMovie", movie);
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
    <div style={{ textAlign: "center" }}>
      <h2>Edit Movie Page</h2>

      <div className="box flex" style={{ gap: "10px", paddingTop: "10px" }}>
        <Input
          text="name of the movie"
          type="text"
          value={movie.name}
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
              <option
                key={index}
                value={genre}
                selected={movie.genres.includes(genre) ? true : false}
              >
                {genre}
              </option>
            );
          })}
        </select>
        <Input
          text="movie image link"
          type="url"
          value={movie.image}
          onChange={(e) => setMovie({ ...movie, image: e.target.value })}
        />
        <Input
          text="date the movie premiered"
          type="date"
          value={movie.date}
          onChange={(e) => setMovie({ ...movie, date: e.target.value })}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={updateMovie}>Update</button>
          <Button link="/main/movies" text="Cancel" />
        </div>
        {loading ? <h3>Loading...</h3> : null}
      </div>
    </div>
  );
}

function Input(props) {
  return (
    <span
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      Enter the {props.text}:
      <input type={props.type} onChange={props.onChange} value={props.value} />
    </span>
  );
}
