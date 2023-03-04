import {  useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios";

function AddMovie(props)
{
    const navigate =  useNavigate();

    const [movie,setMovie]= useState({name:'', genres:[], image: '', date: ''});

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
            if(movie.name!= '' && movie.genres.length!= 0 && movie.date!= '')
            {
                await axios.post('http://localhost:7000/data/addMovie', movie);

                navigate('/main/movies'); 
            }

            else
            alert("YOU MUST FILL ALL THE FORM!!");
        }

        if(x==2)
        navigate('/main/movies'); 
    }

    const check= (e)=>
    {
        let value = Array.from(e.target.selectedOptions, option => option.value);

        setMovie({...movie, genres: value});
    }

    return(<div style={{textAlign: 'center'}}>

        <div className="box">

            <h2>Add Movie Page</h2>

            <input placeholder="Enter Movie Name" type="text" onChange={e=> setMovie({...movie, name: e.target.value})}/><br/><br/>

            Select the genres of the movie: <br/>
            <select style={{width: '200px', textAlign: 'center'}} multiple="multiple" onChange={(e)=> check(e)}>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure </option>
                <option value="Anime">Anime </option>
                <option value="Comedy">Comedy </option>
                <option value="Crime">Crime </option>
                <option value="Drama">Drama</option>
                <option value="Espionage">Espionage </option>
                <option value="Family">Family </option>
                <option value="Fantasy">Fantasy </option>
                <option value="History">History </option>
                <option value="Horror">Horror </option>
                <option value="Legal">Legal </option>
                <option value="Medical">Medical </option>
                <option value="Music">Music </option>
                <option value="Mystery">Mystery </option>
                <option value="Romance">Romance </option>
                <option value="Science-Fiction">Science-Fiction</option>
                <option value="Sports">Sports</option>
                <option value="Supernatural">Supernatural </option>
                <option value="Thriller">Thriller</option>
                <option value="War">War</option>    
                <option value="Western">Western</option>    
            </select><br/><br/>

            <input style={{width: "80%"}} placeholder="Enter Movie Image Link" type="url" onChange={e=> setMovie({...movie, image: e.target.value})}/><br/><br/>

            Enter the date the movie premiered:<br/> <input type="date" onChange={e=> setMovie({...movie, date: e.target.value})}/><br/><br/>

            <input type="button" value="Save" onClick={()=> send(1)} /> 
            <input type="button" value="Cancel" onClick={()=> send(2)} /><br/><br/>
        
        </div><br/>

    </div>)
}

export default AddMovie;
