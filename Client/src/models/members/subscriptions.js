import { Button } from "../other/main";
import { apiCalls, useSessionCheck } from "../other/functions";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function Subs(props) {
  const { sessionCheck } = useSessionCheck();
  const [movies, setMovies] = useState([]);
  const [members, setMembers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [add, setAdd] = useState(false);
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
    if (refresh) {
      getAllData();
    }
  }, [refresh]);

  return (
    <>
      <div className="flex-column">
        <h2>Subscriptions Page</h2>

        {props.data.perm.includes("Create Subscriptions") ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button link="" onClick={() => setAdd(false)} text="All Members" />
            <Button
              link="addMember"
              onClick={() => setAdd(true)}
              text="Add Member"
            />
          </div>
        ) : null}

        {loading ? <h3>Loading...</h3> : null}
      </div>

      <Outlet />

      <div className="flex-wrap">
        {!add
          ? members.map((item, index) => {
              return (
                <Member
                  key={index}
                  perm={props.data.perm}
                  data={item}
                  subs={subs}
                  movies={movies}
                  refresh={() => setRefresh(true)}
                />
              );
            })
          : null}
      </div>
    </>
  );
}

function Member(props) {
  const [loading, setLoading] = useState(false);

  const deleteMember = async (obj) => {
    setLoading(true);
    await apiCalls("delete", `deleteMember/${obj}`);
    await props.refresh();

    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  return (
    <div className="box1 flex-column">
      <h2>{props.data.Name}</h2>

      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <>
          <span style={{ fontSize: "20px" }}>Email: {props.data.Email}</span>
          <span style={{ fontSize: "20px" }}>City: {props.data.City}</span>

          <div style={{ display: "flex", gap: "10px", padding: "15px" }}>
            {props.perm.includes("Update Subscriptions") ? (
              <Button link={`editMember/${props.data._id}`} text="Edit" />
            ) : null}
            {props.perm.includes("Delete Subscriptions") ? (
              <button onClick={() => deleteMember(props.data._id)}>Delete</button>
            ) : null}
          </div>

          {props.perm.includes("View Movies") ? (
            <div className="box2" style={{ height: "18em" }}>
              <b>
                {props.subs.find((sub) => sub.MemberId === props.data._id)
                  ? "The Movies This Member Watched:"
                  : "This Member Didn't Watched Any Movie!!"}
              </b>

              <div className="overflow">
                {props.subs.map((i, index1) => {
                  return (
                    <ul key={index1}>
                      {i.MemberId === props.data._id
                        ? i.Movies.map((j, index2) => {
                            return (
                              <li key={index2}>
                                {props.movies.map((k, index3) => {
                                  return j.MovieId === k._id ? (
                                    <div
                                      key={index3}
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginLeft: "-30px",
                                        paddingRight: "5px",
                                      }}
                                    >
                                      <Link to={`/main/movies/${j.MovieId}`}>
                                        {k.Name.slice(0, 25)}
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
                            );
                          })
                        : null}
                    </ul>
                  );
                })}
              </div>

              <NewSubscription
                id={props.data._id}
                movies={props.movies}
                subs={props.subs}
                refresh={props.refresh}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function NewSubscription(props) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSub, setNewSub] = useState({ id: props.id, movie: "", date: "" });
  const buttonRef = useRef(null);
  const dateRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    const arr = [];
    const sub = props.subs.find((data) => data.MemberId === props.id);

    setList(props.movies);

    if (sub) {
      for (let i = 0; i < sub.Movies.length; i++) {
        arr.push(sub.Movies[i].MovieId);
      }

      setList(props.movies.filter((data) => !arr.includes(data._id)));
    }
  }, [props.subs]);

  const addSubs = async () => {
    if (newSub.movie === "" || newSub.date === "") {
      alert("YOU MUST FILL ALL THE FORM!!");
    } else {
      showOrHide();
      setLoading(true);
      await apiCalls("post", "addSubs", newSub);
      await props.refresh();

      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }

    selectRef.current.value = "";
    dateRef.current.value = "";
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

            {list.map((data, index) => {
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
