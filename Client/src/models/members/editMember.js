import { apiCalls, useSessionCheck } from "../other/functions";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditMember(props) {
  const navigate = useNavigate();
  const { sessionCheck } = useSessionCheck();
  const params = useParams();
  const [member, setMember] = useState({
    name: "",
    id: "",
    email: "",
    city: "",
  });

  useEffect(() => {
    const getMember = async () => {
      const resp = await apiCalls("get", `editMember/${params.id}`);

      setMember({
        name: resp.Name,
        id: resp._id,
        email: resp.Email,
        city: resp.City,
      });
    };

    sessionCheck(props.data);
    getMember();
  }, []);

  const send = async (method) => {
    if (method) {
      if (member.name != "" && member.email != "" && member.city != "") {
        await apiCalls("post", "updateMember", member);
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
      text: "name",
    },
    {
      text: "email",
      type: "email",
    },
    {
      text: "city",
    },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Edit Member Page</h2>

      <div className="box flex" style={{ gap: "10px", paddingTop: "10px" }}>
        {inputs.map((input, index) => {
          return (
            <span key={index}>
              <b>Enter the member's {input.text}: </b>
              <input
                type={input.type || "text"}
                value={member[input.text]}
                onChange={(e) =>
                  setMember({ ...member, [input.text]: e.target.value })
                }
              />
            </span>
          );
        })}

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => send(true)}>Update</button>
          <button onClick={() => send(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
