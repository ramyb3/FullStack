import { apiCalls } from "../other/functions";
import { Button } from "../other/main";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddMember(props) {
  const navigate = useNavigate();
  const [member, setMember] = useState({ name: "", city: "", email: "" });
  const [loading, setLoading] = useState(false);

  const addMember = async () => {
    if (member.name !== "" && member.city !== "" && member.email !== "") {
      setLoading(true);
      await apiCalls("post", "addMember", member);
      props.refresh();

      setTimeout(() => {
        navigate("");
      }, 5000);
    } else {
      alert("YOU MUST FILL ALL THE FORM!!");
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
    <div className="box flex-column" style={{ gap: "10px" }}>
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
        <button onClick={addMember}>Save</button>
        <Button link="" text="Cancel" onClick={props.refresh} />
      </div>
      {loading ? <h3>Loading...</h3> : null}
    </div>
  );
}
