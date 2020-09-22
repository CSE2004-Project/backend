const router = require('express').Router();
const UserController = require('../controllers/user');

router.post('/register', async (req, res) => {
  const response = await UserController.register(req.body.name, req.body.email, req.body.phone, req.body.password, req.body.role);
  res.status(response.code).send(response);
});

router.post('/login', async (req, res) => {
  const response = await UserController.login(req.body.email, req.body.password);
  res.setHeader('Token', response.JWT);
  res.status(response.code).send(response);
});
module.exports = router;
