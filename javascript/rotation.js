//initialization
var currentJob = '';

var rotation = [];
var state = {};

initialize();

function removeRotationAction(index){
	rotation.splice(index,1);
	update();
}	

/*
table structure:

row:
 - cast name
 - start time
 - end time
 - total potency
 - resource cost
 - buff columns
 -- if buff time remaining > end time = solid fill
 -- if buff time remaining < end time = striped/dark fill
 */
function advanceTime(time){
	state.currentTime = state.currentTime + time;
	var doTick = state.nextTick <= state.currentTime;
	//mana ticks
	if(doTick){
		//general tick
		if(!hasStatus('astral_fire'))
			setMana(state.mana + (state.maxMana*.02));
		state.nextTick += 3;
	}
	
	
	//dot ticks
	
	
	
	//update statuses
	var toremove = [];
	for(var key in state.statuses){
		if(doTick) 
			state.statuses[key].tick(state);
		state.statuses[key].duration -= time;
		if(state.statuses[key].duration <= 0)
			toremove.push(key);
	}
	
	for(var i=0; i < toremove.length; i++){
		if(toremove[i] == "enochian"){
			if(hasAnyStatus(['astral_fire','umbral_ice'])){
				var status = getStatus('enochian');
				state.statuses['enochian'].duration += status.duration;
				setStatus('polyglot',true);
				
			} else {
				setStatus(toremove[i],false);
			}

		} else {
		
			setStatus(toremove[i],false);
		}
	}
	
}

function calculatePotency(potency){
	var mod = 1;
	
	if(hasStatus('enochian')) mod += 0.05;
	
	return potency*mod;
}

function calculateManaCost(mana){
	return mana;
}

function calculateTPCost(tp){
	return tp;
}

function playRotation(){
	var resultTable = [];
	
	state = resetState(state.job);
	clearRotationButtons();
	
	for(var i=0; i< rotation.length; i++){
		var row = {};
		var action = rotation[i];
		//display rotation action
		addRotationAction(i,action.id);
		
		//console.log(action.name);
		if(action.type != 'ability'){
			//not oGCD we advance to targetTime;
			advanceTime(state.targetTime-state.currentTime);
		}
		
		row.name = action.name;
		row.startTime = state.currentTime;
		
		
		//determine cast time, and next action time
		var castTime = action.getCast(state);
		if(action.type == "spell" && hasAnyStatus(["swiftcast","triplecast","dualcast"])){
			castTime = 0;
		}
		
		//determine time to take next action
		//if its not an ability (ie its on the gcd) the time is the longest of the cast time, the gcd, or the animation lock (in the cast of swiftcast)
		//if this delay is shorter than the already built in delay, we use that
		//for abilities, its either the current delay or the animation time
		var delay = action.animTime;
		if(action.type != "ability"){
			//remove instcast mods
			if(action.type == "spell"){
				if(hasStatus("swiftcast")){
					setStatus("swiftcast",false);
				} else if(hasStatus("triplecast")){
					updateStatus("triplecast", -1);
				} else if(hasStatus("dualcast")){
					setStatus("dualcast",false);
				}
			}
			
			//state.cast.start = state.currentTime;
			//state.cast.end = castTime;
			//time till next action, longest of cast time, recast time, or animation lock
			delay = Math.max(castTime, delay);
			state.targetTime = state.currentTime + Math.max(action.recast, delay, state.targetTime-state.currentTime);
		} else {
			state.targetTime = state.currentTime + Math.max(delay, state.targetTime-state.currentTime);
		}
		//execute the action
		
		
		//update current time to when this action is ussuable: 
		addRecast(action.recastGroup(),action.recast);
		console.log(delay);
		advanceTime(delay);

		//remove cost
		var mana = calculateManaCost(action.getManaCost());
		setMana(state.mana - mana);
		row.mana = mana;
		var tp = calculateTPCost(action.getTPCost());
		setTP(state.tp - tp);
		row.tp = tp;
		
		//add potency
		var potency = calculatePotency(action.getPotency(state))
		state.potency += potency;
		row.potency = potency;
		
		
		
		action.execute(state);
		row.endTime = state.currentTime;
		resultTable.push(row);
	}
	advanceTime(state.targetTime-state.currentTime);
	console.log(state);
	console.log(resultTable);
}

/*
what to do when an action is clicked
- check if it can be used
- add it to the rotation
- play through the rotation
- update all things that need updating
-- rotation
-- statuses
-- actions
-- resources
-- dps results
*/
function addAction(name){
	if(!actionUsable(name)) {
		console.log("Cannot use " + name + " right now. Add Error message handling?");
		return;
	}
	
	const action = getAction(name);
	if(!action){
		console.log("Error could not find action: "+name);
		return;
	}
	rotation.push(action);

	update();
}

function update(){
	
	playRotation();
	updateStatuses();
	//updateRotationButtons();
	updateActionButtons();
	updateStats();	
}

// Click Handlers
$(".actions .action").click(function(e) {
	var name = $(this).data("action");
	console.log("Adding: " + name);
	addAction(name);
});

$(".jobs .job").click(function(e) {
	var name = $(this).data("name");
	console.log("changing to : " + name);
	changeJob(name);
});