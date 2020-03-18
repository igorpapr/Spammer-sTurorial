let mongoClient = require("mongodb").MongoClient;
let dburl = "mongodb://localhost:27017/mails";

module.exports = {insertUser, getAllUsers, deleteUser, updateUser};

async function insertUser(user, url = dburl){
    return new Promise((resolve, reject) => {
        mongoClient.connect(url, function (err, db) {
            if (err) reject(err);
            else{
            db.collection("users").insertOne(user, function (err1, results) {
                if (err1) return reject(err1);
                resolve("Successfully inserted user with email: " + user._id);
            });
            db.close();
            }
        })
    });
}

async function deleteUser(email, url = dburl){
    return new Promise((resolve, reject) => {
        mongoClient.connect(url, function (err, db) {
            if (err) reject(err);
            else{
                db.collection("users").remove({_id: email}, function (err1, results) {
                    if (err1) return reject(err1);
                    resolve("Successfully deleted user with email: " + email);
                });
                db.close();
            }
        })
    });
}

async function updateUser(targetRepl, url = dburl){
    return new Promise((resolve, reject) => {
        mongoClient.connect(url, function (err, db) {
            if (err) reject(err);
            else{
                db.collection("users").update(
                    {_id: targetRepl._id},
                    {
                        $set: {
                            name: targetRepl.name,
                            surname: targetRepl.surname,
                            patronymic: targetRepl.patronymic
                        }
                    }, function (err1, results) {
                    if (err1) return reject(err1);
                    resolve("Successfully updated user with email: " + targetRepl._id);
                });
                db.close();
            }
        })
    });
}

async function getAllUsers(url = dburl) {
    return new Promise((resolve, reject) => {
        let res = [];
        mongoClient.connect(url, function(err, db){
            if(err){
                reject(err);
            }
            db.collection("users").find().toArray(function(err1, results) {
                if (err1) reject(err1);
                else {
                    for (let i = 0; i < results.length; i++) {
                        res.push(results[i]);
                    }
                    resolve(res);
                }
                db.close();
            });
        });
    });
}