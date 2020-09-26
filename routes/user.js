const router = require('express').Router();
const UserController = require('../controllers/user');
const middlewares = require('../middlewares/auth');

router.post('/register', async (req, res) => {
  const response = await UserController.register(req.body.name, req.body.email, req.body.phone, req.body.password, req.body.role);
  res.status(response.code).send(response);
});

router.post('/login', async (req, res) => {
  const response = await UserController.login(req.body.email, req.body.password);
  if (response.JWT) {
    res.setHeader('Token', response.JWT);
  }
  res.status(response.code).send(response);
});

router.post('/address/add', middlewares.isLoggedIn, middlewares.isCustomer, async (req, res) => {
  const response = await UserController.addAddress(req.decoded.userId, req.body.addressLine1, req.body.addressLine2, req.body.state, req.body.city, req.body.pinCode);
  res.status(response.code).send(response);
});

router.get('/address/fetch', middlewares.isLoggedIn, middlewares.isCustomer, async (req, res) => {
  const response = await UserController.fetchAddresses(req.decoded.userId);
  res.status(response.code).send(response);
});

router.get('/details/fetch', middlewares.isLoggedIn, async (req, res) => {
  const response = await UserController.fetchDetails(req.decoded.userId);
  res.status(response.code).send(response);
});

router.post('/details/update', middlewares.isLoggedIn, async (req, res) => {
  const response = await UserController.updateDetails(req.decoded.userId, req.body.name, req.body.email, req.body.phone);
  res.status(response.code).send(response);
});

router.post('/order/place', middlewares.isLoggedIn, middlewares.isCustomer, async (req, res) => {
  const response = await UserController.placeOrder(req.decoded.userId, req.body.addressId, req.body.restaurantId, req.body.items, req.body.total);
  res.status(response.code).send(response);
});

router.post('/deliveryBoy/deliver', middlewares.isLoggedIn, middlewares.isDeliveryBoy, async (req, res) => {
  const response = await UserController.deliverOrder(req.decoded.userId, req.body.orderId);
  res.status(response.code).send(response);
});

router.get('/orders/fetch/all', middlewares.isLoggedIn, middlewares.isCustomer, async (req, res) => {
  const response = await UserController.fetchOrders(req.decoded.userId);
  res.status(response.code).send(response);
});

router.get('/orders/fetch', middlewares.isLoggedIn, middlewares.isCustomer, async (req, res) => {
  const response = await UserController.fetchOrderDetails(req.decoded.userId, req.query.orderId);
  res.status(response.code).send(response);
});

router.get('/orders/fetch/pending', middlewares.isLoggedIn, middlewares.isCustomer, async (req, res) => {
  const response = await UserController.fetchOrdersPending(req.decoded.userId, req.query.orderId);
  res.status(response.code).send(response);
});

router.get('/orders/fetch/delivered', middlewares.isLoggedIn, middlewares.isCustomer, async (req, res) => {
  const response = await UserController.fetchOrdersDelivered(req.decoded.userId, req.query.orderId);
  res.status(response.code).send(response);
});
module.exports = router;
