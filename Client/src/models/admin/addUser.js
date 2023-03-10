import { useFunctions } from "../other/functions";
import { Button } from "../other/main";
import { useState } from "react";

export const inputs = [
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
    text: "Session Timeout- Minutes",
    onChange: "session",
    type: "number",
    min: 1,
    style: "50px",
  },
];

export default function AddUser(props) {
  const { userReq } = useFunctions();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    Fname: "",
    Lname: "",
    Uname: "",
    session: 0,
    VS: false,
    CS: false,
    US: false,
    DS: false,
    VM: false,
    CM: false,
    UM: false,
    DM: false,
  });

  const checkClicks = (e, label) => {
    let obj;

    if (label.includes("S")) {
      obj = "VS";
    } else {
      obj = "VM";
    }

    setUser({ ...user, [label]: e.target.checked, [obj]: true });
  };

  const clearCheckboxes = (e, label) => {
    if (label === "VS") {
      if (!e.target.checked) {
        setUser({ ...user, CS: false, US: false, DS: false, VS: false });
      } else {
        checkClicks(e, label);
      }
    } else {
      if (!e.target.checked) {
        setUser({ ...user, CM: false, UM: false, DM: false, VM: false });
      } else {
        checkClicks(e, label);
      }
    }
  };

  const checkboxes = [
    {
      onClick: clearCheckboxes,
      text: "View Subscriptions",
      checked: "VS",
    },
    {
      onClick: checkClicks,
      text: "Create Subscriptions",
      checked: "CS",
    },
    {
      onClick: checkClicks,
      text: "Update Subscriptions",
      checked: "US",
    },
    {
      onClick: checkClicks,
      text: "Delete Subscriptions",
      checked: "DS",
    },
    {
      onClick: clearCheckboxes,
      text: "View Movies",
      checked: "VM",
    },
    {
      onClick: checkClicks,
      text: "Create Movies",
      checked: "CM",
    },
    {
      onClick: checkClicks,
      text: "Update Movies",
      checked: "UM",
    },
    {
      onClick: checkClicks,
      text: "Delete Movies",
      checked: "DM",
    },
  ];

  return (
    <div className="box flex-column" style={{ gap: "10px" }}>
      <h2>Add User Page</h2>

      {inputs.map((input, index) => {
        return (
          <input
            key={index}
            type={input.type || "text"}
            onChange={(e) =>
              setUser({ ...user, [input.onChange]: e.target.value })
            }
            placeholder={input.text}
            min={input.min}
          />
        );
      })}

      <b>Permissions:</b>
      {checkboxes.map((checkbox, index) => {
        return (
          <label key={index}>
            <input
              checked={user[checkbox.checked]}
              type="checkbox"
              onClick={(e) => checkbox.onClick(e, checkbox.checked)}
            />
            {checkbox.text}
          </label>
        );
      })}

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() =>
            userReq("", user, "add", props.setAdd, setLoading, null)
          }
        >
          Save
        </button>
        <Button link="" text="Cancel" onClick={props.setAdd} />
      </div>
      {loading ? <h3>Loading...</h3> : null}
    </div>
  );
}
