# Importing dependencies
from feast import FeatureStore
from feast.infra.offline_stores.file_source import SavedDatasetFileStorage
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from datetime import datetime
from git import Repo
import pandas as pd
import os

# Instantiating the API
app = FastAPI()

# Defining allowed origins for CORS
origins = ["http://localhost:3000", "http://localhost:5000", "http://127.0.0.1:3000", "http://127.0.0.1:5000"]

# Adding CORS policy to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


### DATA MODELS FOR REQUEST BODIES ###

# Data model for cloning feature repositories from GitHub
class GitRepo(BaseModel):
    repo_url: str
    to_path: str


# Data model for creating entity DataFrames
class EntityDF(BaseModel):
    entity_keys: list[int]
    entity_name: str
    timestamps: list[str]
    frequency: str


# Data model for saving datasets
class SaveDatasetInfo(BaseModel):
    dataset_name: str
    feature_view_names: list[str]


### API ENDPOINTS ###

# Endpoint for cloning the GitHub repo with a feature repository
@app.post("/clone_repo")
def clone_repo(repo_params: GitRepo):
    # Cloning the repo to a target path if it doesn't exist already
    if not os.path.exists(path="api/git_repos/" + repo_params.to_path):
        Repo.clone_from(
            url=repo_params.repo_url, to_path="api/git_repos/" + repo_params.to_path
        )

    # Saving the target path for later use
    app.target_path = repo_params.to_path


# Endpoint for getting the cloned feature store
@app.post("/get_store")
def get_store(path: str):
    # Getting the feature store
    app.store = FeatureStore(
        repo_path=os.path.join(os.getcwd(), "api", "git_repos", app.target_path, path)
    )

    # Saving the repo path for later use
    app.repo_path = path

    # Changing the working directory to the path of the feature store
    os.chdir(f"api/git_repos/{app.target_path}/{path}")

    # Updating feature store definitions
    # to update paths to data sources
    os.system("feast teardown")
    os.system("feast apply")

    # Going back to the original directory
    os.chdir("../../../..")


# Endpoint for getting feature views
@app.get("/get_feature_views")
def get_feature_views():
    # Getting feature views
    feature_views = app.store.list_feature_views()

    # Initializing a list for feature view names
    feature_view_names = []

    # Iterating over the feature views
    for feature_view in feature_views:
        # Adding each feature view name
        # to the list we created earlier
        feature_view_names.append(feature_view.name)

    # Returning the feature view names
    return {"feature_view_names": feature_view_names}


# Endpoint for getting feature names
@app.get("/get_feature_names")
def get_feature_names(feature_view_name: str):
    # Initializing a list for feature names
    feature_names = []

    # Iterating over the features under the given feature view
    # and appending their names to our list
    for feature in app.store.get_feature_view(name=feature_view_name).features:
        feature_names.append(feature.name)

    # Returning the features
    return {"feature_names": feature_names}


# Endpoint for getting entities
@app.get("/get_entities")
def get_entities():
    # Fetching entities
    entities = app.store.list_entities()

    # Initializing lists for entity names and descriptions
    entity_names = []
    entity_descriptions = []

    # Iterating over entities
    for entity in entities:
        # Appending entity names and descriptions
        # to the lists created earlier
        entity_names.append(entity.name)
        entity_descriptions.append(entity.description)

    # Returning entity names and their descriptions
    return {"entity_names": entity_names, "entity_descriptions": entity_descriptions}


# Endpoint for registering entity DataFrames
@app.post("/register_entity_df")
def register_entity_df(entity_df_params: EntityDF):
    # Generating timestamps based on provided params
    # and converting them to a DataFrame
    timestamps = pd.date_range(
        start=entity_df_params.timestamps[0],
        end=entity_df_params.timestamps[1],
        freq=entity_df_params.frequency,
    ).to_frame(index=False, name="event_timestamp")

    # Creating a DataFrame with entity keys
    entity_ids = pd.DataFrame(
        data=entity_df_params.entity_keys, columns=[entity_df_params.entity_name]
    )

    # Merging the timestamps and entity key DataFrame
    entity_df = timestamps.merge(right=entity_ids, how="cross")

    # Saving the entity DataFrame to the app
    app.entity_df = entity_df


# ADD HTTPTOOLS, WEBSOCKETS

# Endpoint for saving datasets
@app.post("/save_dataset")
def save_dataset(dataset_info: SaveDatasetInfo):
    # Initializing a list for feature names to retrieve
    features_to_get = []

    # Iterating over requested feature view names
    # and generating feature names in
    # the feature_view_name:feature_name format
    for feature_view in dataset_info.feature_view_names:
        for feature in app.store.get_feature_view(name=feature_view).features:
            features_to_get.append(feature_view + ":" + feature.name)

    # Retrieving requested features from the feature store
    job = app.store.get_historical_features(
        entity_df=app.entity_df, features=features_to_get
    )

    storage_path = os.path.join(
        os.getcwd(),
        "api",
        "git_repos",
        app.target_path,
        app.repo_path,
        "data",
        f"{dataset_info.dataset_name}.parquet",
    )

    # Storing the dataset locally on the server
    app.store.create_saved_dataset(
        from_=job,
        name=dataset_info.dataset_name,
        storage=SavedDatasetFileStorage(storage_path),
    )


# Endpoint for materialization
@app.post("/materialize")
def materialize(start_date: str, end_date: str):
    # Converting string dates to datetimes
    end_date = datetime.strptime(end_date, "%Y-%m-%d")

    start_date = datetime.strptime(start_date, "%Y-%m-%d")

    # Materializing features between given dates
    app.store.materialize(end_date=end_date, start_date=start_date)


# Endpoint for incremental materializatioon
@app.post("/materialize_incremental")
def materialize_incremental(end_date: str):
    # Converting string date to datetime
    end_date = datetime.strptime(end_date, "%Y-%m-%d")

    # Incrementally materializing features up to end date
    app.store.materialize_incremental(end_date=end_date)


# Launching the API
if __name__ == "__main__":
    uvicorn.run(app="api:app", port=5000, reload=False)
