const express = require('express');
      router = express.Router(),
      bodyParser = require("body-parser").urlencoded({
		  extended: false
			}),
      passport = require('passport'),
      Product = require('../Models/Product'),
      User = require('../Models/User'),
      Account = require('../Models/Account'),
      About = require('../Models/About'),
      Product_Type = require('../Models/Product_Type');


router.get('/thong-ke-ca-nhan/:id', isAdmin, async (req,res,next) => {
    Product.find({ Seller: req.params.id }, async (err,Pro) => {
      if(err) throw err;
      let mapPty = Pro.map(Protype => Protype.Product_Type);
      let arrJson = await dataMonth(mapPty);
      res.json({
        arrJson: arrJson
      });
    });
});


router.get('/danh-sach-san-pham/:id', isAdmin, async (req,res,next) => {
  Product.find({ Seller: req.params.id },(err,list_Pro) => {
    if(err) throw err;
    Account.findById(req.params.id, (err, userS) => {
      if(err) throw err;
      res.render("Admin/Page/danh-sach-san-pham-admin", {
        title: 'Danh sách sản phẩm của' + userS.User.Username,
        list: list_Pro,
        userN: userS
      });
    });
  });
});

router.get('/dashboard', isAdmin, function(req, res, next) {
  let userAccount = [];
  Account.find( { "Admin.isAdmin": {$ne: true} } , function(err, account) {
    res.render('Admin/Page/Dashboard', {
      title: 'Dashboard',
      account: account
    });
  }).sort({Create_at: -1});
});


router.get('/tat-ca-san-pham', isAdmin, function(req, res, next) {
  // Product.find((err, allPro) => {
  //   res.render('Admin/Page/Dashboard', {
  //     title: 'Tất cả sản phẩm của người dùng',
  //     allPro: allPro
  //   });
  // });
  res.send("Hello mọi người");
});


router.get('/thong-ke', isAdmin, function(req, res, next) {
  // Account.find( { "Admin.isAdmin": {$ne: true} } , function(err, account) {
    res.render('Admin/Page/Statistic', {
      title: 'Thống kê'
      // account: account
    });
  // }).sort({Create_at: -1});
});


router.put('/trang-thai-tai-khoan/:id', isAdmin, function(req, res, next){
  let user_id = { _id: req.params.id };
  Account.update(user_id, { "User.Status": req.body.Status }, function(err, result){
    if(err){
      return console.log(err);
    }
    else {
      res.json(result);
    }
  });
});

router.delete('/xoa-tai-khoan/:id', isAdmin, function(req, res, next){
  let user_id = { _id: req.params.id };
  Account.remove(user_id, function(err, result){
    if(err){
      return console.log(err);
    }
    else {
      res.json(result);
    }
  });
});

router.get('/dang-nhap', function(req,res,next) {
  var messages = req.flash('error');
  res.render('../Page/Login', { title: 'Đăng nhập', messages: messages, hasErrors: messages.length > 0 });
});

router.get('/dang-xuat', isAdmin, function(req,res,next) {
	req.logout();
	res.redirect('/dang-nhap');
});

function isAdmin(req, res, next) {
	if(req.isAuthenticated()) {
    if(req.user.Admin.isAdmin) {
      return next();
    }
    return res.redirect('/');
	}
	req.session.oldUrl = req.originalUrl;
	res.redirect('/dang-nhap');
}


let dataMonth = async (original) => {
  let counts = {};
  let compressed = [];
  original.forEach((element) => {counts[element] = (counts[element] || 0) + 1;});
  for (let element in counts) {
    await prodataMonth(element);
    let ObjectA = new Object();
      ObjectA.label = element;
      ObjectA.y = counts[element];
      compressed.push(ObjectA);
  }
  let op = _aret.map(et => et);
  for (let index in compressed) {
    compressed[index].label = op[index];
  }
  await _aret.splice(0,_aret.length);
  return await compressed;
};
let _aret = [];
let prodataMonth = async (itemName) => {
  await Product_Type.findById(itemName, async (err,resilt) => {
    try {
      await _aret.push(resilt.Title);
    } catch (e) {
      return e.message();
    }
  });
};

module.exports = router;
