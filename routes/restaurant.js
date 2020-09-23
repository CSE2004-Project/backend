const router = require('express').Router();
const middlewares = require('../middlewares/auth');
const RestaurantController = require("../controllers/restaurant");

router.post('/create', middlewares.isLoggedIn, middlewares.isOwner, async (req, res) => {
  const response = await RestaurantController.addRestaurant(req.decoded.userId, req.body.restaurantName, req.body.addressLine1, req.body.addressLine2, req.body.state, req.body.city, req.body.pinCode);
  res.status(response.code).send(response);
});

module.exports = router
