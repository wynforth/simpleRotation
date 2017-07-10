const statuses = Object.assign({}, general_status, blm_status, sam_status, brd_status, rdm_status, smn_status);

//initialize state
function initialize(job){
	//currentJob = getUrlParameter('job');
	state = resetState(job);
	actions = getActions(state);
	
	setMana(state.maxMana);
	setTP(state.maxTP);
	setSkillSpeed(state.sks);
	setSpellSpeed(state.spd);
	setTargets(1);
	
	//job specific clean it up later
	setResource1(0);
	setResource2(0);
		
	rotation = [];
	createActionButtons();
	update();
	//clear previous rotation
	$(".rotation-table thead .status-col").remove();
	$(".rotation-table tbody").html('');
}

function getRole(job) {
	switch (job) {
	case 'DRK':
	case 'PLD':
	case 'WAR':
		return 'tank';
		break;
	case 'AST':
	case 'SCH':
	case 'WHM':
		return 'healer';
		break;
	case 'DRG':
	case 'MNK':
	case 'NIN':
	case 'SAM':
		return 'melee';
		break;
	case 'BRD':
	case 'MCH':
		return 'ranged';
		break;
	case 'BLM':
	case 'RDM':
	case 'SMN':
		return 'caster';
		break;
	default:
		return '';
	}
	return roles[job];
}

function getJobActions(job){
	switch (job){
		case 'BLM': 
			return blm_actions;
			break;
		case 'BRD':
			return brd_actions;
			break;
		case 'RDM':
			return rdm_actions;
			break;
		case 'SAM':
			return sam_actions;
			break;
		case 'SMN':
			return smn_actions;
			break;
		default:
			break;
	}
	
	return '';
}

function getRoleActions(role){
	var actions = {};
	for(var key in roleActions){
		var action = roleActions[key];
		//console.log(action);
		if(action.affinity.indexOf(role) > -1)
			actions[key] = action;
	}
	return actions;
}

function getActions(state){
	return Object.assign({},getJobActions(state.job),getRoleActions(state.role));
}

function resetState(job){
	return {
		level: 70,
		tp: 1000,
		maxTP: 1000,
		potency: 0,
		maxMana: defaults[job].mana,
		mana: defaults[job].mana,
		job: job,
		role: getRole(job),
		statuses: {},
		recast: {},
		currentTime: 0,
		targetTime: 0,
		nextTick: 3.0,
		spd: parseFloat($("#spellSpeed").val()), //defaults[job].spd,
		sks: parseFloat($("#skillSpeed").val()), //defaults[job].sks,
		targets: parseInt($("#targets").val()),
		lastAction: '',
		lastActionTime: 0,
		lastCombo: false,
		resource_1: 0,
		resource_2: 0,
	};
}

function setOptions()
{
	console.log("Getting options");
	state.sks = parseFloat($("#skillSpeed").val());
	state.spd = parseFloat($("#spellSpeed").val());
	state.targets = parseInt($("#targets").val());
	update();
}

function setSkillSpeed(value){
	//console.log(value);
	state.sks = value;
	$("#skillSpeed").val(value);
}

function setSpellSpeed(value){
	//console.log(value);
	state.spd = value;
	$("#spellSpeed").val(value);
}

function setTargets(value){
	//console.log(value);
	state.targets = value;
	$("#targets").val(value);
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



function changeJob(name){
	cleanActionButtonHeaders();
	cleanResources();
	
	parseFloat($("#spellSpeed").val(defaults[name].spd))
	parseFloat($("#skillSpeed").val(defaults[name].sks))
	initialize(name);
	//visibility
	setResources();
}

/*----------------

DISPLAY FUNCTIONS

-----------------*/

function cleanResources(){
	$(".progress.resource-1-bg").removeClass(state.job);
	$(".progress-resource-1").removeClass(state.job);
	$(".resource-1").removeClass(state.job);
	
	$(".progress.resource-2-bg").removeClass(state.job);
	$(".progress-resource-2").removeClass(state.job);
	$(".resource-2").removeClass(state.job);
}

function setResources(){
	switch(state.job){
		case 'SAM':
			$(".progress.resource-1-bg").toggleClass('hidden', false);
			$(".progress.resource-2-bg").toggleClass('hidden', true);
			break;
		case 'RDM':
			$(".progress.resource-1-bg").toggleClass('hidden', false);
			$(".progress.resource-2-bg").toggleClass('hidden', false);
			break;
		default:
			$(".progress.resource-1-bg").toggleClass('hidden', true);
			$(".progress.resource-2-bg").toggleClass('hidden', true);
		
	}
	
	$(".progress.resource-1-bg").addClass(state.job);
	$(".progress-resource-1").addClass(state.job);
	$(".resource-1").addClass(state.job);
	
	$(".progress.resource-2-bg").addClass(state.job);
	$(".progress-resource-2").addClass(state.job);
	$(".resource-2").addClass(state.job);
}

function cleanActionButtonHeaders(){
	$(".header.job").removeClass(state.role);
	$(".header.job .image-job").attr("src","img/icons/none.png");
	$(".actions.job").removeClass(`border-${state.role}`);
	
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
	$(".header.job").addClass(state.role);
	$(".header.job .image-job").attr("src","img/icons/"+state.job+".png");
	$(".actions.job").addClass(`border-${state.role}`);
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
	$(".header.role .image-role").attr("src","img/icons/"+state.role+".png");
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
					<span class="value">${action.getRecast(state).toFixed(2)}s</span>
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
	tooltip += `</div><div class="desc">${action.getDesc(state)}</div></div>`;
	if(action.affinity[0] == 'role'){
		var affins = "";
		tooltip += `<div class="acquired"><div class="footer beige">Acquired</div><div class="spaced">`;
		for(var i = 1; i <action.affinity.length; i++){
			tooltip += `<img src="img/icons/${action.affinity[i]}.png"/>`;
			affins += role2jobs[action.affinity[i]];
		}
		//console.log(affins);
		tooltip += `<span class="lightgreen">Lv.</span> ${action.level}</div></div>`;
		tooltip += `<div class="acquired"><div class="footer beige">Affinity</div><div class="spaced">${affins.trim()}</div></div>`;
	} else {
		tooltip += `<div class="acquired"><div class="footer beige">Acquired</div><div class="spaced"><img src="img/icons/${action.affinity[0]}.png"/><span class="lightgreen">Lv.</span> ${action.level}</div></div>`;
		tooltip += `<div class="acquired"><div class="footer beige">Affinity</div><div class="spaced">${action.affinity.join(", ")}</div></div>`;
	}
	
	
	return tooltip.trim().replace(/^\s+/mg, "");
}


function addRotationAction(id, key){
	var action = getAction(key);
	const Rotation_Action = ({ id, key }) => `
<div class="rotation-action" data-id="${id}" data-action="${key}">
          <img src="img/${key}.png" />
          <small class="cooldown"></small>
        </div>&#9654;`;
		
	$(".rotation .actions").append([{'id': id, 'key': action.getImage() }].map(Rotation_Action).join(''));
	
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
          ${url}
          <small class="cooldown">${duration}</small>
        </div>`;
	
	var statusArr = [];
	for(var key in state.statuses){
		if(statuses.hasOwnProperty(key)){
			var value = state.statuses[key].duration;
			var icon = state.statuses[key].getImg();
			statusArr.push({'name': key, 'url': icon, 'duration': `${value.toFixed(1)}s`});
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
	var action = Object.assign(Object.create(actions[name]), actions[name]); //copy of action?
	//console.log(action);
	action.id = name;
	
	var replacement = action.getReplacement(state);
	//console.log(replacement);
	if(replacement != false)
		return getAction(replacement);
		
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

function setResource1(value) {
	state.resource_1 = Math.min(value, 100);
	$(".progress-resource-1").css('width', (state.resource_1/100*100)+'%').attr('aria-valuenow', state.kenki);
	$(".resource-1").text(`${state.resource_1}`);
}

function setResource2(value) {
	state.resource_2 = Math.min(value, 100);
	$(".progress-resource-2").css('width', (state.resource_2/100*100)+'%').attr('aria-valuenow', state.kenki);
	$(".resource-2").text(`${state.resource_2}`);
}

/*------------------

STATUS FUNCTIONS

------------------*/

function getStatus(name) {
	//console.log(name);
	var status = Object.assign(Object.create(statuses[name]), statuses[name])
	status.id = name;
	return status;
}

function setStatus(name, active){
	var status = getStatus(name);
	//console.log(status);
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
		status.finalize(state);
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
		state.statuses[name].addStacks(stack);
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