const express= require('express');

const router= express.Router();

const usersBL= require('../models/usersBL');
const loginBL= require('../models/loginBL'); 
const permBL= require('../models/permissionsBL');
const dbBL= require('../models/dbBL');
const funcBL= require('../models/funcBL');
const moviesBL= require('../models/moviesBL');
const subsBL= require('../models/subsBL');
const membersBL= require('../models/membersBL');

const restDAL= require('../DAL/rest');

/////////////////////////////////////////////////////////////////

router.route('/').get(async function(req,resp)
{
    let array= await restDAL.getData();

    return resp.json(array);
});

/////////////////////////////////////////////////////////////////

router.route('/main').post(async function(req,resp)
{
    let check= await loginBL.check(req.body); // check authentication

    if(check==1) // if user authenticated
    {
        let time= Date.now();

        //get all data of logged user
        let user= await dbBL.findUser(req.body.user);
        let perm= await permBL.getPermissions();
        let all= await usersBL.getUsers();

        perm= perm.find(x=> x.id==user[0]._id).permissions;

        let timeOut= all.find(x=> x.id==user[0]._id).sessionTimeOut * 60000; // 1 minute = 60000 Milliseconds

       return resp.json({name: req.body.user, perm: perm, time: time, timeOut: timeOut});
    }

    if(check==0) // if not authenticated
    return resp.json("THE USERNAME OR PASSWORD IS INCORRECT!!");
});

/////////////////////////////////////////////////////////////////

router.route('/create').post(async function(req,resp) 
{
    let temp= await dbBL.findUser(req.body.user);

    if(temp.length==0)
    return resp.json("THIS USER DOES NOT EXIST!!");

    else
    {
        let check= false;

        if(!temp[0].Password) // check if user don't have a password
        {   
            await dbBL.savePassword(req.body);  
            
            check= true;
        }

        if(temp[0].Password && check==false) // check if user already created and has a password
        return resp.json("THIS USER ALREADY HAS PASSWORD!!");

        else
        {
            let array= await restDAL.getData();

            return resp.json(array);
        }
    }
});

/////////////////////////////////////////////////////////////////

router.route('/users').get(async function(req,resp)
{
    let array= await funcBL.getAll();

    return resp.json(array);
});

router.route('/addUser').post(async function(req,resp)
{ 
    let id= await usersBL.saveUser(req.body); // save user in file
  
    await permBL.savePermissions(id,req.body); // save permission in file
    await dbBL.saveUserName(req.body.Uname,id); // save user in DB
  
    let array= await restDAL.getData();

    return resp.json(array);
});

router.route('/editUser/:id').get(async function(req,resp) 
{ 
    let data= await funcBL.edit(req.params.id); // get user that i want to update

    return resp.json(data);
});

router.route('/updateUser').post(async function(req,resp) 
{ 
    await funcBL.update(req.body); // update new data of specific user

    let array= await restDAL.getData();

    return resp.json(array);
});

router.route('/deleteUser/:id').delete(async function(req,resp)
{ 
    // delete user data from all files and DB
    await dbBL.deleteUserName(req.params.id);
    await usersBL.deleteUser(req.params.id);
    await permBL.deletePermissions(req.params.id);
  
    let array= await restDAL.getData();

    return resp.json(array);
});

/////////////////////////////////////////////////////////////////

router.route('/findMovies/:movie').post(async function(req,resp)
{ 
    // get all search data
    let movies= await moviesBL.search(req.params.movie);
    let subs= await subsBL.getSubs(); 
    let members= await membersBL.showAll(); 

    return resp.json([movies,members,subs]);
});

router.route('/movies/:id').get(async function(req,resp)
{ 
    //get all data
    let movies= await moviesBL.showAll(); 
    let subs= await subsBL.getSubs();
    let members = await membersBL.showAll();
    
    //get specific data
    let movie = movies.find(x=> x._id==req.params.id);

    let sub=[];

    for(i=0; i<subs.length; i++)
    {
        for(j=0; j<subs[i].Movies.length; j++)
        {
            if(subs[i].Movies[j].MovieId==movie._id)
            sub.push({member: members.find(x=> x._id==subs[i].MemberId), date: subs[i].Movies[j].Date});
        }
    }

    return resp.json([sub,movie]);
});

router.route('/addMovie').post(async function(req,resp) 
{ 
    await moviesBL.addMovie(req.body); // add this movie to DB
  
    let array= await restDAL.getData();

    return resp.json(array);
});

router.route('/editMovie/:id').get(async function(req,resp) 
{ 
    let movie= await moviesBL.updateMovie(req.params.id); // get data of movie that should be updated

    let date= movie.Premiered.slice(0,10); // get full premiere date

    return resp.json([movie,date]);
});

router.route('/updateMovie').post(async function(req,resp) 
{ 
    await moviesBL.saveUpdate(req.body); // update this movie
  
    let array= await restDAL.getData();

    return resp.json(array);
});

router.route('/deleteMovie/:id').delete(async function(req,resp) 
{ 
    await moviesBL.deleteMovie(req.params.id); // delete this movie
    await subsBL.deleteSubs(1,req.params.id); // delete all subs that assigned to this movie
  
    let array= await restDAL.getData();

    return resp.json(array);
});

/////////////////////////////////////////////////////////////////

router.route('/subscriptions/:id').get(async function(req,resp)
{ 
    //get all data
    let movies= await moviesBL.showAll(); 
    let subs= await subsBL.getSubs();
    let members = await membersBL.showAll();
    
    //get specific data
    let member= members.find(x=> x._id==req.params.id); 
    let sub= subs.find(x=> x.MemberId==req.params.id);

    let list=[] ,temp=[];

    for(i=0; i<sub.Movies.length; i++)
    temp.push(sub.Movies[i].MovieId);
    
    list= movies.filter(x=> !temp.includes(x._id))

    return resp.json([sub.Movies,member,movies,list]);
});

router.route('/addMember').post(async function(req,resp)
{ 
    await membersBL.addMember(req.body); // add this member to DB
  
    let array= await restDAL.getData();

    return resp.json(array);
});

router.route('/editMember/:id').get(async function(req,resp) 
{ 
    let member= await membersBL.updateMember(req.params.id); // get data of member that should be updated

    return resp.json(member);
});

router.route('/updateMember').post(async function(req,resp)
{ 
    await membersBL.saveUpdate(req.body); // update this member
  
    let array= await restDAL.getData();

    return resp.json(array);
});

router.route('/deleteMember/:id').delete(async function(req,resp) 
{ 
    await membersBL.deleteMember(req.params.id); // delete this member from DB
    await subsBL.deleteSubs(2,req.params.id); // delete this member subs from DB

    let array= await restDAL.getData();

    return resp.json(array);
});      

/////////////////////////////////////////////////////////////////

router.route('/addSubs').post(async function(req,resp) 
{ 
    await subsBL.checkMovie(req.body); // assign this movie to specific this member
  
    let array= await restDAL.getData();

    return resp.json(array);
});

///////////////////////////////////////////////////////////////////

module.exports= router;