import {config} from "./config.js";
import axios from "axios";

export const events = {
	// Function for cloning feature stores from their GitHub repos	
	uploadModel: function(id){
		var model = document.getElementById(id).files[0];

		var uploadButton = document.getElementById("upload_" + id + "_button");
		var responseArea = document.getElementById("upload_" + id + "_response_area");

		console.log("upload_" + id + "_response_area")

		uploadButton.style.visibility = "hidden";
		responseArea.innerText = "Uploading model...";

		var formData = new FormData();
		formData.append("model", model);
		formData.append("filename", id);		

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
			console.log(error.response);
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
