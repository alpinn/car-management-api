const { Car } = require("../models");

const getTotalCar = () => {
  return Car.count();
};

const getAllCar = () => {
  return Car.findAll();
};

const getCarById = (id) => {
  return Car.findByPk(id);
};

const createCar = (createArgs) => {
  return Car.create(createArgs);
};

const updateCar = (id, updateArgs) => {
  return Car.update(updateArgs, { where: { id } });
};

const deleteCar = (id) => {
  return Car.destroy({ where: { id } });
};

module.exports = {
  getTotalCar,
  getAllCar,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
