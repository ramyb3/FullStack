import { apiCalls, useSessionCheck } from "../other/functions";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Comp from "./comp1";
import { Button } from "../other/main";

export default function Movies(props) {
  const { sessionCheck } = useSessionCheck();
  const [movies, setMovies] = useState([]);
  const [members, setMembers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [add, setAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const resp = await apiCalls("get", "");
      setMovies(resp[0]);
      setMembers(resp[1]);
      setSubs(resp[2]);
    };

    sessionCheck(props.data);

    if (search == "") {
      getData();
    }
  }, []);

  const deleteMovie = async (obj) => {
    await apiCalls("delete", `deleteMovie/${obj}`);
  };

  const find = async () => {
    let resp;

    if (search != "") {
      resp = await apiCalls("post", `findMovies/${search}`);
    } else {
      resp = await apiCalls("get", "");
    }

    setMovies(resp[0]);
    setMembers(resp[1]);
    setSubs(resp[2]);
  };

  return (
    <>
      <div className="flex">
        <h2>Movies Page</h2>

        {props.data.perm.includes("Create Movies") ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button link="" text="All Movies" onClick={() => setAdd(false)} />
            <Button
              link="addMovie"
              text="Add Movie"
              onClick={() => {
                setAdd(true);
                setSearch("");
              }}
            />
          </div>
        ) : null}

        {loading ? <h3>Loading...</h3> : null}
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

      {!add
        ? movies.map((item, index) => {
            return (
              <div
                key={index}
                className="box1 flex"
                style={{ width: "27em", marginBottom: "10px" }}
              >
                <h2>{`${item.Name}, ${item.Premiered.slice(0, 4)}`}</h2>
                <big style={{ paddingBottom: "10px" }}>
                  <b>Genres: </b>
                  {item.Genres.map((genre, index) => {
                    return `${genre}${
                      index !== item.Genres.length - 1 ? ", " : ""
                    }`;
                  })}
                </big>
                <img src={item.Image} width="60%" height="60%" />
                <div style={{ display: "flex", gap: "10px", padding: "15px" }}>
                  {props.data.perm.includes("Update Movies") ? (
                    <Button link={`editMovie/${item._id}`} text="Edit" />
                  ) : null}
                  {props.data.perm.includes("Delete Movies") ? (
                    <Button
                      link=""
                      text="Delete"
                      onClick={() => deleteMovie(item._id)}
                    />
                  ) : null}
                </div>

                {props.data.perm.includes("View Subscriptions") ? (
                  <div className="box2" style={{ width: "21em" }}>
                    <b>
                      <Comp data={item} subs={subs} />
                    </b>

                    {subs.map((i) => {
                      return i.Movies.map((j, index1) => {
                        return (
                          <ul>
                            {j.MovieId === item._id ? (
                              <li key={index1}>
                                {members.map((k, index2) => {
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
                                      <Link
                                        to={`/main/subscriptions/${i.MemberId}`}
                                      >
                                        {k.Name}
                                      </Link>
                                      <span>
                                        {j.Date.slice(8, 10)}/
                                        {j.Date.slice(5, 7)}/
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
          })
        : null}
    </>
  );
}
