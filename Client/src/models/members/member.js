import { apiCalls, useFunctions } from "../other/functions";
import { Button } from "../other/main";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Member(props) {
  const params = useParams();
  const navigate = useNavigate();
  const { sessionCheck } = useFunctions();
  const [subs, setSubs] = useState([]);
  const [movies, setMovies] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [member, setMember] = useState({
    id: params.id ? params.id : props.item._id,
    city: "",
    email: "",
    name: "",
  });

  useEffect(() => {
    if (refresh) {
      if (!params.id) {
        props.refresh();
      } else {
        getSubs();
      }
    }
  }, [refresh]);

  useEffect(() => {
    if (params.id) {
      sessionCheck(props.data);
    }

    setLoading(true);
    getSubs();
  }, [props]);

  const getSubs = async () => {
    let resp;

    if (params.id) {
      resp = await apiCalls("get", `subscriptions/${params.id}`);
    } else {
      resp =
        props.subs.find((data) => data.MemberId === props.item._id)?.Movies ||
        [];
      const subList = props.movies.filter(
        (movie) => !resp.filter((data) => data.MovieId === movie._id).length
      );
      resp = [resp, subList];
    }

    const obj = !params.id ? props.item : resp[1];

    setMovies(!params.id ? props.movies : resp[2]);
    setList(!params.id ? resp[1] : resp[3]);
    setSubs(resp[0]);
    setMember({
      ...member,
      city: obj.City,
      email: obj.Email,
      name: obj.Name,
    });

    setLoading(false);
    setRefresh(false);
  };

  const deleteMember = async () => {
    setLoading2(true);
    await apiCalls("delete", `deleteMember/${member.id}`);

    if (!params.id) {
      props.refresh();
    }

    setTimeout(() => {
      setLoading2(false);

      if (params.id) {
        navigate("/main/subscriptions");
      }
    }, 5000);
  };

  return (
    <div className="flex-column" style={{ marginTop: "10px" }}>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <div className="box1 flex-column">
          <h2>{member.name}</h2>

          {loading2 ? (
            <h3>Loading...</h3>
          ) : (
            <>
              <span style={{ fontSize: "20px" }}>Email: {member.email}</span>
              <span style={{ fontSize: "20px" }}>City: {member.city}</span>

              <div style={{ display: "flex", gap: "10px", padding: "15px" }}>
                {props.data.perm.includes("Update Subscriptions") ? (
                  <Button
                    link={`/main/subscriptions/editMember/${member.id}`}
                    text="Edit"
                  />
                ) : null}
                {props.data.perm.includes("Delete Subscriptions") ? (
                  <button onClick={deleteMember}>Delete</button>
                ) : null}
              </div>

              {props.data.perm.includes("View Movies") ? (
                <div className="box2" style={{ height: "18em" }}>
                  <b>
                    {subs.length > 0
                      ? "The Movies This Member Watched:"
                      : "This Member Didn't Watched Any Movie!!"}
                  </b>

                  <ul className="overflow">
                    {subs.map((sub, index1) => {
                      return (
                        <li key={index1}>
                          {movies.map((movie, index2) => {
                            return sub.MovieId === movie._id ? (
                              <div
                                key={index2}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginLeft: "-30px",
                                  paddingRight: "5px",
                                }}
                              >
                                <Link to={`/main/movies/${sub.MovieId}`}>
                                  {movie.Name.slice(0, 25)}
                                </Link>
                                <span>
                                  {sub.Date.slice(8, 10)}/{sub.Date.slice(5, 7)}
                                  /{sub.Date.slice(0, 4)}
                                </span>
                              </div>
                            ) : null;
                          })}
                        </li>
                      );
                    })}
                  </ul>

                  <NewSubscription
                    id={member.id}
                    list={list}
                    refresh={() => setRefresh(true)}
                  />
                </div>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function NewSubscription(props) {
  const [loading, setLoading] = useState(false);
  const [newSub, setNewSub] = useState({ id: props.id, movie: "", date: "" });
  const buttonRef = useRef(null);
  const dateRef = useRef(null);
  const selectRef = useRef(null);

  const addSubs = async () => {
    selectRef.current.value = "";
    dateRef.current.value = "";

    if (newSub.movie === "" || newSub.date === "") {
      alert("YOU MUST FILL ALL THE FORM!!");
    } else {
      showOrHide();
      setLoading(true);
      await apiCalls("post", "addSubs", newSub);
      props.refresh();

      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }

    setNewSub({ id: props.id, movie: "", date: "" });
  };

  const showOrHide = () => {
    if (!loading) {
      buttonRef.current.style.visibility =
        buttonRef.current.style.visibility === "hidden" ? "visible" : "hidden";
    }
  };

  return (
    <>
      <button onClick={showOrHide}>Subscribe to a new movie</button>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <div
          ref={buttonRef}
          className="flex-column"
          style={{
            visibility: "hidden",
            gap: "10px",
            paddingTop: "10px",
          }}
        >
          <b>Add new movie:</b>
          <select
            ref={selectRef}
            onChange={(e) => setNewSub({ ...newSub, movie: e.target.value })}
          >
            <option value="">--Select Movie--</option>

            {props.list.map((data, index) => {
              return (
                <option key={index} value={data.Name}>
                  {data.Name}
                </option>
              );
            })}
          </select>
          <input
            ref={dateRef}
            type="date"
            onChange={(e) => setNewSub({ ...newSub, date: e.target.value })}
          />
          <button onClick={addSubs}>Subscribe</button>
        </div>
      )}
    </>
  );
}
