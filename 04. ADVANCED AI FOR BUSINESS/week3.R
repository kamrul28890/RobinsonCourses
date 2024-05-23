install.packages("DALEX")
install.packages("DALEXtra")
install.packages("lime")
install.packages(c("rms", "randomForest", "e1071"))
library("tidyverse")
library("DALEX")
library("DALEXtra")


titanic 
View(titanic)
apartments 
View(apartments)


sum(is.na(titanic$country))


titanic = titanic |> 
  mutate(country =  as.character(country)) |> 
  replace_na(list(age = 30, country = "X", sibsp = 0, parch = 0)) |> 
  mutate(country =  factor(country)) 
# impute missing fare based on class
titanic$fare[is.na(titanic$fare) & titanic$class == "1st"] = 89
titanic$fare[is.na(titanic$fare) & titanic$class == "2nd"] = 22
titanic$fare[is.na(titanic$fare) & titanic$class == "3rd"] = 13

apartments_test
View(apartments_test)


library("rms")
# the rcs() function allows us to model potentially non-linear effect of age
titanic_lmr <- lrm(survived == "yes" ~ gender + rcs(age) + class +
                     sibsp + parch + fare + embarked, titanic)
library("randomForest")
set.seed(123)
titanic_rf <- randomForest(survived ~ class + gender + age + 
                             sibsp + parch + fare + embarked, data = titanic)
library("e1071")
titanic_svm <- svm(survived == "yes" ~ class + gender + age + 
                     sibsp + parch + fare + embarked, data = titanic, 
                   type = "C-classification", probability = TRUE)



johnny <- data.frame(
  class = factor("1st", levels = c("1st", "2nd", "3rd", "deck crew", 
                                   "engineering crew", "restaurant staff", "victualling crew")),
  gender = factor("male", levels = c("female", "male")),
  age = 8, sibsp = 0, parch = 0, fare = 72,
  embarked = factor("Southampton", levels = c("Belfast", "Cherbourg", 
                                              "Queenstown","Southampton")))

henry <- data.frame(
  class = factor("1st", levels = c("1st", "2nd", "3rd", "deck crew", 
                                   "engineering crew", "restaurant staff", "victualling crew")),
  gender = factor("male", levels = c("female", "male")),
  age = 47, sibsp = 0, parch = 0, fare = 25,
  embarked = factor("Cherbourg", levels = c("Belfast", "Cherbourg", 
                                            "Queenstown","Southampton")))


View(titanic)


titanic$survived == "yes"

titanic_lmr_exp <- explain(
  model = titanic_lmr, data = titanic[, -9],
  y = titanic$survived == "yes", label = "Logistic Regression",
  type = "classification")

titanic_rf_exp <- explain(
  model = titanic_rf, data = titanic[, -9],
  y = titanic$survived == "yes", label = "Random Forest",
  type = "classification")

titanic_svm_exp <- explain(
  model = titanic_svm, data = titanic[, -9],
  y = titanic$survived == "yes", label = "Support Vector Machine",
  type = "classification")

apartments_lm <- lm(m2.price ~ ., data = apartments)
library("randomForest")
set.seed(123)
apartments_rf <- randomForest(m2.price ~ ., data = apartments)
library("e1071")
apartments_svm <- svm(m2.price ~ construction.year + surface + floor + 
                        no.rooms + district, data = apartments)


apartments_lm_exp <- explain(
  model = apartments_lm, data = apartments_test[, -1], 
  y = apartments_test$m2.price, label = "Linear Regression",
  type = "regression")

apartments_rf_exp <- explain(
  model = apartments_rf, data = apartments_test[, -1], 
  y = apartments_test$m2.price, label = "Random Forest",
  type = "regression")

apartments_svm_exp <- explain(
  model = apartments_svm, data = apartments_test[, -1], 
  y = apartments_test$m2.price, label = "Support Vector Machine",
  type = "regression")



# to explain Random Forest's prediction for johnny
titanic_rf_exp_bd <- predict_parts(
  titanic_rf_exp, new_observation = johnny, 
  type = "break_down")
# to explain Random Forest'ss prediction for the first test apartment
new_apt = apartments_test[1, -1] 
apartments_rf_exp_bd <- predict_parts(
  apartments_rf_exp, new_observation = new_apt, 
  type = "break_down")


# to explain Random Forest's prediction for johnny
titanic_svm_exp_bd <- predict_parts(
  titanic_svm_exp, new_observation = johnny, 
  type = "break_down")
# to explain Random Forest'ss prediction for the first test apartment
new_apt = apartments_test[1, -1] 
apartments_svm_exp_bd <- predict_parts(
  apartments_svm_exp, new_observation = new_apt, 
  type = "break_down")


plot(titanic_rf_exp_bd) + ggtitle("Break-down plot for Johnny")
plot(titanic_svm_exp_bd) + ggtitle("Break-down plot for Johnny")



titanic_rf_exp_bdi <- predict_parts(
  titanic_rf_exp, new_observation = johnny, 
  type = "break_down_interactions")
apartments_rf_exp_bdi <- predict_parts(
  apartments_rf_exp, new_observation = new_apt, 
  type = "break_down_interactions")


titanic_svm_exp_bdi <- predict_parts(
  titanic_svm_exp, new_observation = johnny, 
  type = "break_down_interactions")
apartments_svm_exp_bdi <- predict_parts(
  apartments_svm_exp, new_observation = new_apt, 
  type = "break_down_interactions")


system.time({
  titanic_svm_exp_shap <- predict_parts(
    explainer = titanic_svm_exp, new_observation = johnny, 
    type = "shap", B = 25)
  apartments_svm_exp_shap <- predict_parts(
    explainer = apartments_svm_exp, new_observation = new_apt, 
    type = "shap", B = 25)
})



rnorm(1, mean=0, sd = 1)


# use predict_profile(), not predict_parts()
titanic_rf_exp_cp <- predict_profile(
  explainer = titanic_rf_exp, new_observation = johnny)
apartments_rf_exp_cp <- predict_profile(
  explainer = apartments_rf_exp, new_observation = new_apt)