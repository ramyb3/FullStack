import { apiCalls } from "../other/apiCalls";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Comp from "./comp1";

export default function Movies(props) {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [members, setMembers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [add, setAdd] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (props.data.name != "admin") {
      if (Date.now() - props.data.time >= props.data.timeOut) {
        alert("YOUR TIME IS UP!!");
        navigate("/");
      }
    }
  }, []);

  useEffect(async () => {
    if (search == "") {
      const resp = await apiCalls("get", "");
      setMovies(resp[0]);
      setMembers(resp[1]);
      setSubs(resp[2]);
    }
  }, [movies || members || subs]);

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
          <Link to="">
            <input
              type="button"
              value="All Movies"
              onClick={() => setAdd(false)}
            />
          </Link>
          &nbsp;
          <Link to="addMovie">
            <input
              type="button"
              value="Add Movie"
              onClick={() => (setAdd(true), setSearch(""))}
            />
          </Link>
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
          <input
            type="button"
            value="Find"
            onClick={find}
            style={{ fontSize: "14px", height: "22px" }}
          />
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
                    <Link to={"editMovie/" + item._id}>
                      <input type="button" value="Edit" />
                    </Link>
                  ) : null}

                  {props.data.perm.includes("Delete Movies") ? (
                    <Link to="">
                      <input
                        onClick={() => edit(item._id)}
                        type="button"
                        value="Delete"
                      />
                    </Link>
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
