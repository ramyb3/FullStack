import { apiCalls } from "./functions";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ user: "", psw: "" });
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);

    const resp = await apiCalls("post", "main", user);

    if (resp == "THE USERNAME OR PASSWORD IS INCORRECT!!") {
      alert(resp);
      setLoading(false);
    } else {
      props.setData(resp);
      navigate("/main");
    }
  };

  return (
    <>
      <div className="box flex" style={{ gap: "15px" }}>
        <h2>Login Page</h2>
        <input
          placeholder="Enter User Name"
          type="text"
          onChange={(e) => setUser({ ...user, user: e.target.value })}
        />
        <input
          placeholder="Enter Password"
          type="password"
          onChange={(e) => setUser({ ...user, psw: e.target.value })}
        />
        <button onClick={send}>Login</button>
        {loading ? <h3>Loading...</h3> : null}
        <Link to="/create">CLICK ME IF YOU A NEW USER</Link>
      </div>
      <div className="flex">
        <h2>Login Instructions:</h2>
        <span>UserName - admin</span>
        <span style={{ paddingBottom: "10px" }}>Password - a</span>
        <span style={{ paddingBottom: "10px" }}>
          You can do whatever you want including add/edit/delete users.
        </span>
        <span>**If you want to get limited access,</span>
        <span>
          you must create another user by adding new one in user management
          page,
        </span>
        <span>then logout and click the link below login button,</span>
        <span>choose a password to your new user and log in to the site.</span>
      </div>
    </>
  );
}
