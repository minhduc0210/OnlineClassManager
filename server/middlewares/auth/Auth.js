const { verify } = require("jsonwebtoken");
const CustomError = require("../../helpers/errors/CustomError");

const isAuth = (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization) return next(new CustomError("You need to login", 400));

  const token = authorization.split(" ")[1];
  const { _id, email, role } = verify(token, process.env.SECRET_ACCESS_TOKEN);
  req.user = {
    id: _id,
    email,
    role,
  };
  next();
};

module.exports = {
    isAuth,
  };