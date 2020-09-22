const foodItems = require('./foodItems');
const orderItems = require('./orderItems');
const orders = require('./orders');
const restaurant = require('./restaurant');
const restaurantOwner = require('./restaurantOwner');
const user = require('./user');
const userAddress = require('./userAddress');

user.hasMany(restaurantOwner);
user.hasMany(userAddress);
user.hasMany(orders);

restaurant.hasOne(restaurantOwner);
restaurant.hasMany(foodItems);
restaurant.hasMany(orders);

orders.hasOne(userAddress);
orders.hasMany(orderItems);

orderItems.hasMany(foodItems);
