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
	},
	blizzardI: {
		name: "Blizzard I",
		type: "spell",
		potency: 180,
		mana: 480,
		cast: 2.5
	},
	blizzardII: {
		name: "Blizzard II",
		type: "spell",
		potency: 50,
		mana: 960,
		cast: 3
	},
	blizzardIII: {
		name: "Blizzard III",
		type: "spell",
		potency: 240,
		mana: 1440,
		cast: 3.5
	},
	blizzardIV: {
		name: "Blizzard IV",
		type: "spell",
		potency: 260,
		mana: 1200,
		cast: 3
	}	
};

const statuses = {
	//BLM
	astral_fire: {name: "Astral Fire", duration: 13},
	umbral_ice: {name: "Umbral Ice", duration: 13},
	ley_lines: {name: "Ley Lines", duration: 30},
	triplecast: {name: "Triplecast", duration: 15, stacks: 3},
	umbral_heart: {name: "Umbral Hearts", duration: 30, stacks: 3},
	enochian: {name: "Enochian", duration: 30},
	polyglot: {name: "Polyglot", duration: 30},
	thundercloud: {name: "Thundercloud", duration: 12},
	sharpcast: {name: "Sharpcast", duration: 15},
	firestarter: {name: "Firestarter", duration: 12},
	
	//caster
	swiftcast: {name: "Swiftcast", duration: 10, stacks: 1 },
	lucid_dreaming: {name: "Lucid Dreaming", duration: 21},
	diversion: {name: "Diversion", duration: 15},
	surecast: {name: "Surecast", duration: 10}
}

const jobActions = {
	BLM: BLMactions,
}


function getActions(state){
	return jobActions[state.job];
}
