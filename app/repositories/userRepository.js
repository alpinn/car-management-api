const { User } = require("../models");

const getTotalUser = () => {
  return User.count();
};

const getUsers = () => {
  return User.findAll();
};

const getUser = (id) => {
  return User.findByPk(id);
};

const getUserByEmail = (email) => {
  return User.findOne({
    where: { email },
  });
};

const create = (createArgs) => {
  return User.create(createArgs);
};

const deleteUser = (id) => {
  return User.destroy(id);
};

module.exports = {
  getTotalUser,
  getUsers,
  getUser,
  getUserByEmail,
  create,
  deleteUser,
};
