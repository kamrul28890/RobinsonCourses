//create a new database to work on
use newdb

//insert one document 
db.new_movies.insertOne({"_id": 1, "title": "Dunkirk"})

//retrieve it
db.new_movies.find({"_id": 1})

//collection is automatically created
show collections


//insert multiple
db.new_movies.insertOne({"_id": 2, "title": "Baby Driver"})
db.new_movies.insertOne({"_id": 3, "title": "Logan"})
db.new_movies.insertOne({"_id": 4, "title": "John Wick"}) 
db.new_movies.insertOne({"_id": 5, "title": "A Ghost Story"})

//insertMany
db.new_movies.insertMany([
    {"_id": 2, "title": "Baby Driver"}, 
    {"_id": 3, "title": "Logan"},
    {"_id": 4, "title": "John Wick"}, 
    {"_id": 5, "title": "A Ghost Story"}
])

//can't insert duplicate key
db.new_movies.insertOne({"_id": 2, "title": "Some other movie"})


//only two of them are inserted because of duplicate key
db.new_movies.insertMany([
    {"_id": 6, "title": "some movie 1"}, 
    {"_id": 7, "title": "some movie 2"},
    {"_id": 2, "title": "Movie with duplicate _id"}, 
    {"_id": 8, "title": "some movie 3"},
])

db.new_movies.find({"_id": {$in: [6, 7, 2, 8]}})

//insert without _id
db.new_movies.insertOne({"title": "Thelma"})
//retrieve it
db.new_movies.find({"title" : "Thelma"})

db.new_movies.insertMany([
    {"_id": 9, "title": "movie_1"}, 
    {"_id": 10, "title": "movie_2"}, 
    {"title": "movie_3"},
    {"_id": 8, "title": "movie_4"}, 
])

//delete
db.new_movies.deleteOne({"_id": 2})

//deleteMany
db.new_movies.deleteMany({"title": {"$regex": "^movie"}})

//delete with no condition
db.new_movies.deleteOne({})

db.new_movies.insertMany([
    { "_id": 11, "title": "movie_11"}, 
    { "_id": 12, "title": "movie_12"}, 
    { "_id": 13, "title": "movie_13"}, 
    { "_id": 14, "title": "movie_14"}, 
    { "_id": 15, "title": "series_15"}
])

//this will delete last entry based on sort descending
db.new_movies.findOneAndDelete( 
    {"title": {"$regex": "^movie"}}, 
    {sort: {"_id": -1}}
)

//limit the response to only title
db.new_movies.findOneAndDelete( 
    {"title": {"$regex": "^movie"}},
    {sort: {"_id": -1}, projection: {"_id": 0, "title": 1}} 
)


db.users.insertMany([
    {"_id": 2, "name": "Jon Snow", "email": "Jon.Snow@got.es"}, 
    {"_id": 3, "name": "Joffrey Baratheon", "email": "Joffrey.Baratheon@got.es"},
    {"_id": 5, "name": "Margaery Tyrell", "email": "Margaery.Tyrell@got.es"},
    {"_id": 6, "name": "Khal Drogo", "email": "Khal.Drogo@got.es"} 
])

//replace
db.users.replaceOne( 
    {"_id": 5},
    {"name": "Margaery Baratheon", "email": "Margaery.Baratheon@got.es"} 
)

//no match and no replace
db.users.replaceOne(
    {"name": "Margaery Tyrell" },
    {"name": "Margaery Baratheon", "email": "Margaery.Baratheon@got.es"} 
)

//cannot change _id
db.users.replaceOne(
    {"name": "Margaery Baratheon"},
    {"_id": 9, "name": "Margaery Baratheon", "email": "Margaery.Baratheon@got.es"}
)

//this will replace
db.users.replaceOne(
    {"name": "Margaery Baratheon"},
    {"name": "Margaery Tyrell", "email": "Margaery.Tyrell@got.es"}, 
    {upsert: true}
)

//this will insert
db.users.replaceOne(
    {"name": "Tommen Baratheon"},
    {"name": "Tommen Baratheon", "email": "Tommen.Baratheon@got.es"}, 
    {upsert: true}
)

db.movies.insertMany([
    { "_id": 1011, "title": "Macbeth" },
    { "_id": 1513, "title": "Macbeth" },
    { "_id": 1651, "title": "Macbeth" },
    { "_id": 1819, "title": "Macbeth" },
    { "_id": 2117, "title": "Macbeth" }
])


//findOneAndReplace
db.movies.findOneAndReplace( 
    {"title": "Macbeth"},
    {"title": "Macbeth", "latest" : true}, 
    {
        sort: {"_id": -1}, 
        projection: {"_id": 0}, 
        returnNewDocument: true
    }
)

//update
db.movies.deleteMany({})

db.movies.insertMany([
    {"_id": 1, "title": "Macbeth", "year": 2014, "type": "series"},
    {"_id": 2, "title": "Inside Out", "year": 2015, "type": "movie", "num_mflix_comments": 1},
    {"_id": 3, "title": "The Martian", "year": 2015, "type": "movie", "num_mflix_comments": 1},
    {"_id": 4, "title": "Everest", "year": 2015, "type": "movie", "num_mflix_comments": 1} 
])

db.movies.updateOne( 
    {"title": "Macbeth"}, 
    {$set : {"year": 2015}}
)
db.movies.find({"title" : "Macbeth"})

//can add new fields as well
db.movies.updateOne( 
    {"title": "Macbeth"},
    {$set: {"type" : "movie", "num_mflix_comments" : 1}} 
)
db.movies.find({"title" : "Macbeth"})

//can update same field multiple times
db.movies.updateOne( 
    {"title": "Macbeth"},
    {$set: {"year": 2015, "year": 2015, "year": 2016, "year": 2017}} 
)
db.movies.find({"title" : "Macbeth"})

//update without upsert - no update
db.movies.updateOne( 
    {"title": "Sicario"}, 
    {$set: {"year": 2015}}
)

//update with upsert - insert if not exist
db.movies.updateOne( 
    {"title": "Sicario"}, 
    {$set: {"year" : 2015}}, 
    {"upsert": true}
)

//use the id generated
db.movies.find({"_id" : ObjectId("6431c92693c5a07c80c33b35")})

//returnNewDocment - Ture - return the updated document
db.movies.findOneAndUpdate( 
    {"title": "Macbeth"},
    {$set: {"num_mflix_comments": 15}}, 
    {"returnNewDocument": true}
)
db.movies.find({"title": "Macbeth"})

//use findOneAndUpdate with sort
db.movies.findOneAndUpdate( 
    {"type": "movie"},
    {$set: {"latest": true}}, 
    {
        "returnNewDocument": true, 
        "sort": {"_id" : -1}
    } 
)


use sample_movies

//updateMany
db.movies.updateMany( 
    {"year": 2015},
    {$set: {"languages": ["English"]}} 
)

//use operator $inc - incremental update
db.movies.find({"title": "Macbeth"})

db.movies.findOneAndUpdate( 
    {"title": "Macbeth"},
    {$inc: {"num_mflix_comments": 3, "rating": 1.5}}, 
    {returnNewDocument: true}
)

db.movies.findOneAndUpdate( 
    {"title": "Macbeth"},
    {$inc: {"num_mflix_comments": -2, "rating": -0.2}}, 
    {returnNewDocument: true}
)

//use operator $mul - multiply
db.movies.findOneAndUpdate( 
    {"title": "Macbeth"},
    {$mul: {"rating" : 2}}, 
    {returnNewDocument: true}
)

//use $mul with zero will be zero
db.movies.findOneAndUpdate( 
    {"title": "Macbeth"},
    {$mul: {"box_office_collection": 16.3}}, 
    {returnNewDocument: true}
)

//use operator $rename - rename field
db.movies.findOneAndUpdate( 
    {"title": "Macbeth"},
    {$set: {"imdb_rating": 6.6}}, 
    {returnNewDocument: true}
)

db.movies.findOneAndUpdate( 
    {"title": "Macbeth"},
    {$rename: {"num_mflix_comments": "comments", "imdb_rating": "rating"}},
    {returnNewDocument: true} 
)

//fields will be removed; values provided do not matter
db.movies.findOneAndUpdate( 
    {"title": "Macbeth"}, 
    {$unset: {
        "created_date": "",
        "last_updated": "dummy_value", 
        "box_office_collection": 142.2, 
        "imdb": null,
        "flag": "" 
    }},
    {returnNewDocument: true} 
)





