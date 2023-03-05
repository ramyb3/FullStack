import Subscriptions from "./subscriptions-comp";
import NewSubscription from "./new-subscription";
import { Button } from "../other/main";
import { useEffect, useState } from "react";
import { apiCalls, useSessionCheck } from "../other/functions";
import { Link, Outlet } from "react-router-dom";

export default function Subs(props) {
  const { sessionCheck } = useSessionCheck();
  const [movies, setMovies] = useState([]);
  const [members, setMembers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [add, setAdd] = useState(false);
  const [newSub, setNewSub] = useState({ id: 0, movie: "", date: "" });

  const getData = async () => {
    const resp = await apiCalls("get", "");
    setMovies(resp[0]);
    setMembers(resp[1]);
    setSubs(resp[2]);
  };

  useEffect(() => {
    sessionCheck(props.data);
    getData();
  }, []);

  const deleteMember = async (obj) => {
    await apiCalls("delete", `deleteMember/${obj}`);
    await getData();
  };

  const showORhide = (obj) => {
    document.getElementById(obj).style.visibility =
      document.getElementById(obj).style.visibility == "hidden"
        ? "visible"
        : "hidden";
  };

  const addSub = async () => {
    if (newSub.movie != "" && newSub.date != "") {
      await apiCalls("post", "addSubs", newSub);
      await getData();
    } else {
      alert("YOU MUST FILL ALL THE FORM!!");
    }
  };

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
      </div>

      <Outlet />

      {!add
        ? members.map((item, index) => {
            return (
              <div key={index}>
                <div
                  className="box1 flex"
                  style={{ width: "27em", marginBottom: "10px" }}
                >
                  <h2>{item.Name}</h2>

                  <span style={{ fontSize: "20px" }}>Email: {item.Email}</span>
                  <span style={{ fontSize: "20px" }}>City: {item.City}</span>

                  <div
                    style={{ display: "flex", gap: "10px", padding: "15px" }}
                  >
                    {props.data.perm.includes("Update Subscriptions") ? (
                      <Button link={`editMember/${item._id}`} text="Edit" />
                    ) : null}
                    {props.data.perm.includes("Delete Subscriptions") ? (
                      <Button
                        link=""
                        onClick={() => deleteMember(item._id)}
                        text="Delete"
                      />
                    ) : null}
                  </div>

                  {props.data.perm.includes("View Movies") ? (
                    <div className="box2" style={{ width: "21em" }}>
                      <Subscriptions data={item} subs={subs} />

                      {subs.map((i, index1) => {
                        return (
                          <ul key={index1}>
                            {i.MemberId == item._id ? (
                              <div>
                                {i.Movies.map((j, index2) => {
                                  return (
                                    <li key={index2}>
                                      {movies.map((k, index3) => {
                                        return j.MovieId == k._id ? (
                                          <div
                                            key={index3}
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              marginLeft: "-30px",
                                              paddingRight: "5px",
                                            }}
                                          >
                                            <Link
                                              to={`/main/movies/${j.MovieId}`}
                                            >
                                              {k.Name}
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
                                })}
                              </div>
                            ) : null}
                          </ul>
                        );
                      })}

                      <button onClick={() => showORhide(item._id)}>
                        Subscribe to a new movie
                      </button>

                      <div
                        id={item._id}
                        className="flex"
                        style={{
                          visibility: "hidden",
                          gap: "10px",
                          paddingTop: "10px",
                        }}
                      >
                        <b>Add a new movie:</b>
                        <NewSubscription
                          setNewSub={(data) =>
                            setNewSub({ ...newSub, movie: data })
                          }
                          data={item}
                          movies={movies}
                          subs={subs}
                        />
                        <input
                          type="date"
                          onChange={(e) =>
                            setNewSub({
                              ...newSub,
                              id: item._id,
                              date: e.target.value,
                            })
                          }
                        />
                        <Button link="" onClick={addSub} text="Subscribe" />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        : null}
    </>
  );
}
