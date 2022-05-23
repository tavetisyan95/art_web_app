import "./App.css";
import {events} from "./events.js";

function BackdoorUI(props) { 
	return (
		<div className="UI_wrapper">	
            <div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Model</legend>
					<div className="input">
						<input type="file" id="tested_model_poison" accept=".h5"></input>
					</div>
					<button id="select_model_poison_button" onClick={(e) => {document.getElementById("tested_model_poison").click()}}>UPLOAD</button>
					<div className="description">
						<br></br>
						<p>The model that you want to test.</p>							
					</div>
				</fieldset>
			</div>
            
            <div className="ui_item">
                <fieldset className="fieldset">
                    <br></br>
				    <button id="upload_tested_model_poison_button" onClick={() => {events.uploadModel("tested_model", "poison")}}>Upload Model</button> 
                    <br></br>
                    <br></br>
                    <div className="text" id="upload_tested_model_poison_response_area">
					    Press the button above to upload your model.
				    </div>
                    <br></br>
                </fieldset>
			</div>  	

			<div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Poisoning percentage</legend>										
					<div className="description">
						<p className="type">Float in range (0, 1], default: 0.50</p>						
					</div>
					<div className="input">
						<input id="percent_poison" type="text" defaultValue="0.50"></input>
					</div>
					<div className="description">
					<p>The percentage of samples to poison.</p>											
					</div>
				</fieldset>
			</div> 

            <div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Target labels</legend>										
					<div className="description">
						<p className="type">Integers, default: 1, 2, 3, 4, 5, 6, 7, 8, 9</p>						
					</div>
					<div className="input">
						<input id="target_labels" type="text" defaultValue="1, 2, 3, 4, 5, 6, 7, 8, 9, 0"></input>
					</div>
					<div className="description">
					<p>The labels that you want to replace the original clean labels with.</p>											
					<p>Multiple values can be entered.</p>
					<p>Separate each value with a comma, e.g. <i>"0, 1, 2, ...".</i></p>					
					</div>
				</fieldset>
			</div> 

			<div className="ui_item">
				<fieldset className="fieldset">					
					<br></br>
					<button id="attack_backdoor_button" onClick={() => {events.runBackdoor()}}>Run a backdoor attack</button> 
					<br></br>
					<br></br>
					<div className="text" id="backdoor_response_area">
						Press the button above to run a poisoning backdoor attack.
					</div>
					<br></br>
				</fieldset>
			</div>
		</div>
  );
}
// {parse_data(props.data)}
export default BackdoorUI;
