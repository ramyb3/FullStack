import { apiCalls, useSessionCheck } from "../other/functions";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddMember(props) {
  const navigate = useNavigate();
  const { sessionCheck } = useSessionCheck();
  const [member, setMember] = useState({ name: "", city: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sessionCheck(props.data);
  }, []);

  const send = async (method) => {
    if (method) {
      if (member.name != "" && member.city != "" && member.email != "") {
        setLoading(true);
        await apiCalls("post", "addMember", member);
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
      {loading ? <h3>Loading...</h3> : null}
    </div>
  );
}
