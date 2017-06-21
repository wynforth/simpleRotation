const baseAction = {
	name: "Action",
	type: "ability",
	description: `Does an action`,
	cast: 0,
	recast: 2.5,
	nextCast: 0,
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
	
	execute(state) { 
		this.nextCast = state.currentTime + this.recast;
	},
	
	isUseable(state) {
		return state.currentTime >= this.nextCast;
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
	},
	
	getCast(state) {
		return this.cast;
	}
};



const BLMactions = {
	fire_i: {
		name: "Fire I",
		type: "spell",
		potency: 180,
		mana: 1440,
		cast: 2.5,
		execute(state){
			if(hasStatus("umbral_ice"))
				setStatus("umbral_ice",false);
			else
				updateStatus("astral_fire",1);
			
			if(hasStatus("sharpcast")){
				setStatus("sharpcast",false);
				setStatus("firestarter",true);
			}
		}
	},
	fire_ii: {
		name: "Fire II",
		type: "spell",
		potency: 80,
		mana: 1800,
		cast: 3.0,
		execute(state){
			if(hasStatus("umbral_ice"))
				setStatus("umbral_ice",false);
			else
				updateStatus("astral_fire",1);
		}	
	},
	fire_iii: {
		name: "Fire III",
		type: "spell",
		potency: 240,
		mana: 2400,
		cast: 3.5,
		execute(state){
			if(hasStatus("umbral_ice"))
				setStatus("umbral_ice",false);
			updateStatus("astral_fire",3,true);
			
			setStatus("firestarter",false);
		},
		getCast(state){
			if(hasStatus("firestarter")) return 0;
			return this.cast;
		}, 
		getManaCost(state){
			if(hasStatus("firestarter")) return 0;
			return this.mana;
		},
		isHighlighted(state) {
			return hasStatus('firestarter');
		},
	},
	fire_iv: {
		name: "Fire IV",
		type: "spell",
		potency: 460,
		mana: 1200,
		cast: 3.0,
		isUseable(state) {
			return hasAllStatus(['enochian','astral_fire']);
		}
	},
	flare: {
		name: "Flare",
		type: "spell",
		potency: 260,
		mana: 0,
		cast: 4,
		execute(state){
			if(hasStatus("umbral_ice"))
				setStatus("umbral_ice",false);
			updateStatus("astral_fire",3,true);
		}
	},
	blizzard_i: {
		name: "Blizzard I",
		type: "spell",
		potency: 180,
		mana: 480,
		cast: 2.5,
		execute(state){
			if(hasStatus("astral_fire"))
				setStatus("astral_fire",false);
			else
				updateStatus("umbral_ice",1);
		}
	},
	blizzard_ii: {
		name: "Blizzard II",
		type: "spell",
		potency: 50,
		mana: 960,
		cast: 3,
		execute(state){
			if(hasStatus("astral_fire"))
				setStatus("astral_fire",false);
			else
				updateStatus("umbral_ice",1);
		}
	},
	blizzard_iii: {
		name: "Blizzard III",
		type: "spell",
		potency: 240,
		mana: 1440,
		cast: 3.5,
		execute(state){
			if(hasStatus("astral_fire"))
				setStatus("astral_fire",false);
			updateStatus("umbral_ice",3,true);
		}
	},
	blizzard_iv: {
		name: "Blizzard IV",
		type: "spell",
		potency: 260,
		mana: 1200,
		cast: 3,
		execute(state){
			updateStatus("umbral_hearts",3,true);
		},
		isUseable(state) {
			return hasAllStatus(['enochian','umbral_ice']);
		}
	},
	freeze: {
		name: "Freeze",
		type: "spell",
		potency: 100,
		mana: 2400,
		cast: 3,
		execute(state){
			if(hasStatus("astral_fire"))
				setStatus("astral_fire",false);
			else
				updateStatus("umbral_ice",1);
		}
	},
	thunder_i: {
		name: "Thunder I",
		type: "spell",
		potency: 30,
		mana: 960,
		cast: 2.5,
		getCast(state){
			if(hasStatus("thundercloud")) return 0;
			return this.cast;
		}, 
		getManaCost(state){
			if(hasStatus("thundercloud")) return 0;
			return this.mana
		},
		execute(state){
			setStatus("thundercloud",false);
			if(hasStatus("sharpcast")){
				setStatus("sharpcast",false);
				setStatus("thundercloud",true);
			}
		},
		isHighlighted(state) {
			return hasStatus('thundercloud');
		}
	},
	thunder_ii: {
		name: "Thunder II",
		type: "spell",
		potency: 30,
		mana: 1440,
		cast: 3,
		getCast(state){
			if(hasStatus("thundercloud")) return 0;
			return this.cast;
		}, 
		getManaCost(state){
			if(hasStatus("thundercloud")) return 0;
			return this.mana
		},
		execute(state){
			setStatus("thundercloud",false);
			if(hasStatus("sharpcast")){
				setStatus("sharpcast",false);
				setStatus("thundercloud",true);
			}
		},
		isHighlighted(state) {
			return hasStatus('thundercloud');
		}
	},
	thunder_iii: {
		name: "Thunder III",
		type: "spell",
		potency: 70,
		mana: 1920,
		cast: 2.5,
		getCast(state){
			if(hasStatus("thundercloud")) return 0;
			return this.cast;
		}, 
		getManaCost(state){
			if(hasStatus("thundercloud")) return 0;
			return this.mana
		},
		execute(state){
			setStatus("thundercloud",false);
			if(hasStatus("sharpcast")){
				setStatus("sharpcast",false);
				setStatus("thundercloud",true);
			}
		},
		isHighlighted(state) {
			return hasStatus('thundercloud');
		}
	},
	thunder_iv: {
		name: "Thunder IV",
		type: "spell",
		potency: 50,
		mana: 2160,
		cast: 3,
		getCast(state){
			if(hasStatus("thundercloud")) return 0;
			return this.cast;
		}, 
		getManaCost(state){
			if(hasStatus("thundercloud")) return 0;
			return this.mana
		},
		execute(state){
			setStatus("thundercloud",false);
			if(hasStatus("sharpcast")){
				setStatus("sharpcast",false);
				setStatus("thundercloud",true);
			}
		},
		isHighlighted(state) {
			return hasStatus('thundercloud');
		}
	},
	scathe: {
		name: "Scathe",
		type: "spell",
		potency: 100,
		mana: 960,
		cast: 0,
		getPotency(state){
			if(hasStatus('sharpcast')){
				return this.potency*2;
			}
			return this.potency;
		}
	},
	foul: {
		name: "Foul",
		type: "spell",
		potency: 650,
		mana: 240,
		cast: 2.5,
		execute(state){
			setStatus('polyglot',false);
		},
		isUseable(state) {
			return hasStatus('polyglot');
		},
		
		isHiglighted(state){
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
		recast: 12,
		execute(state){
			if(hasStatus('umbral_ice')){
				setStatus('umbral_ice',false);
				setStatus('astral_fire',true);
			} else if(hasStatus('astral-fire')){
				setStatus('astral_fire',false);
				setStatus('umbral_ice',true);
			}
		}
				
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
		recast: 30,
		execute(state){ 
			setStatus("ley_lines",true); 
		}
	},
	sharpcast: {
		name: "Sharpcast",
		recast: 60,
		execute(state){ 
			setStatus("sharpcast",true); 
		}
	},
	enochian: {
		name: "Enochian",
		recast: 30,
		execute(state){
			setStatus("enochian",true);
		},
		isUseable(state) {
			return hasAnyStatus(['umbral_ice','astral_fire']);
		}
	},
	between_the_lines: {
		name: "Between the Lines",
		recast: 3,
		isUseable(state){
			return hasStatus('ley_lines');
		}
	},
	triplecast: {
		name: "Triplecast",
		recast: 90,
		execute(state){
			updateStatus("triplecast",3,true);
		},
	}
};

const roleActions = {
	'caster': {
		addle: {
			name: "Addle"
		},
		break_action: {
			name: "Break"
		},
		drain: {
			name: "Drain"
		},
		diversion: {
			name: "Diversion",
			execute(state){ setStatus("diversion",true); }
		},
		lucid_dreaming: {
			name: "Lucid Dreaming",
			execute(state){ setStatus("lucid_dreaming",true); }
		},
		swiftcast: {
			name: "Swiftcast",
			execute(state){ setStatus("swiftcast",true); }
		},
		mana_shift: {name: "Mana Shift"},
		apocatastasis: {name: "Apocatastasis"},
		surecast: {
			name: "Surecast",
			execute(state){ setStatus("sharpcast",true); }
		},
		erase: {name: "Erase"}
	}
};

const baseStatus = {name: "status", duration: 0, stacks: 1, maxStacks: 1};

const statuses = {
	//BLM
	astral_fire: {name: "Astral Fire", duration: 13, maxStacks: 3},
	umbral_ice: {name: "Umbral Ice", duration: 13, maxStacks: 3},
	ley_lines: {name: "Ley Lines", duration: 30},
	triplecast: {name: "Triplecast", duration: 15, maxStacks: 3},
	umbral_heart: {name: "Umbral Hearts", duration: 30, maxStacks: 3},
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



function getRole(job){
	return roles[job];
}

function getJobActions(job){
	return jobActions[job];
}

function getRoleActions(role){
	return roleActions[role];
}

function getActions(state){
	return Object.assign({},getJobActions(state.job),getRoleActions(state.role));
}

const jobActions = {
	BLM: BLMactions
}

const roles = {
	BLM: 'caster'
}

const maxMana = {
	BLM: 15480
}