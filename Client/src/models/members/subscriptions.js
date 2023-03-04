import { useEffect, useState } from "react";
import axios from "axios";
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
    if (props.props.name != "admin") {
      if (Date.now() - props.props.time >= props.props.timeOut) {
        // check if time over
        alert("YOUR TIME IS UP!!");
        navigate("/");
      }
    }
  }, []);

  useEffect(async () => {
    let resp = await axios.get(process.env.REACT_APP_API_SERVER);

    setMovies(resp.data[0]);
    setMembers(resp.data[1]);
    setSubs(resp.data[2]);
  }, [movies || members || subs]);

  const edit = async (x) => {
    await axios.delete(`${process.env.REACT_APP_API_SERVER}/deleteMember/${x}`);
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
    if (sub.movie != "" && sub.date != "")
      await axios.post(`${process.env.REACT_APP_API_SERVER}/addSubs/`, sub);
    else alert("YOU MUST FILL ALL THE FORM!!");
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Subscriptions Page</h2>

      {props.props.perm.includes("Create Subscriptions") ? (
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

                  {props.props.perm.includes("Update Subscriptions") ? (
                    <Link to={"editMember/" + item._id}>
                      <input type="button" value="Edit" />
                    </Link>
                  ) : null}

                  {props.props.perm.includes("Delete Subscriptions") ? (
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

                  {props.props.perm.includes("View Movies") ? (
                    <div className="box2" style={{ width: "26em" }}>
                      <big>
                        <b>
                          <Comp1 props={item} subs={subs} />
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
                            props={item}
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
