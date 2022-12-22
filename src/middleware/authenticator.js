import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  console.log(req.cookies);
  const { token } = req.cookies;
  if (!token) return res.jsend.error('You are not authenticated please login!');

  try {
    const user = jwt.decode(token, process.env.SECRET);
    req.user = user;
    return next();
  } catch (error) {
    return res.jsend.error({
      message: 'Your authentication failed, ' + error,
    });
  }
};