import { apiCalls, useSessionCheck } from "../other/functions";
import { Button } from "../other/main";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditMember(props) {
  const navigate = useNavigate();
  const { sessionCheck } = useSessionCheck();
  const params = useParams();
  const [loading, setLoading] = useState(false);
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

      setLoading(false);
    };

    sessionCheck(props.data);
    setLoading(true);
    getMember();
  }, []);

  const updateMember = async () => {
    if (member.name !== "" && member.email !== "" && member.city !== "") {
      setLoading(true);
      await apiCalls("post", "updateMember", member);
      navigate("/main/subscriptions");
    } else {
      alert("YOU MUST FILL ALL THE FORM!!");
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

      <div
        className="box flex-column"
        style={{ gap: "10px", paddingTop: "10px" }}
      >
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
          <button onClick={updateMember}>Update</button>
          <Button link="/main/subscriptions" text="Cancel" />
        </div>
        {loading ? <h3>Loading...</h3> : null}
      </div>
    </div>
  );
}
