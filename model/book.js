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


function getCategory(callback) {
    connection.query("SELECT * FROM category",function (err,categories) {
       callback(err,categories);
    });
}

function setCategoryToDatabase(newCategory, callback) {
    var category = newCategory.category;
    var user_id = newCategory.user_id;
    var photo_category = newCategory.photo_category;

    var filter = new BloomFilter(1000, 0.0001);
    connection.query('SELECT * FROM category',function (err,result) {
        result.forEach(function (elements) {
            filter.add(elements.category);
        });
            if(filter.has(category)){
                console.log("Thể loại này đã tồn tại");
            }else{
                var insertQuery = "INSERT INTO category( category,user_id,image_category ) values ( ?,?,?)";

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






module.exports.setBookToDatabase = setBookToDatabase;
module.exports.getCategory = getCategory;
module.exports.setCategoryToDatabase = setCategoryToDatabase;
