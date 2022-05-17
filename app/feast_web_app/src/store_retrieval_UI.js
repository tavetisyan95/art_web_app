import "./App.css";
import {events} from "./events.js";

function StoreRetrievalUI(props) { 
	return (
		<div className="UI_wrapper">			
            <div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Store path</legend>
					<div className="input">
						<input id="store_path" type="text" defaultValue="driver_stats"></input>
					</div>
					<div className="description">												
						<p>The path relative to the root directory of the source repository where the <i>feature_store.yaml</i> file is located.</p>						
						<p>Do not add any slashes or backslashes to the path.</p>
					</div>
				</fieldset>
			</div> 
            

            <div className="ui_item">
                <fieldset className="fieldset">
                <br></br>
				<button id="get_store_button" onClick={() => {events.getStore()}}>Get Store</button> 
                <br></br>
               <br></br>
                <div className="text" id="store_response_area">
				    Press the button above to get the feature store.
			    </div>
                   <br></br>
               </fieldset>
			</div>	   
		</div>
  );
}
// {parse_data(props.data)}
export default StoreRetrievalUI;
