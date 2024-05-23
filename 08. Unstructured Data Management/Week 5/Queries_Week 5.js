use sample_movies

db.comments.find()

db.comments.find({"name" : "Lauren Carr"})

db.comments.find({name : "Lauren Carr"})

// An empty find() function
db.comments.find()

// find() function with an empty document
db.comments.find({})

// find() function querying on a non existing field
db.comments.find({"a_non_existent_field" : null})

db.comments.find(
    {"name": "Lauren Carr"}, 
    {"name": 1, "date": 1}
)

db.comments.find(
    {"name": "Lauren Carr"},
    {"name": 1, "date": 1, "_id" : 0} 
)


// find distinct rated levels for movies
db.movies.distinct("rated")

// find distinct with condition
db.movies.distinct("rated", {"year": 1994})

db.movies.countDocuments({})

db.movies.countDocuments({"year": 1999})

db.movies.estimatedDocumentCount()

//equals
db.movies.find({"num_mflix_comments": 5})
db.movies.find({"num_mflix_comments": {$eq : 5 }})

//not equal
db.movies.find(
    {"num_mflix_comments": 
        {$ne: 5 }
    }
)

// greater than
db.movies.find(
    {year: {$gt: 2015}} 
)

db.movies.find(
    {year: {$gt: 2015}} 
).count()

//greater than or equal to
db.movies.find(
    {year: {$gte: 2015}} 
).count()

db.movies.find(
    {"released" :
        {$gte: new Date('2000-01-01')} 
    }
).count()

//less than
db.movies.find(
    {"num_mflix_comments": 
        {$lt: 2}
    }
).count()

db.movies.find(
    {"num_mflix_comments": 
        {$lte: 2}
    }
).count()

db.movies.find(
    {"released":
        {$lt: new Date('2000-01-01')} 
    }
).count()

//in and nin
db.movies.find(
    {"rated":
        {$in: ["G", "PG", "PG-13"]} 
    }
)

db.movies.find(
    {"rated":
        {$nin: ["G", "PG", "PG-13"]} 
    }
)

//all matched
db.movies.countDocuments(
    {"nef":
        {$nin: ["a value", "another value"]} 
    }
)

//none matched
db.movies.countDocuments(
    {"nef":
        {$nin: ["a value", "another value", null ]} 
    }
)

//and
db.movies.countDocuments( 
    {$and:
        [{"rated": "UNRATED"}, {"year": 2008}] 
    }
)

db.movies.find( 
    {$and:
        [{"rated": "UNRATED"}, {"year": 2008}] 
    }
).count()

//or
db.movies.find(
    { $or: [
        {"rated": "G"}, 
        {"rated": "PG"}, 
        {"rated": "PG-13"}
    ]} 
)

db.movies.find(
    {$or: [
        {"rated": "G"}, 
        {"year": 2005},
        {"num_mflix_comments": {$gte: 5}} 
    ]}
)

//nor - none of the conditions met
db.movies.find( 
    {$nor: [
        {"rated": "G"}, 
        {"year": 2005},
        {"num_mflix_comments": {$gte: 5}} 
    ]}
)

//not - negate the given condition
db.movies.find(
    {"num_mflix_comments": 
        {$gte: 5}
    }
)

db.movies.find(
    {"num_mflix_comments": 
        {$not: {$gte: 5} }
    } 
)

db.movies.find(
    {"num_mflix_comments": 
        {$lt: 5}
    } 
)

//Regular expression
db.movies.find(
    {"title": {$regex:"Opera"}},
    {"title": 1}
)
db.movies.find(
    {"title": {$regex:"Opera$"}},
    {"title": 1}
)

//query arrays and nested documents
//cast is an array
db.movies.find(
    {"cast": "Charles Chaplin"}, 
    {"cast": 1, "_id": 0}
)

db.movies.find( 
    {$and :[
        {"cast": "Charles Chaplin"}, 
        {"cast": "Edna Purviance"}
    ]} 
)

//match exactly
db.movies.find(
    {"languages": ["English", "German"]},
    {"languages": 1}
)

db.movies.find(
    {"languages": ["German", "English"]},
    {"languages": 1}
)

//find movies languages by [ "English", "French", "Cantonese", "German"] 
db.movies.find(
    {"languages": ["English", "French", "Cantonese", "German"]},
    {"languages": 1, "_id": 0}
    )
//find movies languages by ["English", "French", "Cantonese"] 
db.movies.find(
    {"languages": ["English", "French", "Cantonese"]},
    {"languages": 1, "_id" : 0}
)

//project search result
db.movies.find(
    {"languages": "Syriac"}, 
    {"languages": 1}
)

//limit output to "Syriac" only
db.movies.find(
    {"languages": "Syriac"}, 
    {"languages.$": 1}
)

//$slice: first three
db.movies.find(
    {"title": "Youth Without Youth"}, 
    {"languages": {$slice: 3}}
)

//last two
db.movies.find(
    {"title": "Youth Without Youth"}, 
    {"languages": {$slice: -2}}
)

//skip first two and return next four
db.movies.find(
    {"title": "Youth Without Youth"}, 
    {"languages": {$slice: [2, 4]}}
)

//skip to five from last index then next four
db.movies.find(
    {"title": "Youth Without Youth"}, 
    {"languages": {$slice: [-5, 4]}}
)

//query nested object: exact match
db.movies.find(
    {"awards":
        {"wins": 1, "nominations": 0, "text": "1 win."} 
    }
)


//limit
db.movies.find(
    {"cast": "Charles Chaplin"}, 
    {"title": 1, "_id": 0}
).limit(3)


//limit(0) means no limit
db.movies.find(
    {"cast": "Charles Chaplin"}, 
    {"title": 1, "_id": 0}
).limit(0)

//limit(-2) means limit(2)
db.movies.find(
    {"cast": "Charles Chaplin"}, 
    {"title": 1, "_id": 0}
).limit(-2)


//skip
//exclude first two
db.movies.find(
    {"cast": "Charles Chaplin"}, 
    {"title": 1, "_id": 0}
).skip(2)

//this is not valid
db.movies.find(
    {"cast": "Charles Chaplin"}, 
    {"title": 1, "_id": 0}
).skip(-3)


//sort
//ascending
db.movies.find(
    {"cast": "Charles Chaplin"}, 
    {"title": 1, "_id": 0}
).sort({"title": 1})

//descending
db.movies.find(
    {"cast": "Charles Chaplin"}, 
    {"title": 1, "_id": 0}
).sort({"title": -1})

db.movies.find()
.limit(50)
.sort({"imdb.rating": -1, "year" : 1})
















