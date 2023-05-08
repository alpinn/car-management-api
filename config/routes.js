const express = require("express");
const controllers = require("../app/controllers");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/openapi.json');

const apiRouter = express.Router();

/**
 * TODO: Implement your own API
 *       implementations
 */
apiRouter.use('/api-documentation', swaggerUi.serve);
apiRouter.get('/api-documentation', swaggerUi.setup(swaggerDocument));

apiRouter.get("/api/v1/posts",controllers.api.v1.authController.authorize, controllers.api.v1.postController.list);
apiRouter.post("/api/v1/posts", controllers.api.v1.authController.authorize, controllers.api.v1.postController.create);
apiRouter.put("/api/v1/posts/:id", controllers.api.v1.postController.update);
apiRouter.get("/api/v1/posts/:id", controllers.api.v1.postController.show);
apiRouter.delete(
  "/api/v1/posts/:id",
  controllers.api.v1.postController.destroy
);

//Users
apiRouter.post("/api/v1/users", controllers.api.v1.userController.create);
apiRouter.post("/api/v1/admin/register", controllers.api.v1.authController.authorize, controllers.api.v1.authController.isSuperAdmin, controllers.api.v1.authController.registerAdmin);
apiRouter.post("/api/v1/register", controllers.api.v1.authController.register);
apiRouter.post("/api/v1/login", controllers.api.v1.authController.login);


/**
 * TODO: Delete this, this is just a demonstration of
 *       error handler
 */
apiRouter.get("/api/v1/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;
