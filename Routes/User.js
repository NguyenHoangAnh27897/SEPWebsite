const express = require('express');
const router = express.Router();



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

router.get('/thong-tin-ca-nhan', isLogin, function(req,res,next) {
	res.render('Page/profile', { title: 'Thông tin cá nhân', account: req.user });
});

router.get('/kenh-nguoi-ban', isLogin, function(req, res, next) {
	Product.find({ Seller: req.user._id },function(err, docs) {
		Product_Type.find(function(err, types) {
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
			res.render('Page/kenh-nguoi-ban', { title: 'Kênh người bán', products: docs , type: types });
		});
	}).sort({Create_at: -1});
});

router.get('/update-san-pham/:id', isLogin, function(req,res,next) {
	Product.findById(req.params.id, function(err, docs) {
		Product_Type.find(function(err, types) {
			res.render('Page/Product/Edit', { title: 'Chỉnh sửa sản phẩm', chuto: 'Kênh người bán', products: docs , type: types });
		});
	});
});

router.post('/update-san-pham/:id', isLogin, function(req,res,next) {
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
				console.log(editSanpham);
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

router.get('/them-san-pham', isLogin, function(req,res,next) {
	Product.find(function(err, docs) {
		Product_Type.find(function(err, types) {
			res.render('Page/Product/Add', { title: 'Thêm sản phẩm', chuto: 'Kênh người bán', products: docs , type: types });
		});
	});
});

router.post("/them-san-pham", isLogin, function(req, res) {
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

router.get('/dang-xuat', isLogin, function(req,res,next) {
	req.logout();
	res.redirect('/');
});

router.get('/dang-ky', function(req,res,next) {
	var messages = req.flash('error');
	res.render('Page/register', { title: 'Đăng ký', messages: messages, hasErrors: messages.length > 0 });
});

router.post('/dang-ky', passport.authenticate('dang-ky', {
  failureRedirect: '/dang-ky',
	failureFlash: true
}),function(req, res, next){
	  if(req.session.oldUrl) {
			let currentUrl = req.session.oldUrl;
			req.session.oldUrl = null;
			res.redirect(currentUrl);
		} else {
			res.redirect('/thong-tin-ca-nhan');
		}
});

router.get('/dang-nhap', function(req,res,next) {
  var messages = req.flash('error');
  res.render('Page/Login', { title: 'Đăng nhập',user: req.account, messages: messages, hasErrors: messages.length > 0 });
});

router.post('/dang-nhap', passport.authenticate('dang-nhap', {
  failureRedirect: '/dang-nhap',
  failureFlash: true
}), function(req, res, next){
	if(req.user.Admin.isAdmin) {
		res.redirect('/gioi-thieu');
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

function isLogin(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.session.oldUrl = req.originalUrl;
	res.redirect('/dang-nhap');
}

module.exports = router;
