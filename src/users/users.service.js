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



export default {
  createUser,
  getAll,
  getUserById,
  updateUser,
  deleteUser,
 
}; 
