import { apiCalls, useSessionCheck } from "../other/functions";
import { Button } from "../other/main";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Movie(props) {
  const params = useParams();
  const { sessionCheck } = useSessionCheck();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({
    id: 0,
    name: "",
    genres: [],
    image: "",
    date: "",
  });

  useEffect(() => {
    const getMovie = async () => {
      const resp = await apiCalls("get", `movies/${params.id}`);

      setSubs(resp[0]);
      setMovie({
        id: resp[1]._id,
        name: resp[1].Name,
        genres: resp[1].Genres,
        image: resp[1].Image,
        date: resp[1].Premiered,
      });

      setLoading(false);
    };

    sessionCheck(props.data);
    setLoading(true);
    getMovie();
  }, []);

  const deleteMovie = async () => {
    await apiCalls("delete", `deleteMovie/${movie.id}`);
  };

  return (
    <div className="flex-column" style={{ marginTop: "10px" }}>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <div className="box1 flex-column">
          <h2>{`${movie.name}, ${movie.date.slice(0, 4)}`}</h2>

          <big style={{ paddingBottom: "10px" }}>
            <b>Genres: </b>
            {movie.genres.map((genre, index) => {
              return `${genre}${index !== movie.genres.length - 1 ? ", " : ""}`;
            })}
          </big>

          <img src={movie.image} width="250px" height="300px" />

          <div style={{ display: "flex", gap: "10px", padding: "15px" }}>
            {props.data.perm.includes("Update Movies") ? (
              <Button link={`/main/movies/editMovie/${movie.id}`} text="Edit" />
            ) : null}
            {props.data.perm.includes("Delete Movies") ? (
              <Button link="/main/movies" text="Delete" onClick={deleteMovie} />
            ) : null}
          </div>

          <div className="box2" style={{ height: "10em" }}>
            <b>
              {subs.length > 0
                ? "The Members Who Watched This Movie:"
                : "No One Watched This Movie!!"}
            </b>

            <div className="overflow">
              {subs.map((sub, index) => {
                return (
                  <ul key={index}>
                    <li>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginLeft: "-30px",
                          paddingRight: "5px",
                        }}
                      >
                        <Link to={`/main/subscriptions/${sub.member._id}`}>
                          {sub.member.Name}
                        </Link>
                        <span>
                          {sub.date.slice(8, 10)}/{sub.date.slice(5, 7)}/
                          {sub.date.slice(0, 4)}
                        </span>
                      </div>
                    </li>
                  </ul>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
