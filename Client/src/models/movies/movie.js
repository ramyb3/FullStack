import { apiCalls, useSessionCheck } from "../other/functions";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../other/main";

export default function Movie(props) {
  const params = useParams();
  const { sessionCheck } = useSessionCheck();
  const [subs, setSubs] = useState([]);
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
    };

    sessionCheck(props.data);
    getMovie();
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
          <Button link={`/main/movies/editMovie/${movie.id}`} text="Edit" />
        ) : null}

        {props.data.perm.includes("Delete Movies") ? (
          <Button link="/main/movies" text="Delete" onClick={edit} />
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
