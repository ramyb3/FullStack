import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function Movie(props) {
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
    if (props.props.name != "admin") {
      if (Date.now() - props.props.time >= props.props.timeOut) {
        // check if time over
        alert("YOUR TIME IS UP!!");
        navigate("/");
      }
    }

    let resp = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/movies/${params.id}`
    );

    setSubs(resp.data[0]);
    setMovie({
      id: resp.data[1]._id,
      name: resp.data[1].Name,
      genres: resp.data[1].Genres,
      image: resp.data[1].Image,
      date: resp.data[1].Premiered,
    });
  }, []);

  const edit = async () => {
    await axios.delete(
      `${process.env.REACT_APP_API_SERVER}/deleteMovie/${movie.id}`
    );
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

        {props.props.perm.includes("Update Movies") ? (
          <Link to={"/main/movies/editMovie/" + movie.id}>
            <input type="button" value="Edit" />
          </Link>
        ) : null}

        {props.props.perm.includes("Delete Movies") ? (
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

export default Movie;
