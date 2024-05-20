import db from '../database/index.js';

async function createUser(){
  return db.user.create({data});
}

async function getAll() {
  return db.user.findMany();
}

async function getUserById(id){
  return db.user.findUnique({
    where: {id : parseInt(id)},
  });
}

async function updateUser(id,data){
    return db.user.update({
      where : {id : parseInt(id)},
      data,
    })
}

async function deleteUser(id){
  return db.user.delete({
    where : {id : parseInt(id)},
  })
}

async function depositMoney(userId,amount){

  const user = await db.user.findUnique({where : {id : parseInt (userId)}});
  const newBalance = user.balance + amount
  return db.user.update({
    where : {id : parseInt(userId)},
    data  : {balance : newBalance}
  })
}
 

async function withdrawMoney(userId,amount){

  const user = await db.user.findUnique({where : {id : parseInt (userId)}});
  const newBalance = user.balance - amount
  return db.user.update({
    where : {id : parseInt(userId)},
    data  : {balance : newBalance}
  })
}

async function transferMoney(fromUserId,toUserId,amount){
      const fromUser = await db.user.findUnique({where : {id : parseInt (fromUserId)}});
      const toUser = await db.user.findUnique({where : {id : parseInt (toUserId)}});

      await db.user.update({
        where : {id : parseInt(fromUserId)},
        data  : {balance : fromUser.balance - amount}
      })
       
      return db.user.update({
        where : {id : parseInt(toUserId)},
        data  : {balance : toUser.balance + amount}
      })
}
   

async function allTransactionHistory(userId){
  return db.$transaction.findMany();

}


export default {
  createUser,
  getAll,
  getUserById,
  updateUser,
  deleteUser,
  depositMoney,
  withdrawMoney,
  transferMoney,
  allTransactionHistory
}; 
