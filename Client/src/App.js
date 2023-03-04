import {Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css'

import LoginComp from './models/other/login';
import CreateComp from './models/other/create';
import MainComp from './models/other/main';
import MoviesComp from './models/movies/movies';
import SubsComp from './models/members/subscriptions';
import UsersComp from './models/admin/manageUsers';
import AddUserComp from './models/admin/addUser';
import EditUserComp from './models/admin/editUser';
import AddMovieComp from './models/movies/addMovie';
import EditMovieComp from './models/movies/editMovie';
import AddMemberComp from './models/members/addMember';
import EditMemberComp from './models/members/editMember';
import MemberComp from './models/members/member';
import MovieComp from './models/movies/movie';

function App()
{
    const [props,setProps]= useState([]);

    return (<div>

        <div style={{textAlign: "center"}}>This site has been uploaded with the help of Avi Koenig </div> 

        <h1 style={{textAlign: "center", color: 'rgb(109, 65, 67)'}}>Movies - Subscriptions Web Site</h1>

        <Routes>

            <Route path="/" element={<LoginComp send={data=> setProps(data)}/>} />
            <Route path="/create" element={<CreateComp />} />

            <Route path="/main" element={<MainComp props={props} callback={data=> setProps(data)}/>} >

                <Route path="movies" element={<MoviesComp props={props}/>} >
                    <Route path="addMovie" element={<AddMovieComp props={props}/>} />
                </Route>

                <Route path="subscriptions" element={<SubsComp props={props}/>} >
                    <Route path="addMember" element={<AddMemberComp props={props}/>} />
                </Route>

                <Route path="manageUsers" element={<UsersComp />} >
                    <Route path="addUser" element={<AddUserComp />} />
                </Route>

                <Route path="manageUsers/editUser/:id" element={<EditUserComp props={props}/>} />
                <Route path="movies/editMovie/:id" element={<EditMovieComp props={props}/>} />
                <Route path="subscriptions/editMember/:id" element={<EditMemberComp props={props}/>} />

                <Route path="movies/:id" element={<MovieComp props={props}/>} />
                <Route path="subscriptions/:id" element={<MemberComp props={props}/>} />

            </Route>
        </Routes>   

    </div>);
}

export default App;
