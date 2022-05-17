import "./App.css";
import {events} from "./events.js";

function MaterializeUI(props) { 
	return (
		<div className="UI_wrapper">
			<div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Materialization interval (standard materialization)</legend>
					<div className="description">
						<p className="type">Start date</p>						
					</div>
					<div className="input">
						<input id="start_date_materialize" type="text" defaultValue="2021-09-01"></input>
					</div>
					<div className="description">
						<p className="type">End date</p>						
					</div>
					<div className="input">
						<input id="end_date_materialize" type="text" defaultValue="2021-09-03"></input>
					</div>
					<div className="description">						
						<p>The date range from which to materialize features.</p>						
						<p>Expected format for dates is <i>YYYY-MM-DD</i>, e.g. <i>2020-09-12</i></p>						
					</div>
				</fieldset>
			</div> 


			<div className="ui_item">
				<fieldset className="fieldset">
					<br></br>
					<button id="materialize_button" onClick={() => {events.materialize()}}>Materialize</button> 
					<br></br>
					<br></br>
					<div className="text" id="materialize_response_area">
						Press the button above to materialize the latest features.
					</div>
					<br></br>
				</fieldset>
			</div>


			<div className="ui_item">
				<fieldset className="fieldset">
					<legend className="legend">Materialization interval (incremental materialization)</legend>										
					<div className="description">
						<p className="type">End date</p>						
					</div>
					<div className="input">
						<input id="end_date_materialize_incr" type="text" defaultValue="2021-09-03"></input>
					</div>
					<div className="description">
					<p>The date up to which to materialize features.</p>						
					<p>Expected format for dates is <i>YYYY-MM-DD</i>, e.g. <i>2020-09-12</i></p>						
					</div>
				</fieldset>
			</div> 


			<div className="ui_item">
				<fieldset className="fieldset">					
					<br></br>
					<button id="materialize_incremental_button" onClick={() => {events.materializeIncremental()}}>Materialize incremental</button> 
					<br></br>
					<br></br>
					<div className="text" id="materialize_incr_response_area">
						Press the button above to materialize the latest features.
					</div>
					<br></br>
				</fieldset>
			</div>
		</div>
  );
}
// {parse_data(props.data)}
export default MaterializeUI;
