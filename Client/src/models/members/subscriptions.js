import Member from "./member";
import AddMember from "./addMember";
import { Button } from "../other/main";
import { apiCalls, useFunctions } from "../other/functions";
import { useEffect, useState } from "react";

export default function Subs(props) {
  const { sessionCheck } = useFunctions();
  const [movies, setMovies] = useState([]);
  const [members, setMembers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [add, setAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllData();
  }, []);

  useEffect(() => {
    sessionCheck(props.data);
  }, [add]);

  useEffect(() => {
    if (refresh) {
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

      <div className="flex-wrap">
        {!add ? (
          members.map((item, index) => {
            return (
              <Member
                key={index}
                data={props.data}
                item={item}
                subs={subs}
                movies={movies}
                refresh={() => setRefresh(true)}
              />
            );
          })
        ) : (
          <AddMember
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
