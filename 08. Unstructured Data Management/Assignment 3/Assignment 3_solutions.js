use kickstarter

//1.1 count number of projects in video games category: 344
db.projects.find({$and :[{"category.name": "Video Games"}, {"state": "successful"}]}).count()

//1.2 count number of projects in video games or playing cards category: 1711
db.projects.find({$or: 
    [{"category.name": "Video Games"},
     {"category.name": "Playing Cards"}]
}).count()

//1.3 find blockbuster projects: 25
db.projects.find({$and: 
    [{'pledged': {$gte: 1000000}},
     {'backers_count': {$gte: 10000}}]
}).count()

//1.4 find the top three pledged projcts in video games; show _id and pledged in your output
db.projects.find(
    {"category.name": "Video Games"},
    {"pledged": 1}
).sort({"pledged": -1}).limit(3)

//Update
//1.5 create a field success; it equals to one if state is "sucessful" and zero otherwise
db.projects.updateMany({"state": "successful"}, {$set: {"success": 1}})
db.projects.updateMany({"state": {$ne: "successful"}}, {$set: {"success": 0}})



//Aggregation

//2.1 What is the average pledged amount by project category? Sort the output descending by average pledged amount
db.projects.aggregate([{$group: {_id: "$category.name", avg_pledged: {$avg: "$pledged"}}},
                       {$sort: {"avg_pledged": -1}},
                       {$limit: 5}
                    ])

//2.2 What is the success rate by project category? (use $divide in $project)
db.projects.aggregate([{$group: {_id: "$category.name", success: {$sum: "$success"}, count: {$sum: 1}}},
                       {$project : {"success_rate": { "$divide" : ["$success", "$count"]}}},
                       {$limit: 5}
                    ])

//2.3 What is the number of projects by states in US? Sort the output descending by number of projects
db.projects.aggregate([{$match: {"location.country": "US"}}, 
                       {$group: {_id: "$location.state", count: {$sum: 1}}},
                       {$sort:  {"count": -1}},
                       {$limit: 5}
                    ])

//2.4 What is the success rate by states in US?
db.projects.aggregate([{$match: {"location.country": "US"}}, 
                       {$group: {_id: "$location.state", success: {$sum: "$success"}, count: {$sum: 1}}},
                       {$project : {"count": 1, "success_rate": { "$divide" : ["$success", "$count"]}}},
                       {$limit: 5}
                    ])

//2.5: Sample 10000 projects, obtain the creator who has at least 3 successful projects
db.projects.aggregate([
    {$sample: {size: 10000}},
    {$match: {"state": "successful"}},
    {$group: {_id: "$creator.id", "num_success_projects": {$sum: 1}}},
    {$match: {"num_success_projects": {$gte: 3}}}
])
