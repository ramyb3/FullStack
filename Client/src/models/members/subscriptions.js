import { useEffect, useState } from "react";
import { apiCalls } from "../other/apiCalls";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Comp1 from "./comp2";
import Comp2 from "./comp3";

export default function Subs(props) {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [members, setMembers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [add, setAdd] = useState(false);
  const [sub, setNew] = useState({ id: 0, movie: "", date: "" });

  useEffect(() => {
    if (props.data.name != "admin") {
      if (Date.now() - props.data.time >= props.data.timeOut) {
        // check if time over
        alert("YOUR TIME IS UP!!");
        navigate("/");
      }
    }
  }, []);

  useEffect(async () => {
    const resp = await apiCalls("get", "");
    setMovies(resp[0]);
    setMembers(resp[1]);
    setSubs(resp[2]);
  }, [movies || members || subs]);

  const edit = async (obj) => {
    await apiCalls("delete", `deleteMember/${obj}`);
  };

  const showORhide = (obj) => {
    let check = false;

    if (document.getElementById(obj).style.visibility == "hidden") {
      document.getElementById(obj).style.visibility = "visible";

      check = true;
    }

    if (
      document.getElementById(obj).style.visibility == "visible" &&
      check == false
    )
      document.getElementById(obj).style.visibility = "hidden";
  };

  const send = async () => {
    if (sub.movie != "" && sub.date != "") {
      await apiCalls("post", "addSubs", sub);
    } else {
      alert("YOU MUST FILL ALL THE FORM!!");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Subscriptions Page</h2>

      {props.data.perm.includes("Create Subscriptions") ? (
        <div style={{ textAlign: "center" }}>
          <Link to="">
            <input
              type="button"
              value="All Members"
              onClick={() => setAdd(false)}
            />
          </Link>
          &nbsp;
          <Link to="addMember">
            <input
              type="button"
              value="Add Member"
              onClick={() => setAdd(true)}
            />
          </Link>
          <br />
          <br />
        </div>
      ) : null}

      <Outlet />

      {add == false
        ? members.map((item, index) => {
            return (
              <div key={index}>
                <div className="box1" style={{ width: "27em" }}>
                  <h2> {item.Name} </h2>

                  <big>
                    Email: {item.Email}
                    <br />
                    City: {item.City}
                    <br />
                    <br />
                  </big>

                  {props.data.perm.includes("Update Subscriptions") ? (
                    <Link to={"editMember/" + item._id}>
                      <input type="button" value="Edit" />
                    </Link>
                  ) : null}

                  {props.data.perm.includes("Delete Subscriptions") ? (
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

                  {props.data.perm.includes("View Movies") ? (
                    <div className="box2" style={{ width: "26em" }}>
                      <big>
                        <b>
                          <Comp1 data={item} subs={subs} />
                        </b>
                        <br />

                        {subs.map((i) => {
                          return (
                            <ul>
                              {i.MemberId == item._id ? (
                                <div>
                                  {i.Movies.map((j) => {
                                    return (
                                      <li>
                                        {movies.map((k) => {
                                          return (
                                            <div>
                                              {j.MovieId == k._id ? (
                                                <div>
                                                  <Link
                                                    to={
                                                      "/main/movies/" +
                                                      j.MovieId
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
                                    );
                                  })}{" "}
                                </div>
                              ) : null}
                            </ul>
                          );
                        })}

                        <input
                          type="button"
                          value="Subscribe to a new movie"
                          onClick={() => showORhide(item._id)}
                        />

                        <div id={item._id} style={{ visibility: "hidden" }}>
                          <br />

                          <b> Add a new movie: </b>
                          <br />
                          <br />

                          <Comp2
                            callback={(data) => setNew({ ...sub, movie: data })}
                            data={item}
                            movies={movies}
                            subs={subs}
                          />
                          <br />

                          <input
                            type="date"
                            onChange={(e) =>
                              setNew({
                                ...sub,
                                id: item._id,
                                date: e.target.value,
                              })
                            }
                          />
                          <br />
                          <br />
                          <Link to="">
                            <input
                              onClick={send}
                              type="button"
                              value="Subscribe"
                            />
                          </Link>
                        </div>
                      </big>
                    </div>
                  ) : null}
                </div>
                <br />
              </div>
            );
          })
        : null}
    </div>
  );
}
