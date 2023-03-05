import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditMember(props) {
  const navigate = useNavigate();
  const params = useParams();
  const [member, setMember] = useState({
    name: "",
    id: "",
    email: "",
    city: "",
  });

  useEffect(() => {
    if (props.data.name != "admin") {
      if (Date.now() - props.data.time >= props.data.timeOut) {
        alert("YOUR TIME IS UP!!");
        navigate("/");
      }
    }

    const getMember = async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/editMember/${params.id}`
      );

      setMember({
        name: resp.data.Name,
        id: resp.data._id,
        email: resp.data.Email,
        city: resp.data.City,
      });
    };

    getMember();
  }, []);

  const send = async (method) => {
    if (method) {
      if (member.name != "" && member.email != "" && member.city != "") {
        await axios.post(
          `${process.env.REACT_APP_API_SERVER}/updateMember`,
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
