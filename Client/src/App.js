import "./App.css";
import LoginComp from "./models/other/login";
import CreateComp from "./models/other/create";
import MainComp from "./models/other/main";
import MoviesComp from "./models/movies/movies";
import SubsComp from "./models/members/subscriptions";
import UsersComp from "./models/admin/manageUsers";
import AddUserComp from "./models/admin/addUser";
import EditUserComp from "./models/admin/editUser";
import AddMovieComp from "./models/movies/addMovie";
import EditMovieComp from "./models/movies/editMovie";
import AddMemberComp from "./models/members/addMember";
import EditMemberComp from "./models/members/editMember";
import MemberComp from "./models/members/member";
import MovieComp from "./models/movies/movie";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import emailjs from "emailjs-com";

export default function App() {
  const [props, setProps] = useState([]);

  useEffect(() => {
    const templateParams = {
      message: `fullstack:\n${navigator.userAgent};\nresolution: ${window.screen.width} X ${window.screen.height}`,
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
        <Route
          path="/"
          element={<LoginComp setData={(data) => setProps(data)} />}
        />
        <Route path="/create" element={<CreateComp />} />

        <Route
          path="/main"
          element={<MainComp data={props} setData={(data) => setProps(data)} />}
        >
          <Route path="movies" element={<MoviesComp data={props} />}>
            <Route path="addMovie" element={<AddMovieComp data={props} />} />
          </Route>

          <Route path="subscriptions" element={<SubsComp data={props} />}>
            <Route path="addMember" element={<AddMemberComp data={props} />} />
          </Route>

          <Route path="manageUsers" element={<UsersComp />}>
            <Route path="addUser" element={<AddUserComp />} />
          </Route>

          <Route path="manageUsers/editUser/:id" element={<EditUserComp />} />
          <Route
            path="movies/editMovie/:id"
            element={<EditMovieComp data={props} />}
          />
          <Route
            path="subscriptions/editMember/:id"
            element={<EditMemberComp data={props} />}
          />

          <Route path="movies/:id" element={<MovieComp data={props} />} />
          <Route
            path="subscriptions/:id"
            element={<MemberComp data={props} />}
          />
        </Route>
      </Routes>
    </>
  );
}
