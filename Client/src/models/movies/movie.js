import { apiCalls } from "../other/apiCalls";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function Movie(props) {
  const params = useParams();

  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    id: 0,
    name: "",
    genres: [],
    image: "",
    date: "",
  });
  const [subs, setSubs] = useState([]);

  useEffect(async () => {
    if (props.data.name != "admin") {
      if (Date.now() - props.data.time >= props.data.timeOut) {
        alert("YOUR TIME IS UP!!");
        navigate("/");
      }
    }

    const resp = await apiCalls("get", `movies/${params.id}`);

    setSubs(resp[0]);
    setMovie({
      id: resp[1]._id,
      name: resp[1].Name,
      genres: resp[1].Genres,
      image: resp[1].Image,
      date: resp[1].Premiered,
    });
  }, []);

  const edit = async () => {
    await apiCalls("delete", `deleteMovie/${movie.id}`);
  };

  return (
    <div>
      <br />
      <br />
      <div className="box1">
        <h2>
          {" "}
          {movie.name}, {movie.date.slice(0, 4)}{" "}
        </h2>
        <big>
          <b> Genres: </b>
          {movie.genres.map((x, index) => {
            return (
              <>{index != movie.genres.length - 1 ? <> {x}, </> : <> {x} </>}</>
            );
          })}
          <br />
          <br />
        </big>

        <img src={movie.image} width="60%" height="60%" />
        <br />
        <br />

        {props.data.perm.includes("Update Movies") ? (
          <Link to={"/main/movies/editMovie/" + movie.id}>
            <input type="button" value="Edit" />
          </Link>
        ) : null}

        {props.data.perm.includes("Delete Movies") ? (
          <Link to="/main/movies">
            <input onClick={edit} type="button" value="Delete" />
          </Link>
        ) : null}
        <br />
        <br />

        <div className="box2">
          <big>
            <b>
              {subs.length == 0 ? (
                <>No One Watched This Movie!! </>
              ) : (
                <>The Members Who Watched This Movie: </>
              )}
            </b>
            <br />

            {subs.map((i) => {
              return (
                <ul>
                  <li>
                    {
                      <div>
                        <Link to={"/main/subscriptions/" + i.member._id}>
                          {i.member.Name}
                        </Link>
                        &nbsp;,&nbsp;
                        {i.date.slice(8, 10)}/{i.date.slice(5, 7)}/
                        {i.date.slice(0, 4)}
                      </div>
                    }
                  </li>
                </ul>
              );
            })}
          </big>
        </div>
      </div>
      <br />
    </div>
  );
}
