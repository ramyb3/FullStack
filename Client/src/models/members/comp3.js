import { useEffect, useState } from "react";

function Comp(props)
{
    const [list,setList]= useState([]);

    useEffect(()=>
    {
        setList(props.movies);

        let temp=[];

        let sub= props.subs.find(x=> x.MemberId==props.props._id);

        if(sub!= undefined)
        {
            for(var i=0; i<sub.Movies.length; i++)
            temp.push(sub.Movies[i].MovieId);
            
            setList(props.movies.filter(x=> !temp.includes(x._id)));
        }
    },[props]);

    const send= (e)=>
    {
        props.callback(e);
    }
    
    return(<div>

        <select onChange={e=> send(e.target.value)}>

            <option value="">--Select Movie--</option>

            {
                list.map(i=>
                {
                    return<option value={i.Name}> {i.Name} </option>
                })
            }

        </select>
        
    </div>)
}

export default Comp;