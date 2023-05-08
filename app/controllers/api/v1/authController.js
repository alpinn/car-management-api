/**
 * @file contains request handler of user resource
 * @author Fikri Rahmat Nurhidayat
 */
const ApplicationError = require("../../../errors")
const userService = require("../../../services/userService");
const jwt = require("jsonwebtoken");

module.exports = {

  me (req, res) {
    try {
      const user = req.user; //from authorization userMiddleware
      res.status(200).json({
        status: "OK",
        message: "Success",
        data: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(err.statusCode || 404).json({
        status: "FAIL",
        message: err.message,
      });
    }
  },

  registerAdmin(req, res) {
    userService
      .createAdmin(req.body)
      .then((user) => {
        res.status(201).json({
          status: "OK",
          data: user,
        });
      })
      .catch((err) => {
        res.status(422).json({
          status: "FAIL",
          message: err.message,
        });
      });
  },
  register(req, res) {
    userService
      .create(req.body)
      .then((user) => {
        res.status(201).json({
          status: "OK",
          data: user,
        });
      })
      .catch((err) => {
        res.status(422).json({
          status: "FAIL",
          message: err.message,
        });
      });
  },
  login(req, res) {
    userService
      .login(req.body)
      .then((user) => {

        if (!user.data) {
          res.status(401).json({
            status: "FAIL",
            message: user.message,
            data: null,
          });

          return;
        }

        res.status(201).json({
          status: "OK",
          data: {
            id: user.data.id,
            name: user.data.name,
            email: user.data.email,
            token: user.data.token
          },
        });
      })

      .catch((err) => {
        res.status(422).json({
          status: "FAIL",
          message: err.message,
        });
      });
  },

  authorize(req, res, next) {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split("Bearer ")[1];

      const tokenPaylod = jwt.verify(token, "secret");

      req.user = tokenPaylod;

      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: "Unauthorized",
      });
    }
  },

  isAdmin(req, res, next) {
    try {
      const {role} = req.user;
      if (
        role === 'superadmin' ||
        role === 'admin'
      ) {
        return next();
      }
      throw new ApplicationError(403, "You don't have permission to access!");
    } catch (err) {
      res.status(err.statusCode).json({
        status: "FAIL",
        message: err.message,
      });
    }
  },

  isSuperAdmin(req, res, next) {
    try {
      const {role} = req.user;

      if(role === 'superadmin') return next();

      res.status(403).json({
        message: "Have no access",
      });
      
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: "Unauthorized",
      });
    }
  }
  
};
