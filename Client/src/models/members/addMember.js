import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AddMember(props) {
  const navigate = useNavigate();
  const [member, setMember] = useState({ name: "", city: "", email: "" });

  useEffect(() => {
    if (props.data.name != "admin") {
      if (Date.now() - props.data.time >= props.data.timeOut) {
        alert("YOUR TIME IS UP!!");
        navigate("/");
      }
    }
  }, []);

  const send = async (method) => {
    if (method) {
      if (member.name != "" && member.city != "" && member.email != "") {
        await axios.post(
          `${process.env.REACT_APP_API_SERVER}/addMember`,
          member
        );

        navigate("/main/subscriptions");
      } else {
        alert("YOU MUST FILL ALL THE FORM!!");
      }
    } else {
      navigate("/main/subscriptions");
    }
  };

  const inputs = [
    {
      placeholder: "Enter Name",
      onChange: "name",
    },
    {
      placeholder: "Enter Email",
      onChange: "email",
      type: "email",
    },
    {
      placeholder: "Enter City",
      onChange: "city",
    },
  ];

  return (
    <div className="box flex" style={{ gap: "10px" }}>
      <h2>Add Member Page</h2>

      {inputs.map((input, index) => {
        return (
          <input
            key={index}
            type={input.type || "text"}
            onChange={(e) =>
              setMember({ ...member, [input.onChange]: e.target.value })
            }
            placeholder={input.placeholder}
          />
        );
      })}

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => send(true)}>Save</button>
        <button onClick={() => send(false)}>Cancel</button>
      </div>
    </div>
  );
}
