
library(keras)
library(tidyverse)
mnist <- keras::dataset_mnist()
str(mnist)


x <- array(rep(0,2*3*2), dim=c(2,3,2))
dim(x)


x_train <- mnist$train$x
y_train <- mnist$train$y
x_test <- mnist$test$x
y_test <- mnist$test$y


dim(x_train)


dim(x_train)
length(dim(x_train))
typeof(x_train)

## The x data is a 3-d array (images,width,height) of of grayscale values 
# View(mnist$train$x[1,,]) # Let's look at the first training example
c(c(x_train, y_train), c(x_test, y_test)) %<-% mnist
str(x_train)

## Reshape x from 3d to 2d (by default, row-major)
x_train <- array_reshape(x_train, c(nrow(x_train), 784))
x_test <- array_reshape(x_test, c(nrow(x_test), 784))
str(x_train) # View(x_train[1,])





digit <- x_train[2,,]
plot(as.raster(digit, max = 255))

x_train[1,]


x_train <- x_train / 255
x_test <- x_test / 255

x_train[1,]


str(y_train) 


## Deep learning models prefer binary values rather than integers
y_train <- to_categorical(y_train, 10)
y_test <- to_categorical(y_test, 10)
str(y_train) # View(y_train)



## Sequential model is simply a linear stack of layers
model <- keras_model_sequential() 
## Define the structure of the neural net
model |> # A dense layer is a fully connected layer
  layer_dense(units = 256, activation = 'relu', input_shape = c(784)) |> 
  layer_dropout(rate = 0.4) |> # randomly set 40% of weights to 0
  layer_dense(units = 128, activation = 'relu') |> 
  layer_dropout(rate = 0.3) |> # this helps prevent overfitting
  layer_dense(units = 64, activation = 'relu') |> 
  layer_dropout(rate = 0.2) |> # this helps prevent overfitting
  layer_dense(units = 10, activation = 'softmax') # probability of each class
summary(model)

## Compile the model with appropriate loss function, optimizer, and metrics
model |> compile(
  optimizer = "adam",                   # see next slide
  loss = "categorical_crossentropy",    # since we have 10 categoreis
  metrics = c("accuracy")               # for classification
)

## Use x_train and y_train for training
history <- model |> fit(
  x_train, y_train, 
  batch_size = 64,      # a set of 128 samples
  epochs = 10,           # let's go through x_train 20 times
  validation_split = 0.2 # use the last 20% of train data for validation
)
plot(history)

## Use x_test and y_test for evaluation
model |> evaluate(x_test, y_test)
str(y_test)
