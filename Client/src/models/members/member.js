import Button from "../other/main";
import { apiCalls, useSessionCheck } from "../other/functions";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function Member(props) {
  const params = useParams();
  const navigate = useNavigate();
  const { sessionCheck } = useSessionCheck();
  const [subMovies, setSubs] = useState([]);
  const [movies, setMovies] = useState([]);
  const [list, setList] = useState([]);
  const [sub, setNew] = useState({ id: 0, movie: "", date: "" });
  const [member, setMember] = useState({
    id: 0,
    city: "",
    email: "",
    name: "",
  });

  useEffect(() => {
    const getSubs = async () => {
      const resp = await apiCalls("get", `subscriptions/${params.id}`);

      setList(resp[3]);
      setMovies(resp[2]);
      setSubs(resp[0]);
      setMember({
        id: resp[1]._id,
        city: resp[1].City,
        email: resp[1].Email,
        name: resp[1].Name,
      });
    };

    sessionCheck(props.data);
    getSubs();
  }, []);

  const deleteMember = async () => {
    await apiCalls("delete", `deleteMember/${member.id}`);
  };

  const showOrHide = (obj) => {
    let check = false;

    if (document.getElementById(obj).style.visibility == "hidden") {
      document.getElementById(obj).style.visibility = "visible";
      check = true;
    }
    if (document.getElementById(obj).style.visibility == "visible" && !check) {
      document.getElementById(obj).style.visibility = "hidden";
    }
  };

  const send = async () => {
    if (sub.movie != "" && sub.date != "") {
      await apiCalls("post", "addSubs", sub);
      navigate("/main/subscriptions");
    } else {
      alert("YOU MUST FILL ALL THE FORM!!");
    }
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

        {props.data.perm.includes("Update Subscriptions") ? (
          <Button
            link={`/main/subscriptions/editMember/${member.id}`}
            text="Edit"
          />
        ) : null}

        {props.data.perm.includes("Delete Subscriptions") ? (
          <Button
            link="/main/subscriptions"
            text="Delete"
            onClick={deleteMember}
          />
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

            <button onClick={() => showOrHide(member.id)}>
              Subscribe to a new movie
            </button>

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
              <button onClick={send}>Subscribe</button>
            </div>
          </big>
        </div>
      </div>
      <br />
    </div>
  );
}
