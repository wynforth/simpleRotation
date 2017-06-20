//initialization
var state = {
	tp: 0,
	maxTP: 1000,
	mana: 0,
	maxMana: 100,
	job: '',
	role: '',
	statuses: {},
};

var rotation = [];


//initialize state
state.job = 'BLM';
state.role = getRole(state);
state.maxMana = getMaxMana(state);
setMana(state.maxMana);
setTP(state.maxTP);

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
	for(var key in getJobActions(state)){
		if(actions.hasOwnProperty(key)){
			actionArr.push({'name': key, 'url': key});
			//console.log(action.name.replace(/\ /g,'_').toLowerCase());
		}
	}
	$(".header.job").addClass(state.job);
	$(".header.job .image-job").attr("src","img/job_"+state.job+".png");
	$(".actions.job").addClass(`border-${state.job}`);
	$(".actions.job").append(actionArr.map(Action).join(''));
	
	var actionArr = [];
	for(var key in getRoleActions(state)){
		if(actions.hasOwnProperty(key)){
			actionArr.push({'name': key, 'url': key});
			//console.log(action.name.replace(/\ /g,'_').toLowerCase());
		}
	}
	$(".header.role").addClass(state.role);
	$(".header.role .image-role").attr("src","img/role_"+state.role+".png");
	$(".actions.role").addClass(`border-${state.role}`);
	$(".actions.role").append(actionArr.map(Action).join(''));
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

function addRotationAction(action){
	rotation.push(action);
	const Rotation_Action = ({ id, key }) => `
<div class="rotation-action" data-id="${id}" data-action="${key}">
          <img src="img/${key}.png" />
          <small class="cooldown"></small>
        </div>`;
	var toAdd = {'id': rotation.length-1, 'key': action.id };
	$(".rotation .actions").append([toAdd].map(Rotation_Action).join(''));
	$(".rotation .actions").click(function(e) {
		var name = $(this).data("action");
		console.log("Removing: " + name);
		removeRotationAction(name);
	});
		
}	

function removeRotationAction(action){
	
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
	addRotationAction(action);
	
	//updateRotationButtons();
	updateActionButtons();
}

// Click Handlers
$(".actions .action").click(function(e) {
	var name = $(this).data("action");
	console.log("Adding: " + name);
	addAction(name);
});

$(".rotation-action").click(function(e) {
	var name = $(this).data("action");
	console.log("Removing: " + name);
	removeRotationAction(name);
});