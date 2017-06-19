const baseAction = {
	name: "Action",
	type: "action",
	description: `Does an action`,
	cast: 0,
	recast: 2.5,
	potency: 0,
	mana: 0,
	tp: 0,
	animTime: 0.8,
	comboActions: [],
	comboPotency: 0,
	
	
	isCombo(state) {
		if(state.lastActionTime + 8000 > state.currentTime && this.comboActions.includes(state.lastAction)) {
			var action = getAction(state.lastAction);
			return action.comboActions.length > 0 ? state.lastCombo : true;
		}
		return false;
	},
	
	execute(state) { },
	isUseable(state) {
		return state.getMP() > this.mana && state.getTP() >= this.tp;
	},
	
	isHighlighted(state) {
		return false;
	},
	
	getReplacement(state) {
		return false;
	},
	
	getPotency(state) {
		if(this.comboActions.length == 0)
			return this.potency;
		return this.isCombo(state) ? this.comboPotency : this.potency;
	}
};



const BLMactions = {
	fireI: {
		name: "Fire I",
		type: "spell",
		potency: 180,
		mana: 1440,
		cast: 2.5,
	},
	fireII: {
		name: "Fire II",
		type: "spell",
		potency: 80,
		mana: 1800,
		cast: 3.0,
	},
	fireIII: {
		name: "Fire III",
		type: "spell",
		potency: 240,
		mana: 2400,
		cast: 3.5
	},
	fireIV: {
		name: "Fire IV",
		type: "spell",
		potency: 460,
		mana: 1200,
		cast: 3.0
	}
};

const jobActions = {
	BLM: BLMactions,
}


function getActions(state){
	return jobActions[state.job];
}
