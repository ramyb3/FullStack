import { apiCalls, useSessionCheck } from "../other/functions";
import { Button } from "../other/main";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function Movies(props) {
  const { sessionCheck } = useSessionCheck();
  const [movies, setMovies] = useState([]);
  const [members, setMembers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [add, setAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const getAllData = async () => {
    const resp = await apiCalls("get", "");
    setMovies(resp[0]);
    setMembers(resp[1]);
    setSubs(resp[2]);
    setLoading(false);
    setRefresh(false);
  };

  useEffect(() => {
    setLoading(true);
    sessionCheck(props.data);
    getAllData();
  }, []);

  useEffect(() => {
    if (refresh || !add) {
      getAllData();
    }
  }, [refresh, add]);

  const find = async () => {
    if (search !== "") {
      setLoading(true);

      const resp = await apiCalls("post", `findMovies/${search}`);
      setMovies(resp[0]);
      setMembers(resp[1]);
      setSubs(resp[2]);
      setLoading(false);
      setRefresh(false);
    } else {
      await getAllData();
    }
  };

  return (
    <>
      <div className="flex">
        <h2>Movies Page</h2>

        {props.data.perm.includes("Create Movies") ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              link=""
              text="All Movies"
              onClick={() => {
                setLoading(true);
                setAdd(false);
              }}
            />
            <Button
              link="addMovie"
              text="Add Movie"
              onClick={() => setAdd(true)}
            />
          </div>
        ) : null}
      </div>

      <Outlet />

      {!add ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "10px",
          }}
        >
          <input
            placeholder="Find Movie"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button style={{ fontSize: "14px", height: "22px" }} onClick={find}>
            Find
          </button>
        </div>
      ) : null}

      {loading ? <h3 style={{ textAlign: "center" }}>Loading...</h3> : null}

      {!add
        ? movies.map((item, index) => {
            return (
              <Movie
                key={index}
                perm={props.data.perm}
                data={item}
                subs={subs}
                members={members}
                refresh={() => setRefresh(true)}
              />
            );
          })
        : null}
    </>
  );
}

function Movie(props) {
  const [loading, setLoading] = useState(false);

  const deleteMovie = async (obj) => {
    setLoading(true);
    await apiCalls("delete", `deleteMovie/${obj}`);
    await props.refresh();

    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  return (
    <div className="box1 flex" style={{ width: "27em", marginBottom: "10px" }}>
      <h2>{`${props.data.Name}, ${props.data.Premiered.slice(0, 4)}`}</h2>
      <big style={{ paddingBottom: "10px" }}>
        <b>Genres: </b>
        {props.data.Genres.map((genre, index) => {
          return `${genre}${
            index !== props.data.Genres.length - 1 ? ", " : ""
          }`;
        })}
      </big>
      <img src={props.data.Image} width="60%" height="60%" />
      <div style={{ display: "flex", gap: "10px", padding: "15px" }}>
        {props.perm.includes("Update Movies") ? (
          <Button link={`editMovie/${props.data._id}`} text="Edit" />
        ) : null}
        {props.perm.includes("Delete Movies") ? (
          <Button
            link=""
            text="Delete"
            onClick={() => deleteMovie(props.data._id)}
          />
        ) : null}
      </div>

      {loading ? <h3>Loading...</h3> : null}

      {props.perm.includes("View Subscriptions") ? (
        <div className="box2" style={{ width: "21em" }}>
          <b>
            {props.subs.find((sub) =>
              sub.Movies.find((movie) => movie.MovieId === props.data._id)
            )
              ? "The Members Who Watched This Movie:"
              : "No One Watched This Movie!!"}
          </b>

          {props.subs.map((i) => {
            return i.Movies.map((j, index1) => {
              return (
                <ul>
                  {j.MovieId === props.data._id ? (
                    <li key={index1}>
                      {props.members.map((k, index2) => {
                        return k._id === i.MemberId ? (
                          <div
                            key={index2}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginLeft: "-30px",
                              paddingRight: "5px",
                            }}
                          >
                            <Link to={`/main/subscriptions/${i.MemberId}`}>
                              {k.Name}
                            </Link>
                            <span>
                              {j.Date.slice(8, 10)}/{j.Date.slice(5, 7)}/
                              {j.Date.slice(0, 4)}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </li>
                  ) : null}
                </ul>
              );
            });
          })}
        </div>
      ) : null}
    </div>
  );
}
