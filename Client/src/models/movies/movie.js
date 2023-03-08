import { apiCalls, useFunctions } from "../other/functions";
import { Button } from "../other/main";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function Movie(props) {
  const params = useParams();
  const navigate = useNavigate();
  const { sessionCheck } = useFunctions();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [movie, setMovie] = useState({
    id: 0,
    name: "",
    genres: [],
    image: "",
    date: "",
  });

  useEffect(() => {
    if (!props.item) {
      sessionCheck(props.data);
    }

    setLoading(true);
    getMovie();
  }, [props]);

  const getMovie = async () => {
    let resp = [];

    if (!props.item) {
      resp = await apiCalls("get", `movies/${params.id}`);
    } else {
      for (let i = 0; i < props.subs.length; i++) {
        const obj = props.subs[i].Movies.find(
          (data) => data.MovieId === props.item._id
        );

        if (obj) {
          const member = props.members.find(
            (data) => data._id === props.subs[i].MemberId
          );

          resp.push({
            member: {
              _id: member._id,
              Name: member.Name,
            },
            date: obj.Date,
          });
        }
      }
    }

    const obj = props.item ? props.item : resp[1];

    setMovie({
      id: obj._id,
      name: obj.Name,
      genres: obj.Genres,
      image: obj.Image,
      date: obj.Premiered,
    });

    setSubs(props.item ? resp : resp[0]);
    setLoading(false);
  };

  const deleteMovie = async () => {
    setLoading2(true);
    await apiCalls("delete", `deleteMovie/${movie.id}`);

    if (props.item) {
      props.refresh();
    }

    setTimeout(() => {
      setLoading2(false);

      if (!props.item) {
        navigate("/main/movies");
      }
    }, 5000);
  };

  return (
    <div className="flex-column" style={{ marginTop: "10px" }}>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <div className="box1 flex-column">
          <h2>{`${movie.name}, ${movie.date.slice(0, 4)}`}</h2>

          {loading2 ? (
            <h3>Loading...</h3>
          ) : (
            <>
              <big style={{ paddingBottom: "10px" }}>
                <b>Genres: </b>
                {movie.genres.map((genre, index) => {
                  return `${genre}${
                    index !== movie.genres.length - 1 ? ", " : ""
                  }`;
                })}
              </big>

              <img src={movie.image} width="250px" height="300px" />

              <div style={{ display: "flex", gap: "10px", padding: "15px" }}>
                {props.data.perm.includes("Update Movies") ? (
                  <Button
                    link={`/main/movies/editMovie/${movie.id}`}
                    text="Edit"
                  />
                ) : null}
                {props.data.perm.includes("Delete Movies") ? (
                  <button onClick={deleteMovie}>Delete</button>
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
