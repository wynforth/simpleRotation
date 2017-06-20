const baseAction = {
	name: "Action",
	type: "ability",
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
		return true;
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
	},
	
	getManaCost(state) {
		return this.mana;
	},
	
	getTPCost(state) {
		return this.tp;
	}
};



const BLMactions = {
	fire_i: {
		name: "Fire I",
		type: "spell",
		potency: 180,
		mana: 1440,
		cast: 2.5,
	},
	fire_ii: {
		name: "Fire II",
		type: "spell",
		potency: 80,
		mana: 1800,
		cast: 3.0,
	},
	fire_iii: {
		name: "Fire III",
		type: "spell",
		potency: 240,
		mana: 2400,
		cast: 3.5
	},
	fire_iv: {
		name: "Fire IV",
		type: "spell",
		potency: 460,
		mana: 1200,
		cast: 3.0,
		isUseable(state) {
			return hasStatus('enochian') && hasStatus('astral_fire');
		}
	},
	flare: {
		name: "Flare",
		type: "spell",
		potency: 260,
		mana: 0,
		cast: 4
	},
	blizzard_i: {
		name: "Blizzard I",
		type: "spell",
		potency: 180,
		mana: 480,
		cast: 2.5
	},
	blizzard_ii: {
		name: "Blizzard II",
		type: "spell",
		potency: 50,
		mana: 960,
		cast: 3
	},
	blizzard_iii: {
		name: "Blizzard III",
		type: "spell",
		potency: 240,
		mana: 1440,
		cast: 3.5
	},
	blizzard_iv: {
		name: "Blizzard IV",
		type: "spell",
		potency: 260,
		mana: 1200,
		cast: 3,
		isUseable(state) {
			return hasStatus('enochian') && hasStatus('umbral_ice');
		}
	},
	freeze: {
		name: "Freeze",
		type: "spell",
		potency: 100,
		mana: 2400,
		cast: 3 
	},
	thunder_i: {
		name: "Thunder I",
		type: "spell",
		potency: 30,
		mana: 960,
		cast: 2.5
	},
	thunder_ii: {
		name: "Thunder II",
		type: "spell",
		potency: 30,
		mana: 1440,
		cast: 3
	},
	thunder_iii: {
		name: "Thunder III",
		type: "spell",
		potency: 70,
		mana: 1920,
		cast: 2.5
	},
	thunder_iv: {
		name: "Thunder IV",
		type: "spell",
		potency: 50,
		mana: 2160,
		cast: 3
	},
	scathe: {
		name: "Scathe",
		type: "spell",
		potency: 100,
		mana: 960,
		cast: 0
	},
	foul: {
		name: "Foul",
		type: "spell",
		potency: 650,
		mana: 240,
		cast: 2.5,
		isUseable(state) {
			return hasStatus('polyglot');
		}
	},
	sleep: {
		name: "Sleep",
		type: "spell",
		mana: 1200,
		cast: 2.5
	},
	transpose: {
		name: "Transpose",
		recast: 12
	},
	manaward: {
		name: "Manaward",
		recast: 120
	},
	convert: {
		name: "Convert",
		recast: 180
	},
	aetherial_manipulation: {
		name: "Aetherial Manipulation",
		recast: 30
	},
	ley_lines: {
		name: "Ley Lines",
		recast: 30
	},
	sharpcast: {
		name: "Sharpcast",
		recast: 60
	},
	enochian: {
		name: "Enochian",
		recast: 30,
		isUseable(state) {
			return hasStatus('umbral_ice') || hasStatus('astral_fire');
		}
	},
	between_the_lines: {
		name: "Between the Lines",
		recast: 3
	},
	triplecast: {
		name: "Triplecast",
		recast: 90
	}
};

const roleActions = {
	'caster': {
		addle: {name: "Addle"},
		break_action: {name: "Break"},
		drain: {name: "Drain"},
		diversion: {name: "Diversion"},
		lucid_dreaming: {name: "Lucid Dreaming"},
		swiftcast: {name: "Swiftcast"},
		mana_shift: {name: "Mana Shift"},
		apocatastasis: {name: "Apocatastasis"},
		surecast: {name: "Surecast"},
		erase: {name: "Erase"}
	}
};

const statuses = {
	//BLM
	astral_fire: {name: "Astral Fire", duration: 13, stacks: 1},
	umbral_ice: {name: "Umbral Ice", duration: 13, stacks: 1},
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
	surecast: {name: "Surecast", duration: 10},
}



function getRole(state){
	return roles[state.job];
}

function getJobActions(state){
	return jobActions[state.job];
}

function getRoleActions(state){
	return roleActions[state.role];
}

function getActions(state){
	return Object.assign({},getJobActions(state),getRoleActions(state));
}

const jobActions = {
	BLM: BLMactions
}

const roles = {
	BLM: 'caster'
}

const maxmana = {
	BLM: 15480
}