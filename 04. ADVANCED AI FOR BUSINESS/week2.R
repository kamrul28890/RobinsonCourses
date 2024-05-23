library(repurrrsive)
library(tidyverse)
# See the data included in the repurrrsive package
data(package = "repurrrsive")$result[, c("Item","Title")]



# Example
for (year in 2001:2004){
  if(year==2002)
    next
  
  print( paste("The year was", year) )
}


iris
View(iris)
mean
is.numeric


iris[ , 1]

is.numeric(iris[ , 1])
is.numeric(iris[ , 5])

avg_vec = vector("numeric", ncol(iris))
for(i in 1:ncol(iris)) {
  
  if(is.numeric(iris[ , i])) {
    avg = mean(iris[ , i])
    avg_vec[i] = avg
  } else {
    avg_vec[i] = NA
  }
}
avg_vec

hello_world <- function() { # this particular function takes no input
  print("Hello world!")
  # This function has no return statement; return nothing.
}
hello_world()  # call the function; don't forget the parentheses


add_one <- function(num) {
  num = NULL
  try({
    num <- num + 1  # be sure to match the input variable name 
  })
  
  
  return(num)
}
a = add_one(10)
print(a)

add_one("big data")
result = NULL
try({result = 1 + "gsu"})
try({result = 1 + "gsu"}, silent = T)
result


add_one <- function(num) {
  
  num <- tryCatch({
    num + 1 
  }, error=function(cond) {
    NA
  })
  
  return(num)  # return() says what the output is
}
a = add_one(10)
print(a)
a = add_one("big data")
print(a)


add_two_values <- function(num1=0, num2=0) {
  total <- tryCatch({
    num1 + num2
  }, error=function(cond) {
    NA
  })
  return(total)
}

print(add_two_values())
print(add_two_values(num1 = 5, num2=10))
print(add_two_values("a", "b"))

map_dbl(1:3, function(x) {
  x^2
  
  
  return(something)
})


(1:3)^2


repurrrsive::sw_people

sw_people[[2]]

bmi = as.numeric(sw_people[[1]]$mass) / 
  (as.numeric(sw_people[[1]]$height)/100)^2 
bmi


bmi_vec = map_dbl(sw_people, function(x){
  bmi = as.numeric(x$mass) / 
    (as.numeric(x$height)/100)^2 
})

bmi_vec
sw_people[[12]]$height
sw_people[[12]]$mass


sw_people[[1]]$name


name_vec = map_chr(sw_people, function(x){
  x$name
})
name_vec

gender_vec = map_chr(sw_people, function(x){
  x$gender
})
gender_vec

df = data.frame(
  name = name_vec,
  gender = gender_vec,
  bmi = bmi_vec
)

View(df)

df = df |> 
  mutate(
    bmi_category = ifelse(bmi<18.5, "underweight", ifelse(bmi<25, "normal", ifelse(bmi<30, "overweight", "obesity")))
  )

gender_vec = map_chr(sw_people, function(x){
  x$gender
})
gender_vec = map_chr(sw_people, ~ .$gender)

gender_vec


gender_vec = map_chr(sw_people, function(x, y, z){
  
  x
  y
  z
  
  return(something)
})


gender_vec = map_chr(sw_people, ~ ..1+..2+..3)

gh_users

bmi_vec = sw_people |> 
  map_dbl(function(x){
  bmi = as.numeric(x$mass) / 
    (as.numeric(x$height)/100)^2 
})


mtcars 
unique(mtcars$cyl)


for(i in 1:10) {
  print(i)
}

#install.packages("httr")
library(httr)
response = GET(url = "https://api.github.com/repos/tidyverse/ggplot2")
class(response)
response
response_content = content(response)



library(httr)
response = GET(url = "https://api.github.com/orgs/google/members")
class(response)
response
response_content = content(response)
response_content



library(gh)
#Get the first 100. Set .limit = Inf if you want to get all
google_members <- gh("/orgs/google/members", .limit = 100)
length(google_members)
google_members
google_members[[1]]
google_members[[2]]

?gh

fb_members <- gh("/orgs/facebook/members", 
                 .limit=Inf)
length(fb_members)

fb_members[[1]]$login

login_vec = map_chr(fb_members, ~.$login)
login_vec

login_vec[[1]]

one_profile = gh("/users/{username}", 
                 username=login_vec[[1]])

one_profile$followers

follower_vec = map_int(fb_members, function(x){
  one_profile = gh("/users/{username}", 
                   username=x)
  return(one_profile$followers)
})

