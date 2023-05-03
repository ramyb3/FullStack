import "./App.css";
import Login from "./models/other/login";
import Create from "./models/other/create";
import Main from "./models/other/main";
import Movies from "./models/movies/movies";
import Subs from "./models/members/subscriptions";
import Users from "./models/admin/manageUsers";
import EditUser from "./models/admin/editUser";
import EditMovie from "./models/movies/editMovie";
import EditMember from "./models/members/editMember";
import Member from "./models/members/member";
import Movie from "./models/movies/movie";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDeviceData } from "react-device-detect";
import emailjs from "emailjs-com";

export default function App() {
  const deviceData = useDeviceData();
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const templateParams = {
      message: `fullstack:\n\n${JSON.stringify(
        deviceData,
        null,
        2
      )}\n\nresolution: ${window.screen.width} X ${window.screen.height}`,
    };

    emailjs.send(
      process.env.REACT_APP_EMAIL_JS_SERVICE,
      process.env.REACT_APP_EMAIL_JS_TEMPLATE,
      templateParams,
      process.env.REACT_APP_EMAIL_JS_USER
    );
  }, []);

  return (
    <>
      <h1>Movies - Subscriptions Web Site</h1>

      <Routes>
        <Route path="/" element={<Login setData={setUserData} />} />
        <Route path="/create" element={<Create />} />

        <Route
          path="/main"
          element={<Main data={userData} setData={setUserData} />}
        >
          <Route path="manageUsers" element={<Users />}>
            <Route path="addUser" element={<Users />} />
          </Route>
          <Route path="manageUsers/editUser/:id" element={<EditUser />} />

          <Route path="movies" element={<Movies data={userData} />}>
            <Route path="addMovie" element={<Movies data={userData} />} />
          </Route>
          <Route
            path="movies/editMovie/:id"
            element={<EditMovie data={userData} />}
          />
          <Route path="movies/:id" element={<Movie data={userData} />} />

          <Route path="subscriptions" element={<Subs data={userData} />}>
            <Route path="addMember" element={<Subs data={userData} />} />
          </Route>
          <Route
            path="subscriptions/editMember/:id"
            element={<EditMember data={userData} />}
          />
          <Route
            path="subscriptions/:id"
            element={<Member data={userData} />}
          />
        </Route>
      </Routes>
    </>
  );
}
