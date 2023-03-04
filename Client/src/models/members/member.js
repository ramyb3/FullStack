import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function Member(props) {
  const params = useParams();

  const navigate = useNavigate();

  const [member, setMember] = useState({
    id: 0,
    city: "",
    email: "",
    name: "",
  });
  const [subMovies, setSubs] = useState([]);
  const [movies, setMovies] = useState([]);
  const [list, setList] = useState([]);
  const [sub, setNew] = useState({ id: 0, movie: "", date: "" });

  useEffect(async () => {
    if (props.props.name != "admin") {
      if (Date.now() - props.props.time >= props.props.timeOut) {
        // check if time over
        alert("YOUR TIME IS UP!!");
        navigate("/");
      }
    }

    let resp = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/subscriptions/${params.id}`
    );

    setList(resp.data[3]);
    setMovies(resp.data[2]);
    setSubs(resp.data[0]);
    setMember({
      id: resp.data[1]._id,
      city: resp.data[1].City,
      email: resp.data[1].Email,
      name: resp.data[1].Name,
    });
  }, []);

  const edit = async () => {
    await axios.delete(
      `${process.env.REACT_APP_API_SERVER}/deleteMember/${member.id}`
    );
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
      await axios.post(`${process.env.REACT_APP_API_SERVER}/addSubs/`, sub);

      navigate("/main/subscriptions");
    } else alert("YOU MUST FILL ALL THE FORM!!");
  };

  return (
    <div>
      <br />
      <br />
      <div className="box1" style={{ width: "27em" }}>
        <h2> {member.name} </h2>

        <big>
          Email: {member.email}
          <br />
          City: {member.city}
          <br />
          <br />
        </big>

        {props.props.perm.includes("Update Subscriptions") ? (
          <Link to={"/main/subscriptions/editMember/" + member.id}>
            <input type="button" value="Edit" />
          </Link>
        ) : null}

        {props.props.perm.includes("Delete Subscriptions") ? (
          <Link to={"/main/subscriptions"}>
            <input onClick={edit} type="button" value="Delete" />
          </Link>
        ) : null}
        <br />
        <br />

        <div className="box2" style={{ width: "26em" }}>
          <big>
            <b>
              {subMovies.length == 0 ? (
                <>This Member Didn't Watched Any Movie!! </>
              ) : (
                <>The Movies This Member Watched:</>
              )}
            </b>
            <br />

            <ul>
              {subMovies.map((j) => {
                return (
                  <li>
                    {movies.map((k) => {
                      return (
                        <div>
                          {j.MovieId == k._id ? (
                            <div>
                              <Link to={"/main/movies/" + j.MovieId}>
                                {k.Name}
                              </Link>
                              &nbsp;,&nbsp;
                              {j.Date.slice(8, 10)}/{j.Date.slice(5, 7)}/
                              {j.Date.slice(0, 4)}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </li>
                );
              })}
            </ul>

            <input
              type="button"
              value="Subscribe to a new movie"
              onClick={() => showORhide(member.id)}
            />

            <div id={member.id} style={{ visibility: "hidden" }}>
              <br />

              <b> Add a new movie: </b>
              <br />
              <br />

              <select
                onChange={(e) =>
                  setNew({ ...sub, id: member.id, movie: e.target.value })
                }
              >
                <option value="">--Select Movie--</option>

                {list.map((k) => {
                  return <option value={k.Name}> {k.Name} </option>;
                })}
              </select>
              <br />

              <input
                type="date"
                onChange={(e) => setNew({ ...sub, date: e.target.value })}
              />
              <br />
              <br />
              <input onClick={send} type="button" value="Subscribe" />
            </div>
          </big>
        </div>
      </div>
      <br />
    </div>
  );
}
