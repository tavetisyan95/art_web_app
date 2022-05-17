import "./App.css";
import {events} from "./events.js";

function RepoExplorationUI(props) { 
	return (
		<div className="UI_wrapper">
            <div className="ui_item">
                <fieldset className="fieldset">                    
                    <br></br>
				    <button id="get_entities_button" onClick={() => {events.getEntityList()}}>Get Entity List</button> 
                    <br></br>
                    <br></br>
                    <div className="text" id="entity_response_area">
                        <p>Press the button  above to get the list of entities.</p>
                    </div>
                    <br></br>
                </fieldset>
			</div>	


			<div className="ui_item">
				<fieldset className="fieldset">
					<legend align="center" className="legend">Entity list</legend>
					<div className="text" id="entities_area">
						<p>No entities requested...</p>
					</div>
				</fieldset>
			</div>
			
			
        	<div className="ui_item">
                <fieldset className="fieldset">
            	    <br></br>
				    <button id="get_fv_names_button" onClick={() => {events.getFeatureViewNames()}}>Get Feature View Names</button> 
    	            <br></br>
                   	<br></br>
                    <div className="text" id="feature_view_response_area">
                        Press the button above to get feature view names.
                    </div>
                    <br></br>
                </fieldset>
			</div>
            
			
			<div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Feature views</legend>					
					<br></br>								
					<select id="selector_feature_view" onChange={events.getFeatureNames}></select>					
					<div className="description">
						<br></br>
						<p>The feature views registered in the feature store.</p>
					</div>
				</fieldset>
			</div>	


			<div className="ui_item">
				<fieldset className="fieldset">
					<legend align="center" className="legend">Features</legend>
					<div className="text" id="feature_names_area">
						<p>Select a feature view to view its features...</p>
					</div>
				</fieldset>
			</div>
		</div>
  );
}
// {parse_data(props.data)}
export default RepoExplorationUI;
