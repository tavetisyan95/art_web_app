import "./App.css";
import {events} from "./events.js";

function SaveDatasetUI(props) { 
	return (
		<div className="UI_wrapper">
			<div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Dataset name</legend>					
					<div className="input">
						<input id="dataset_name" type="text" defaultValue="dataset"></input>
					</div>
					<div className="description">
						<p>The name under which the dataset should be registered.</p>						
                       	<p>Also the name of the parquet file that will be created on the server.</p>
					</div>
				</fieldset>
			</div> 		
        
		
            <div className="ui_item">
				<fieldset className="fieldset">
					<legend align="center" className="legend">Available feature views</legend>
					<div className="text" id="feature_views_area">		
						<p>Select the feature views whose features should be included in the entity DataFrame.</p>
					</div>
				</fieldset>
			</div>
        

			<div className="ui_item">
    	        <fieldset className="fieldset">
        	        <br></br>
					<button id="save_dataset_button" onClick={() => {events.saveDataset()}}>Save Dataset</button> 
                	<br></br>
                	<br></br>
                	<div className="text" id="save_dataset_area">
	                    Press the button above to save dataset.
                	</div>
                	<br></br>
            	</fieldset>
			</div>
		</div>
  );
}
// {parse_data(props.data)}
export default SaveDatasetUI;
