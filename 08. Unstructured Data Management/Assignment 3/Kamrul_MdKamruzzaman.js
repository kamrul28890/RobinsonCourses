// ******* Task 1. MongoDB CRUD *********

// 1.1 - Get number of successful projects in “Video Games” category (state is “successful”).
db.projectskamrul.find({"category.name": "Video Games", "state": "successful" }).count()

// 1.2 - Get the total number of projects in “Video Games” or “Playing Cards” categories.
db.projectskamrul.countDocuments(
    {$or:
       [{"category.name":"Video Games"},
       {"category.name":"Playing Cards"}
       ]}
)

// 1.3 - Blockbuster projects are those with extremely high pledged amount and backer count. Find the number of blockbuster projects in the data by querying projects with pledged >=$1,000,000 and backers >=10,000.
db.projectskamrul.find({$and:[{"pledged":{$gte: 1000000}}, {"backers_count":{$gte: 10000}}]}).count()

// 1.4 - Find the top three pledged projects in “Video Games” category; display the output with “_id” and pledged only.
db.projectskamrul.find(
    {"category.name": "Video Games"},
    {"pledged":1, "_id": 1}
).sort({"pledged": -1}).limit(3)

// 1.5 - Update the collection “projects” with a new field “success”; this new field equals to 1, if state is “successful”, and 0, otherwise.
db.projectskamrul.updateMany({ },
   [{$set: {success: 
                {
                  $cond: {if: { $eq: [ "$state", "successful" ] }, then: 1, else: 0 }
                }
           }
   }],
)

// ******* Task 2. MongoDB Aggregation Pipeline *********

// 2.1 - Calculate the average pledged amount per category and display the top 5 categories.
db.projectskamrul.aggregate([
    {$group: {
        _id: "$category.name",
        "avg_pledged_amount": {$avg: "$pledged"}
    }},
    {$sort: {avg_pledged_amount: -1}},
    {$limit: 5}
])

// 2.2 - Calculate the success rate per category and display the top 5 categories with the highest success rates.
db.projectskamrul.aggregate([
    {$group: {
       _id: "$category.name",
       "total_success": {$sum: "$success"},
       "total_projects": {$sum: 1}
    }},
    {$project: {success_rate: {$divide: ["$total_success", "$total_projects"]}}},
    {$sort: {success_rate: -1}},
    {$limit: 5}
])

// 2.3 - Find the top 5 states in the US with the highest number of projects.
db.projectskamrul.aggregate([
    {$match: {
        "location.country": "US"
    }},
    {$group: {
        _id: "$location.state",
        "project_nos": {$sum: 1}
    }},
    {$sort: {
        project_nos: -1
    }},
    {$limit: 5}
])

// 2.4 - Calculate the success rate per state in the US and display the top 5 states with the highest success rates.
db.projectskamrul.aggregate([
    { $match: {
        "location.country": "US"
    }},
    { $group: {
        _id: "$location.state",
        "project_nos": {$sum: 1},
        "success_total": {$sum: "$success"}
    }},
    {$project: {
        state_wise_success_rate: { $divide: ["$success_total", "$project_nos"]}
    }},
    { $limit: 5}
])

// 2.5 - Find creators with at least 3 successful projects out of a sample of 10,000 successful projects.
db.projectskamrul.aggregate([
    {$sample: {size: 10000}},
    {$match: {
        state: "successful"
    }},
    {$group: {
        _id: "$creator.id",
        successful_projects_nos: {$sum: 1}
    }},
    {$match: {
        "successful_projects_nos": {$gte: 3}
    }}
])
