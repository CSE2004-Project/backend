const router = require('express').Router();
const middlewares = require('../middlewares/auth');
const RestaurantController = require('../controllers/restaurant');

router.post('/create', middlewares.isLoggedIn, middlewares.isOwner, async (req, res) => {
  const response = await RestaurantController.addRestaurant(req.decoded.userId, req.body.restaurantName, req.body.addressLine1, req.body.addressLine2, req.body.state, req.body.city, req.body.pinCode);
  res.status(response.code).send(response);
});

router.post('/item/add', middlewares.isLoggedIn, middlewares.isOwner, async (req, res) => {
  const response = await RestaurantController.addItem(req.decoded.userId, req.body.restaurantId, req.body.itemName, req.body.itemDescription, req.body.price);
  res.status(response.code).send(response);
});

router.get('/fetch/all', middlewares.isLoggedIn, middlewares.isCustomer, async (req, res) => {
  const response = await RestaurantController.fetchAllRestaurants(req.query.addressId);
  res.status(response.code).send(response);
});

router.get('/items/fetch/all', middlewares.isLoggedIn, async (req, res) => {
  const response = await RestaurantController.fetchItems(req.query.restaurantId);
  res.status(response.code).send(response);
});
module.exports = router;
