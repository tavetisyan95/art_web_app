import "./App.css";
import {events} from "./events.js";

function PoisonUI(props) { 
	return (
		<div className="UI_wrapper">			

            <div className="ui_item">
                <fieldset className="fieldset">
                    <br></br>
				    <button id="upload_vuln_model_button" onClick={() => {events.uploadVulnerableModel()}}>Upload Vulnerable Model</button> 
                    <br></br>
                    <br></br>
                    <div className="text" id="upload_vuln_model_response_area">
					    Press the button above to clone the repo from GitHub.
				    </div>
                    <br></br>
                </fieldset>
			</div>	   	


			<div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">percent poison</legend>										
					<div className="description">
						<p className="type">percent poison</p>						
					</div>
					<div className="input">
						<input id="percent_poison" type="text" defaultValue="0.50"></input>
					</div>
					<div className="description">
					<p>Percentage of samples to poison.</p>											
					</div>
				</fieldset>
			</div> 

            <div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">target labels</legend>										
					<div className="description">
						<p className="type">target labels</p>						
					</div>
					<div className="input">
						<input id="target_labels" type="text" defaultValue="1, 2, 3, 4, 5, 6, 7, 8, 9, 0"></input>
					</div>
					<div className="description">
					<p>target labels.</p>												
					</div>
				</fieldset>
			</div> 

			<div className="ui_item">
				<fieldset className="fieldset">					
					<br></br>
					<button id="attack_poison_button" onClick={() => {events.runPoison()}}>Run a poisoning attack</button> 
					<br></br>
					<br></br>
					<div className="text" id="poison_response_area">
						Press the button above to run a poisoning attack.
					</div>
					<br></br>
				</fieldset>
			</div>
		</div>
  );
}
// {parse_data(props.data)}
export default PoisonUI;
