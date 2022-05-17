import {config} from "./config.js";
import axios from "axios";

export const events = {
	// Function for cloning feature stores from their GitHub repos	
	uploadModel: function(){
		var model = document.getElementById("model").files[0];

		var uploadButton = document.getElementById("upload_model_button");
		var responseArea = document.getElementById("upload_model_response_area");

		uploadButton.style.visibility = "hidden";
		responseArea.innerText = "Uploading model...";

		var formData = new FormData();
		formData.append("weights", model);

		axios({
			method: "post",
			url: "http://localhost:5000/upload-model",
			data: formData,
			headers: {
				Accept: "application/json",
				"Content-Type": "multipart/form-data"
			}
		})
		.then(() => {
			uploadButton.style.visibility = "visible";

			responseArea.innerText = "Model loaded!"
		})
		.catch((error) => {
			uploadButton.style.visibility = "visible";
			responseArea.innerText = "Something went wrong!";
			console.error("Error: ", error);
		})

	},
	uploadVulnerableModel: function(){
		var model = document.getElementById("vulnerable_model").files[0];

		var uploadButton = document.getElementById("upload_vuln_model_button");
		var responseArea = document.getElementById("upload_vuln_model_response_area");

		uploadButton.style.visibility = "hidden";
		responseArea.innerText = "Uploading model...";

		var formData = new FormData();
		formData.append("weights", model);

		axios({
			method: "post",
			url: "http://localhost:5000/upload-model-vulnerable",
			data: formData,
			headers: {
				Accept: "application/json",
				"Content-Type": "multipart/form-data"
			}
		})
		.then(() => {
			uploadButton.style.visibility = "visible";

			responseArea.innerText = "Model loaded!"
		})
		.catch((error) => {
			uploadButton.style.visibility = "visible";
			responseArea.innerText = "Something went wrong!";
			console.error("Error: ", error);
		})

	},
	runFGM: function(){
		var eps = document.getElementById("eps").value;
		var epsStep = document.getElementById("eps_step").value;
		var batchSize = document.getElementById("batch_size_fgm").value;

		var attackButton = document.getElementById("attack_fgm_button");
		var responseArea = document.getElementById("fgm_response_area");

		attackButton.style.visibility = "hidden";
		responseArea.innerText = "Running attack...";
		
		axios({
			method: "post",
			url: "http://localhost:5000/test-fgm",
			data: {
				eps: eps,
				eps_step: epsStep,
				batch_size: batchSize
			},
			headers: {"Content-Type": "application/json"}
		})
		.then(function(response) {
			attackButton.style.visibility = "visible";
			responseArea.innerText = "Attack complete!\n\n";				

			responseArea.innerText += "--- METRICS ON CLEAN DATA ---\n\n"

			responseArea.innerText += "Loss: " + response.data.clean_loss + "\n";
			responseArea.innerText += "Accuracy: " + response.data.clean_acc + "\n\n";

			responseArea.innerText += "--- METRICS ON ADVERSARIAL DATA ---\n\n"

			responseArea.innerText += "Loss: " + response.data.score_adv_loss + "\n";
			responseArea.innerText += "Accuracy: " + response.data.score_adv_acc;
		})
		.catch(function (error){
			attackButton.style.visibility = "visible";
			responseArea.innerText = "Something went wrong!";			
			console.log(error.response);
		})

	},
	runPoison: function(){
		var percentPoison = document.getElementById("percent_poison").value;
		var targetLabels = document.getElementById("target_labels").value;

		console.log([targetLabels]);

		var attackButton = document.getElementById("attack_poison_button");
		var responseArea = document.getElementById("poison_response_area");

		attackButton.style.visibility = "hidden";
		responseArea.innerText = "Running attack...";

		axios({
			method: "post",
			url: "http://localhost:5000/test-backdoor",
			data: {
				percent_poison: percentPoison,
				target_labels: targetLabels
			},
			headers: {"Content-Type": "application/json"}
		})
		.then(function(response) {
			attackButton.style.visibility = "visible";
			responseArea.innerText = "Attack complete!\n\n\n";				
			
			responseArea.innerText += "--- METRICS WITH RESPECT TO POISONED LABELS ---\n\n"

			responseArea.innerText += "Loss: " + response.data.pscore_loss + "\n";
			responseArea.innerText += "Accuracy: " + response.data.pscore_acc + "\n\n";

			responseArea.innerText += "--- METRICS WITH RESPECT TO CLEAN LABELS ---\n\n"

			responseArea.innerText += "Loss: " + response.data.clean_loss + "\n";
			responseArea.innerText += "Accuracy: " + response.data.clean_acc;
		})
		.catch(function (error){
			attackButton.style.visibility = "visible";
			responseArea.innerText = "Something went wrong.";
			console.log(error.response);
		})
	},
	runSteal: function(){
		var batchSizeFit = document.getElementById("batch_size_fit").value;
		var batchSizeQuery = document.getElementById("batch_size_query").value;
		var nbEpochs = document.getElementById("nb_epochs").value;
		var nbStolen = document.getElementById("nb_stolen").value;

		var attackButton = document.getElementById("attack_steal_button");
		var responseArea = document.getElementById("steal_response_area");

		attackButton.style.visibility = "hidden";
		responseArea.innerText = "Running attack...";

		axios({
			method: "post",
			url: "http://localhost:5000/test-copycatcnn",
			data: {
				batch_size_fit: batchSizeFit,
				batch_size_query: batchSizeQuery,
				nb_epochs: nbEpochs,
				nb_stolen: nbStolen
			},
			headers: {"Content-Type": "application/json"}
		})
		.then(function(response){
			attackButton.style.visibility = "visible";
			responseArea.innerText = "Attack complete!\n\n\n";				

			responseArea.innerText += "--- METRICS OF THE VICTIM MODEL ---\n\n"

			responseArea.innerText += "Loss: " + response.data.victim_loss + "\n";
			responseArea.innerText += "Accuracy: " + response.data.victim_acc + "\n\n";

			responseArea.innerText += "--- METRICS OF THE STOLEN MODEL ---\n\n"

			responseArea.innerText += "Loss: " + response.data.copycat_loss + "\n";
			responseArea.innerText += "Acc: " + response.data.copycat_acc;
		})
		.catch(function (error) {
			attackButton.style.visibility = "visible";
			responseArea.innerText = "Something went wrong.";
			console.log(error.response);
		})
	},
	getRepo: function(){
		// Getting necessary values
		var gitRepoUrl = document.getElementById("git_repo_url").value;
		var targetPath = document.getElementById("target_path").value;
		var repoReponseArea = document.getElementById("repo_response_area");	
		
		// Updating the status message in the response field
		repoReponseArea.innerText = "Getting repo...";

		// Making a request body
		var body = {repo_url: gitRepoUrl,
				   to_path: targetPath}

		// Sending an HTTP request to clone the specified GitHub repo
		axios({
			method: "post",
			url: "http://" + config.api_url + ":" + config.api_port + config.clone_repo_endpoint,
			data: body,
			headers: {"Content-Type": "application/json"}
		})
		.then(function(){	
			// Displaying a success message	
			repoReponseArea.innerText = "Repo cloned!";	
		})
		.catch(function (error) {
			// Logging errors, if any
			console.log(error.response);
			repoReponseArea.innerText = "Something went wrong. Check API logs.";
		}) 
	},
	// Function for getting the feature store dir from the cloned repo
	getStore: function(){
		// Getting necessary values
		var storePath = document.getElementById("store_path").value;
		var storeResponseArea = document.getElementById("store_response_area");

		// Updating the status message in the response field
		storeResponseArea.innerText = "Getting feature store...";

		// Sending an HTTP request to retrieve the feature store
		axios({
			method: "post",
			url: "http://" + config.api_url + ":" + config.api_port + config.get_store_endpoint,
			params: {path: storePath},
			headers: {"Content-Type": "application/json"}
		})
		.then(function(){
			// Displaying a success message
			storeResponseArea.innerText = "Store received!";
		})
		.catch(function(error) {
			// Logging errors, if any
			console.log(error.response);
			storeResponseArea.innerText = "Something went wrong. Check API logs.";
		})
	},
	// Function for getting entities from the feature store
	getEntityList: function(){
		// Getting necessary values
		var entityListResponseArea = document.getElementById("entities_area");
		var entityResponseArea = document.getElementById("entity_response_area");

		// Updating the status message in the response field
		entityResponseArea.innerText = "Getting entities...";

		// Sending an HTTP request to get entities
		axios({
			method: "get",
			url: "http://" + config.api_url + ":" + config.api_port + config.get_entities_endpoint,
			headers: {"Content-Type": "application/json"}
		})
		.then(function(response){
			// Displaying a success message
			entityResponseArea.innerText = "Entities received!";
			entityListResponseArea.innerText = "";
			
			var entityNames = response.data.entity_names;
			var entityDescriptions = response.data.entity_descriptions;

			// Displaying existing entity names along with their descriptions
			for (var i = 0; i < entityNames.length; i++){				
				entityListResponseArea.innerText += entityNames[i] + ": " + entityDescriptions[i] + "\n";
		}
		})
		.catch(function(error){
			// Logging errors, if any
			console.log(error.response);
			entityResponseArea.innerText = "Something went wrong. Check API logs.";
		})
	},
	// Function for getting feature view names from the feature store
	getFeatureViewNames: function(){
		// Getting necessary values
		var selectorFeatureView = document.getElementById("selector_feature_view");			
		var featureViewListArea = document.getElementById("feature_views_area");
		var featureViewResponseArea = document.getElementById("feature_view_response_area");

		// Updating the status message in the response field
		featureViewResponseArea.innerText = "Getting feature views...";		

		// Declaring a list to store feature view names from previous calls
		var existingFVs = [];

		// Adding existing feature view names from the selector to the created list
		if(selectorFeatureView.length != 0){
			for (var i = 0; i < selectorFeatureView.length; i++){				
				existingFVs.push(selectorFeatureView.options[i].value);
			}			
		}	
		
		// Sending an HTTP request to get feature views
		axios({
			method: "get",
			url: "http://" + config.api_url + ":" + config.api_port + config.get_feature_views_endpoint,		
			headers: {"Content-Type": "application/json"}
		})
		.then(function(response) {					
			// Displaying a success message				
			featureViewResponseArea.innerText = "Feature views received!";
			
			var featureViewNames = response.data.feature_view_names;

			// Iterating over each of the received feature view names
			for (var i = 0; i < featureViewNames.length; i++){
				// If a feature view name doesn't exist already, add it to
				// the fields that display feature view names								
				if (!existingFVs.includes(featureViewNames[i])){
					selectorFeatureView.add(
						new Option(featureViewNames[i], 
							featureViewNames[i])
					);

				// Creating a line break so that
				// each feature view is displayed on a new line
				var br = document.createElement("br");								
				featureViewListArea.appendChild(br);
				
				// Creating a checkbox for the current feature view name
				var checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.value = featureViewNames[i];
				checkbox.id = "feature_view_checkbox_" + i;				
				featureViewListArea.appendChild(checkbox);

				// Creating a label for the checkbox
				var label = document.createElement("label");
				label.htmlFor = checkbox.id;
				label.appendChild(document.createTextNode(featureViewNames[i]));				
				featureViewListArea.appendChild(label);	
				}										
			}

			// Get and display the feature names for the current feature view
			events.getFeatureNames();
		})
		.catch(function (error) {
			// Logging errors, if any
			console.log(error.response);
			featureViewResponseArea.innerText = "Something went wrong. Check API logs.";
		}) 
	},
	// Function for getting the feature names for a specified feature view
	getFeatureNames: function(){
		// Getting necessary values
		var featureViewNames = document.getElementById("selector_feature_view").value;			
		var featureNameArea = document.getElementById("feature_names_area");		

		// Sending an HTTP request to get feature names
		axios({
			method: "get",
			url: "http://" + config.api_url + ":" + config.api_port + config.get_feature_names_endpoint,
			params: {feature_view_name: featureViewNames},
			headers: {"Content-Type": "application/json"}
		})
		.then(function(response) {
			// Adding feature names to a string
			var features = ""
			
			// Retrieving the feature names from the response
			var featureNames = response.data.feature_names;
			
			for (var i = 0; i < featureNames.length; i++){
				features += featureNames[i] + "\n";				
			}
			
			// Displaying the feature names
			featureNameArea.innerText = features;			
		})
		.catch(function (error) {
			// Logging errors, if any
			console.log(error.response);
			featureNameArea.innerText = "Something went wrong. Check API logs.";
		}) 
	},	
	// Function for registering an entity DataFrame on the server
	registerEntityDF: function(){
		// Getting necessary values
		var startDate = document.getElementById("start_date").value;
		var endDate = document.getElementById("end_date").value;
		var entityKeysStr = document.getElementById("entity_key").value;
		var entityName = document.getElementById("entity_name").value;
		var frequency = document.getElementById("frequency").value;
		var entityCreateResponseArea = document.getElementById("entity_create_response_area");

		// Updating the status message in the response field
		entityCreateResponseArea.innerText = "Creating entity DataFrame...";
		
		// Splitting the string with potentially several entity keys into a list of strings
		entityKeysStr = entityKeysStr.split(",");

		// Iterating over the entity key strings and converting them to integers
		var entityKeys = []
		for (var i = 0; i < entityKeysStr.length; i++){
			entityKeys.push(parseInt(entityKeysStr[i]));
		}

		// Creating a request body for the HTTP request
		var body = {
			entity_keys: entityKeys,
			entity_name: entityName,
			timestamps: [startDate, endDate],
			frequency: frequency
		}

		// Sending an HTTP request to create an entity DataFrame
		axios({
			method: "post",
			url: "http://" + config.api_url + ":" + config.api_port + config.register_entity_df_endpoint,
			data: JSON.stringify(body),
			headers: {"Content-Type": "application/json"}
		})
		.then(function() {			
			// Displaying a success message
			entityCreateResponseArea.innerText = "Entity DataFrame created!";
		})
		.catch(function(error) {
			// Logging errors, if any
			console.log(error.response);
			entityCreateResponseArea.innerText = "Something went wrong. Check API logs.";
		})
	},
	// Helper function for getting selected feature view names
	getCheckboxes: function(){
		// Getting checked checkboxes
		var checkboxes = document.querySelectorAll('input[id*="feature_view_checkbox"]:checked');		

		// Iterating over the checked checkboxes and getting the 
		// feature view names associated with them
		var checkedLabels = []
		checkboxes.forEach(element => {			
			checkedLabels.push(element.labels[0].innerText);
		});

		// Returning selected feature view names
		return checkedLabels;
	},
	// Function for saving datasets
	saveDataset: function(){
		// Getting necessary values
		var datasetName = document.getElementById("dataset_name").value;
		var selectedFeatureViews = events.getCheckboxes();	
		var saveDatasetArea = document.getElementById("save_dataset_area");

		// Updating the status message in the response field
		saveDatasetArea.innerText = "Saving dataset...";

		// Sending an HTTP request to save the selected feature views into a dataset
		axios({
			method: "post",
			url: "http://" + config.api_url + ":" + config.api_port + config.save_dataset_endpoint,
			data: JSON.stringify({
				dataset_name: datasetName,
				feature_view_names: selectedFeatureViews
			}),
			headers: {"Content-Type": "application/json"}
		})
		.then(function(){
			// Displaying a success message
			saveDatasetArea.innerText = "Dataset saved!";
		})
		.catch(function(error){
			// Logging errors, if any
			console.log(error.response);
			if (selectedFeatureViews.length === 0){
				saveDatasetArea.innerText = "Please select at least one feature view!";
			} else{
				saveDatasetArea.innerText = "Something went wrong. Check API logs.";
			}
			
		})
	},
	// Function for materializing features
	materialize: function(){
		// Getting necessary values
		var startDate = document.getElementById("start_date_materialize").value;
		var endDate = document.getElementById("end_date_materialize").value;
		var materializeResponseArea = document.getElementById("materialize_response_area");

		// Updating the status message in the response field
		materializeResponseArea.innerText = "Materializing features...";

		// Sending an HTTP request to materialize features
		axios({
			method: "post",
			url: "http://" + config.api_url + ":" + config.api_port + config.materialize_endpoint,
			params: {
				start_date: startDate,
				end_date: endDate
			},
			headers: {"Content-Type": "application/json"}
		})
		.then(function(){
			// Displaying a success message
			materializeResponseArea.innerText = "Features materialized!";
		})
		.catch(function(error){
			// Logging errors, if any
			console.log(error.response);
			materializeResponseArea.innerText = "Something went wrong. Check API logs.";
		})
	},
	// Function for incrementally materializing features
	materializeIncremental: function(){	
		// Getting necessary values
		var endDate = document.getElementById("end_date_materialize_incr").value;
		var materializeIncrResponseArea = document.getElementById("materialize_incr_response_area");
			
		// Updating the status message in the response field
		materializeIncrResponseArea.innerText = "Materializing features...";

		// Sending an HTTP request to incrementally materialize features
		axios({
			method: "post",
			url: "http://" + config.api_url + ":" + config.api_port + config.materialize_incremental_endpoint,
			params: {				
				end_date: endDate
			},
			headers: {"Content-Type": "application/json"}
		})
		.then(function(){
			// Displaying a success message
			materializeIncrResponseArea.innerText = "Features materialized!";
		})
		.catch(function(error){
			// Logging errors, if any
			console.log(error.response);
			materializeIncrResponseArea.innerText = "Something went wrong. Check API logs.";
		})
	},
  /*
  toggle_train_state : {},
  toggle_choice : "Classification",
  toggle_training_mode : function(id, choice) {
    events.toggle_choice = choice;
    const possible = ["ball_id", "ball_id2"];
    const elem = document.getElementById(id);
    if(typeof(events.toggle_train_state[id]) === "undefined") {
      events.toggle_train_state[id] = false;
    }
    if(events.toggle_train_state[id]) {
      elem.style.marginLeft = "35px";
      elem.style.background = "limegreen";
      const other_id = possible.filter((x) => x !== id)[0]
      const other_elem = document.getElementById(other_id);
      other_elem.style.marginLeft = "0px";
      other_elem.style.background = "red";
    } else {
      elem.style.marginLeft = "0px";
      elem.style.background = "red";
      const other_id = possible.filter((x) => x !== id)[0]
      const other_elem = document.getElementById(other_id);
      other_elem.style.marginLeft = "35px";
      other_elem.style.background = "limegreen";
    }
    elem.style.transition = "all 0.2s ease-in-out";
    events.toggle_train_state[id] = !events.toggle_train_state[id];
  }*/
};
