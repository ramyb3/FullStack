import { Button } from "../other/main";
import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [add, setAdd] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      const resp = await axios.get(`${process.env.REACT_APP_API_SERVER}/users`);
      setUsers(resp.data);
    };

    getUsers();
  }, [users]);

  const edit = async (user) => {
    await axios.delete(
      `${process.env.REACT_APP_API_SERVER}/deleteUser/${user}`
    );
  };

  return (
    <>
      <div className="flex">
        <h2>All Users Page</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button link="" text="All Users" onClick={() => setAdd(false)} />
          <Button link="addUser" text="Add User" onClick={() => setAdd(true)} />
        </div>
      </div>

      <Outlet />

      {!add
        ? users.map((item, index) => {
            return (
              <div key={index} style={{ marginBottom: "15px" }}>
                <div className="box1 flex">
                  <Span text="Name" data={item.name} />
                  <Span text="User Name" data={item.user} />
                  {item.user != "admin" ? (
                    <Span
                      text="Session Timeout (Minutes)"
                      data={item.session}
                    />
                  ) : null}
                  <Span text="Created Date" data={item.date} />
                  <b style={{paddingTop:"10px"}}>Permissions:</b>
                  {item.perm.map((string, index) => {
                    return `${string}${
                      index != item.perm.length - 1 ? ", " : ""
                    }`;
                  })}
                  {item.user != "admin" ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        paddingTop: "15px",
                      }}
                    >
                      <Button link={`editUser/${item.id}`} text="Edit" />
                      <Button
                        link=""
                        text="Delete"
                        onClick={() => edit(item.id)}
                      />
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

function Span(props) {
  return (
    <span>
      <b>{props.text}: </b>
      {props.data}
    </span>
  );
}
