import bcrypt from 'bcryptjs';
import models from '../models';
import token from '../services/token';

export default {
  register: async (req, res) => {
    try {
      req.body.password = await bcrypt.hashSync(req.body.password, 10);
      const user = await models.User.create(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send({
        message: 'Ocurrió un error'
      });
      console.log('error', error);
      // res.status(500).send({
    }
  },

  register_admin: async (req, res) => {
    try {
      // Forzamos el rol a "admin" sin depender del cliente
      req.body.rol = 'admin';

      // Encriptamos la contraseña de forma asincrónica
      req.body.password = await bcrypt.hash(req.body.password, 10);

      // Creamos el usuario en la base de datos
      const user = await models.User.create(req.body);

      // Respondemos con éxito
      res.status(200).json(user);
    } catch (error) {
      // Captura de errores
      res.status(500).send({
        message: 'Ocurrió un error al registrar el admin'
      });
      console.log('Error en register_admin:', error);
    }
  },

  login: async (req, res) => {
    try {
      const user = await models.User.findOne({
        email: req.body.email,
        state: 1
      });
      if (user) {
        //Si está registrado en el sistema
        let compare = await bcrypt.compare(req.body.password, user.password);
        if (compare) {
          let tokenT = await token.encode(user._id, user.rol, user.email);

          const USER_FRONTEND = {
            token: tokenT,
            user: {
              name: user.name,
              email: user.email,
              lastname: user.lastname,
              avatar: user.avatar
            }
          };

          res.status(200).json(USER_FRONTEND);
        } else {
          res.status(500).send({
            message: 'El usuario no existe'
          });
        }
      } else {
        res.status(500).send({
          message: 'El usuario no existe'
        });
      }
    } catch (error) {
      res.status(500).send({
        message: 'Ocurrió un error'
      });
    }
  },
  login_admin: async (req, res) => {
    try {
      const user = await models.User.findOne({
        email: req.body.email,
        state: 1,
        rol: 'admin'
      });

      if (user) {
        // Si está registrado en el sistema
        let compare = await bcrypt.compare(req.body.password, user.password);
        if (compare) {
          console.log('USER COMPLETO QUE VIENE DE BD:', user); // 👈 aquí sí se imprime

          let tokenT = await token.encode(user._id, user.rol, user.email);

          const USER_FRONTEND = {
            token: tokenT,
            user: {
              name: user.name,
              email: user.email,
              lastname: user.lastname,
              avatar: user.avatar,
              rol: user.rol
            }
          };

          res.status(200).json(USER_FRONTEND);
        } else {
          res.status(500).send({
            message: 'El usuario no existe'
          });
        }
      } else {
        res.status(500).send({
          message: 'El usuario no existe'
        });
      }
    } catch (error) {
      res.status(500).send({
        message: 'Ocurrió un error'
      });
    }
  },

  update: async (req, res) => {
    try {
      if (req.files) {
        var img_path = req.files.avatar.path;
        var name = img_path.split('\\');
        var avatar_name = name[2];
        console.log('avatar_name', avatar_name);
      }
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
      await models.User.findByIdAndUpdate({ _id: req.body._id }, req.body);

      let UserT = await models.User.findOne({ _id: req.body._id });
      res.status(200).json({
        message: 'El usuario se actualizó correctamente',
        user: resource.User.user_list(UserT, avatar_name)
      });
    } catch (error) {
      res.status(500).send({
        message: 'Ocurrió un error'
      });
    }
  },
  list: async (req, res) => {
    try {
      const users = await models.User.find().sort({ createdAt: -1 });

      const formattedUsers = users.map((user) => ({
        _id: user._id,
        name: user.name,
        lastname: user.lastname, // ✅ Enviamos como lastname (no surname)
        email: user.email,
        avatar: user.avatar,
        rol: user.rol,
        createdAt: user.createdAt
      }));

      res.status(200).json({ users: formattedUsers });
    } catch (error) {
      res.status(500).send({ message: 'Ocurrió un error al listar usuarios' });
      console.log('Error en list:', error);
    }
  },
  remove: async (req, res) => {
    try {
      const User = await models.User.findByIdAndDelete({ _id: req.body._id });
      res.status(200).json({
        message: 'El usuario se eliminó correctamente',
        User
      });
    } catch (error) {
      res.status(500).send({
        message: 'Ocurrió un error'
      });
    }
  }
};
