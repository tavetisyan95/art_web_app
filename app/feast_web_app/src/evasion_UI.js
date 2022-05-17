import "./App.css";
import {events} from "./events.js";

function EvasionUI(props) { 
	return (
		<div className="UI_wrapper">
			<div className="ui_item">
					<fieldset className="fieldset">
						<legend className="legend">Vulnerable model</legend>
						<div className="input">
							<input type="file" id="vulnerable_model" accept=".h5"></input>
						</div>
						<button id="select_vuln_model_button" onClick={(e) => {document.getElementById("model_weights").click()}}>UPLOAD</button>
						<div className="description">
							<br></br>
							<p>The weights of your model.</p>
							<p>You can obtain the weights of a TF model by calling the method <i>save</i> of a trained <i>Model</i> or <i>Sequential</i> model.</p>
							<p>Files in <i>.h5</i> format are expected.</p>
						</div>
					</fieldset>
				</div>

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
					<legend className="legend">Eps</legend>										
					<div className="description">
						<p className="type">Eps</p>						
					</div>
					<div className="input">
						<input id="eps" type="text" defaultValue="0.15"></input>
					</div>
					<div className="description">
					<p>Eps parameter.</p>											
					</div>
				</fieldset>
			</div> 

            <div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Eps step</legend>										
					<div className="description">
						<p className="type">Eps step parameter</p>						
					</div>
					<div className="input">
						<input id="eps_step" type="text" defaultValue="0.15"></input>
					</div>
					<div className="description">
					<p>Eps step parameter.</p>												
					</div>
				</fieldset>
			</div> 

            <div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Batch size</legend>										
					<div className="description">
						<p className="type">Eps step parameter</p>						
					</div>
					<div className="input">
						<input id="batch_size_fgm" type="text" defaultValue="32"></input>
					</div>
					<div className="description">
					<p>Batch size for attack.</p>												
					</div>
				</fieldset>
			</div> 


			<div className="ui_item">
				<fieldset className="fieldset">					
					<br></br>
					<button id="attack_fgm_button" onClick={() => {events.runFGM()}}>Run a FGM attack</button> 
					<br></br>
					<br></br>
					<div className="text" id="fgm_response_area">
						Press the button above to run a Fast Gradient Attack.
					</div>
					<br></br>
				</fieldset>
			</div>
		</div>
  );
}
// {parse_data(props.data)}
export default EvasionUI;
