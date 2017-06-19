//initialization
var state = {
	tp: 1000,
	maxTP: 1000,
	mana: 15480,
	maxMana: 15480,
	job: 'BLM',
	role: 'caster',
};

actions = getActions(state);

setMana(9000);
setTP(630);
createActionButtons();


function createActionButtons(){
	var rowLimit = 12;
	const Action = ({ name, url }) => `<div class="action" data-action="${name}">
          <img src="img/${url}.png" />
          <small class="cooldown"></small>
        </div>`;
	
	var actionArr = [];
	for(var key in actions){
		if(actions.hasOwnProperty(key)){
			var action = actions[key];
			actionArr.push({'name': action.name, 'url': action.name.replace(/\ /g,'_').toLowerCase()});
			console.log(action.name.replace(/\ /g,'_').toLowerCase());
		}
	}
	$(".actions").html(actionArr.map(Action).join(''));
	/*
	
	*/
}

function updateActionButtons(){
  $(".actions .action").each(function() {
    const key = $(this).data("action");
    const action = getAction(key);

    $("img", this).prop("src", `img/${action.id}.png`);

    if(!state.hotkeyMode) {
      $(this).toggleClass("disabled", !actionUsable(key));
      $(this).toggleClass("highlight", action.highlight(state));
    } else {
      $(this).toggle(true);
      $(this).toggleClass("disabled", false);
      $(this).removeClass("highlight");
    }
  });
}