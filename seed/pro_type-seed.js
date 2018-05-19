var Product_Type = require('../Models/Product_Type');

var mongoose = require('mongoose');

mongoose.connect('mongodb://superMarketVLU:asdasd@ds157833.mlab.com:57833/testchotot')

var product_type = [
    new Product_Type({
        Title: 'Hoa quả',
        Icon: 'fa fa-hoaqua',
    }),
    new Product_Type({
        Title: 'Thức ăn',
        Icon: 'fa fa-thucan',
    }),
    new Product_Type({
        Title: 'Thiết bị điện tử',
        Icon: 'fa fa-electronic',
    }),
    new Product_Type({
        Title: 'Quần áo',
        Icon: 'fa fa-clothes',
    }),
    new Product_Type({
        Title: 'Giày/Dép',
        Icon: 'fa fa-dep',
    }),
    new Product_Type({
        Title: 'Phương tiện di chuyển',
        Icon: 'fa fa-vircle',
    }),
];

var done=0;
for (let i in product_type) {
    product_type[i].save((err, result) => {
        done++;
        if(done === product_type.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
