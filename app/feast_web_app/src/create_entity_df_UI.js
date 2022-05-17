import "./App.css";
import {events} from "./events.js";

function CreateEntityDFUI(props) { 
	return (
		<div className="UI_wrapper">				
			<div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Timestamp range</legend>
					<div className="description">
						<p className="type">Start date</p>						
					</div>
					<div className="input">
						<input id="start_date" type="text" defaultValue="2021-09-01"></input>
					</div>
					<div className="description">
						<p className="type">End date</p>						
					</div>
					<div className="input">
						<input id="end_date" type="text" defaultValue="2021-09-15"></input>
					</div>
					<div className="description">												
						<p>The start and end dates between which timestamps should be generated.</p>
						<p>Expected format for dates is <i>YYYY-MM-DD</i>, e.g. <i>2020-09-12</i></p>					
					</div>
				</fieldset>
			</div> 


            <div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Frequency</legend>					
					<div className="input">
						<input id="frequency" type="text" defaultValue="H"></input>
					</div>
					<div className="description">
						<p>The frequency of the generated timestamps. Defaults to hourly.</p>						
					</div>
				</fieldset>
			</div> 


			<div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Entity keys</legend>					
					<div className="input">
						<input id="entity_key" type="text" defaultValue="1001"></input>
					</div>
					<div className="description">
						<p>The entity keys for which to create an entity DataFrame.</p>
						<p>You can enter several values separated by a comma and a space, e.g. <i>1001, 1002, 1003, 1004</i></p>						
					</div>
				</fieldset>
			</div> 


			<div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Entity column name</legend>					
					<div className="input">
						<input id="entity_name" type="text" defaultValue="driver_id"></input>
					</div>
					<div className="description">
						<p>The name of the entity column in the dataset.</p>						
					</div>
				</fieldset>
			</div> 		
			            
                     
            <div className="ui_item">
                <fieldset className="fieldset">
                <br></br>
			    <button id="create_entity_df_button" onClick={(event) => {events.registerEntityDF()}}>Create Entity DF</button> 
                <br></br>
                <br></br>
                <div className="text" id="entity_create_response_area">
                    Press button above to create an entity DataFrame.
                </div>
                <br></br>
                </fieldset>
			</div>         
		</div>
  );
}
// {parse_data(props.data)}
export default CreateEntityDFUI;
