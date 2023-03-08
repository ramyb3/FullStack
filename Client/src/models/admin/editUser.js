import { inputs } from "./addUser";
import { apiCalls, useFunctions } from "../other/functions";
import { Button } from "../other/main";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EditUser() {
  const { userReq } = useFunctions();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [perm, setPerm] = useState([]);
  const [user, setUser] = useState({
    date: "",
    Fname: "",
    id: "",
    Lname: "",
    session: 0,
    Uname: "",
  });

  useEffect(() => {
    const editUser = async () => {
      const resp = await apiCalls("get", `editUser/${params.id}`);

      setName(`${resp.firstName} ${resp.lastName}`);
      setPerm(resp.perm);
      setUser({
        date: resp.date,
        Fname: resp.firstName,
        id: resp.id,
        Lname: resp.lastName,
        session: resp.session,
        Uname: resp.user,
      });

      setLoading(false);
    };

    setLoading(true);
    editUser();
  }, []);

  //check if main checkbox off
  const checkClicks = (e, label) => {
    const string = label.includes("Movies") ? "Movies" : "Subscriptions";

    if (!e.target.checked) {
      const arr = perm.filter((data) => data !== label);
      setPerm(arr);
    } else {
      if (!perm.includes(`View ${string}`)) {
        setPerm([...perm, label, `View ${string}`]);
      } else {
        setPerm([...perm, label]);
      }
    }
  };

  //check if main checkbox on
  const clearCheckboxes = (e, label) => {
    const string = label.includes("Movies") ? "Movies" : "Subscriptions";
    let arr;

    if (e.target.checked) {
      arr = [...perm, label];
    } else {
      arr = perm.filter((data) => !data.includes(string));
    }

    setPerm(arr);
  };

  const checkboxes = [
    {
      onClick: clearCheckboxes,
      text: "View Subscriptions",
    },
    {
      onClick: checkClicks,
      text: "Create Subscriptions",
    },
    {
      onClick: checkClicks,
      text: "Update Subscriptions",
    },
    {
      onClick: checkClicks,
      text: "Delete Subscriptions",
    },
    {
      onClick: clearCheckboxes,
      text: "View Movies",
    },
    {
      onClick: checkClicks,
      text: "Create Movies",
    },
    {
      onClick: checkClicks,
      text: "Update Movies",
    },
    {
      onClick: checkClicks,
      text: "Delete Movies",
    },
  ];

  return (
    <div className="flex-column">
      <h2>Edit User Page: {name}</h2>

      <div
        className="box flex-column"
        style={{ gap: "10px", paddingTop: "10px" }}
      >
        {inputs.map((input, index) => {
          return (
            <span key={index}>
              <b>{input.text}: </b>
              <input
                type={input.type || "text"}
                style={{ width: input.style }}
                value={user[input.onChange]}
                onChange={(e) =>
                  setUser({ ...user, [input.onChange]: e.target.value })
                }
                min={input.min}
              />
            </span>
          );
        })}
        <span>
          <b>Created Date: </b>
          {user.date}
        </span>

        <b>Permissions:</b>
        {checkboxes.map((checkbox, index) => {
          return (
            <label key={index}>
              <input
                checked={perm.includes(checkbox.text)}
                type="checkbox"
                onClick={(e) => checkbox.onClick(e, checkbox.text)}
              />
              {checkbox.text}
            </label>
          );
        })}

        <div style={{ display: "flex", gap: "10px", paddingTop: "15px" }}>
          <button
            onClick={() =>
              userReq(
                "/main/manageUsers",
                user,
                "update",
                () => {},
                setLoading,
                perm
              )
            }
          >
            Update
          </button>
          <Button link="/main/manageUsers" text="Cancel" />
        </div>

        {loading ? <h3>Loading...</h3> : null}
      </div>
    </div>
  );
}
