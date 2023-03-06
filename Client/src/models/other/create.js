import { apiCalls } from "./functions";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Create() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ user: "", psw: "" });
  const [loading, setLoading] = useState(false);

  const create = async () => {
    if (user.user !== "" && user.psw !== "") {
      setLoading(true);

      const resp = await apiCalls("post", "create", user);

      if (!Array.isArray(resp)) {
        alert(resp);
      } else {
        navigate("/");
      }
    } else {
      alert("YOU MUST ENTER USERNAME AND PASSWORD!!");
    }
  };

  return (
    <div className="box flex-column" style={{ gap: "15px" }}>
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
      <button onClick={create}>Create</button>
      {loading ? <h3>Loading...</h3> : null}
    </div>
  );
}
