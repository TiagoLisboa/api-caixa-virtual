import jwt from 'jsonwebtoken';
import authConfig from '../src/config/auth';

function authenticateUser({ id }) {
  const token = jwt.sign({ id }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });
  return token;
}

export default authenticateUser;
