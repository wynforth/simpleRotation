function resetState(job){
	return {
		level: 70,
		tp: 1000,
		maxTP: 1000,
		potency: 0,
		maxMana: maxMana[job],
		mana: maxMana[job],
		job: job,
		role: getRole(job),
		statuses: {},
		recast: {},
		currentTime: 0,
		targetTime: 0,
		nextTick: 3.0,
		spd: 2.41,
		sks: 2.41,
		lastAction: '',
		lastActionTime: 0,
		lastCombo: false,
		kenki: 0,
		black: 0,
		white: 0,
		oath: 0,
		beast: 0,
		blood: 0,
		faerie: 0,
		ninki: 0,
		heat: 0,
	};
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function replaceQueryParam(param, newval, search) {
    var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    var query = search.replace(regex, "$1").replace(/&$/, '');

    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
}

//initialize state
function initialize(){
	//currentJob = getUrlParameter('job');
	state = resetState(currentJob);
	actions = getActions(state);
	setMana(state.maxMana);
	setTP(state.maxTP);
	
	setKenki(0);
	$(".progress.kenki-bg").toggleClass('hidden', currentJob!="SAM");
	
	rotation = [];
	createActionButtons();
	update();
	//clear previous rotation
	$(".rotation-table thead .status-col").remove();
	$(".rotation-table tbody").html('');
}

function changeJob(name){
	cleanActionButtonHeaders();
	currentJob = name;
	//var str = window.location.search;
	//str = replaceQueryParam('job', currentJob, str);
	//window.location = window.location.pathname + str;
	
	initialize();
}

/*----------------

DISPLAY FUNCTIONS

-----------------*/

function cleanActionButtonHeaders(){
	$(".header.job").removeClass(state.job);
	$(".header.job .image-job").attr("src","img/icons/none.png");
	$(".actions.job").removeClass(`border-${state.job}`);
	
	$(".header.role").removeClass(state.role);
	$(".header.role .image-role").attr("src","img/icons/none.png");
	$(".actions.role").removeClass(`border-${state.role}`);
}


function createActionButtons(){
	if(state.job === undefined || state.job =="")
		return;
	console.log(state.job);
	const Action = ({ name, url }) => `
		<div class="action" data-action="${name}">
          <img src="img/${url}.png" />
          <small class="cooldown"></small>
		  <small class="cost"></small>
        </div>`;
	
	var actionArr = [];
	for(var key in getJobActions(state.job)){
		var action = getAction(key);
		if(actions.hasOwnProperty(key) && !actions[key].hidden){
			actionArr.push({'name': key, 'url': action.getImage()});
			//console.log(action.name.replace(/\ /g,'_').toLowerCase());
		}
	}
	$(".header.job").addClass(state.job);
	$(".header.job .image-job").attr("src","img/icons/job_"+state.job+".png");
	$(".actions.job").addClass(`border-${state.job}`);
	$(".actions.job").html(actionArr.map(Action).join(''));
	
	var actionArr = [];
	for(var key in getRoleActions(state.role)){
		var action = getAction(key);
		if(actions.hasOwnProperty(key)){
			actionArr.push({'name': key, 'url': action.getImage()});
			//console.log(action.name.replace(/\ /g,'_').toLowerCase());
		}
	}
	$(".header.role").addClass(state.role);
	$(".header.role .image-role").attr("src","img/icons/role_"+state.role+".png");
	$(".actions.role").addClass(`border-${state.role}`);
	$(".actions.role").html(actionArr.map(Action).join(''));
	
	$(".actions .action").click(function(e) {
		var name = $(this).data("action");
		addAction(name);
	});
}

function updateActionButtons(){
  $(".actions .action").each(function() {
    const key = $(this).data("action");
    const action = getAction(key);

	//update image incase the action was replaced
	if(key != action.id)
		$("img", this).prop("src", `img/${action.getImage()}.png`);

	$(this).toggleClass("disabled", !actionUsable(key));
    $(this).toggleClass("highlight", action.isHighlighted(state));
		
	var mpCost = action.getManaCost(state);
	var tpCost = action.getTPCost(state)
	if(mpCost > 0 || tpCost > 0){
		var value = Math.max(mpCost, tpCost);
		$(".cost", this).text(`${value.toFixed(0)}`)
		$(".cost", this).toggleClass("mp-text", mpCost > 0);
		$(".cost", this).toggleClass("tp-text", tpCost > 0);
	} else {
		$(".cost", this).text('');
	}
	
	var label = $(".cooldown", this)
	var value = getRecast(action.recastGroup());
	if(value != 0)
		label.text(`${value.toFixed(1)}s`);
	else
		label.text('');
	
	$(this).tooltip('dispose');
	$(this).tooltip({html: true, title: getTitle(action), placement: 'bottom'});
  });
}

function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getTitle(action){
	var tooltip = "";
	tooltip = `
		<div class="ffxiv-tooltip rounded">
			<div class="highlight"></div>
			<div class="tooltip-header">
				<div class="distance"><span class="grey">Range:</span> ${action.range}y <span class="grey">Radius:</span> ${action.radius}y</div>
				<img src="img/${action.getImage()}.png"/>
				<div class="name">${action.name}</div>
				<div class="type"><span class="beige">${jsUcfirst(action.type)}</span></div>
			</div>
			<div class="costs">
				<div class="cost">
					<div class="type"><span class="beige">Cast</span></div>
					<span class="value">${action.getCast(state) == 0 ? 'Instant':action.getCast(state).toFixed(2)+'s'}</span>
				</div>
				<div class="cost">
					<div class="type"><span class="beige">Recast</span></div>
					<span class="value">${action.recast.toFixed(2)}s</span>
			</div>`;
		if(action.getManaCost(state) > 0){
			tooltip += `<div class="cost">
				<div class="type"><span class="beige">Mana Cost</span></div>
				<span class="value">${action.getManaCost(state)}</span>
			</div>`;
		} else if(action.getTPCost(state)){
			tooltip += `<div class="cost">
				<div class="type"><span class="beige">TP Cost</span></div>
				<span class="value">${action.getTPCost(state)}</span>
			</div>`;
		}
	tooltip += `</div><div class="desc">${action.description}</div></div>`;
	return tooltip.trim().replace(/^\s+/mg, "");
}


function addRotationAction(id, key){
	
	const Rotation_Action = ({ id, key }) => `
<div class="rotation-action" data-id="${id}" data-action="${key}">
          <img src="img/${key}.png" />
          <small class="cooldown"></small>
        </div>&#9654;`;
		
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
		var scale = state.spd / 2.5; //2.5/2.5 = no spell speed. figure out how to do a setting for it later
		
		if(hasStatus('ley_lines'))
			scale -=0.15;
		
		action.cast *= scale;
		action.recast *= scale;
	}
	if(action.type == "weaponskill"){
		var scale = state.sks / 2.5; 
		
		if(hasStatus('shifu'))
			scale -= 0.1;
			
		
		action.cast *= scale;
		action.recast *= scale;
	}
  
	return action;
}

function actionUsable(key) {
	const action = getAction(key);
	if(!action) {
		//console.log("not an action");
		return false;
	}
	
	if(!!getRecast(action.recastGroup())){
		//console.log("action on cooldown");
		return false;
	}

	if(action.getManaCost(state) > state.mana) {
		//console.log("not enough mana: " + state.mana + "/" + action.getManaCost(state) );
		return false;
	}
	
	if(action.getTPCost(state) > state.tp){
		//console.log("not enough tp: " + state.tp + "/" + action.getTPCost(state) );
		return false;
	}

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

function setKenki(kenki) {
	state.kenki = Math.min(kenki, 100);
	$(".progress-kenki").css('width', (state.kenki/100*100)+'%').attr('aria-valuenow', state.kenki);
	$(".kenki").text(`${state.kenki}`);
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
		//console.log("Gaining " + name + " @ " + state.currentTime + "-" + (state.currentTime + status.duration));
		if(hasStatus(name)){
			state.statuses[name].duration = status.duration //reset duration of existing
		} else {
			state.statuses[name] = status; //create new status
		}
	} else {
		
		//console.log("losing status " + name);
		delete state.statuses[name];
		//drop enochian if fire or ice are lost
		if(hasStatus('enochian') && !hasAnyStatus(["astral_fire","umbral_ice"])){
			delete state.statuses['enochian'];
		}
	
	}
}

function updateStatus(name, stack, set=false) {
	//console.log(name);
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