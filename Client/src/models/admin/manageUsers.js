import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

function Users()
{
    const [users,setUsers]= useState([]);
    const [add,setAdd]= useState(false);

    useEffect(async()=>
    {
        let resp= await axios.get('http://localhost:7000/data/users');

        setUsers(resp.data);
    },[users]);                      

    const edit= async (x)=>
    {
        await axios.delete('http://localhost:7000/data/deleteUser/' + x);
    }

    return(<div>

        <div style={{textAlign: "center"}}>
            <h2 >All Users Page</h2>

            <Link to=""><input type="button" value="All Users" onClick={()=> setAdd(false)} /></Link>&nbsp;
            <Link to="addUser"><input type="button" value="Add User" onClick={()=> setAdd(true)} /></Link><br/><br/>
        </div>

        <Outlet/>

        { add==false ? 
        
            users.map((item,index)=>
            {
                return<div key={index}><div className="box1">
                    
                    <b>Name: </b> {item.name} <br/>
                    <b>User Name: </b> {item.user}<br/>

                    {item.user!='admin' ?

                        <div> <b>Session Timeout (Minutes): </b> {item.session} <br/> </div> : null
                    }

                    <b>Created Date: </b> {item.date} <br/><br/>
                    <b>Permissions: </b>
                    {
                        item.perm.map((x,index)=>
                        {
                            return <>

                                {index!=item.perm.length-1 ?
                                <> {x},  </> : <> {x} </> }
                                
                            </> 
                        })
                    
                    }<br/><br/>

                    {item.user!='admin' ?

                    <div>

                        <Link to={"editUser/"+ item.id}><input type="button" value="Edit" /></Link>
                        <Link to=""><input onClick={()=> edit(item.id)} type="button" value="Delete" /></Link>
                    
                    </div> : null}
                    
                </div><br/><br/></div>
            })  : null 
        }

    </div>)
}

export default Users;
