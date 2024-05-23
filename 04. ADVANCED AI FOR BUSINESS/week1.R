
"data science"
'business'

paste("Artificial", "Intelligence")


class(TRUE)

T
F

class("1")
class(1)
class(TRUE)
class("TRUE")


as.numeric("AI")
as.numeric(F)

x = 2
x
y <- 3

paste("fasdfjldadf", "fadsfsadfsa", 
      "dfakjshfdksahk", sep="_")


f_name = "Yu-Kai"
l_name ="Lin"
length_f_name = nchar(f_name)
length_l_name = nchar(l_name)
paste(f_name, l_name)
length_f_name * length_l_name 
length_f_name / length_l_name
length_f_name > length_l_name


1:30


y = c("A", "B", "C")
y

vec = c(1, 4, NA, 2)
length(vec)

x <- list(name="Bob", grades=c(100,80,90))


x[1]
x[[1]]

x$grades
x$name


z = list(
  name = c("Alice", "Bob", "Claire", "Denise"),
  female = c(T, F, T, F), 
  age = c(20, 25, 30, 35)
)

z$name[2]
z[[1]][2]
z[["name"]][2]

name = c("Alice", "Bob", "Claire", "Denise")
female = c(T, F, T, F)
age = c(20, 25, 30, 35)

df = data.frame(
  name, female, age
)
df
rownames(df) = c("row_1", "row_2", 
                 "row_3", "row_4")
df

mean(df$age)

library(tidyverse)

getwd()
list.files()
list.files(path = "data/")


library("jsonlite") #load the library into R before you can use it.
df = read_csv("data/HousePrices.csv")
df
json_content = toJSON(df)
df2=fromJSON(json_content)
df

write(json_content, file="data/my_HousePrices.json") 



mpg

View(mpg)
p1 = ggplot(data = mpg) + 
  geom_point(mapping = aes(x = displ, y = cyl, color = class))
p2 = ggplot(data = mpg) + 
  geom_point(mapping = aes(x = cty, y = hwy, color = class))
p1
p2
df
glimpse(df)
library(ggthemes)
ggplot(data = df, 
       mapping = aes(x = lotsize, 
                     y = price,
                     color = aircon,
                     size = stories)) + 
  geom_point() +
  geom_smooth() + 
  facet_wrap(~ driveway, nrow=1,
             labeller = as_labeller(c("no" = "Without driveway",
                                      "yes" = "With driveway"))) +
  theme_gdocs() +
  scale_color_gdocs() + 
  xlab("Lot Size")+
  ylab("Price")


1:4


glimpse(df)
df |> 
  select(c(price, aircon, gasheat, garage)) |> 
  filter(garage==0)

df |> 
  mutate(price_per_bedroom = price/bedrooms) |> 
  select(c(price, bedrooms, price_per_bedroom)) |> 
  arrange(desc(price_per_bedroom))

df |> 
  mutate(has_4_or_more_bedrooms = bedrooms>=4) |> 
  group_by(has_4_or_more_bedrooms) |> 
  summarise(n_houses = n())






