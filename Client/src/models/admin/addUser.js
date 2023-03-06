import { apiCalls } from "../other/functions";
import { Button } from "../other/main";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AddUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [VS, setVS] = useState(false);
  const [VM, setVM] = useState(false);
  const [user, setUser] = useState({
    Fname: "",
    Lname: "",
    Uname: "",
    session: 0,
    CS: false,
    US: false,
    DS: false,
    CM: false,
    UM: false,
    DM: false,
  });

  //check if 'View Subscriptions' off
  const checkSubs = () => {
    setVS(true);
  };

  //check if 'View Movies' off
  const checkMovies = () => {
    setVM(true);
  };

  //check if 'View Subscriptions' on
  const clearSubs = () => {
    setUser({ ...user, CS: false, US: false, DS: false });
  };

  //check if 'View Movies' on
  const clearMovies = () => {
    setUser({ ...user, CM: false, UM: false, DM: false });
  };

  const addUser = async () => {
    if (
      user.Fname !== "" &&
      user.Lname !== "" &&
      user.Uname !== "" &&
      user.session != 0
    ) {
      setLoading(true);

      const obj = { ...user, VS, VM };
      await apiCalls("post", "addUser", obj);
      navigate("/main/manageUsers");
    } else {
      alert("YOU MUST FILL ALL THE FORM!!");
    }
  };

  const checkboxes = [
    {
      checked: VS,
      onClick: clearSubs,
      text: "View Subscriptions",
      onChange: setVS,
    },
    {
      checked: user.CS,
      onClick: checkSubs,
      text: "Create Subscriptions",
      onChange: "CS",
    },
    {
      checked: user.US,
      onClick: checkSubs,
      text: "Update Subscriptions",
      onChange: "US",
    },
    {
      checked: user.DS,
      onClick: checkSubs,
      text: "Delete Subscriptions",
      onChange: "DS",
    },
    {
      checked: VM,
      onClick: clearMovies,
      text: "View Movies",
      onChange: setVM,
    },
    {
      checked: user.CM,
      onClick: checkMovies,
      text: "Create Movies",
      onChange: "CM",
    },
    {
      checked: user.UM,
      onClick: checkMovies,
      text: "Update Movies",
      onChange: "UM",
    },
    {
      checked: user.DM,
      onClick: checkMovies,
      text: "Delete Movies",
      onChange: "DM",
    },
  ];

  const inputs = [
    {
      placeholder: "First Name",
      onChange: "Fname",
    },
    {
      placeholder: "Last Name",
      onChange: "Lname",
    },
    {
      placeholder: "User Name",
      onChange: "Uname",
    },
    {
      placeholder: "Session Timeout- Minutes",
      onChange: "session",
      type: "number",
      min: 1,
    },
  ];

  return (
    <div className="box flex" style={{ gap: "10px" }}>
      <h2>Add User Page</h2>

      {inputs.map((input, index) => {
        return (
          <input
            key={index}
            type={input.type || "text"}
            onChange={(e) =>
              setUser({ ...user, [input.onChange]: e.target.value })
            }
            placeholder={input.placeholder}
            min={input.min}
          />
        );
      })}

      <b>Permissions:</b>
      {checkboxes.map((checkbox, index) => {
        return (
          <label key={index}>
            <input
              checked={checkbox.checked}
              type="checkbox"
              onChange={(e) =>
                typeof checkbox.onChange === "string"
                  ? setUser({ ...user, [checkbox.onChange]: e.target.checked })
                  : checkbox.onChange(e.target.checked)
              }
              onClick={checkbox.onClick}
            />
            {checkbox.text}
          </label>
        );
      })}

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={addUser}>Save</button>
        <Button link="/main/manageUsers" text="Cancel" />
      </div>
      {loading ? <h3>Loading...</h3> : null}
    </div>
  );
}
