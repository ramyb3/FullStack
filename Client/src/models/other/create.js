import { apiCalls } from "./apiCalls";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Create() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ user: "", psw: "" });

  const send = async () => {
    if (user.user != "" && user.psw != "") {
      const resp = await apiCalls("post", "create", user);

      if (!Array.isArray(resp.data)) {
        alert(resp.data);
      } else {
        navigate("/");
      }
    } else {
      alert("YOU MUST ENTER USERNAME AND PASSWORD!!");
    }
  };

  return (
    <div className="box flex" style={{ gap: "15px" }}>
      <h2>Create Account Page</h2>
      <input
        type="text"
        placeholder="Enter given User Name"
        onChange={(e) => setUser({ ...user, user: e.target.value })}
      />
      <input
        placeholder="Enter Password"
        type="password"
        onChange={(e) => setUser({ ...user, psw: e.target.value })}
      />
      <button onClick={send}>Create</button>
    </div>
  );
}
