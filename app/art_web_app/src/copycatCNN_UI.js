import "./App.css";
import {events} from "./events.js";

function CopycatCNNUI(props) { 
	return (
		<div className="UI_wrapper">			

            <div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Model</legend>
					<div className="input">
						<input type="file" id="tested_model_copycatcnn" accept=".h5"></input>
					</div>
					<button id="select_model_copycatcnn_button" onClick={(e) => {document.getElementById("tested_model_copycatcnn").click()}}>UPLOAD</button>
					<div className="description">
						<br></br>
						<p>The model that you want to test.</p>							
					</div>
				</fieldset>
			</div>
            
            <div className="ui_item">
                <fieldset className="fieldset">
                    <br></br>
				    <button id="upload_tested_model_copycatcnn_button" onClick={() => {events.uploadModel("tested_model", "copycatcnn")}}>Upload Model</button> 
                    <br></br>
                    <br></br>
                    <div className="text" id="upload_tested_model_copycatcnn_response_area">
					    Press the button above to upload your model.
				    </div>
                    <br></br>
                </fieldset>
			</div>

			<div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Batch size for fitting</legend>										
					<div className="description">
						<p className="type">Integer, default: 256</p>						
					</div>
					<div className="input">
						<input id="batch_size_fit" type="text" defaultValue="256"></input>
					</div>
					<div className="description">
					<p>Batch size for fitting the stolen classifier.</p>											
					</div>
				</fieldset>
			</div> 

			<div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Batch size for querying</legend>										
					<div className="description">
						<p className="type">Integer, default: 256</p>						
					</div>
					<div className="input">
						<input id="batch_size_query" type="text" defaultValue="256"></input>
					</div>
					<div className="description">
					<p>Batch size for querying the victim classifier for predictions.</p>											
					</div>
				</fieldset>
			</div> 			

            <div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Epochs</legend>										
					<div className="description">
						<p className="type">Integer, default: 10</p>						
					</div>
					<div className="input">
						<input id="nb_epochs" type="text" defaultValue="10"></input>
					</div>
					<div className="description">
					<p>number of epochs for stealing.</p>												
					</div>
				</fieldset>
			</div> 

			<div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Number of queries (nb_stolen)</legend>										
					<div className="description">
						<p className="type">Integer, default: 1000</p>						
					</div>
					<div className="input">
						<input id="nb_stolen" type="text" defaultValue="1000"></input>
					</div>
					<div className="description">
					<p>Number of queries to submit to the victim classifier to fit the stolen classifier. Effectively determines the size of the training set for the stolen classifier.</p>												
					</div>
				</fieldset>
			</div> 

			<div className="ui_item">
				<fieldset className="fieldset">					
					<br></br>
					<button id="attack_copycatcnn_button" onClick={() => {events.runCopycatCNN()}}>Run a CopycatCNN Attack</button> 
					<br></br>
					<br></br>
					<div className="text" id="copycatcnn_response_area">
						Press the button above to run a CopycatCNN attack.
					</div>
					<br></br>
				</fieldset>
			</div>
		</div>
  );
}
// {parse_data(props.data)}
export default CopycatCNNUI;
