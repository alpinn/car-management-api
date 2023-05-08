const { carRepository } = require("../repositories");
const { ApplicationError } = require("../errors");

exports.create = async (payload) => {
  try {
    const carPayload = {
      name : payload.name,
      price: Number(payload.price),
      size : payload.size,
      image: payload.image,
      available : payload.available,
      createdBy : payload.createdBy,
    };
    console.log(carPayload)
    const payloadFunc = await carRepository.createCar(carPayload);
    // console.log('nomor payload', payload);

    return {
      id: payloadFunc?.id,
      name: payloadFunc?.name,
      price: payloadFunc?.price,
      size: payloadFunc?.size,
      image: payloadFunc?.image,
      available: payloadFunc?.available,
      updatedAt: payloadFunc?.updatedAt,
      createdAt: payloadFunc?.createdAt,
    };
    // return ("success")
  } catch (error) {
    console.log(error)
    throw new ApplicationError(500, "failed create car!"); 
  }
};

exports.getCarById = async (id) => {
  try {
    const payload = await carRepository.getCarById(id);
    const carPayload = {
      id: payload?.id,
      name: payload?.name,
      price: payload?.price,
      size: payload?.size,
      image: payload?.image,
      available: payload?.available,
      createdAt: payload?.dataValues.createdAt,
      updatedAt: payload?.dataValues.updatedAt,
    };
    return carPayload;
  } catch (error) {
    throw new ApplicationError(500, "failed get car!");
  }
};

exports.getAllCar = async () => {
  try {
    const payload = await carRepository.getAllCar();
    const carPayload =
      (await payload.length) < 1
        ? []
        : payload.map((car) => {
            return {
              id: car?.dataValues?.id,
              name: car?.dataValues?.name,
              price: car?.dataValues?.price,
              size: car?.dataValues?.size,
              image: car?.dataValues?.image,
              available: car?.dataValues?.available,
              createdAt: car?.dataValues?.createdAt,
              updatedAt: car?.dataValues?.updatedAt,
            };
          });

    return carPayload;
  } catch (error) {
    throw new ApplicationError(500, "failed get car!");
  }
};

exports.deleteCar = async (carId, deletedBy) => {
  try {
    await carRepository.updateCar(carId, { deletedBy });
    return await carRepository.deleteCar(carId);
  } catch (error) {
    throw new ApplicationError(500, "failed delete car!");
  }
};

exports.updateCar = async (carId, updateArgs) => {
  try {
    return await carRepository.updateCar(carId, updateArgs);
  } catch (error) {
    throw new ApplicationError(500, "failed update car!");
  }
};