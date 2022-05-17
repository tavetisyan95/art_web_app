import "./App.css";
import {events} from "./events.js";

function ModelUploadUI(props) { 
	return (
		<div className="UI_wrapper">
			<div className="ui_item">
					<fieldset className="fieldset">
						<legend className="legend">Model</legend>
						<div className="input">
							<input type="file" id="model" accept=".h5"></input>
						</div>
						<button id="select_model_button" onClick={(e) => {document.getElementById("model_weights").click()}}>UPLOAD</button>
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
				    <button id="upload_model_button" onClick={() => {events.uploadModel()}}>Upload Model</button> 
                    <br></br>
                    <br></br>
                    <div className="text" id="upload_model_response_area">
					    Press the button above to clone the repo from GitHub.
				    </div>
                    <br></br>
                </fieldset>
			</div>	                         
		</div>
  );
}
// {parse_data(props.data)}
export default ModelUploadUI;
