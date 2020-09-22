const foodItems = require('./foodItems');
const orderItems = require('./orderItems');
const orders = require('./orders');
const restaurant = require('./restaurant');
const restaurantOwner = require('./restaurantOwner');
const user = require('./user');
const userAddress = require('./userAddress');

user.hasMany(restaurantOwner, {foreignKey: 'userId'});
user.hasMany(userAddress, {foreignKey: 'userId'});
user.hasMany(orders, {foreignKey: 'userId'});

restaurant.hasOne(restaurantOwner, {foreignKey: 'restaurantId'});
restaurant.hasMany(foodItems, {foreignKey: 'restaurantId'});
restaurant.hasMany(orders, {foreignKey: 'restaurantId'});

orders.hasOne(userAddress, {foreignKey: 'addressId'});
orders.hasMany(orderItems, {foreignKey: 'orderId'});

foodItems.hasMany(orderItems, {foreignKey: 'itemId'});