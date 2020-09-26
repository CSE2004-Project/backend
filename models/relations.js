const foodItems = require('./foodItems');
const orderItems = require('./orderItems');
const orders = require('./orders');
const restaurant = require('./restaurant');
const restaurantOwner = require('./restaurantOwner');
const user = require('./user');
const userAddress = require('./userAddress');

user.hasMany(restaurantOwner, { foreignKey: 'userId' });
user.hasMany(userAddress, { foreignKey: 'userId' });
user.hasMany(orders, { foreignKey: 'userId' });

restaurant.hasOne(restaurantOwner, { foreignKey: 'restaurantId' });
restaurant.hasMany(foodItems, { foreignKey: 'restaurantId' });
restaurant.hasMany(orders, { foreignKey: 'restaurantId' });

orders.belongsTo(userAddress, { foreignKey: 'addressId' });
orders.hasMany(orderItems, { foreignKey: 'orderId' });
orders.belongsTo(restaurant, { foreignKey: 'restaurantId' });
orders.belongsTo(user, { foreignKey: 'userId' });

foodItems.hasMany(orderItems, { foreignKey: 'itemId' });
orderItems.belongsTo(foodItems, { foreignKey: 'itemId' });
