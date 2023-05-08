const { carService } = require("../../../services");
const {Car} = require("../../../models")

exports.checkCar = async (req, res, next) => {
    try {
      const id = req.params.id;
      const resData = await Car.findOne({
        where: { id },
      });
  
      if (!resData) {
        res.status(404).json({
          error: "Car not found!",
        });
  
        return;
      }
  
      req.car = resData;
  
      next();
    } catch (error) {
      res.status(500).json({
        message: "Error!",
        err_msg: error.message,
      });
    }
  };

exports.createCar = async (req, res) => {
  try {

    const {name, price, size, available} = req.body;
    console.log(req.body);
    const image = req.image;
    const createdBy = req.user.id;
    console.log(createdBy);
    const payload = {name, price, size, image, available, createdBy}
    // console.log(payload);
    const carPayload = await carService.create(payload);

    res.status(201).json({
      status: "OK",
      message: "Success",
      data: carPayload,
    });
  } catch (err) {
    res.status(err.statusCode).json({
      status: "FAIL",
      message: err.message,
    });
  }
};

exports.getAllCar = async (req, res) => {
  try {
    const carPayload = await carService.getAllCar();

    res.status(200).json({
      status: "OK",
      message: "Success",
      data: carPayload,
    });
  } catch (err) {
    res.status(err.statusCode).json({
      status: "FAIL",
      message: err.message,
    });
  }
};

exports.getCar = async (req, res) => {
  try {
    const car = req.car;
    res.status(200).json({
      status: "OK",
      message: "Success",
      data: car,
    });
  } catch (err) {
    res.status(err.statusCode).json({
      status: "FAIL",
      message: err.message,
    });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const carId = req.car.id;
    const deletedBy = req.user.id; 
    await carService.deleteCar(carId, deletedBy);
    res.status(200).json({
      status: "OK",
      message: "Success",
    });
  } catch (err) {
    res.status(err.statusCode).json({
      status: "FAIL",
      message: err.message,
    });
  }
};

exports.updateCar = async (req, res) => {
  try {
    
    const payload = req.body;
    const carId = req.car.id;
    const image = req.image || req.payload.image;
    const updatedBy = req.user.id;
    const uploadPayload = {
        name: payload.name || car.name,
        price: Number(payload.price) || car.price,
        size: payload.size || car.size,
        image,
        available: payload.available || car.available,
        updatedBy,
      };

      await carService.updateCar(carId, uploadPayload);
    res.status(200).json({
      status: "OK",
      message: "Success",
      data: {
        name: uploadPayload.name,
        price: uploadPayload.price,
        size: uploadPayload.size,
        image: uploadPayload.image,
        available: uploadPayload.available,
      },
    });
  } catch (err) {
    res.status(err.statusCode).json({
      status: "FAIL",
      message: err.message,
    });
  }
};