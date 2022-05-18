import "./App.css";
import ModelUploadUI from "./model_upload_UI";
import EvasionUI from "./evasion_UI";
import PoisonUI from "./poison_UI";
import StealingUI from "./stealingUI";


function App() {
	return (
		<div className="App">
			<p className="title">AI DEFENSE TESTER</p>
			<p className="subtitle">Run attacks on your ML model to determine if it is resistant to attacks.</p>										

			<br></br>
			<br></br>
			<br></br>
			<p className="subtitle"> MODEL UPLOAD</p>
			<p className="description">Upload the model that you want to run attacks against.</p>		
			<ModelUploadUI/>

			<br></br>
			<br></br>
			<br></br>
			<p className="subtitle">1. FAST GRADIENT METHOD ATTACK</p>
			<p className="description">Select the params for a Fast Gradient Method attack.</p>
			<p className="description">If your model shows similar results on both clean and adversarial samples, it probably IS resistant to the attack with your chosen parameters.</p>
			<p className="description">Otherwise, if your model struggles with adversarial samples, it probably is NOT resistant to your attack parameters.</p>
			<EvasionUI/>

			<br></br>
			<br></br>
			<br></br>
			<p className="subtitle">2. POISONING BACKDOOR ATTACKS</p>
			<p className="description">Select the params for a poisoning backdoor attack.</p>
			<p className="description">Depending on the results, you can identify if your model is poisoned or not. Possible outcomes are as follows:</p>
			<br></br>
			<p className="description">1. METRICS WITH RESPECT TO POISONED LABELS ARE WORSE THAN WITH RESPECT TO CLEAN LABELS.</p> 
			<p className="description">This probably means that your model doesn't have backdoors. The model performs well against clean labels because it can correctly identify samples, while the performance against poisoned labels is bad because the backdoor in the samples doesn't trigger the attacker's desired output.</p>
			<br></br>
			<p className="description">2. METRICS WITH RESPECT TO CLEAN LABELS ARE WORSE THAN WITH RESPECT TO POISONED LABELS.</p>
			<p className="description">This probably means that your model has a backdoor and that the target labels reflect the actual poisoned labels the model has been trained on. If the model performs well with respect to poisoned labels, it means that the backdoor in the samples triggers the attacker's desired output.</p>
			<br></br>
			<p className="description">3. METRICS WITH RESPECT TO BOTH CLEAN AND POISONED LABELS ARE POOR.</p> 
			<p className="description">This probably means that your model has a backdoor, but your chosen target labels aren't the actual poisoned labels the model has been trained on. The model performs badly against clean labels because it has a backdoor, but the performance against poisoned labels is also bad because you've picked incorrect target labels.</p>
			<PoisonUI/>	

			<br></br>
			<br></br>
			<br></br>
			<p className="subtitle">3. COPYCAT CNN ATTACKS</p>
			<p className="description">Select the params for a CopycatCNN attack.</p>
			<p className="description">If the stolen model performs similar to the victim model, it probably means that the victim model is NOT resistant to extraction attacks.</p>
			<p className="description">Otherwise, if the stolen model performs notably worse than the victim model, it probably means that the victim model IS resistant to extraction attacks.</p>
			<StealingUI/>			
		</div>
	);
}

export default App;