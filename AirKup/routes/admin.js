var multer = require('multer');
var book = require("../model/book")


var path = require('path');
/* GET home page. */
module.exports = function (app,passport) {
    // app.get('/admin/signup', function(req, res, next) {
    //     res.render('signup', { message: req.flash('signupMessage') });
    // });
    // app.post('/admin/signup', passport.authenticate('local-signup', {
    //     successRedirect : '/admin/login', // redirect to the secure profile section
    //     failureRedirect : '/admin/signup', // redirect back to the signup page if there is an error
    //     failureFlash : true // allow flash messages
    // }));
    app.get('/admin/login', function(req, res, next) {
        // if (req.isAuthenticated()) {
            // if(req.user.role == 'admin'  ) {
                res.render('./admin/login.ejs',  { message: req.flash('loginMessage') });

        //     }else{
        //         if(req.user.role == 'user'){
        //             res.render('error.ejs');
        //         }
        //     }
        // } else {
        //     res.render('error.ejs');
        // }
    });
    // process the login form
    app.post('/admin/login', passport.authenticate('local-login', {
            successRedirect : '/admin/book', // redirect to the secure profile section
            failureRedirect : '/admin/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
        function(req, res) {
            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/admin/manager');
        });
    app.get('/admin/book',function (req,res,next) {
        if (req.isAuthenticated()) {
            res.render('./admin/managerBook.ejs',{user: req.user});
        }
    });


    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./public/upload");
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname+ "-" + Date.now() + path.extname(file.originalname));
        }
    });

    var upload = multer({storage: storage}).array("photo",2);

    app.get('/admin/addBook',function (req,res,next) {
        if (req.isAuthenticated()) {
            book.getCategory(function (err,categories) {
                res.render('./admin/addBook', {user: req.user, items: categories});
            });


        }
    });
    app.post("/admin/addBook", function (req, res) {
        if (req.isAuthenticated()) {
            upload(req, res, function (err) {
                var newBook = {
                    title: req.body.title,
                    description: req.body.description,
                    content: req.body.content,
                    category: req.body.category,
                    price: req.body.price,
                    user_id: req.user.user_id
                };
                if( req.files.length == 1){

                       newBook.photo_before= "/upload/" + req.files[0].filename;

                }else {
                        newBook.photo_before= "/upload/" + req.files[0].filename;
                        newBook.photo_after= "/upload/" + req.files[1].filename;
                }

                 console.log(newBook);
                book.setBookToDatabase(newBook,function (err) {
                    book.increaseBook(newBook.user_id,function (err) {
                    });
                });

            });

            res.redirect('/admin/book');

        }
    });
    app.get('/admin/category',function (req,res,next) {
        if (req.isAuthenticated()) {
                res.render('./admin/managerCate', {user: req.user});
        }
    });
    app.get('/admin/addCategory',function (req,res,next) {
        if (req.isAuthenticated()) {
            res.render('./admin/addCategory', {user: req.user});
        }
    });
    app.post("/admin/addCategory",multer({storage: storage}).single("photo_category"), function (req, res) {
        if (req.isAuthenticated()) {

                var newCategory = {
                    category: req.body.category,
                    photo_category: "/upload/" + req.file.filename,
                    user_id: req.user.user_id
                };

                book.setCategoryToDatabase(newCategory, function (err) {
                    console.log("Them danh muc thanh cong!")
                });
                res.redirect('/admin/category');

        }
    });
    app.get('/api/books', function(req, res, next) {

            book.getBook(function (category_arr) {
                  //

                res.send(category_arr);
                // return;
            });

            });
    // app.get('/api/books/category/:id', function(req, res, next) {
    //     book.getCategory(id,function (err,categories) {
    //         book.getBook(id,function (err,books) {
    //             var book = categories.map(function(cat,index){
    //                 var body = [];
    //                 body.push(books[index]);
    //                 cat["body"] = body;
    //                 return cat;
    //             });
    //             res.send(book);
    //         });
    //
    //
    //     });
    // });
};



