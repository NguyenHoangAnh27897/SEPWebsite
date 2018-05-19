var Product = require('../Models/Product'),
    User = require('../Models/User'),
    Account = require('../Models/Account'),
    About = require('../Models/About'),
    Product_Type = require('../Models/Product_Type'),
    nodemailer = require('nodemailer'),
    multer = require('multer'),
    path = require('path'),
    mongoose = require('mongoose');

module.exports = (app) => {

  app.get('/', (req,res,next) => {
  	Product.find({ Enable: true }, (err, docs) => {
  		Product_Type.find((err, types) => {
  			let mao = docs.map( (imgEdit) => {
  				let	propImg = 'Img_Product',
  						position = imgEdit.Img_Product.indexOf(',');
  				if(imgEdit.Img_Product.length !== position) {
  					imgEdit[propImg] = imgEdit.Img_Product.split(",", 1);
  				}
  				else {
  					imgEdit[propImg] = imgEdit.Img_Product;
  				}
  				return imgEdit;
  			});
  			res.render('Page/home', {
  				title: 'Chợ tốt Văn Lang',
  				products: docs,
  				type: types,
  				one_type_id: types[Object.keys(types)[0]]._id
  			 });
  		});
  	}).limit(12).sort({Create_at: -1});
  });

  app.get('/thong-tin-ca-nhan', isLogin, function(req,res,next) {
  	res.render('Page/profile', { title: 'Thông tin cá nhân', account: req.user });
  });

  app.get('/dang-xuat', isLogin, function(req,res,next) {
  	req.logout();
  	res.redirect('/');
  });

  app.get('/dang-ky', function(req,res,next) {
  	var messages = req.flash('error');
  	res.render('Page/register', {
  		title: 'Đăng ký tài khoản',
  		messages: messages,
  		hasErrors: messages.length > 0 });
  });

  app.post('/dang-ky', passport.authenticate('dang-ky', {
    failureRedirect: '/dang-ky',
  	failureFlash: true
  }),function(req, res, next){
  	  if(req.session.oldUrl) {
  			let currentUrl = req.session.oldUrl;
  			req.session.oldUrl = null;
  			res.redirect(currentUrl);
  		} else {
  			res.redirect('/cho-duyet');
  		}
  });

  app.get('/dang-nhap', function(req,res,next) {
    var messages = req.flash('error');
    res.render('Page/Login', { title: 'Đăng nhập',user: req.account, messages: messages, hasErrors: messages.length > 0 });
  });

  app.post('/dang-nhap', passport.authenticate('dang-nhap', {
    failureRedirect: '/dang-nhap',
    failureFlash: true
  }), function(req, res, next){
  	if(req.user.Admin.isAdmin) {
  		res.redirect('/admin/dashboard');
  	}
  	else {
  		if(req.session.oldUrl) {
  			let currentUrl = req.session.oldUrl;
  			req.session.oldUrl = null;
  			res.redirect(currentUrl);
  		} else {
  			res.redirect('/');
  		}
  	}
  });

  app.get('/danh-muc/:id', function(req,res,next) {
  	if(!req.params.id) { console.log('Không có'); }
  	Product_Type.find(function(err, types) {
  		if (err) return next(err + "");
  			Product.find({ Enable: true },function(err, docs) {
  				if (err) return next(err + "");
  				let mao = docs.map(function(imgEdit) {
  					let	propImg = 'Img_Product',
  							position = imgEdit.Img_Product.indexOf(',');
  					if(imgEdit.Img_Product.length !== position) {
  						imgEdit[propImg] = imgEdit.Img_Product.split(",", 1);
  					}
  					else {
  						imgEdit[propImg] = imgEdit.Img_Product;
  					}
  					return imgEdit;
  				});
  				res.render('Page/danh-muc', {
  					title: 'Danh mục',
  					header: 'Chợ tốt Văn Lang',
  					subHeader: 'Lựa chọn sản phẩm mà bạn muốn',
  					type: types,
  					type_id: req.params.id,
  					products: docs });
  			}).sort({Create_at: -1});
  	});
  });

  app.get('/gioi-thieu',function(req,res,next) {
  	res.render('Page/About', { title: 'Chợ tốt Văn Lang' });
  });

  app.get('/lien-he',function(req,res,next) {
  	res.render('Page/Contact', { title: 'Liên hệ với chúng tôi' });
  });


  function isLogin(req, res, next) {
  	if(req.isAuthenticated()) {
  		return next();
  	}
  	req.session.oldUrl = req.originalUrl;
  	res.redirect('/dang-nhap');
  }



  // handler
  app.use((req, res, next) => {
  	var err = new Error("Không tìm thấy hoặc có thể trang đang được phát. Vui lòng quay lại sau...");
  	err.status = 404;
  	next(err);
  });


  if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
              message: err.message,
              error: err
          });
      });
  }


  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: {}
      });
  });

  var maxImg = [];
  //Set luu
  const storage = multer.diskStorage({
    destination: './public/images/',
    filename: (req, file, cb) => {
  		var imgArr = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
      if((maxImg.length) > 5){
  			return cb('Wá rồi');
  		}
  		else {
  			maxImg.push(imgArr);
  			cb(null, imgArr);
  		}
    }
  });
  //Init Upload
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 6 * 1024 * 1024,
      files: 6,
    },
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    }
  }).array('product__img',6);

  function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb('Vui lòng chỉ chọn hình ảnh!')
    }
  }

};
