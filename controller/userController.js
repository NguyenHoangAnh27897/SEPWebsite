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
	
	app.get('/kenh-nguoi-ban', isLogin, isPay, function(req, res, next) {
    Product.find({$and: [{ Seller: req.user._id }, { Enable: true }] },function(err, docs) {
        if (err) throw new Error(err);
        Product_Type.find(function(err, types) {
            if (err) throw err
            Product.find({$and: [{ Seller: req.user._id }, { Enable: false }] },function(err, docsD) {
                if (err) throw new Error(err);
                docs.map(function(imgEdit) {
                    let propImg = 'Img_Product',
                            position = imgEdit.Img_Product.indexOf(',');
                    if(imgEdit.Img_Product.length !== position) {
                        imgEdit[propImg] = imgEdit.Img_Product.split(",", 1);
                    }
                    else {
                        imgEdit[propImg] = imgEdit.Img_Product;
                    }
                    return imgEdit;
                });
                docsD.map(function(imgEdit) {
                    let propImg = 'Img_Product',
                            position = imgEdit.Img_Product.indexOf(',');
                    if(imgEdit.Img_Product.length !== position) {
                        imgEdit[propImg] = imgEdit.Img_Product.split(",", 1);
                    }
                    else {
                        imgEdit[propImg] = imgEdit.Img_Product;
                    }
                    return imgEdit;
                });
                res.render('Page/kenh-nguoi-ban', {
                    title: 'Kênh người bán',
                    products: docs ,
                    productsD: docsD,
                    type: types
                });
            });
        });
    }).sort({Create_at: -1});
  });


	app.get('/them-san-pham', isLogin, isPay, function(req,res,next) {
    Product.find(function(err, docs) {
        Product_Type.find(function(err, types) {
            res.render('Page/Product/Add', {
                title: 'Thêm sản phẩm',
                chuto: 'Kênh người bán',
                products: docs ,
                type: types
            });
        });
    });
  });

  app.post("/them-san-pham", isLogin, isPay, function(req, res) {
    upload(req, res, function(err) {
      if (err) {
            Product.find(function(err, docs) {
                Product_Type.find(function(err, types) {
                    res.render('Page/Product/Add', {
                        title: 'Thêm sản phẩm',
                        msg: "Lỗi: Không có ảnh!",
                        chuto: 'Kênh người bán',
                        products: docs,
                        type: types
                    });
                });
            });
      } else {
        if (maxImg.length === 0) {
                Product.find(function(err, docs) {
                    Product_Type.find(function(err, types) {
                        res.render('Page/Product/Add', {
                            title: 'Thêm sản phẩm',
                            msg: "Vui lòng thêm ảnh để hoàn thiện sản phẩm!",
                            chuto: 'Kênh người bán',
                            products: docs,
                            type: types
                        });
                    });
                });
        }
        else {
                var sanpham = new Product();
                sanpham.Product_Name = req.body.Product_Name;
                sanpham.Description = req.body.Description;
                sanpham.Seller = req.user._id;
                sanpham.Price = req.body.Price;
                sanpham.Quantity = req.body.Quantity;
                sanpham.Brand = (req.body.Brand) ? (req.body.Brand) : "No Brand";
                sanpham.Product_Type = req.body.Product_Type;
                sanpham.Img_Product = `${maxImg.toString()}`;
                sanpham.save(function(err) {
                    if(err) {
                        return console.log(err);
                    } else {
                        maxImg.splice(0,maxImg.length);
                        res.redirect('/');
                    }
                });
        }
      }
    });
	});
	
	app.get('/update-san-pham/:id', isLogin, isPay, function(req,res,next) {
    Product.findById(req.params.id, function(err, docs) {
        Product_Type.find(function(err, types) {
            res.render('Page/Product/Edit', {
                title: 'Chỉnh sửa sản phẩm',
                chuto: 'Kênh người bán',
                products: docs ,
                id: docs.Product_Type,
                type: types
            });
        });
    });
  });

  app.post('/update-san-pham/:id', isLogin, isPay, function(req,res,next) {
    upload(req, res, function(err) {
        if (err) {
            Product.findById(req.params.id, function(err, docs) {
                Product_Type.find(function(err, types) {
                    res.render('Page/Product/Edit', {
                        title: 'Thêm sản phẩm',
                        msg: "Lỗi: Không có ảnh!",
                        chuto: 'Kênh người bán',
                        products: docs ,
                        id: req.params.id,
                        type: types
                    });
                });
            });
        } else {
            if (maxImg.length === 0) {
                Product.findById(req.params.id, function(err, docs) {
                    Product_Type.find(function(err, types) {
                        res.render('Page/Product/Edit', {
                            title: 'Thêm sản phẩm',
                            msg: "Vui lòng thêm ảnh để hoàn thiện sản phẩm!",
                            chuto: 'Kênh người bán',
                            products: docs,
                            id: req.params.id,
                            type: types
                        });
                    });
                });
            }
            else {
                var editSanpham = {};
                editSanpham.Product_Name = req.body.Product_Name;
                editSanpham.Description = req.body.Description;
                editSanpham.Price = req.body.Price;
                editSanpham.Quantity = req.body.Quantity;
                editSanpham.Brand = req.body.Brand;
                editSanpham.Product_Type = req.body.Product_Type;
                editSanpham.Img_Product = `${maxImg.toString()}`;
                var sp_id = { _id: req.params.id };
                Product.update(sp_id, editSanpham, function(err){
                    if(err){
                        return console.log(err);
                    } else {
                        maxImg.splice(0,maxImg.length);
                        res.redirect('/kenh-nguoi-ban');
                    }
                });
            }
        }
    });
  });


	app.get('/chi-tiet-san-pham/:id', function(req,res,next) {
    Product.findById(req.params.id, function(err, product) {
        try {
            Account.findById(product.Seller ,function(err, nguoidung){
                if(err) { throw new Error('Lỗi Seller'); }
                else {
                    Product.find({$and: [{ Seller: nguoidung._id}, { Enable: true }]}, function(err, PoS){
                        if(err) { throw new Error('Lỗi Seller_id'); }
                        Product_Type.findOne(function(err,types){
                            let all_Img = product.Img_Product.split(",");
                            res.render('Page/chi-tiet-san-pham', {
                                title: 'Chi tiết sản phẩm',
                                product: product,
                                seller: nguoidung,
                                pos: PoS,
                                all_Img: all_Img,
                                one_typeid: types._id
                            });
                        });
                    });
                }
            });
        } catch (e) {
             e.message;
        }
    });
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
  	if(!req.params.id) { throw new Error('Không có sản phẩm'); }
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
  					subHeader: 'Chọn sản phẩm bạn muốn',
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
