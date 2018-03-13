var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var connection = require('../config/database').connection;

// module.exports = function(app, passport, SERVER_SECRET) {
//     app.use( expressJwt({
//         secret : SERVER_SECRET
//     }).unless({
//         path:[
//             '/api/me'
//
//         ]}
//     ));
//     app.use(function (err, req, res, next) {
//         if (err.name === 'UnauthorizedError') {
//             return res.status(403).send({
//                 success: false,
//                 message: 'No token provided.'
//             });
//         }
//     });

    function getCateHome(callback) {
        connection.query("SELECT  distinct category.category_id,category.category,category.image_Category FROM category,books WHERE category.category_id = books.category_id",function(err, categories) {
            var category_arr=[];
            categories.forEach(function (element) {
                var object ={
                    category_id: " ",
                    category_tittle: " ",
                    count_book: [],
                    count_book_borrow : " ",
                    count_read : " ",
                    top_user_donate: " ",
                    image_category: " "
                };
                object.category_id = element.category_id;
                object.category_tittle = element.category;
                object.image_category = element.image_Category;
                category_arr.push(object);


            });


            connection.query("SELECT * FROM books,category WHERE books.category_id = category.category_id ",function(err, books) {

                for(var i=0; i < category_arr.length;i++){
                    for(var j=0 ; j < books.length;j++){
                        if(category_arr[i].category_id == books[j].category_id ){
                         console.log(books[j])
                            //console.log(books[j]);


                        }

                    }
                }
                //callback(category_arr);


            });


        });

    }
    getCateHome();
    // app.get('/api/show/category/', function(req, res) {
    //     getCateHome();
    // });






// };