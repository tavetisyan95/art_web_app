# Importing dependencies
import tensorflow as tf
from tensorflow.keras.layers import Conv2D, MaxPool2D, Dense, Flatten, Layer
import numpy as np
from art.attacks.poisoning import PoisoningAttackBackdoor
from art.attacks.poisoning.perturbations import add_pattern_bd
from art.utils import to_categorical

# Initializing loss and optimizer objects
# for ART's TensorFlowV2Classifier wrapper class
loss = tf.keras.losses.CategoricalCrossentropy()
optimizer = tf.keras.optimizers.Adam()

# Defining a training step for TensorFlowV2Classifier
def train_step(
    model, 
    inputs, 
    targets
    ):
    # Record the forward pass
    # and loss calculations in our model
    with tf.GradientTape() as tape:
        preds = model(inputs=inputs, training=True)
        loss_value = loss(y_true=targets, y_pred=preds)

    # Compute gradients with respect to the model's weights
    grads = tape.gradient(
        target=loss_value, 
        sources=model.trainable_variables)

    # Apply gradients to the model's weights
    optimizer.apply_gradients(grads_and_vars=zip(grads, model.trainable_variables))

# Function for creating model
def create_model():
    # Defining the model
    model = tf.keras.models.Sequential([
        Conv2D(filters=32, kernel_size=3, activation="relu", input_shape=(28, 28, 1)),
        Conv2D(filters=64, kernel_size=3, activation="relu"),
        MaxPool2D(pool_size=2),        
        Flatten(),
        Dense(units=128, activation="relu"),
        Dense(units=10, activation="softmax")
    ])

    # Compiling the model
    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"]
        )   

    # Returning the model
    return model

# Function for poisoning a dataset
def poison_dataset(
    clean_images, 
    clean_labels, 
    target_labels, 
    percent_poison
    ):
    # Creating copies of our clean images and labels
    # Poisoned samples will be added to these copies
    x_poison = clean_images.copy()
    y_poison = clean_labels.copy()

    # Creating a separate copy of the clean labels so that we
    # can return not only the poisoned but also original labels
    y_clean = clean_labels.copy()

    # Indicating our source labels (as integers)
    source_labels = np.arange(10)

    # Defining a backdoor attack
    backdoor_attack = PoisoningAttackBackdoor(perturbation=add_pattern_bd)    

    # Iterating over our source labels and provided target labels
    for (source_label, target_label) in (zip(source_labels, target_labels)):
        # Calculating the number of clean labels that are equal to the
        # current source label
        num_labels = np.size(np.where(np.argmax(a=clean_labels, axis=1) == source_label))                

        # Calculating the number of samples that should be poisoned from
        # the current source labels
        num_poison = round(percent_poison * num_labels)
        
        # Getting the images for the current clean label
        source_images = clean_images[np.argmax(a=clean_labels, axis=1) == source_label]

        # Getting all the labels that are equal to the current clean label
        # these labels correspond to the poisoned images and are needed
        # so that we can evaluate model performance on poisoned samples
        # with respect to clean labels
        original_labels = clean_labels[np.argmax(a=clean_labels, axis=1) == source_label]

        # Randomly picking indices to poison
        indices_to_be_poisoned = np.random.choice(
            a=num_labels, 
            size=num_poison
            )        

        # Get the images for the current label that should be poisoned
        images_to_be_poisoned = source_images[indices_to_be_poisoned].copy()
        labels_to_be_poisoned = original_labels[indices_to_be_poisoned].copy()        

        # Converting the target label to a categorical
        target_label = to_categorical(labels=(np.ones(shape=num_poison) * target_label), nb_classes=10)

        # Poisoning the images and labels for the current label
        poisoned_images, poisoned_labels = backdoor_attack.poison(
            x=images_to_be_poisoned, 
            y=target_label
            )

        # Appending the poisoned images to our clean images
        x_poison = np.append(
            arr=x_poison, 
            values=poisoned_images, 
            axis=0
            )

        # Appending the poisoned labels to our clean labels
        y_poison = np.append(
            arr=y_poison, 
            values=poisoned_labels, 
            axis=0
            )

        # Appending the unaltered clean labels to our clean labels
        y_clean = np.append(
            arr=y_clean,
            values=labels_to_be_poisoned,
            axis=0
        )        
    
    # Returning the poisoned samples and the poison indicator array
    return x_poison, y_poison, y_clean


# Custom TF Keras class that implements ART's Reverse Sigmoid postprocessing defense
class ReverseSigmoidLayer(Layer):
    # Layer constructor   
    def __init__(self, beta, gamma, **kwargs):
        super(ReverseSigmoidLayer, self).__init__(**kwargs)
        self.beta = beta
        self.gamma = gamma

    # Method that defines the forward pass of the layer
    def call(self, preds, training=None):
        # Returning unprocessed inputs when training
        if training:
            return preds
        
        # Computing reverse sigmoid when not training
        clip_min = 1e-9
        clip_max = 1.0 - clip_min
        
        preds_clipped = tf.clip_by_value(t=preds, clip_value_min=clip_min, clip_value_max=clip_max)

        if preds.shape[1] > 1:
            perturbation_r = self.beta * (
                self.sigmoid(z=(-self.gamma * tf.math.log(x=((1.0 - preds_clipped) / preds_clipped)))) - 0.5
                )
            preds_perturbed = preds - perturbation_r
            preds_perturbed = tf.clip_by_value(t=preds_perturbed, clip_value_min=0.0, clip_value_max=1.0)
            alpha = 1.0 / tf.math.reduce_sum(input_tensor=preds_perturbed, axis=-1, keepdims=True)
            reverse_sigmoid = alpha * preds_perturbed
        else:
            preds_1 = preds
            preds_2 = 1.0 - preds
            
            preds_clipped_1 = preds_clipped
            preds_clipped_2 = 1.0 - preds_clipped

            perturbation_r_1 = self.beta * (
                self.sigmoid(z=(-self.gamma * tf.math.log(x=((1.0 - preds_clipped_1) / preds_clipped_1)))) - 0.5
            )

            perturbation_r_2 = self.beta * (
                self.sigmoid(z=(-self.gamma * tf.math.log(x=((1.0 - preds_clipped_2) / preds_clipped_2)))) - 0.5
            )

            preds_perturbed_1 = preds_1 - perturbation_r_1
            preds_perturbed_2 = preds_2 - perturbation_r_2

            preds_perturbed_1 = tf.clip_by_value(t=preds_perturbed_1, clip_value_min=0.0, clip_value_max=1.0)
            preds_perturbed_2 = tf.clip_by_value(t=preds_perturbed_2, clip_value_min=0.0, clip_value_max=1.0)

            alpha = 1.0 / (preds_perturbed_1 + preds_perturbed_2)
            reverse_sigmoid = alpha * preds_perturbed_1

        return reverse_sigmoid
        
    # Method for getting layer config when saving model
    def get_config(self):
        config = super().get_config()
        config.update({
            "beta": self.beta,
            "gamma": self.gamma,
        })
        return config          

    # Method to compute standard sigmoid
    def sigmoid(self, z):
        return 1.0 / (1.0 + tf.math.exp(x=-z))