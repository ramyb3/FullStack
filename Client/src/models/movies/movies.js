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
  }, []); //movies || members || subs

  const edit = async (obj) => {
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
    <div>
      <h2 style={{ textAlign: "center" }}>Movies Page</h2>

      {props.data.perm.includes("Create Movies") ? (
        <div style={{ textAlign: "center" }}>
          <Button link="" text="All Movies" onClick={() => setAdd(false)} />
          &nbsp;
          <Button
            link="addMovie"
            text="Add Movie"
            onClick={() => {
              setAdd(true);
              setSearch("");
            }}
          />
          <br />
          <br />
        </div>
      ) : null}

      <Outlet />

      {add == false ? (
        <div style={{ textAlign: "center" }}>
          {" "}
          <input
            placeholder="Find Movie"
            type="text"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button style={{ fontSize: "14px", height: "22px" }} onClick={find}>
            Find
          </button>
          <br />
          <br />
        </div>
      ) : null}

      {add == false
        ? movies.map((item, index) => {
            return (
              <div key={index}>
                <div className="box1">
                  <h2>
                    {" "}
                    {item.Name}, {item.Premiered.slice(0, 4)}{" "}
                  </h2>

                  <big>
                    <b> Genres: </b>
                    {item.Genres.map((x, index) => {
                      return (
                        <>
                          {index != item.Genres.length - 1 ? (
                            <> {x}, </>
                          ) : (
                            <> {x} </>
                          )}
                        </>
                      );
                    })}
                    <br />
                    <br />
                  </big>

                  <img src={item.Image} width="60%" height="60%" />
                  <br />
                  <br />

                  {props.data.perm.includes("Update Movies") ? (
                    <Button link={`editMovie/${item._id}`} text="Edit" />
                  ) : null}

                  {props.data.perm.includes("Delete Movies") ? (
                    <Button
                      link=""
                      text="Delete"
                      onClick={() => edit(item._id)}
                    />
                  ) : null}
                  <br />
                  <br />

                  {props.data.perm.includes("View Subscriptions") ? (
                    <div className="box2">
                      <big>
                        <b>
                          <Comp data={item} subs={subs} />
                        </b>

                        {subs.map((i) => {
                          return i.Movies.map((j) => {
                            return (
                              <ul>
                                {" "}
                                {j.MovieId == item._id ? (
                                  <li>
                                    {members.map((k) => {
                                      return (
                                        <div>
                                          {k._id == i.MemberId ? (
                                            <div>
                                              <Link
                                                to={
                                                  "/main/subscriptions/" +
                                                  i.MemberId
                                                }
                                              >
                                                {k.Name}
                                              </Link>
                                              &nbsp;,&nbsp;
                                              {j.Date.slice(8, 10)}/
                                              {j.Date.slice(5, 7)}/
                                              {j.Date.slice(0, 4)}
                                            </div>
                                          ) : null}
                                        </div>
                                      );
                                    })}
                                  </li>
                                ) : null}
                              </ul>
                            );
                          });
                        })}
                      </big>
                    </div>
                  ) : null}
                  <br />
                </div>
                <br />
              </div>
            );
          })
        : null}
    </div>
  );
}
