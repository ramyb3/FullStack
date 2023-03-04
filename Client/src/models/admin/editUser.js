import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditUser() {
  const navigate = useNavigate();
  const params = useParams();
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
      const resp = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/editUser/${params.id}`
      );

      setName(`${resp.data.firstName} ${resp.data.lastName}`);
      setPerm(resp.data.perm);
      setUser({
        date: resp.data.date,
        Fname: resp.data.firstName,
        id: resp.data.id,
        Lname: resp.data.lastName,
        session: resp.data.session,
        Uname: resp.data.user,
      });
    };

    editUser();
  }, []);

  //check if main checkbox off
  const checkClicks = (e, label) => {
    const string = label.includes("Movies") ? "Movies" : "Subscriptions";

    if (!e.target.checked) {
      const arr = perm.filter((data) => data != label);
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
    const arr = perm.filter((data) => !data.includes(string));
    setPerm(arr);
  };

  const send = async (method) => {
    if (method) {
      if (
        user.Fname != "" &&
        user.Lname != "" &&
        user.Uname != "" &&
        user.session != 0
      ) {
        let obj = user;
        obj = { ...obj, perm };
        await axios.post(`${process.env.REACT_APP_API_SERVER}/updateUser`, obj);

        navigate("/main/manageUsers");
      } else {
        alert("YOU MUST FILL ALL THE FORM!!");
      }
    } else {
      navigate("/main/manageUsers");
    }
  };

  const inputs = [
    {
      text: "First Name",
      onChange: "Fname",
    },
    {
      text: "Last Name",
      onChange: "Lname",
    },
    {
      text: "User Name",
      onChange: "Uname",
    },
    {
      text: "Session Timeout (Minutes)",
      onChange: "session",
      type: "number",
      min: 1,
      style: "50px",
    },
  ];

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
    <div className="flex">
      <h2>Edit User Page: {name}</h2>

      <div className="box flex" style={{ gap: "10px", paddingTop:"10px" }}>
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
          <button onClick={() => send(true)}>Update</button>
          <button onClick={() => send(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
