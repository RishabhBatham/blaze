var DataTypes = require("sequelize").DataTypes;
var _accounts = require("./accounts");
var _blog = require("./blog");
var _certificate = require("./certificate");
var _close_trades = require("./close_trades");
var _coupon = require("./coupon");
var _faq_category = require("./faq_category");
var _graph_status = require("./graph_status");
var _inquiry = require("./inquiry");
var _ipaddress = require("./ipaddress");
var _newfaq = require("./newfaq");
var _newsletter = require("./newsletter");
var _payment_history = require("./payment_history");
var _payments = require("./payments");
var _preaccounts = require("./preaccounts");
var _trading_objective = require("./trading_objective");
var _transactions = require("./transactions");
var _treding_stats = require("./treding_stats");
var _user = require("./user");
var _users = require("./users");

function initModels(sequelize) {
  var accounts = _accounts(sequelize, DataTypes);
  var blog = _blog(sequelize, DataTypes);
  var certificate = _certificate(sequelize, DataTypes);
  var close_trades = _close_trades(sequelize, DataTypes);
  var coupon = _coupon(sequelize, DataTypes);
  var faq_category = _faq_category(sequelize, DataTypes);
  var graph_status = _graph_status(sequelize, DataTypes);
  var inquiry = _inquiry(sequelize, DataTypes);
  var ipaddress = _ipaddress(sequelize, DataTypes);
  var newfaq = _newfaq(sequelize, DataTypes);
  var newsletter = _newsletter(sequelize, DataTypes);
  var payment_history = _payment_history(sequelize, DataTypes);
  var payments = _payments(sequelize, DataTypes);
  var preaccounts = _preaccounts(sequelize, DataTypes);
  var trading_objective = _trading_objective(sequelize, DataTypes);
  var transactions = _transactions(sequelize, DataTypes);
  var treding_stats = _treding_stats(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    accounts,
    blog,
    certificate,
    close_trades,
    coupon,
    faq_category,
    graph_status,
    inquiry,
    ipaddress,
    newfaq,
    newsletter,
    payment_history,
    payments,
    preaccounts,
    trading_objective,
    transactions,
    treding_stats,
    user,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
