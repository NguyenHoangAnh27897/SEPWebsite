var Product = require('../Models/Product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://superMarketVLU:asdasd@ds157833.mlab.com:57833/testchotot')

var products = [
    new Product({
      Product_Name : "Siêu xe",
      Description : "Lamborghini",
      Img_Product : "product__img-1525457114926.jpg,product__img-1525457114930.jpg,product__img-1525457114936.jpg,product__img-1525457114939.jpg",
      Enable : false,
      Status : [
          "Mới"
      ],
      Create_at : "2018-05-04T18:00:28.464Z",
      update_at : "2018-05-04T18:00:28.464Z",
      Seller : "5aec9f807359b21b3ca90a09",
      Price : 3900000000.0,
      Quantity : 1,
      Brand : "Lamborghini",
      Product_Type : "5adb5abcf79d9728b46dfb1b"
    }),
    new Product({
      Product_Name : "Siêu xe",
      Description : "Lamborghini",
      Img_Product : "product__img-1525457114926.jpg,product__img-1525457114930.jpg,product__img-1525457114936.jpg,product__img-1525457114939.jpg",
      Enable : false,
      Status : [
          "Mới"
      ],
      Create_at : "2018-05-04T18:00:28.464Z",
      update_at : "2018-05-04T18:00:28.464Z",
      Seller : "5aec9f807359b21b3ca90a09",
      Price : 3900000000.0,
      Quantity : 1,
      Brand : "Lamborghini",
      Product_Type : "5adb5abcf79d9728b46dfb1b"
    }),
    new Product({
      Product_Name : "Siêu xe",
      Description : "Lamborghini",
      Img_Product : "product__img-1525457114926.jpg,product__img-1525457114930.jpg,product__img-1525457114936.jpg,product__img-1525457114939.jpg",
      Enable : false,
      Status : [
          "Mới"
      ],
      Create_at : "2018-05-04T18:00:28.464Z",
      update_at : "2018-05-04T18:00:28.464Z",
      Seller : "5aec9f807359b21b3ca90a09",
      Price : 3900000000.0,
      Quantity : 1,
      Brand : "Lamborghini",
      Product_Type : "5adb5abcf79d9728b46dfb1b"
    }),
    new Product({
      Product_Name : "Siêu xe",
      Description : "Lamborghini",
      Img_Product : "product__img-1525457114926.jpg,product__img-1525457114930.jpg,product__img-1525457114936.jpg,product__img-1525457114939.jpg",
      Enable : false,
      Status : [
          "Mới"
      ],
      Create_at : "2018-05-04T18:00:28.464Z",
      update_at : "2018-05-04T18:00:28.464Z",
      Seller : "5aec9f807359b21b3ca90a09",
      Price : 3900000000.0,
      Quantity : 1,
      Brand : "Lamborghini",
      Product_Type : "5adb5abcf79d9728b46dfb1b"
    }),
    new Product({
      Product_Name : "Siêu xe",
      Description : "Lamborghini",
      Img_Product : "product__img-1525457114926.jpg,product__img-1525457114930.jpg,product__img-1525457114936.jpg,product__img-1525457114939.jpg",
      Enable : false,
      Status : [
          "Mới"
      ],
      Create_at : "2018-05-04T18:00:28.464Z",
      update_at : "2018-05-04T18:00:28.464Z",
      Seller : "5aec9f807359b21b3ca90a09",
      Price : 3900000000.0,
      Quantity : 1,
      Brand : "Lamborghini",
      Product_Type : "5adb5abcf79d9728b46dfb1b"
    }),
    new Product({
      Product_Name : "Siêu xe",
      Description : "Lamborghini",
      Img_Product : "product__img-1525457114926.jpg,product__img-1525457114930.jpg,product__img-1525457114936.jpg,product__img-1525457114939.jpg",
      Enable : false,
      Status : [
          "Mới"
      ],
      Create_at : "2018-05-04T18:00:28.464Z",
      update_at : "2018-05-04T18:00:28.464Z",
      Seller : "5aec9f807359b21b3ca90a09",
      Price : 3900000000.0,
      Quantity : 1,
      Brand : "Lamborghini",
      Product_Type : "5adb5abcf79d9728b46dfb1b"
    }),
    new Product({
      Product_Name : "Siêu xe",
      Description : "Lamborghini",
      Img_Product : "product__img-1525457114926.jpg,product__img-1525457114930.jpg,product__img-1525457114936.jpg,product__img-1525457114939.jpg",
      Enable : false,
      Status : [
          "Mới"
      ],
      Create_at : "2018-05-04T18:00:28.464Z",
      update_at : "2018-05-04T18:00:28.464Z",
      Seller : "5aec9f807359b21b3ca90a09",
      Price : 3900000000.0,
      Quantity : 1,
      Brand : "Lamborghini",
      Product_Type : "5adb5abcf79d9728b46dfb1b"
    }),
    new Product({
      Product_Name : "Siêu xe",
      Description : "Lamborghini",
      Img_Product : "product__img-1525457114926.jpg,product__img-1525457114930.jpg,product__img-1525457114936.jpg,product__img-1525457114939.jpg",
      Enable : false,
      Status : [
          "Mới"
      ],
      Create_at : "2018-05-04T18:00:28.464Z",
      update_at : "2018-05-04T18:00:28.464Z",
      Seller : "5aec9f807359b21b3ca90a09",
      Price : 3900000000.0,
      Quantity : 1,
      Brand : "Lamborghini",
      Product_Type : "5adb5abcf79d9728b46dfb1b"
    })
];

var done=0;
for (let i in products) {
    products[i].save((err, result) => {
        done++;
        if(done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
