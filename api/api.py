# Importing dependencies
import aiofiles
from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import aiofiles
import tensorflow as tf
import art
from art.attacks.evasion import FastGradientMethod
from art.attacks.extraction import CopycatCNN
from art.estimators.classification import TensorFlowV2Classifier
import uvicorn
import util_functions

# Data model for backdoor attacks
class BackdoorArgs(BaseModel):
    percent_poison: float
    target_labels: str

# Data model for copycat CNN
class CopycatCNNArgs(BaseModel):
    batch_size_fit: int
    batch_size_query: int
    nb_epochs: int
    nb_stolen: int

# Data model for the Fast Gradient Method
class FGMArgs(BaseModel):    
    eps: float
    eps_step: float
    batch_size: int

# Loading data
(train_images, train_labels), (test_images, test_labels), min, max = art.utils.load_dataset(name="mnist")

# Initializing app
app = FastAPI()

# Defining allowed origins
origins = [
    "http://localhost:3000", 
    "http://localhost:5000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000"
]

# Creating dictionary to store uploaded models
app.classifiers = {}

# Defining CORS policy
app.add_middleware(
    middleware_class=CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"])

# Endpoint for uploading the model to test
@app.post("/upload-model")
async def upload_model(
    model: UploadFile,
    filename: str = Form(...)    
    ):
    # Saving the received model to the web server
    async with aiofiles.open("api/" + filename + ".h5", "wb") as out_file:
        # Reading the received files as bytes
        model_file = await model.read()

        # Writing the bytes to the web server
        await out_file.write(model_file)
    
    # Loading the model from the saved file
    model = tf.keras.models.load_model(
        filepath="api/" + filename +".h5", 
        custom_objects={"ReverseSigmoidLayer": util_functions.ReverseSigmoidLayer})

    # Compiling the model
    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )

    # Wrapping our model in KerasClassifier
    app.classifiers[filename] = TensorFlowV2Classifier(
        model=model,
        nb_classes=10,
        input_shape=(28, 28, 1),
        loss_object=util_functions.loss,
        train_step=util_functions.train_step
        )

# Endpoint for testing performance against the Fast Gradient Method
@app.post("/run-fgm")
def test_fgm(fgm_args: FGMArgs):
    # Initializing the attack
    attack = FastGradientMethod(
        estimator=app.classifiers["vuln_model"], 
        eps=fgm_args.eps,
        eps_step=fgm_args.eps_step,
        batch_size=fgm_args.batch_size
        )

    # Generating adversarial samples
    adversarial_images = attack.generate(x=test_images)

    # Evaluating performance on clean and adversarial samples
    score_clean = app.classifiers["tested_model"]._model.evaluate(x=test_images, y=test_labels)
    score_adv = app.classifiers["tested_model"]._model.evaluate(x=adversarial_images, y=test_labels)

    # Returning results
    return {
        "clean_loss": round(score_clean[0], 3), 
        "clean_acc": round(score_clean[1], 3), 
        "score_adv_loss": round(score_adv[0], 3), 
        "score_adv_acc": round(score_adv[1], 3)
        }

# Endpoint for testing performance against PoisoningBackdoorAttack
@app.post("/run-backdoor")
def test_backdoor(backdoor_args: BackdoorArgs):
    # Breaking the single string with labels into an array of string labels
    str_target_labels = backdoor_args.target_labels.split(",")

    # Iterating over the string labels,
    # converting them to integers,
    # and 
    num_target_labels = []
    for string_label in str_target_labels:
        num_target_labels.append(int(string_label))

    # Poisoning dataset
    pimages, plabels, original_labels = util_functions.poison_dataset(
        test_images, 
        test_labels,
        num_target_labels,
        backdoor_args.percent_poison
        )

    # Evaluating the model's performance on poisoned images with respect to poisoned labels
    poisoned_score = app.classifiers["tested_model"]._model.evaluate(pimages, plabels)

    # Evaluating the model's performance on poisoned images with respect to clean labels
    clean_score = app.classifiers["tested_model"]._model.evaluate(pimages, original_labels)

    # Returning results
    return {
        "pscore_loss": round(poisoned_score[0], 3), 
        "pscore_acc": round(poisoned_score[1], 3), 
        "clean_loss": round(clean_score[0], 3),
        "clean_acc": round(clean_score[1], 3)
         }
    
# Endpoint for testing performance against theft by CopycatCNN
@app.post("/run-copycatcnn")
def test_copycat_cnn(copycatcnn_args: CopycatCNNArgs):    
    # Initializing the attack
    attack = CopycatCNN(
        app.classifiers["tested_model"],
        copycatcnn_args.batch_size_fit,
        copycatcnn_args.batch_size_query,
        copycatcnn_args.nb_epochs,
        copycatcnn_args.nb_stolen,
        use_probability=True        
    )

    # Initializing the base model for CopycatCNN to train
    model_stolen = TensorFlowV2Classifier(model=util_functions.create_model(),
        nb_classes=10,
        input_shape=(28, 28, 1),
        loss_object=util_functions.loss,
        train_step=util_functions.train_step
        )

    # Extracting the victim classifier
    classifier_stolen = attack.extract(
        x=train_images[50000:],
        y=train_labels[50000:],
        thieved_classifier=model_stolen
    )

    # Evaluating the performance of the original model and the stolen model
    score_victim = app.classifiers["tested_model"]._model.evaluate(x=test_images, y=test_labels)
    score_stolen = classifier_stolen._model.evaluate(x=test_images, y=test_labels)

    # Returning results
    return {
        "victim_loss": round(score_victim[0], 3), 
        "victim_acc": round(score_victim[1], 3), 
        "copycat_loss": round(score_stolen[0], 3), 
        "copycat_acc": round(score_stolen[1], 3)
        }

@app.post("/test_miface")
def test_miface():
    pass

# Launching the API
if __name__ == "__main__":
    uvicorn.run(
        app="api:app", 
        port=5000, 
        reload=True
        )