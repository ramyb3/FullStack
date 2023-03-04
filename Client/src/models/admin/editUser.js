import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditUser() {
  const navigate = useNavigate();

  const params = useParams();

  const [user, setUser] = useState({
    date: "",
    Fname: "",
    id: "",
    Lname: "",
    session: 0,
    Uname: "",
  });
  const [name, setName] = useState("");
  const [perm, setPerm] = useState([]);

  useEffect(async () => {
    let resp = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/editUser/${params.id}`
    );

    setName(resp.data.firstName + " " + resp.data.lastName);

    setPerm(resp.data.perm);

    setUser({
      date: resp.data.date,
      Fname: resp.data.firstName,
      id: resp.data.id,
      Lname: resp.data.lastName,
      session: resp.data.session,
      Uname: resp.data.user,
    });
  }, []);

  const checkSubs = (
    e //check if 'View Subscriptions' off
  ) => {
    if (document.getElementById(e.target.id).checked == true) {
      if (!perm.includes("View Subscriptions"))
        setPerm([...perm, e.target.name, "View Subscriptions"]);
      else setPerm([...perm, e.target.name]);
    } else {
      let arr = perm.filter((x) => x != e.target.name);

      setPerm(arr);
    }
  };

  const checkMovies = (
    e //check if 'View Movies' off
  ) => {
    if (document.getElementById(e.target.id).checked == true) {
      if (!perm.includes("View Movies"))
        setPerm([...perm, e.target.name, "View Movies"]);
      else setPerm([...perm, e.target.name]);
    } else {
      let arr = perm.filter((x) => x != e.target.name);

      setPerm(arr);
    }
  };

  const clearSubs = () =>
    //check if 'View Subscriptions' on
    {
      let arr = perm.filter(
        (x) =>
          x != "View Subscriptions" &&
          x != "Create Subscriptions" &&
          x != "Update Subscriptions" &&
          x != "Delete Subscriptions"
      );

      setPerm(arr);
    };

  const clearMovies = () =>
    //check if 'View Movies' on
    {
      let arr = perm.filter(
        (x) =>
          x != "View Movies" &&
          x != "Create Movies" &&
          x != "Update Movies" &&
          x != "Delete Movies"
      );

      setPerm(arr);
    };

  const send = async (x) => {
    if (x == 1) {
      if (
        user.Fname != "" &&
        user.Lname != "" &&
        user.Uname != "" &&
        user.session != 0
      ) {
        let obj = user;

        obj = { ...obj, perm };

        await axios.post(`${process.env.REACT_APP_API_SERVER}/updateUser`, obj);

        navigate("/main/manageUsers");
      } else alert("YOU MUST FILL ALL THE FORM!!");
    }

    if (x == 2) navigate("/main/manageUsers");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Edit User Page: {name}</h2>

      <div className="box">
        <br />
        <b>First Name:</b>{" "}
        <input
          type="text"
          name="Fname"
          value={user.Fname}
          onChange={(e) => setUser({ ...user, Fname: e.target.value })}
        />{" "}
        <br />
        <b>Last Name:</b>{" "}
        <input
          type="text"
          name="Lname"
          value={user.Lname}
          onChange={(e) => setUser({ ...user, Lname: e.target.value })}
        />{" "}
        <br />
        <b>User Name:</b>{" "}
        <input
          type="text"
          name="Uname"
          value={user.Uname}
          onChange={(e) => setUser({ ...user, Uname: e.target.value })}
        />{" "}
        <br />
        <b>Session Timeout (Minutes):</b>{" "}
        <input
          style={{ width: "50px" }}
          type="number"
          name="session"
          value={user.session}
          min="1"
          onChange={(e) => setUser({ ...user, session: e.target.value })}
        />{" "}
        <br />
        <b>Created Date:</b> {user.date} <br />
        <br />
        <b>Permissions:</b> <br />
        {perm.includes("View Subscriptions") ? (
          <input
            type="checkbox"
            name="View Subscriptions"
            id="ID1"
            onClick={clearSubs}
            checked
          />
        ) : (
          <input
            type="checkbox"
            name="View Subscriptions"
            id="ID1"
            onClick={clearSubs}
          />
        )}{" "}
        View Subscriptions
        <br />
        {perm.includes("Create Subscriptions") ? (
          <input
            type="checkbox"
            name="Create Subscriptions"
            id="ID3"
            onClick={(e) => checkSubs(e)}
            checked
          />
        ) : (
          <input
            type="checkbox"
            name="Create Subscriptions"
            id="ID3"
            onClick={(e) => checkSubs(e)}
          />
        )}{" "}
        Create Subscriptions
        <br />
        {perm.includes("Update Subscriptions") ? (
          <input
            type="checkbox"
            name="Update Subscriptions"
            id="ID4"
            onClick={(e) => checkSubs(e)}
            checked
          />
        ) : (
          <input
            type="checkbox"
            name="Update Subscriptions"
            id="ID4"
            onClick={(e) => checkSubs(e)}
          />
        )}{" "}
        Update Subscriptions
        <br />
        {perm.includes("Delete Subscriptions") ? (
          <input
            type="checkbox"
            name="Delete Subscriptions"
            id="ID5"
            onClick={(e) => checkSubs(e)}
            checked
          />
        ) : (
          <input
            type="checkbox"
            name="Delete Subscriptions"
            id="ID5"
            onClick={(e) => checkSubs(e)}
          />
        )}{" "}
        Delete Subscriptions
        <br />
        {/*///////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        {perm.includes("View Movies") ? (
          <input
            type="checkbox"
            name="View Movies"
            id="ID2"
            onClick={clearMovies}
            checked
          />
        ) : (
          <input
            type="checkbox"
            name="View Movies"
            id="ID2"
            onClick={clearMovies}
          />
        )}{" "}
        View Movies
        <br />
        {perm.includes("Create Movies") ? (
          <input
            type="checkbox"
            name="Create Movies"
            id="ID6"
            onClick={(e) => checkMovies(e)}
            checked
          />
        ) : (
          <input
            type="checkbox"
            name="Create Movies"
            id="ID6"
            onClick={(e) => checkMovies(e)}
          />
        )}{" "}
        Create Movies
        <br />
        {perm.includes("Update Movies") ? (
          <input
            type="checkbox"
            name="Update Movies"
            id="ID7"
            onClick={(e) => checkMovies(e)}
            checked
          />
        ) : (
          <input
            type="checkbox"
            name="Update Movies"
            id="ID7"
            onClick={(e) => checkMovies(e)}
          />
        )}{" "}
        Update Subscriptions
        <br />
        {perm.includes("Delete Movies") ? (
          <input
            type="checkbox"
            name="Delete Movies"
            id="ID8"
            onClick={(e) => checkMovies(e)}
            checked
          />
        ) : (
          <input
            type="checkbox"
            name="Delete Movies"
            id="ID8"
            onClick={(e) => checkMovies(e)}
          />
        )}{" "}
        Delete Movies
        <br />
        <br />
        <input type="button" value="Update" onClick={() => send(1)} />
        <input type="button" value="Cancel" onClick={() => send(2)} />
        <br />
        <br />
      </div>
      <br />
    </div>
  );
}

export default EditUser;
