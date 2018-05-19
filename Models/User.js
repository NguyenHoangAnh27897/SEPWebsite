'use strict';

const mongoose = require('mongoose');
var Account = require('./Account');
const Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    // User_Account_id: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Account'
    // }],
    Username: {
        type: String,
        required: true
    },
    Product_Quantity: {
        type: String,
        default: 0
    },
    Info: {
        type: String
    },
    Phone: {
      type: Number
    },
    Avatar_Img: {
      type: String,
      default: '../images/main.png'
    }
});
module.exports = mongoose.model("user", UserSchema);
