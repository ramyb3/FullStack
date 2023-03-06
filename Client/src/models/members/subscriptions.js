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
      <div className="flex">
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
    <div className="box1 flex" style={{ width: "27em", marginBottom: "10px" }}>
      <h2>{props.data.Name}</h2>

      <span style={{ fontSize: "20px" }}>Email: {props.data.Email}</span>
      <span style={{ fontSize: "20px" }}>City: {props.data.City}</span>

      <div style={{ display: "flex", gap: "10px", padding: "15px" }}>
        {props.perm.includes("Update Subscriptions") ? (
          <Button link={`editMember/${props.data._id}`} text="Edit" />
        ) : null}
        {props.perm.includes("Delete Subscriptions") ? (
          <Button
            link=""
            onClick={() => deleteMember(props.data._id)}
            text="Delete"
          />
        ) : null}
      </div>

      {loading ? <h3>Loading...</h3> : null}

      {props.perm.includes("View Movies") ? (
        <div className="box2" style={{ width: "21em" }}>
          <b>
            {props.subs.find((sub) => sub.MemberId === props.data._id)
              ? "The Movies This Member Watched:"
              : "This Member Didn't Watched Any Movie!!"}
          </b>

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
                                  {k.Name}
                                </Link>
                                <span>
                                  {j.Date.slice(8, 10)}/{j.Date.slice(5, 7)}/
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

          <NewSubscription
            id={props.data._id}
            movies={props.movies}
            subs={props.subs}
            refresh={props.refresh}
          />
        </div>
      ) : null}
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

  const addSub = async () => {
    selectRef.current.value = "";
    dateRef.current.value = "";

    if (newSub.movie !== "" && newSub.date !== "") {
      showOrHide(props.id);
      setLoading(true);
      await apiCalls("post", "addSubs", newSub);
      await props.refresh();
      setNewSub({ id: props.id, movie: "", date: "" });

      setTimeout(() => {
        setLoading(false);
      }, 5000);
    } else {
      alert("YOU MUST FILL ALL THE FORM!!");
    }
  };

  const showOrHide = () => {
    if (!loading) {
      buttonRef.current.style.visibility =
        buttonRef.current.style.visibility === "hidden" ? "visible" : "hidden";
    }
  };

  return (
    <>
      <button onClick={() => showOrHide(props.id)}>
        Subscribe to a new movie
      </button>
      <div
        ref={buttonRef}
        className="flex"
        style={{
          visibility: "hidden",
          gap: "10px",
          paddingTop: "10px",
        }}
      >
        <b>Add new movie:</b>
        <select
          style={{ textAlign: "center" }}
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
        <Button link="" onClick={addSub} text="Subscribe" />
      </div>
      {loading ? <h3>Loading...</h3> : null}
    </>
  );
}
