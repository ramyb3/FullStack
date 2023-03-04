import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login(props) {
  const navigate = useNavigate();

  const [user, setUser] = useState({ user: "", psw: "" });
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);

    let resp = await axios.post("http://localhost:7000/data/main", user);

    if (resp.data == "THE USERNAME OR PASSWORD IS INCORRECT!!") {
      alert(resp.data);
      setLoading(false);
    } else {
      props.send(resp.data);

      navigate("/main"); //to main
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div className="box">
        <h2>Login Page</h2>
        <input
          placeholder="Enter User Name"
          type="text"
          onChange={(e) => setUser({ ...user, user: e.target.value })}
        />
        <br />
        <br />
        <input
          placeholder="Enter Password"
          type="password"
          onChange={(e) => setUser({ ...user, psw: e.target.value })}
        />
        <br />
        <br />
        <input type="button" value="Login" onClick={send} />
        <br />
        {loading == true ? <h3>Loading...</h3> : <br />}
        <Link to="/create">CLICK ME IF YOU A NEW USER</Link> <br />
        <br />
      </div>
      <h2>Login Instructions:</h2>
      UserName - admin
      <br />
      Password - a<br />
      <br />
      You can do whatever you want including add/edit/delete users.
      <br />
      <br />
      **If you want to get limited access, you must create another user by
      adding new one in user management page,
      <br />
      then logout and click the link below login button, choose a password to
      your new user and log in to the site.
      <br />
      <br />
    </div>
  );
}

export default Login;
