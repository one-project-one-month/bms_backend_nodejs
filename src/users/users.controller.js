import services from './users.service.js';

import bcrypt from 'bcryptjs'


//desc      login/set token
//route     post/api/v1/users/login
//@access   private
export async function login(req,res){

  const user = await res.services.createUser();
  result = user.json({message : "user login"})
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


//desc      Deposit
//route     post/api/v1/users/{id}/deposite
//@access   private

export async function depositMoney(req,res){

  try{
      const {amount} = req.body;
      const user = await user.services.depositMoney(req.params.id , amount)
      res.json(user)
  }catch(error){
    res.status(500).json({ error: 'An error occurred while depositing users' });
  }


}



//desc      withdraw
//route     post/api/v1/users/{id}/withdraw
//@access   private

export async function withdrawMoney(req,res){

  try{
      const {amount} = req.body;
        const result = await user.services.withdrawMoney(req.params.id , amount)
        res.json(result);
  }catch(error){
    res.status(500).json({ error: 'An error occurred while while withdrawing money' });
  }
  }



 
//desc      Transfer
//route     post/api/v1/users/{id}/transfer
//@access   private
export async function transferMoney(req,res){
  try{
      const {toUserId ,amount} = req.body;
      const result = await services.transferMoney(req.params.id,toUserId,amount);
      res.json(result);
  }catch(error){
    res.status(500).json({ error: 'An error occurred while  transfering money' });
  }
 
}


//desc      All user's transaction history
//route     post/api/v1/users/{id}/transaction_history
//@access   private
export async function allTransactionHistory(req,res){

      try{
          const transaction = await services.allTransactionHistory(req.params.id)
          res.json(transaction)
      }catch(error){
        res.status(500).json({ error: 'An error occurred while reviewing All Transaction History' });
      }


}


export default {
  login,
  getAll,
  getUser,
  updateUser,
  deleteUser,
  logout,
  depositMoney,
  withdrawMoney,
  transferMoney,
  allTransactionHistory

};