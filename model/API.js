var connection = require('../config/database').connection;
function getApiBookInCategory(callback) {
    connection.query("SELECT  distinct category.category_id,category.category FROM category,books WHERE category.category_id = books.category_id",function(err, categories) {
        var category_arr=[];
        categories.forEach(function (element) {
            var object ={
                category_id: " ",
                category_tittle: " ",
                books :[ ]
            };
            object.category_id = element.category_id;
            object.category_tittle = element.category;
            category_arr.push(object);

        });

        connection.query("SELECT * FROM books",function(err, books) {
            for(var i=0; i < category_arr.length;i++){
                for(var j=0 ; j < books.length;j++){
                    if(category_arr[i].category_id == books[j].category_id){
                        category_arr[i].books.push(books[j]);
                    }

                }
            }
            callback(category_arr);


        });


    });

}
function getApiCateHome(callback) {

    connection.query("SELECT  distinct category.category_id,category.category,category.image_category FROM category,books WHERE category.category_id = books.category_id",function(err, categories) {
        var category_arr=[];
        categories.forEach(function (element) {
            var object ={
                category_id: " ",
                category_tittle: " ",
                image_category: " ",
                count_book :[ ],
                count_book_borrow: []

            };
            object.category_id = element.category_id;
            object.category_tittle = element.category;
            object.image_category = element.image_category;
            category_arr.push(object);

        });

        connection.query("SELECT * FROM books",function(err, books) {
            for(var i=0; i < category_arr.length;i++){
                for(var j=0 ; j < books.length;j++){
                    if(category_arr[i].category_id == books[j].category_id){
                        category_arr[i].count_book.push(books[j]);
                    }
                }
            }
            for(var i =0; i < category_arr.length;i++){
                category_arr[i].count_book = category_arr[i].count_book.length;
            }

        });
        connection.query("SELECT * FROM books,category WHERE category.category_id = books.category_id AND status = ?", [1],function(err, books) {
            for(var i=0; i < category_arr.length;i++){
                for(var j=0 ; j < books.length;j++){
                    if(category_arr[i].category_id == books[j].category_id){
                        category_arr[i].count_book_borrow.push(books[j]);
                    }
                }
            }

            for(var i =0; i < category_arr.length;i++){
                category_arr[i].count_book_borrow = category_arr[i].count_book_borrow.length;
            }
            callback(category_arr);
        });
    });

}

module.exports.getApiBookInCategory = getApiBookInCategory;
module.exports.getApiCateHome = getApiCateHome;