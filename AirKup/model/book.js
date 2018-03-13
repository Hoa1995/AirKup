var connection = require('../config/database').connection;
var BloomFilter = require('bloom-filters').BloomFilter;

function setBookToDatabase(newBook, callback) {
    var title = newBook.title;
    var photo_before = newBook.photo_before;
    var photo_after = newBook.photo_after;
    var description = newBook.description;
    var content = newBook.content;
    var category = newBook.category;
    var price = newBook.price;
    var user_id = newBook.user_id;


    var insertQuery = "INSERT INTO books( title,photo_before,photo_after,description,content,category_id,price,user_id ) values ( ?, ?,?,?,?,?,?,?)";

    connection.query(insertQuery,[title, photo_before,photo_after,description,content,category,price,user_id],function(err, rows) {
        if (err) {
            console.log(err);
        } else {

            var id = rows.insertId;
            callback(err, id);
        }
    });
}
function getBook(callback) {
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
function getCategory(callback) {
    connection.query("SELECT  * FROM category",function (err,categories) {
       callback(err,categories);
    });
}

function setCategoryToDatabase(newCategory, callback) {
    var category = newCategory.category;
    var photo_category = newCategory.photo_category;
    var user_id = newCategory.user_id;
    var filter = new BloomFilter(1000, 0.0001);

    getCategory(function (err,categories) {
        categories.forEach(function (elements) {
            filter.add(elements.category);
        });
        if(filter.has(category)){
            console.log("The loai da ton tai");
        }else{
            var insertQuery = "INSERT INTO category( category,user_id,image_Category ) values ( ?,?,?)";

            connection.query(insertQuery,[category, user_id,photo_category],function(err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    var id = rows.insertId;
                    callback(err, id);
                }
            });
        }



    });

}

function increaseBook(userID, callback) {
    connection.query("SELECT * FROM users WHERE user_id = ? ",[userID], function(err, rows){
        if (rows[0]) {
            var counter = parseInt(rows[0].countBook) + 1;
            connection.query('UPDATE users SET countBook = ? WHERE user_id = ?', [counter, userID]);
            callback(err);
        }
    });
}

module.exports.setBookToDatabase = setBookToDatabase;
module.exports.getCategory = getCategory;
module.exports.getBook = getBook;
module.exports.setCategoryToDatabase = setCategoryToDatabase;
module.exports.increaseBook = increaseBook;