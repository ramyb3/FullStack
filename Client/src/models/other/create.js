import {  useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Create()
{
    const navigate =  useNavigate();

    const [user,setUser]= useState({user:'', psw: ''});

    const send= async()=>
    {
        if(user.user!='' && user.psw!='')
        {
            let resp= await axios.post('http://localhost:7000/data/create', user);
        
            if(!Array.isArray(resp.data))
            alert(resp.data);
            
            else
            navigate('/'); //to login
        }

        else
        alert("YOU MUST ENTER USERNAME AND PASSWORD!!");   
    }

    return(<div style={{textAlign: 'center'}}>

        <div className='box'>
            
            <h2>Create Account Page</h2>
            
            Enter the User Name that the ADMIN gave you:<br/> <input type="text" onChange={e=> setUser({...user, user: e.target.value})}/><br/><br/>
            <input placeholder="Enter Password" type="password" onChange={e=> setUser({...user, psw: e.target.value})}/><br/><br/>
            <input type="button" value="Create" onClick={send} /><br/><br/>
        
        </div>

    </div>)
}

export default Create;
