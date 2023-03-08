import { useFunctions } from "../other/functions";
import { Button } from "../other/main";
import { useState } from "react";

export const inputs = [
  {
    placeholder: "Enter Name",
    text: "name",
  },
  {
    placeholder: "Enter Email",
    text: "email",
    type: "email",
  },
  {
    placeholder: "Enter City",
    text: "city",
  },
];

export default function AddMember(props) {
  const { memberReq } = useFunctions();
  const [member, setMember] = useState({ name: "", city: "", email: "" });
  const [loading, setLoading] = useState(false);

  return (
    <div className="box flex-column" style={{ gap: "10px" }}>
      <h2>Add Member Page</h2>

      {inputs.map((input, index) => {
        return (
          <input
            key={index}
            type={input.type || "text"}
            onChange={(e) =>
              setMember({ ...member, [input.text]: e.target.value })
            }
            placeholder={input.placeholder}
          />
        );
      })}

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() =>
            memberReq("", member, "add", props.refresh, setLoading)
          }
        >
          Save
        </button>
        <Button link="" text="Cancel" onClick={props.refresh} />
      </div>
      {loading ? <h3>Loading...</h3> : null}
    </div>
  );
}
