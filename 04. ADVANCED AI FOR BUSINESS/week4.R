library(tidyverse)
application_train <- read_csv("data/loan/application_train.csv",
                              na = c("", NA, "-1"))
application_test <- read_csv("data/loan/application_test.csv",
                             na = c("", NA, "-1"))
View(application_train)
View(application_test)


glimpse(application_train)
unique(application_train$FLAG_OWN_CAR )

# Training data: Separate into x and y tibbles
x_train_tbl <- application_train |> select(-TARGET)
y_train_tbl <- application_train |> select(TARGET)   
# Testing data
x_test_tbl  <- application_test
# Remove the original data to save memory
rm(application_train)
rm(application_test)

#install.packages("skimr")
library(skimr)
x_train_tbl_skim = partition(skim(x_train_tbl))
names(x_train_tbl_skim)

string_2_factor_names <- x_train_tbl_skim$character$skim_variable
string_2_factor_names
#install.packages("recipes")
library(recipes)
rec_obj <- recipe(~ ., data = x_train_tbl) |>
  step_string2factor(all_of(string_2_factor_names)) |>
  step_impute_median(all_numeric()) |> # missing values in numeric columns
  step_impute_mode(all_nominal()) |> # missing values in factor columns
  prep()
rec_obj



x_train_processed_tbl --> x_train_tbl |> 
  change chr to fct

x_train_processed_tbl <- x_train_processed_tbl |> 
  imput mean to numeric columns

x_train_processed_tbl <- x_train_processed_tbl |> 
  imput mode to factor columns



x_test_processed_tbl --> x_test_tbl |> 
  change chr to fct

x_test_processed_tbl <- x_test_processed_tbl |> 
  imput mean to numeric columns




x_test_processed_tbl <- x_test_processed_tbl |> 
  imput mode to factor columns


y_train_tbl

rec_obj_for_y <- recipe(~ ., data = y_train_tbl) |>
  step_num2factor("TARGET", levels = c("0","1"),
                  transform = function(x) x + 1) |>
  prep(stringsAsFactors = FALSE)
y_train_processed_tbl  <- bake(rec_obj_for_y, y_train_tbl)


y_train_processed_tbl <- read_rds("data/loan/y_train_processed_tbl.rds")
x_train_processed_tbl <- read_rds("data/loan/x_train_processed_tbl.rds")
x_test_processed_tbl <- read_rds("data/loan/x_test_processed_tbl.rds")

library(h2o)
h2o.init(nthreads = -1) #-1 to use all cores
# push data into h2o; NOTE: THIS MAY TAKE A WHILE!
data_h2o <- as.h2o(
  bind_cols(y_train_processed_tbl, x_train_processed_tbl),
  destination_frame= "train.hex"  #destination_frame is optional
)
new_data_h2o <- as.h2o(
  x_test_processed_tbl,
  destination_frame= "test.hex"  #destination_frame is optional
)
# what if you do not assign destination_frame
data_h2o_no_destination <- as.h2o(
  bind_cols(y_train_processed_tbl, x_train_processed_tbl)
)


# Partition the data into training, validation and test sets
splits <- h2o.splitFrame(data = data_h2o, seed = 1234, 
                         ratios = c(0.7, 0.15)) # 70/15/15 split
train_frame <- splits[[1]] # from training data
valid_frame <- splits[[2]] # from training data
test_frame  <- splits[[3]] # from training data




y <- "TARGET" # column name for outcome
x <- setdiff(names(train_frame), y) # column names for predictors
m1 <- h2o.deeplearning(
  model_id = "dl_model_first",
  x = x,
  y = y,
  training_frame = train_frame, 
  validation_frame = valid_frame, ## validation dataset: used for scoring and
  ## early stopping
  #activation="Rectifier",      ## default
  #hidden=c(200,200),           ## default: 2 hidden layers, 200 neurons each
  epochs = 1                    ## one pass over the training data
)



h2o.saveModel(object = m1,     # the model you want to save
              path = getwd(),  # the folder to save
              force = TRUE) 



m3 <- h2o.deeplearning(
  model_id="dl_model_tuned", 
  x = x,
  y = y,
  training_frame = train_frame, 
  validation_frame = valid_frame,
  overwrite_with_best_model = F,    ## Return the final model after 10 epochs, 
  ## even if not the best
  hidden = c(128,128,128),          ## more hidden layers -> more complex interactions
  epochs = 10,                      ## to keep it short enough
  score_validation_samples = 10000, ## downsample validation set for faster scoring
  score_duty_cycle = 0.025,         ## don't score more than 2.5% of the wall time
  adaptive_rate = F,                ## manually tuned learning rate
  rate = 0.01, 
  rate_annealing = 2e-6,            
  momentum_start = 0.2,             ## manually tuned momentum
  momentum_stable = 0.4, 
  momentum_ramp = 1e7, 
  l1 = 1e-5,                        ## add some L1/L2 regularization
  l2 = 1e-5,
  max_w2 = 10                       ## helps stability for Rectifier
)


list$something




m4 = h2o.gbm(
  model_id = "my_gbm",
  training_frame = train_frame,  
  validation_frame = valid_frame,
  x=x,                        
  y=y,  
  
  ntrees = 20,                ## decrease the trees, mostly to allow for run time
  learn_rate = 0.2,           ## increase the learning rate (from 0.1)
  max_depth = 10
)



m4



hyper_params <- list(
  ntrees = 10*c(1:10),
  max_depth = 5:10
)

# there could be multiple stopping criteria
# so we use a list to put all of them together
search_criteria = list( 
  strategy = "RandomDiscrete", 
  seed=1234567, 
  stopping_metric = "auto", # logloss for classification 
  stopping_rounds=5,        # stop when the last 5 models
  stopping_tolerance=0.01,  # improve less than 1%
  max_runtime_secs = 120,   # stop when the search took more than 360 seconds
  max_models = 100          # stop when the search tried over 100 models
)

grid <- h2o.grid(
  algorithm = "gbm",
  grid_id = "dl_grid_random_gbm",
  x = x,
  y = y,
  training_frame = train_frame, 
  validation_frame = valid_frame,

  hyper_params = hyper_params,
  search_criteria = search_criteria
)

automl_models_h2o <- h2o.automl(
  x = x,
  y = y,
  training_frame    = train_frame,
  validation_frame  = valid_frame,
  leaderboard_frame = test_frame,
  max_runtime_secs  = 300  # suppose we only have 5 minutes,
  # which is too short for real-world projects
)

automl_models_h2o

h2o.shutdown(prompt = F)