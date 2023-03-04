import {  useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios";

function AddMember(props)
{
    const navigate =  useNavigate();

    const [member,setMember]= useState({name:'', city: '', email: ''});

    useEffect(()=>
    {
        if(props.props.name!= "admin")
        {   
            if((Date.now()-props.props.time) >= props.props.timeOut) // check if time over
            {
                alert("YOUR TIME IS UP!!");
                navigate("/");
            }
        }
    },[]);

    const send= async(x)=>
    {
        if(x==1)
        {
            if(member.name!= '' && member.city!= '' && member.email!= '')
            {
                await axios.post('http://localhost:7000/data/addMember', member);

                navigate('/main/subscriptions'); 
            }

            else
            alert("YOU MUST FILL ALL THE FORM!!");
        }

        if(x==2)
        navigate('/main/subscriptions'); 
    }

    return(<div style={{textAlign: 'center'}}>

        <div className="box">

            <h2>Add Member Page</h2>

            <input placeholder="Enter Name" type="text" onChange={e=> setMember({...member, name: e.target.value})} /><br/>

            <input placeholder="Enter Email" type="email" onChange={e=> setMember({...member, email: e.target.value})} /><br/>

            <input placeholder="Enter City" type="text" onChange={e=> setMember({...member, city: e.target.value})} /><br/><br/>

            <input type="button" value="Save" onClick={()=> send(1)} /> 
            <input type="button" value="Cancel" onClick={()=> send(2)} /><br/><br/>
        
        </div>

    </div>)
}

export default AddMember;
