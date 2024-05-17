import services from './users.service.js';


//desc      login/set token
//route     post/api/v1/users/login
//@access   private
export function login(req,res){

  res.status(200).json({message : 'login User '})
}




//desc      get user
//route     Get/api/v1/users
//@access   Public
export function getAll(req, res) {
  res.json(services.getAll());
}


//desc      get one user
//route     Get/api/v1/users/{id}
//@access   Public
export function getUser(req,res){

   res.status(200).json({message : 'get one'})
}


//desc      Update one user
//route     put/api/v1/users/{id}
//@access   Private
export function updateUser(req,res){

  res.status(200).json({message : 'update one  user'})
}



//desc      Delete one user
//route     delete/api/v1/users/{id}
//@access   private
export function deleteUser(req,res){

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

export function depositeMoney(req,res){

  res.status(200).json({message : 'Deposite Money '})
}



//desc      withdraw
//route     post/api/v1/users/{id}/withdraw
//@access   private

export function withdrawMoney(req,res){

  res.status(200).json({message : 'Width draw Money '})
}

 
//desc      Transfer
//route     post/api/v1/users/{id}/transfer
//@access   private
export function transferMoney(req,res){

  res.status(200).json({message : 'Transfer Money '})
}


//desc      All user's transaction history
//route     post/api/v1/users/{id}/transaction_history
//@access   private
export function allTransactionHistory(req,res){

  res.status(200).json({message : 'Transfer Money '})
}


export default {
  getAll,

};