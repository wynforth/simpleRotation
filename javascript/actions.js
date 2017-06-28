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
	radius: 0,
	range: 0,
	
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
			level: 8,
			range: 25,
			description: `
				Lowers target's intelligence and mind by 10%.<br/>
				<span class="green">Duration:</span> 10s
			`,
			execute(state) { setStatus('addle',true); }
		},
		'break': {
			name: "Break",
			type: "spell",
			cast: 2.5,
			recast: 2.5,
			potency: 50,
			level: 12,
			range: 25,
			description: `
				Deals unaspected damage with a potency of 50.<br/>
				<span class="green">Additional Effect:</span> <span class="yellow">Heavy</span> +20%<br/>
				<span class="green">Duration:</span> 20s
			`,
			execute(state){ setStatus('heavy',true); }
		},
		drain: {
			name: "Drain",
			type: "spell",
			cast: 2.5,
			recast: 2.5,
			potency: 80,
			level: 16,
			range: 25,
			description: `
				Deals unaspected damage with a potency of 80.<br/>
				<span class="green">Additional Effect:</span> Absorbs a portion of damage dealt as HP
			`,
		},
		diversion: {
			name: "Diversion",
			recast: 120,
			level: 20,
			description: `
				Reduces enmity generation.<br/>
				<span class="green">Duration:</span> 15s
			`,
			execute(state){ setStatus("diversion",true); }
		},
		lucid_dreaming: {
			name: "Lucid Dreaming",
			recast: 120,
			level: 24,
			description: `
				Reduces enmity by half.<br/>
				<span class="green">Additional Effect:</span> <span class="yellow">Refresh</span><br/>
				<span class="green">Refresh Potency:</span> 80<br/>
				<span class="green">Duration:</span> 21s
			`,
			execute(state){ setStatus("lucid_dreaming",true); }
		},
		swiftcast: {
			name: "Swiftcast",
			recast: 60,
			level: 32,
			description: `
				Next spell is cast immediately.<br/>
				<span class="green">Duration:</span> 10s
			`,
			execute(state){ setStatus("swiftcast",true); }
		},
		mana_shift: {
			name: "Mana Shift", 
			recast: 150,
			level: 36,
			range: 25,
			description: `Transfers up to 20% of own maximum MP to target party member.`
		},
		apocatastasis: {
			name: "Apocatastasis",
			recast: 150,
			level: 40,
			range: 25,
			description: `
				Reduces a party member's magic vulnerability by 20%.<br/>
				<span class="green">Duration:</span> 10s`,
			execute(state) { setStatus('apocatastasis',true); }
		},
		surecast: {
			name: "Surecast",
			recast: 30,
			level: 46,
			description: `
				Next spell is cast without interruption.<br/>
				<span class="green">Additional Effect:</span> Nullifies knockback and draw-in effects<br/>
				<span class="green">Duration:</span> 10s
			`,
			execute(state){ setStatus("surecast",true); }
		},
		erase: {
			name: "Erase",
			recast: 90,
			level: 48,
			range: 25,
			description: `
				Removes a single damage over time effect from target party member other than self.<br/>
				<span class="green">Additional Effect:</span> Restores target's HP<br/>
				<span class="green">Cure Potency:</span> 200
			`,
		},
		wait_for_mana: {
			name: "Wait for Mana",
			recast: 0,
			cast: 0,
			animTime: 0,
			description: `Take no action until the next mana tick.`,
			type: "spell",
			getCast(state){
				return state.nextTick - state.currentTime;
			}
		},
		max_ether: {
			name: "Max-Ether",
			recast: 300,
			description: `Restores up to 16% of MP (1360 points max).<br/>Processed via the alchemical extraction of aetheric essence occurring in elemental crystals, the contents of this vial instantly restore a considerable amount of MP.`,
			recastGroup(state){
				return 'potion';
			},
			execute(state){
				setMana(state.mana + Math.min(state.maxMana * .16, 1360));
			}
		},
		max_ether_hq: {
			name: "Max-Ether HQ",
			recast: 270,
			description: `Restores up to 20% of MP (1700 points max).<br/>Processed via the alchemical extraction of aetheric essence occurring in elemental crystals, the contents of this vial instantly restore a considerable amount of MP.`,
			recastGroup(state){
				return 'potion';
			},
			execute(state){
				setMana(state.mana + Math.min(state.maxMana * .2, 1700));
			}
		},
		infusion_intelligence: {
			name: "Infusion of Intelligence",
			recast: 270,
			description: `
				Intelligence +10% (Max 137)<br/>
				This diluted brew temporarily increases intelligence, but for twice the duration of similar potions.<br/>
				<span class="green">Duration:</span> 30s
			`,
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
	ranged: {
		second_wind: {
			name: "Second Wind",
			recast: 120,
		},
		foot_graze: {
			name: "Foot Graze",
			recast: 30,
		},
		leg_graze: {
			name: "Leg Graze",
			recast: 30,
		},
		peloton: {
			name: "Peloton",
			recast: 5
		},
		invigorate: {
			name: "Invigorate",
			recast: 120,
			execute(state){
				setTP(state.tp + 400);
			}
		},
		tactician: {
			name: "Tactician",
			recast: 180,
			execute(state) {
				setStatus("tactician", 30);
			}
		},
		refresh: {
			name: "Refresh",
			recast: 180,
			execute(state) {
				setStatus("refresh", 30);
			}
		},
		head_graze: {
			name: "Head Graze",
			recast: 30,
		},
		arm_graze: {
			name: "Arm Graze",
			recast: 25
		},
		palisade: {
			name: "Palisade",
			recast: 150
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
		}
	},
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
	
	//ranged
	tactician: {
		name: "Tactitian",
		duration: 30,
		color: "#E0901F",
		tick(state) {
			setTP(state.tp + 50);
		}
	},
	refresh: {
		name: "Refresh",
		duration: 30,
		color: "#7F7FC0",
		tick(state) {
			setMana(state.mana + (state.maxMana * .02));
		}
	},
	
	//melee
	true_north: {
		name: "True North",
		duration: 15,
		color: "#C07F4F",
	},
	bloodbath: {
		name: "Bloodbath",
		duration: 20,
		color: "#D00F0F",
	}
	
};

const statuses = Object.assign({}, general_status, blm_status, sam_status, brd_status);



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
	BLM: blm_actions,
	SAM: sam_actions,
	BRD: brd_actions,
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