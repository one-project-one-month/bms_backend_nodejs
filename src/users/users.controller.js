import services from './users.service.js';
import jwt from "../utils/generateToken.js"
import bcrypt from 'bcryptjs'


//desc      login/set token
//route     post/api/v1/users/signup
//@access   private
export async function signUp(req,res){

  const user = await res.services.createUser();
   
}

//desc      get user
//route     Get/api/v1/users
//@access   Public
export async function getAll(req, res) {

  try{
      const users = await services.getAll();
      res.json(users)
    
  }catch(error){
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }

 
}


//desc      get one user
//route     Get/api/v1/users/{id}
//@access   Public
export async function getUser(req,res){

  try{
    const user = await services.getUserById(req.params.id)
        if(!user){
          res.status(400).json({error : "user not found"})
        }
  }catch(error){
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }

 
}


//desc      Update one user
//route     put/api/v1/users/{id}
//@access   Private
export async function updateUser(req,res){

  try{
        const user = await services.updateUser(req.params.id, req.body);
        res.json(user)
  }catch(error){
    res.status(500).json({ error: 'An error occurred while updating users' });
  }

}



//desc      Delete one user
//route     delete/api/v1/users/{id}
//@access   private
export async function deleteUser(req,res){

  try{
      await services.deleteUser(req.params.id)
      res.status(200).json({message : "user deleted successfully"})
  }catch(error){
    res.status(500).json({ error: 'An error occurred while deleting users' });
  }

  res.status(200).json({message : 'delete one user '})
}



//desc      logout/set token
//route     get/api/v1/users/{id}/logout
//@access   private
export function logout(req,res){



  res.status(200).json({message : 'logout User '})
}




export default {
  signUp,
  getAll,
  getUser,
  updateUser,
  deleteUser,
  logout

};