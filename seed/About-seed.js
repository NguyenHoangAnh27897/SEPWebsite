var About = require('../Models/About');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chotot');

var About = [ new About({
    Title: 'Welcome to Chợ tốt Văn Lang',
    Description: 'Trang mua,bán các sản phẩm dành cho trường Đại học Văn Lang',
    Img_Company: '../public/images/mob2.png'
})
];

var done=0;
for (var i = 0; i < About.length; i++) {
    About[i].save((err, result) => {
        done++;
        if(done === About.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}