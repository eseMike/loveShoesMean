import token from '../services/token';

export default {
  verifyEcommerce: async (req, res, next) => {
    if (!req.headers.token) {
      return res.status(404).send({
        message: 'No token'
      });
    }
    const response = await token.decode(req.headers.token);
    if (response) {
      if (response.rol === 'Admin' || response.rol === 'Cliente') {
        next();
      } else {
        res.status(403).send({
          message: 'No está permitido visitar esta ruta'
        });
      }
    } else {
      res.status(404).send({
        message: 'El token no es válido'
      });
    }
  },

  verifyAdmin: async (req, res, next) => {
    if (!req.headers.token) {
      return res.status(404).send({
        message: 'No token'
      });
    }
    const response = await token.decode(req.headers.token);
    if (response) {
      if (response.rol === 'Admin') {
        next();
      } else {
        res.status(403).send({
          message: 'No está permitido visitar esta ruta'
        });
      }
    } else {
      res.status(404).send({
        message: 'El token no es válido'
      });
    }
  }
};
