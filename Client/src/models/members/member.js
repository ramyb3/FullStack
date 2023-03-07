import { apiCalls, useSessionCheck } from "../other/functions";
import { Button } from "../other/main";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Member(props) {
  const params = useParams();
  const { sessionCheck } = useSessionCheck();
  const [subMovies, setSubs] = useState([]);
  const [movies, setMovies] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [member, setMember] = useState({
    id: 0,
    city: "",
    email: "",
    name: "",
  });

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

    setLoading(false);
    setRefresh(false);
  };

  useEffect(() => {
    setLoading(true);
    sessionCheck(props.data);
    getSubs();
  }, []);

  useEffect(() => {
    if (refresh) {
      getSubs();
    }
  }, [refresh]);

  const deleteMember = async () => {
    await apiCalls("delete", `deleteMember/${member.id}`);
  };

  return (
    <div className="flex-column" style={{ marginTop: "10px" }}>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <div className="box1 flex-column">
          <h2>{member.name}</h2>

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
              <Button
                link="/main/subscriptions"
                text="Delete"
                onClick={deleteMember}
              />
            ) : null}
          </div>
          <div className="box2" style={{ height: "18em" }}>
            <b>
              {subMovies.length > 0
                ? "The Movies This Member Watched:"
                : "This Member Didn't Watched Any Movie!!"}
            </b>

            <ul className="overflow">
              {subMovies.map((i, index1) => {
                return (
                  <li key={index1}>
                    {movies.map((j, index2) => {
                      return i.MovieId === j._id ? (
                        <div
                          key={index2}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginLeft: "-30px",
                            paddingRight: "5px",
                          }}
                        >
                          <Link to={`/main/movies/${i.MovieId}`}>
                            {j.Name.slice(0, 25)}
                          </Link>
                          <span>
                            {i.Date.slice(8, 10)}/{i.Date.slice(5, 7)}/
                            {i.Date.slice(0, 4)}
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
      await props.refresh();

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
