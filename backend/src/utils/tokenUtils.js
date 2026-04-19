import jwt from 'jsonwebtoken';

export const generateToken = (userId, role, email) => {
  return jwt.sign(
    { userId, role, email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};
