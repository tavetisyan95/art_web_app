import "./App.css";
import {events} from "./events.js";

function FGMUI(props) { 
	return (
		<div className="UI_wrapper">
			<div className="ui_item">
					<fieldset className="fieldset">
						<legend className="legend">Model</legend>
						<div className="input">
							<input type="file" id="tested_model_fgm" accept=".h5"></input>
						</div>
						<button id="select_tested_model_fgm_button" onClick={(e) => {document.getElementById("tested_model_fgm").click()}}>UPLOAD</button>
						<div className="description">
							<br></br>
							<p>The <i>robust</i> model that you want to test.</p>							
						</div>
					</fieldset>
				</div>
            
            <div className="ui_item">
                <fieldset className="fieldset">
                    <br></br>
				    <button id="upload_tested_model_fgm_button" onClick={() => {events.uploadModel("tested_model", "fgm")}}>Upload Model</button> 
                    <br></br>
                    <br></br>
                    <div className="text" id="upload_tested_model_fgm_response_area">
					    Press the button above to upload the robust model.
				    </div>
                    <br></br>
                </fieldset>
			</div>       
			
			<div className="ui_item">
					<fieldset className="fieldset">
						<legend className="legend">Vulnerable model</legend>
						<div className="input">
							<input type="file" id="vuln_model_fgm" accept=".h5"></input>
						</div>
						<button id="select_vuln_model_button" onClick={(e) => {document.getElementById("vuln_model_fgm").click()}}>UPLOAD</button>
						<div className="description">
							<br></br>
							<p>The model that you want Fast Gradient Method to generate adversarial samples for.</p>							
							<p>This could be an unprotected version of your model so that you can compare defenses vs no defenses.</p>
						</div>
					</fieldset>
				</div>

            <div className="ui_item">
                <fieldset className="fieldset">
                    <br></br>
				    <button id="upload_vuln_model_fgm_button" onClick={() => {events.uploadModel("vuln_model", "fgm")}}>Upload Vulnerable Model</button> 
                    <br></br>
                    <br></br>
                    <div className="text" id="upload_vuln_model_fgm_response_area">
					    Press the button above to upload the vulnerable model.
				    </div>
                    <br></br>
                </fieldset>
			</div>	   	


			<div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Eps</legend>										
					<div className="description">
						<p className="type">Float, default: 0.15</p>						
					</div>
					<div className="input">
						<input id="eps" type="text" defaultValue="0.15"></input>
					</div>
					<div className="description">
					<p> Attack step size (input variation).</p>											
					</div>
				</fieldset>
			</div> 

            <div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Eps step</legend>										
					<div className="description">
						<p className="type">Float, default: 0.1</p>						
					</div>
					<div className="input">
						<input id="eps_step" type="text" defaultValue="0.1"></input>
					</div>
					<div className="description">
					<p>Step size of input variation for minimal perturbation computation..</p>												
					</div>
				</fieldset>
			</div> 

            <div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Batch size</legend>										
					<div className="description">
						<p className="type">Integer, default: 32</p>						
					</div>
					<div className="input">
						<input id="batch_size_fgm" type="text" defaultValue="32"></input>
					</div>
					<div className="description">
					<p>Batch size for the attack.</p>
					</div>
				</fieldset>
			</div> 


			<div className="ui_item">
				<fieldset className="fieldset">					
					<br></br>
					<button id="attack_fgm_button" onClick={() => {events.runFGM()}}>Run an FGM attack</button> 
					<br></br>
					<br></br>
					<div className="text" id="fgm_response_area">
						Press the button above to run a Fast Gradient Method attack.
					</div>
					<br></br>
				</fieldset>
			</div>
		</div>
  );
}
// {parse_data(props.data)}
export default FGMUI;
