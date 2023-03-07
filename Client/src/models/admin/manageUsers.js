import { Button } from "../other/main";
import { apiCalls } from "../other/functions";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [add, setAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  const getUsers = async () => {
    const resp = await apiCalls("get", "users");
    setUsers(resp);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getUsers();
  }, []);

  const deleteUser = async (user) => {
    await apiCalls("delete", `deleteUser/${user}`);
    await getUsers();
  };

  return (
    <>
      <div className="flex-column">
        <h2>All Users Page</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button link="" text="All Users" onClick={() => setAdd(false)} />
          <Button link="addUser" text="Add User" onClick={() => setAdd(true)} />
        </div>
        {loading ? <h3>Loading...</h3> : null}
      </div>

      <Outlet />

      <div className="flex-wrap" style={{ height: "250px" }}>
        {!add
          ? users.map((item, index) => {
              return <User key={index} func={deleteUser} data={item} />;
            })
          : null}
      </div>
    </>
  );
}

function User(props) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="box1 flex-column" style={{ width: "25em" }}>
      <Span text="Name" data={props.data.name} />
      <Span text="User Name" data={props.data.user} />
      {props.data.user != "admin" ? (
        <Span text="Session Timeout (Minutes)" data={props.data.session} />
      ) : null}
      <Span text="Created Date" data={props.data.date} />
      <b style={{ paddingTop: "10px" }}>Permissions:</b>
      {props.data.perm.map((string, index) => {
        return `${string}${index != props.data.perm.length - 1 ? ", " : ""}`;
      })}
      {props.data.user != "admin" ? (
        <div
          style={{
            display: "flex",
            gap: "10px",
            paddingTop: "15px",
          }}
        >
          <Button link={`editUser/${props.data.id}`} text="Edit" />
          <button
            onClick={() => {
              setLoading(true);
              props.func(props.data.id);
            }}
          >
            Delete
          </button>
        </div>
      ) : null}

      {loading ? <h3>Loading...</h3> : null}
    </div>
  );
}

function Span(props) {
  return (
    <span>
      <b>{props.text}: </b>
      {props.data}
    </span>
  );
}
