import "./App.css";
import {events} from "./events.js";

function StealingUI(props) { 
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
					<legend className="legend">batch size fit</legend>										
					<div className="description">
						<p className="type">batch size fit</p>						
					</div>
					<div className="input">
						<input id="batch_size_fit" type="text" defaultValue="256"></input>
					</div>
					<div className="description">
					<p>Batch size for fitting.</p>											
					</div>
				</fieldset>
			</div> 

			<div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">batch size query</legend>										
					<div className="description">
						<p className="type">batch size query</p>						
					</div>
					<div className="input">
						<input id="batch_size_query" type="text" defaultValue="256"></input>
					</div>
					<div className="description">
					<p>Batch size for querying.</p>											
					</div>
				</fieldset>
			</div> 			

            <div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">nb epochs</legend>										
					<div className="description">
						<p className="type">nb epochs</p>						
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
					<legend className="legend">nb stolen</legend>										
					<div className="description">
						<p className="type">nb stolen</p>						
					</div>
					<div className="input">
						<input id="nb_stolen" type="text" defaultValue="10000"></input>
					</div>
					<div className="description">
					<p>Number of samples to train the stolen model on.</p>												
					</div>
				</fieldset>
			</div> 

			<div className="ui_item">
				<fieldset className="fieldset">					
					<br></br>
					<button id="attack_steal_button" onClick={() => {events.runSteal()}}>Run a stealing attack</button> 
					<br></br>
					<br></br>
					<div className="text" id="steal_response_area">
						Press the button above to run a stealing attack.
					</div>
					<br></br>
				</fieldset>
			</div>
		</div>
  );
}
// {parse_data(props.data)}
export default StealingUI;
