/*----------------

DISPLAY FUNCTIONS

-----------------*/


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
	$(".header.job .image-job").attr("src","img/icons/job_"+state.job+".png");
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
	$(".header.role .image-role").attr("src","img/icons/role_"+state.role+".png");
	$(".actions.role").addClass(`border-${state.role}`);
	$(".actions.role").html(actionArr.map(Action).join(''));
}

function updateActionButtons(){
  $(".actions .action").each(function() {
    const key = $(this).data("action");
    const action = getAction(key);

	//update image incase the action was replaced
	if(key != action.id)
		$("img", this).prop("src", `img/${action.id}.png`);

	$(this).toggleClass("disabled", !actionUsable(key));
    $(this).toggleClass("highlight", action.isHighlighted(state));
	
	var label = $(".cooldown", this)
	var value = getRecast(action.recastGroup());
	if(value != 0)
		label.text(`${value.toFixed(1)}s`);
	else
		label.text('');
  });
}

function addRotationAction(id, key){
	
	const Rotation_Action = ({ id, key }) => `
<div class="rotation-action" data-id="${id}" data-action="${key}">
          <img src="img/${key}.png" />
          <small class="cooldown"></small>
        </div>`;
		
	$(".rotation .actions").append([{'id': id, 'key': key }].map(Rotation_Action).join(''));
	var last = $(".rotation .actions .rotation-action").last();
	last.toggleClass("error", !actionUsable(key));
	last.click(function(e) {
		var name = $(this).data("action");
		var index = $(this).data("id");
		console.log("Removing: " + name + " at index " + index);
		removeRotationAction(index);
	});
		
}	

function clearRotationButtons(){
	$(".rotation .actions").html("");
}

function updateRotationButtons(){
	$(".rotation .actions").html("");
	for(var i = 0; i < rotation.length; i++){
		addRotationAction(i, rotation[i].id);
	}
	
}

function updateStatuses(){
	const Status = ({ name, url, duration }) => `
		<div class="status" data-action="${name}">
          <img src="img/status/${url}.png" />
          <small class="cooldown">${duration}</small>
        </div>`;
	
	var statusArr = [];
	for(var key in state.statuses){
		if(statuses.hasOwnProperty(key)){
			var value = state.statuses[key].duration;
			var icon = key;
			if(state.statuses[key].stacks > 1)
				icon = key+"_"+"i".repeat(state.statuses[key].stacks);			
			statusArr.push({'name': key, 'url': icon, 'duration': `${value.toFixed(1)}s`});
			//console.log(action.name.replace(/\ /g,'_').toLowerCase());
		}
	}
	$(".statuses").html(statusArr.map(Status).join(''));
}

function updateStats(){
	//$(".dps").text((state.damage / ((state.currentTime - state.damageStart) )).toFixed(2));
	//console.log(state.potency);
	$(".pot").text(state.potency.toFixed(2));
	$(".time").text(state.currentTime.toFixed(2));
    $(".pps").text((state.potency / ((state.currentTime) )).toFixed(2));
}

/*---------------------

ACTION FUNCTIONS

---------------------*/


function getAction(name) {
	if(typeof actions[name] === "undefined")
		return false;

	var action = Object.assign({ id: name }, baseAction, actions[name]);
	var replacement = action.getReplacement(state);

	if(replacement != false)
		return getAction(replacement);
	
	if(action.type == "spell") {
		var scale = 2.5 / 2.5; //2.5/2.5 = no spell speed. figure out how to do a setting for it later
		
		if(hasStatus('ley_lines'))
			scale -=0.1;
		
		action.cast *= scale;
		action.recast *= scale;
	}
  
	return action;
}

function actionUsable(key) {
	const action = getAction(key);
	if(!action)
		return false;

	if(!!getRecast(action.recastGroup()))
		return false;

	if(action.getManaCost(state) > state.mana)
		return false;
	
	if(action.getTPCost(state) > state.tp)
		return false;

	return action.isUseable(state);
}

function getMaxMana(state){
	return maxmana[state.job];
}

function setMana(mana) {
	state.mana = Math.min(mana, state.maxMana);
	$(".progress-mana").css('width', (state.mana/state.maxMana*100)+'%').attr('aria-valuenow', state.mana);
	$(".mana").text(`${state.mana} / ${state.maxMana}`);
}

function setTP(tp) {
	state.tp = Math.min(tp, state.maxTP);
	$(".progress-tp").css('width', (state.tp/state.maxTP*100)+'%').attr('aria-valuenow', state.tp);
	$(".tp").text(`${state.tp} / ${state.maxTP}`);
}

/*------------------

STATUS FUNCTIONS

------------------*/

function getStatus(name) {
	return Object.assign({},baseStatus,statuses[name]);
}

function setStatus(name, active){
	var status = getStatus(name);
	if(active){
		//add/update status
		if(hasStatus(name)){
			state.statuses[name].duration = status.duration //reset duration of existing
		} else {
			state.statuses[name] = status; //create new status
		}
	} else {
		console.log("losing status " + name);
		delete state.statuses[name];
		//drop enochian if fire or ice are lost
		if(hasStatus('enochian') && !hasAnyStatus(["astral_fire","umbral_ice"])){
			delete state.statuses['enochian'];
		}
	}
}

function updateStatus(name, stack, set=false) {
	var isNew = !hasStatus(name);
	if(isNew && stack <= 0) //no-op
		return
	setStatus(name,true);
	if(set) {
		state.statuses[name].stacks = stack;
	} else if(!isNew) {
		state.statuses[name].stacks = Math.min(state.statuses[name].stacks+stack, state.statuses[name].maxStacks);
	}

	if(state.statuses[name].stacks <= 0){
		console.log("stacks lost on " + name);
		setStatus(name,false);
	}
}

function getStacks(name) {
	if(state.statuses[name])
		return state.statuses[name].stacks
	return 0;
}

function hasStatus(name) {
	//console.log("checking status: " + name);
	
	if(state.statuses[name])
		return state.statuses[name].duration > 0; 
	return false;
}

function hasAnyStatus(arr) {
	for(var i=0; i < arr.length; i++){
		if(hasStatus(arr[i]))
			return true;
	}
	return false;
}

function hasAllStatus(arr) {
	for(var i=0; i< arr.length; i++){
		if(!hasStatus(arr[i]))
			return false;
	}
	return true;
}

function addRecast(name, duration) {
	state.recast[name] = {
		start: state.currentTime,
		duration: duration
	};
}

function setRecast(name, duration) {
	if(!getRecast(name)) {
		return addRecast(name, duration);
	}

	state.recast[name].duration = duration;
}

function getRecast(name) {
	if(state.recast[name] == undefined)
		return 0;

	var recast = state.recast[name];
	return Math.max(0, (recast.start + recast.duration) - state.currentTime);
}

function clearRecast(name) {
	delete state.recast[name];
}