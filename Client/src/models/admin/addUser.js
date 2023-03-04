import {  useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from "axios";

function AddUser()
{
    const navigate =  useNavigate();

    const [user,setUser]= useState({Fname:'', Lname:'', Uname: '', session: 0,
    CS: false, US: false, DS: false, CM: false, UM: false, DM: false});

    const [VS,setVS]= useState(false);
    const [VM,setVM]= useState(false);

    const checkSubs= ()=> //check if 'View Subscriptions' off
    {
        document.getElementById("ID1").checked = true;   
        
        setVS(true);
    }
    
    const checkMovies= ()=> //check if 'View Movies' off
    {
        document.getElementById("ID2").checked = true;  
        
        setVM(true);
    }
    
    const clearSubs= ()=> //check if 'View Subscriptions' on
    {
        document.getElementById("ID3").checked = false;
        document.getElementById("ID4").checked = false;
        document.getElementById("ID5").checked = false;

        setUser({...user, CS: false, US: false, DS: false});
    }
    
    const clearMovies= ()=> //check if 'View Movies' on
    {
        document.getElementById("ID6").checked = false;
        document.getElementById("ID7").checked = false; 
        document.getElementById("ID8").checked = false;  
        
        setUser({...user, CM: false, UM: false, DM: false});
    }

    const send= async(x)=>
    {
        if(x==1)
        {
            if(user.Fname!= '' && user.Lname!= '' && user.Uname!= '' && user.session!= 0)
            {
                let obj= {...user, VS: VS, VM: VM};

                await axios.post('http://localhost:7000/data/addUser', obj);

                navigate('/main/manageUsers'); 
            }

            else
            alert("YOU MUST FILL ALL THE FORM!!");
        }

        if(x==2)
        navigate('/main/manageUsers'); 
    }

    return(<div style={{textAlign: 'center'}}>
        
        <div className="box">

            <h2 >Add User Page</h2>

            <input placeholder="First Name" type="text" onChange={e=> setUser({...user,Fname: e.target.value})}/> <br/>
            <input placeholder="Last Name" type="text" onChange={e=> setUser({...user,Lname: e.target.value})}/> <br/>
            <input placeholder="User Name" type="text" onChange={e=> setUser({...user,Uname: e.target.value})}/> <br/>
            <input placeholder="Session Timeout- Minutes" type="number" min="1" onChange={e=> setUser({...user,session: e.target.value})}/> <br/><br/>
            
            <b>Permissions:</b> <br/>
            <input type="checkbox" id="ID1" onClick={clearSubs} onChange={e=> setVS(e.target.checked)}/> View Subscriptions <br/>
            <input type="checkbox" id="ID3" onClick={checkSubs} onChange={e=> setUser({...user, CS: e.target.checked})}/> Create Subscriptions <br/>
            <input type="checkbox" id="ID4" onClick={checkSubs} onChange={e=> setUser({...user, US: e.target.checked})}/> Update Subscriptions <br/>
            <input type="checkbox" id="ID5" onClick={checkSubs} onChange={e=> setUser({...user, DS: e.target.checked})}/> Delete Subscriptions <br/>
            <input type="checkbox" id="ID2" onClick={clearMovies} onChange={e=> setVM(e.target.checked)}/> View Movies <br/>
            <input type="checkbox" id="ID6" onClick={checkMovies} onChange={e=> setUser({...user, CM: e.target.checked})}/> Create Movies <br/>
            <input type="checkbox" id="ID7" onClick={checkMovies} onChange={e=> setUser({...user, UM: e.target.checked})}/> Update Movies <br/>
            <input type="checkbox" id="ID8" onClick={checkMovies} onChange={e=> setUser({...user, DM: e.target.checked})}/> Delete Movies <br/><br/>

            <input type="button" value="Save" onClick={()=> send(1)} /> 
            <input type="button" value="Cancel" onClick={()=> send(2)} /><br/><br/>

        </div><br/>

    </div>)
}

export default AddUser;
