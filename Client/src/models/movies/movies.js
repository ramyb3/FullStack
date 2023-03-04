import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Comp from "./comp1";

function Movies(props) {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [members, setMembers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [add, setAdd] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (props.props.name != "admin") {
      if (Date.now() - props.props.time >= props.props.timeOut) {
        // check if time over
        alert("YOUR TIME IS UP!!");
        navigate("/");
      }
    }
  }, []);

  useEffect(async () => {
    if (search == "") {
      let resp = await axios.get(process.env.REACT_APP_API_SERVER);

      setMovies(resp.data[0]);
      setMembers(resp.data[1]);
      setSubs(resp.data[2]);
    }
  }, [movies || members || subs]);

  const edit = async (x) => {
    await axios.delete(`${process.env.REACT_APP_API_SERVER}/deleteMovie/${x}`);
  };

  const find = async () => {
    if (search != "") {
      let resp = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/findMovies/${search}`
      );

      setMovies(resp.data[0]);
      setMembers(resp.data[1]);
      setSubs(resp.data[2]);
    } else {
      let resp = await axios.get(process.env.REACT_APP_API_SERVER);

      setMovies(resp.data[0]);
      setMembers(resp.data[1]);
      setSubs(resp.data[2]);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Movies Page</h2>

      {props.props.perm.includes("Create Movies") ? (
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

                  {props.props.perm.includes("Update Movies") ? (
                    <Link to={"editMovie/" + item._id}>
                      <input type="button" value="Edit" />
                    </Link>
                  ) : null}

                  {props.props.perm.includes("Delete Movies") ? (
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

                  {props.props.perm.includes("View Subscriptions") ? (
                    <div className="box2">
                      <big>
                        <b>
                          <Comp props={item} subs={subs} />
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

export default Movies;
