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
	hidden: false,
	level: 1,
	
	recastGroup(){
		return this.type=='ability' ? this.id : 'global';
	},
	
	isCombo(state) {
		if(state.lastActionTime + 8 > state.currentTime && this.comboActions.includes(state.lastAction)) {
			var action = getAction(state.lastAction);
			return action.comboActions.length > 0 ? state.lastCombo : true;
		}
		return false;
	},
	
	execute(state) { 
	},
	
	isLevel(state) {
		return this.level <= state.level;
	},
	
	isUseable(state) {
		return this.isLevel(state);
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
	},
	
	getRecast(state) {
		return Math.max(0, this.nextCast - state.currentTime);
	}
};

const roleActions = {
	caster: {
		addle: {
			name: "Addle",
			recast: 120,
			execute(state) { setStatus('addle',true); }
		},
		'break': {
			name: "Break",
			type: "spell",
			cast: 2.5,
			recast: 2.5,
			potency: 50,
			execute(state){ setStatus('heavy',true); }
		},
		drain: {
			name: "Drain",
			type: "spell",
			cast: 2.5,
			recast: 2.5,
			potency: 80,
		},
		diversion: {
			name: "Diversion",
			recast: 120,
			execute(state){ setStatus("diversion",true); }
		},
		lucid_dreaming: {
			name: "Lucid Dreaming",
			recast: 120,
			execute(state){ setStatus("lucid_dreaming",true); }
		},
		swiftcast: {
			name: "Swiftcast",
			recast: 60,
			execute(state){ setStatus("swiftcast",true); }
		},
		mana_shift: {
			name: "Mana Shift", 
			recast: 150,
		},
		apocatastasis: {
			name: "Apocatastasis",
			recast: 150,
			execute(state) { setStatus('apocatastasis',true); }
		},
		surecast: {
			name: "Surecast",
			recast: 30,
			execute(state){ setStatus("surecast",true); }
		},
		erase: {
			name: "Erase",
			recast: 90
		},
		wait_for_mana: {
			name: "Wait for Mana",
			recast: 0,
			cast: 0,
			animTime: 0,
			type: "spell",
			getCast(state){
				return state.nextTick - state.currentTime;
			}
		},
		infusion_intelligence: {
			name: "Infusion of Intelligence",
			cast: 0,
			recast: 270,
			recastGroup(state){
				return 'potion';
			},
 			execute(state) {
				setStatus("medicated", true);
			}
		}
	},
	melee: {
		second_wind: {
			name: "Second Wind",
			recast: 120,
		},
		arms_length: {
			name:"Arm's Length",
			recast: 60,
		},
		leg_sweep: {
			name: "Leg Sweep",
			recast: 40,
		},
		diversion: {
			name: "Diversion",
			recast: 120,
			execute(state){ setStatus("diversion",true); }
		},
		invigorate: {
			name: "Invigorate",
			recast: 120,
		},
		bloodbath: {
			name: "Bloodbath",
			recast: 90,
			execute(state) {
				setStatus('bloodbath', true);
			}
		},
		goad: {
			name: "Goad",
			recast: 180
		},
		feint: {
			name: "Feint",
			recast: 120
		},
		crutch: {
			name: "Crutch",
			recast: 90,
		},
		true_north: {
			name: "True North",
			recast: 150,
			execute(state) {
				setStatus('true_north', true);
			}
		},
		infusion_dexterity: {
			name: "Infusion of Dexterity",
			cast: 0,
			recast: 270,
			recastGroup(state){
				return 'potion';
			},
 			execute(state) {
				setStatus("medicated", true);
			}
		},
		infusion_strength: {
			name: "Infusion of Strength",
			cast: 0,
			recast: 270,
			recastGroup(state){
				return 'potion';
			},
 			execute(state) {
				setStatus("medicated", true);
			}
		}
		
	},
	ranged: {},
	tank: {},
	healer: {},
};

const baseStatus = {name: "status", duration: 0, stacks: 1, maxStacks: 1, tick(state){ }, color: '#888888'};


const general_status = {
	//general
	heavy:  {
		name:"Heavy", 
		duration: 20,
		color: "#A02F2F"
	},
	medicated:  {
		name:"Medicated", 
		duration: 30,
		color: "#2F5F90"
	},
};

const caster_status = {
		//caster
	addle: {
		name: "Addle", 
		duration: 10,
		color: "#6F3FA0"
	},
	swiftcast: {
		name: "Swiftcast", 
		duration: 10, 
		color: "#E090C0"
	},
	lucid_dreaming: {
		name: "Lucid Dreaming", 
		duration: 21,
		color: "#905F7F"
	},
	diversion: {
		name: "Diversion", 
		duration: 15,
		color: "#6FF07F"
	},
	surecast: {
		name: "Surecast", 
		duration: 10,
		color: "#7FA0A0"
	},
	apocatastasis: {
		name: "Apocatastasis", 
		duration: 10,
		color: "#904FC0"
	},
};

const statuses = Object.assign({}, general_status, caster_status, blm_status, sam_status);



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
	BLM: BLMactions,
	SAM: SAMactions
}

const roles = {
	DRK: 'tank',
	PLD: 'tank',
	WAR: 'tank',
	AST: 'healer',
	SCH: 'healer',
	WHM: 'healer',
	DRG: 'melee',
	MNK: 'melee',
	NIN: 'melee',
	SAM: 'melee',
	BRD: 'ranged',
	MCH: 'ranged',
	BLM: 'caster',
	RDM: 'caster',
	SMN: 'caster'
}

const maxMana = {
	DRK: 0,
	PLD: 0,
	WAR: 0,
	AST: 0,
	SCH: 0,
	WHM: 0,
	DRG: 0,
	MNK: 0,
	NIN: 0,
	SAM: 0,
	BRD: 0,
	MCH: 0,
	BLM: 15480,
	RDM: 0,
	SMN: 0,
	'': 0
}