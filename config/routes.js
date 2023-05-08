const express = require("express");
const controllers = require("../app/controllers/api/v1");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/openapi.json');

const apiRouter = express.Router();

/**
 * TODO: Implement your own API
 *       implementations
 */
apiRouter.use('/api-documentation', swaggerUi.serve);
apiRouter.get('/api-documentation', swaggerUi.setup(swaggerDocument));

//cars
const prefix = "/api/v1"
apiRouter.get(`${prefix}/cars`, controllers.authController.authorize, controllers.carController.getAllCar);
apiRouter.post(`${prefix}/cars/create`, controllers.authController.authorize, controllers.authController.isAdmin, controllers.imageUploadController.imgUploader, controllers.imageUploadController.cloudinaryUpload, controllers.carController.createCar);
apiRouter.put(`${prefix}/cars/update`, controllers.authController.authorize, controllers.authController.isAdmin, controllers.carController.checkCar, controllers.imageUploadController.imgUploader, controllers.imageUploadController.cloudinaryUpload, controllers.carController.updateCar);
apiRouter.get(`${prefix}/cars/:id`, controllers.authController.authorize, controllers.carController.checkCar, controllers.carController.getCar);
apiRouter.delete(`${prefix}/cars/delete/:id`, controllers.authController.authorize, controllers.authController.isAdmin,controllers.carController.checkCar, controllers.carController.deleteCar);

//Users
apiRouter.post(`${prefix}/users/login`, controllers.authController.login);
apiRouter.post(`${prefix}/users/register`, controllers.authController.register);
apiRouter.post(`${prefix}/users/admin/register`, controllers.authController.authorize, controllers.authController.isSuperAdmin, controllers.authController.registerAdmin);
apiRouter.get(`${prefix}/users/me`, controllers.authController.authorize, controllers.authController.me);


/**
 * TODO: Delete this, this is just a demonstration of
 *       error handler
 */
// apiRouter.get("/api/v1/errors", () => {
//   throw new Error(
//     "The Industrial Revolution and its consequences have been a disaster for the human race."
//   );
// });

// apiRouter.use(controllers.api.main.onLost);
// apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;
