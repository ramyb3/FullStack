import { apiCalls, useSessionCheck } from "../other/functions";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditMovie(props) {
  const navigate = useNavigate();
  const { sessionCheck } = useSessionCheck();
  const params = useParams();
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
    };

    sessionCheck(props.data);
    getMovie();
  }, []);

  const send = async (x) => {
    if (x == 1) {
      if (movie.name != "" && movie.genres.length != 0 && movie.date != "") {
        await apiCalls("post", "updateMovie", movie);
        navigate("/main/movies");
      } else {
        alert("YOU MUST FILL ALL THE FORM!!");
      }
    } else {
      navigate("/main/movies");
    }
  };

  const check = (e) => {
    let value = Array.from(e.target.selectedOptions, (option) => option.value);

    setMovie({ ...movie, genres: value });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Edit Movie Page</h2>

      <div className="box">
        <br />
        Enter the name of the movie:
        <br />{" "}
        <input
          type="text"
          value={movie.name}
          onChange={(e) => setMovie({ ...movie, name: e.target.value })}
        />
        <br />
        <br />
        Select the genres of the movie: <br />
        <select
          style={{ width: "200px", textAlign: "center" }}
          multiple="multiple"
          onChange={(e) => check(e)}
        >
          {movie.genres.includes("Action") ? (
            <option value="Action" selected>
              Action
            </option>
          ) : (
            <option value="Action">Action</option>
          )}

          {movie.genres.includes("Adventure") ? (
            <option value="Adventure" selected>
              Adventure
            </option>
          ) : (
            <option value="Adventure">Adventure</option>
          )}

          {movie.genres.includes("Anime") ? (
            <option value="Anime" selected>
              Anime
            </option>
          ) : (
            <option value="Anime">Anime</option>
          )}

          {movie.genres.includes("Comedy") ? (
            <option value="Comedy" selected>
              Comedy
            </option>
          ) : (
            <option value="Comedy">Comedy</option>
          )}

          {movie.genres.includes("Crime") ? (
            <option value="Crime" selected>
              Crime
            </option>
          ) : (
            <option value="Crime">Crime</option>
          )}

          {movie.genres.includes("Drama") ? (
            <option value="Drama" selected>
              Drama
            </option>
          ) : (
            <option value="Drama">Drama</option>
          )}

          {movie.genres.includes("Espionage") ? (
            <option value="Espionage" selected>
              Espionage
            </option>
          ) : (
            <option value="Espionage">Espionage</option>
          )}

          {movie.genres.includes("Family") ? (
            <option value="Family" selected>
              Family
            </option>
          ) : (
            <option value="Family">Family</option>
          )}

          {movie.genres.includes("Fantasy") ? (
            <option value="Fantasy" selected>
              Fantasy
            </option>
          ) : (
            <option value="Fantasy">Fantasy</option>
          )}

          {movie.genres.includes("History") ? (
            <option value="History" selected>
              History
            </option>
          ) : (
            <option value="History">History</option>
          )}

          {movie.genres.includes("Horror") ? (
            <option value="Horror" selected>
              Horror
            </option>
          ) : (
            <option value="Horror">Horror</option>
          )}

          {movie.genres.includes("Legal") ? (
            <option value="Legal" selected>
              Legal
            </option>
          ) : (
            <option value="Legal">Legal</option>
          )}

          {movie.genres.includes("Medical") ? (
            <option value="Medical" selected>
              Medical
            </option>
          ) : (
            <option value="Medical">Medical</option>
          )}

          {movie.genres.includes("Music") ? (
            <option value="Music" selected>
              Music
            </option>
          ) : (
            <option value="Music">Music</option>
          )}

          {movie.genres.includes("Mystery") ? (
            <option value="Mystery" selected>
              Mystery
            </option>
          ) : (
            <option value="Mystery">Mystery</option>
          )}

          {movie.genres.includes("Romance") ? (
            <option value="Romance" selected>
              Romance
            </option>
          ) : (
            <option value="Romance">Romance</option>
          )}

          {movie.genres.includes("Science-Fiction") ? (
            <option value="Science-Fiction" selected>
              Science-Fiction
            </option>
          ) : (
            <option value="Science-Fiction">Science-Fiction</option>
          )}

          {movie.genres.includes("Sports") ? (
            <option value="Sports" selected>
              Sports
            </option>
          ) : (
            <option value="Sports">Sports</option>
          )}

          {movie.genres.includes("Supernatural") ? (
            <option value="Supernatural" selected>
              Supernatural
            </option>
          ) : (
            <option value="Supernatural">Supernatural</option>
          )}

          {movie.genres.includes("Thriller") ? (
            <option value="Thriller" selected>
              Thriller
            </option>
          ) : (
            <option value="Thriller">Thriller</option>
          )}

          {movie.genres.includes("War") ? (
            <option value="War" selected>
              War
            </option>
          ) : (
            <option value="War">War</option>
          )}

          {movie.genres.includes("Western") ? (
            <option value="Western" selected>
              Western
            </option>
          ) : (
            <option value="Western">Western</option>
          )}
        </select>
        <br />
        <br />
        Enter the movie image link:
        <br />{" "}
        <input
          style={{ width: "80%" }}
          type="url"
          value={movie.image}
          onChange={(e) => setMovie({ ...movie, image: e.target.value })}
        />
        <br />
        <br />
        Enter the date the movie premiered: <br />
        <input
          type="date"
          value={movie.date}
          onChange={(e) => setMovie({ ...movie, date: e.target.value })}
        />
        <br />
        <br />
        <button onClick={() => send(1)}>Update</button>
        <button onClick={() => send(2)}>Cancel</button>
        <br />
        <br />
      </div>
      <br />
    </div>
  );
}
