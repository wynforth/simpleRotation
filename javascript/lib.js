function getAction(name) {
	if(typeof actions[name] === "undefined")
		return false;

	var action = Object.assign({ id: name }, baseAction, actions[name]);
	var replacement = action.getReplacement(state);

	if(replacement != false)
		return getAction(replacement);
  //account for spell speed update to account for skill and spell speed seperately
  /*
  if(action.type == "spell") {
    var scale = getSetting("gcd", 2.5) / 2.5;
    action.cast *= scale;
    action.recast *= scale;
  }*/
  
	return action;
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

function actionUsable(key) {
	const action = getAction(key);
	if(!action) return false; //action not found

	//check for cooldown
	// not enough mana
	if(action.getManaCost() > state.mana)
		return false;
	//not enough TP
	if(action.getTPCost() > state.mana)
		return false;

  // check action specific stuff
  return action.isUseable(state);
}

function hasStatus(name) {
  return state.statuses[name] > 0; 
}