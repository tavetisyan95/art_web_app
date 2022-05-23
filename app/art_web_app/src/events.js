import {config} from "./config.js";
import axios from "axios";

export const events = {
	// Function for uploading models to the web server	
	uploadModel: function(id, attack){
		// Getting the model file
		var model = document.getElementById(id + "_" + attack).files[0];
		
		// Getting the model upload button and status message area
		var uploadButton = document.getElementById("upload_" + id + "_" + attack + "_button");
		var responseArea = document.getElementById("upload_" + id + "_" + attack + "_response_area");		

		// Hiding the upload button and updating the status message
		uploadButton.style.visibility = "hidden";
		responseArea.innerText = "Uploading model...";
		
		// Creating form  data with the model to send
		var formData = new FormData();
		formData.append("model", model);
		formData.append("filename", id);		

		// Sending a POST request with the form data
		axios({
			method: "post",
			url: "http://" + config.api_url + ":" + config.api_port + config.upload_model_endpoint,
			data: formData,
			headers: {
				Accept: "application/json",
				"Content-Type": "multipart/form-data"
			}
		})
		// If the request was successful
		.then(() => {
			// Making the upload button visible
			uploadButton.style.visibility = "visible";

			// Showing a success message			
			responseArea.innerText = "Model loaded!"
		})
		// If the request was unsuccessful
		.catch((error) => {
			// Showing the upload button
			uploadButton.style.visibility = "visible";

			// Showing an error message
			responseArea.innerText = "Something went wrong!";

			// Logging the error in the console
			console.log(error.response);
		})

	},
	// Function for running a Fast Gradient Method attack
	runFGM: function(){
		// Getting the param values for the attack
		var eps = document.getElementById("eps").value;
		var epsStep = document.getElementById("eps_step").value;
		var batchSize = document.getElementById("batch_size_fgm").value;

		// Getting the attack button and the status message area,
		// hiding the button, and updating the status message
		var attackButton = document.getElementById("attack_fgm_button");
		var responseArea = document.getElementById("fgm_response_area");
		attackButton.style.visibility = "hidden";
		responseArea.innerText = "Running attack...";
		
		// Sending a POST request to run the attack
		axios({
			method: "post",
			url: "http://" + config.api_url + ":" + config.api_port + config.run_fgm_endpoint,
			data: {
				eps: eps,
				eps_step: epsStep,
				batch_size: batchSize
			},
			headers: {"Content-Type": "application/json"}
		})
		// If the request is successful
		.then(function(response) {
			// Making the button visible and displaying a success message
			attackButton.style.visibility = "visible";
			responseArea.innerText = "Attack complete!\n\n";				

			// Displaying attack results
			responseArea.innerText += "--- METRICS ON CLEAN DATA ---\n\n"

			responseArea.innerText += "Loss: " + response.data.clean_loss + "\n";
			responseArea.innerText += "Accuracy: " + response.data.clean_acc + "\n\n";

			responseArea.innerText += "--- METRICS ON ADVERSARIAL DATA ---\n\n"

			responseArea.innerText += "Loss: " + response.data.score_adv_loss + "\n";
			responseArea.innerText += "Accuracy: " + response.data.score_adv_acc;
		})
		// If the request is unsuccessful
		.catch(function (error){
			// Showing the upload button
			attackButton.style.visibility = "visible";

			// Showing an error message
			responseArea.innerText = "Something went wrong!";			

			// Logging the error in the console 
			console.log(error.response);
		})

	},
	// Function for running a poisoning backdoor attack
	runBackdoor: function(){
		// Getting param values for the attack
		var percentPoison = document.getElementById("percent_poison").value;
		var targetLabels = document.getElementById("target_labels").value;
		
		// Getting the attack button and the status message area,
		// hiding the button, and updating the status message
		var attackButton = document.getElementById("attack_backdoor_button");
		var responseArea = document.getElementById("backdoor_response_area");
		attackButton.style.visibility = "hidden";
		responseArea.innerText = "Running attack...";

		// Sending a POST request to run the attack
		axios({
			method: "post",
			url: "http://" + config.api_url + ":" + config.api_port + config.run_backdoor_endpoint,
			data: {
				percent_poison: percentPoison,
				target_labels: targetLabels
			},
			headers: {"Content-Type": "application/json"}
		})
		// If the request is successful
		.then(function(response) {
			// Making the button visible and displaying a success message
			attackButton.style.visibility = "visible";
			responseArea.innerText = "Attack complete!\n\n\n";				
			
			// Displaying attack results
			responseArea.innerText += "--- METRICS WITH RESPECT TO POISONED LABELS ---\n\n"

			responseArea.innerText += "Loss: " + response.data.pscore_loss + "\n";
			responseArea.innerText += "Accuracy: " + response.data.pscore_acc + "\n\n";

			responseArea.innerText += "--- METRICS WITH RESPECT TO CLEAN LABELS ---\n\n"

			responseArea.innerText += "Loss: " + response.data.clean_loss + "\n";
			responseArea.innerText += "Accuracy: " + response.data.clean_acc;
		})
		// If the request is unsuccessful
		.catch(function (error){
			// Showing the upload button
			attackButton.style.visibility = "visible";

			// Showing an error message
			responseArea.innerText = "Something went wrong!";			

			// Logging the error in the console 
			console.log(error.response);
		})
	},
	// Function for running a Copycat CNN attack
	runCopycatCNN: function(){
		// Getting the param values for the attack
		var batchSizeFit = document.getElementById("batch_size_fit").value;
		var batchSizeQuery = document.getElementById("batch_size_query").value;
		var nbEpochs = document.getElementById("nb_epochs").value;
		var nbStolen = document.getElementById("nb_stolen").value;

		// Getting the attack button and the status message area,
		// hiding the button, and updating the status message
		var attackButton = document.getElementById("attack_copycatcnn_button");
		var responseArea = document.getElementById("copycatcnn_response_area");
		attackButton.style.visibility = "hidden";
		responseArea.innerText = "Running attack...";

		// Sending a POST request to run the attack
		axios({
			method: "post",
			url: "http://" + config.api_url + ":" + config.api_port + config.run_copycatcnn_endpoint,
			data: {
				batch_size_fit: batchSizeFit,
				batch_size_query: batchSizeQuery,
				nb_epochs: nbEpochs,
				nb_stolen: nbStolen
			},
			headers: {"Content-Type": "application/json"}
		})
		// If the request is successful
		.then(function(response){
			// Showing the button and displaying a success message
			attackButton.style.visibility = "visible";
			responseArea.innerText = "Attack complete!\n\n\n";				

			// Displaying attack results
			responseArea.innerText += "--- METRICS OF THE VICTIM MODEL ---\n\n"

			responseArea.innerText += "Loss: " + response.data.victim_loss + "\n";
			responseArea.innerText += "Accuracy: " + response.data.victim_acc + "\n\n";

			responseArea.innerText += "--- METRICS OF THE STOLEN MODEL ---\n\n"

			responseArea.innerText += "Loss: " + response.data.copycat_loss + "\n";
			responseArea.innerText += "Acc: " + response.data.copycat_acc;
		})
		//If the request is unsuccessful
		.catch(function (error) {
			// Showing the upload button
			attackButton.style.visibility = "visible";

			// Showing an error message
			responseArea.innerText = "Something went wrong!";			

			// Logging the error in the console 
			console.log(error.response);
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
