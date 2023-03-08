import AddMovie from "./addMovie";
import { apiCalls, useSessionCheck } from "../other/functions";
import { Button } from "../other/main";
import { useEffect, useRef, useState } from "react";
import Movie from "./movie";

export default function Movies(props) {
  const { sessionCheck } = useSessionCheck();
  const [movies, setMovies] = useState([]);
  const [members, setMembers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [add, setAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const serachRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getAllData();
  }, []);

  useEffect(() => {
    sessionCheck(props.data);
  }, [add]);

  useEffect(() => {
    if (refresh) {
      serachRef.current.value = "";
      getAllData();
    }
  }, [refresh]);

  const getAllData = async () => {
    const resp = await apiCalls("get", "");
    setMovies(resp[0]);
    setMembers(resp[1]);
    setSubs(resp[2]);
    setLoading(false);
    setRefresh(false);
  };

  const find = async () => {
    if (search !== "") {
      setLoading(true);

      const resp = await apiCalls("post", `findMovies/${search}`);
      setMovies(resp[0]);
      setMembers(resp[1]);
      setSubs(resp[2]);
      setLoading(false);
      setRefresh(false);
    } else {
      await getAllData();
    }
  };

  return (
    <>
      <div className="flex-column">
        <h2>Movies Page</h2>

        {props.data.perm.includes("Create Movies") ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              link=""
              text="All Movies"
              onClick={() => {
                setLoading(true);
                setRefresh(true);
                setAdd(false);
              }}
            />
            <Button
              link="addMovie"
              text="Add Movie"
              onClick={() => setAdd(true)}
            />
          </div>
        ) : null}
      </div>

      {!add ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          <input
            ref={serachRef}
            placeholder="Find Movie"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button style={{ fontSize: "14px", height: "22px" }} onClick={find}>
            Find
          </button>
        </div>
      ) : null}

      {loading ? <h3 style={{ textAlign: "center" }}>Loading...</h3> : null}

      <div className="flex-wrap">
        {!add ? (
          movies.map((item, index) => {
            return (
              <Movie
                key={index}
                data={props.data}
                item={item}
                subs={subs}
                members={members}
                refresh={() => setRefresh(true)}
              />
            );
          })
        ) : (
          <AddMovie
            refresh={() => {
              setAdd(false);
              setRefresh(true);
            }}
          />
        )}
      </div>
    </>
  );
}
