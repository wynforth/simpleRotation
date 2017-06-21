//initialization
const currentJob = 'BLM';

var rotation = [];

function resetState(job){
	return {
		tp: 1000,
		maxTP: 1000,
		maxMana: maxMana[job],
		mana: maxMana[job],
		job: job,
		role: getRole(job),
		statuses: {},
		currentTime: 0,
		targetTime: 0
	};
}

var state = resetState(currentJob);

//initialize state


actions = getActions(state);

createActionButtons();
updateActionButtons();

function createActionButtons(){
	const Action = ({ name, url }) => `
		<div class="action" data-action="${name}">
          <img src="img/${url}.png" />
          <small class="cooldown"></small>
        </div>`;
	
	var actionArr = [];
	for(var key in getJobActions(state.job)){
		if(actions.hasOwnProperty(key)){
			actionArr.push({'name': key, 'url': key});
			//console.log(action.name.replace(/\ /g,'_').toLowerCase());
		}
	}
	$(".header.job").addClass(state.job);
	$(".header.job .image-job").attr("src","img/job_"+state.job+".png");
	$(".actions.job").addClass(`border-${state.job}`);
	$(".actions.job").html(actionArr.map(Action).join(''));
	
	var actionArr = [];
	for(var key in getRoleActions(state.role)){
		if(actions.hasOwnProperty(key)){
			actionArr.push({'name': key, 'url': key});
			//console.log(action.name.replace(/\ /g,'_').toLowerCase());
		}
	}
	$(".header.role").addClass(state.role);
	$(".header.role .image-role").attr("src","img/role_"+state.role+".png");
	$(".actions.role").addClass(`border-${state.role}`);
	$(".actions.role").html(actionArr.map(Action).join(''));
}

function updateActionButtons(){
  $(".actions .action").each(function() {
    const key = $(this).data("action");
    const action = getAction(key);
	//update image incase the action was replaced
    $("img", this).prop("src", `img/${action.id}.png`);

    $(this).toggleClass("disabled", !actionUsable(key));
    $(this).toggleClass("highlight", action.isHighlighted(state));
  });
}

function addRotationAction(id, key){
	
	const Rotation_Action = ({ id, key }) => `
<div class="rotation-action" data-id="${id}" data-action="${key}">
          <img src="img/${key}.png" />
          <small class="cooldown"></small>
        </div>`;
		
	$(".rotation .actions").append([{'id': id, 'key': key }].map(Rotation_Action).join(''));

	$(".rotation .actions .rotation-action").last().click(function(e) {
		var name = $(this).data("action");
		var index = $(this).data("id");
		console.log("Removing: " + name + " at index " + index);
		removeRotationAction(index);
	});
		
}	

function updateRotationButtons(){
	$(".rotation .actions").html("");
	for(var i = 0; i < rotation.length; i++){
		addRotationAction(i, rotation[i].id);
	}
	
}

function removeRotationAction(index){
	rotation.splice(index,1);
	
	updateRotationButtons();
	playRotation();
	updateActionButtons();
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
function advanceTime(duration){
	//update statuses
	state.currentTime = state.currentTime + duration;
}

function playRotation(){
	var resultTable = [];
	state = resetState(state.job);
	console.log(state);
	for(var i=0; i< rotation.length; i++){
		var row = {};
		var action = rotation[i];
		console.log(action.name);
		if(action.type != 'ability'){
			//not oGCD we advance to targetTime;
			advanceTime(state.targetTime-state.currentTime);
		}
		
		row.name = action.name;
		row.startTime = state.currentTime;
		row.potency = action.getPotency(state);
		
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
		advanceTime(delay);
		action.execute(state);
		row.endTime = state.currentTime;
		resultTable.push(row);
	}
	console.log(state);
	console.log(resultTable);
}

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
	
	playRotation();
	updateRotationButtons();
	updateActionButtons();
}

// Click Handlers
$(".actions .action").click(function(e) {
	var name = $(this).data("action");
	console.log("Adding: " + name);
	addAction(name);
});