//we are using the database sample_movies, which we used in Week 5, for aggregation examples

use sample_movies

db.theaters.find(
    {"location.address.state": "MN"},
    {"location.address.city": 1})
.sort({"location.address.city": 1}) 
.limit(3)

db.theaters. aggregate([
    {$match: {"location.address.state": "MN"}}, 
    {$project: {"location.address.city": 1}}, 
    {$sort: {"location.address.city": 1}}, 
    {$limit: 3}
])

db.movies.aggregate([
    {$sort: {"imdb.rating": -1}},
    {$match: {
        "genres": {$in: ["Romance"]}, 
        "released": {$lte: new Date("2001-01-01")}}},
    {$limit: 3},
    {$project: {"genres": 1, "released": 1, "imdb.rating": 1}}
])

//group
db.movies.aggregate([ 
    {$group: 
        {_id: "$rated" }
    }
])

db.movies.aggregate([ 
    {$group: 
        {_id: "rated" }
    }
])

//count
db.movies.aggregate([ 
    {$group: {
        _id: "$rated",
        "numTitles": {$sum: 1}, 
    }}
])

db.movies.aggregate([ 
    {$group: {
    _id: "$rated",
    "sumRuntime": {$sum: "$runtime"}, 
    }}
])

db.movies.aggregate([ 
    {$group: {
    _id: "$rated",
    "avgRuntime": {$avg: "$runtime"}, 
    }}
])

db.movies.aggregate([ 
    {$group: {
        _id: "$rated",
        "avgRuntime": {$avg: "$runtime"}
    }},
    {$project: {
        "roundedAvgRuntime": {$trunc: "$avgRuntime"} 
    }}
])

//example
db.movies.aggregate([
    {$match: {
        released: {$lte: new Date("2001-01-01")}
    }},
    {$group: {
        _id: {"$arrayElemAt": ["$genres", 0]},
        "popularity": {$avg: "$imdb.rating"},
        "top_movie": {$max: "$imdb.rating"},
        "longest_runtime": {$max: "$runtime"}
    }},
    {$sort: 
        {popularity: -1}
    },
    {$project: {
        _id: 1,
        popularity: 1, 
        top_movie: 1, 
        adjusted_runtime: {$add: ["$longest_runtime", 12]}
    }}
])

//join collections
db.users.aggregate([
    {$match: {
        $or: [{"name": "Catelyn Stark"}, {"name": "Ned Stark"}]
    }},
    {$lookup: {
        from: "comments", 
        localField: "name", 
        foreignField: "name", 
        as: "comments"
    }},
    {$limit: 2}
])

db.users.aggregate([
    {$match: {
        $or: [{"name": "Catelyn Stark"}, {"name": "Ned Stark"}]
    }},
    {$lookup: {
        from: "comments", 
        localField: "name", 
        foreignField: "name", 
        as: "comments"
    }},
    {$unwind: "$comments"}, 
    {$limit: 3},
])

//output
db.movies.aggregate([
    {$sort: {"imdb.rating": -1}}, 
    {$match: {
        "genres": {$in: ["Romance"]},
        "released": {$lte: new Date("2001-01-01") }
    }},
    {$limit: 5 },          
    {$project: { title: 1, genres: 1, released: 1, "imdb.rating": 1}},
    {$out: "movies_top_romance"} 
])

show collections
db.movies_top_romance.findOne({})

//options
db.movies.aggregate([
    {$match: {
        "awards.wins": {$gte: 1},
        genres: {$in: ["Documentary"]},
    }},
    {$sort: {"awards.wins": -1}},
    {$limit: 3},
    {$project: {title: 1, genres: 1, awards: 1}},
],
{
    maxTimeMS: 30000,
    allowDiskUse: true,
    comment: "Find Award Winning Documentary Films"
})
