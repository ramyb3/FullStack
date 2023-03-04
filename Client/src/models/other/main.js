import { Link, Outlet } from "react-router-dom";

export default function Main(props) {
  return (
    <>
      <b style={{ color: "rgb(69, 78, 208)", fontSize: "20px" }}>
        Connected User: {props.props.name}
      </b>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        {props.props.perm.includes("View Movies") ? (
          <Button link="movies" text="Movies" />
        ) : null}
        {props.props.perm.includes("View Subscriptions") ? (
          <Button link="subscriptions" text="Subscriptions" />
        ) : null}
        {props.props.name == "admin" ? (
          <Button link="manageUsers" text="Users Management" />
        ) : null}
        <Button link="/" text="Logout" onClick={() => props.callback([])} />
      </div>
      <Outlet />
    </>
  );
}

function Button(props) {
  return (
    <Link to={props.link}>
      <button onClick={props.onClick}>{props.text}</button>
    </Link>
  );
}
