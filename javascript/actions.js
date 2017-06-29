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
	affinity: ['role',''],
	
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
	},
	
	getImage(){
		return this.affinity[0] + "/" + this.id;
	}
};

const roleActions = {
	//level 8
	addle: {
		name: "Addle",
		recast: 120,
		level: 8,
		range: 25,
		affinity: ['role','caster'],
		description: `Lowers target's intelligence and mind by 10%.<br/>
			<span class="green">Duration:</span> 10s`,
		execute(state) { setStatus('addle',true); }
	},
	cleric_stance: {
		name: "Cleric Stance",
		recast: 90,
		level: 8,
		affinity: ['role','healer'],
		description: `Increases attack magic potency by 5%.<br/>
			<span class="green">Duration:</span> 15s`
	},
	rampart: {
		name: "Rampart",
		level: 8,
		recast: 90,
		affinity: ['role','tank'],
		description: `Reduces damage taken by 20%.<br/>
			<span class="green">Duration:</span> 20s`
	},
	second_wind: {
		name: "Second Wind",
		recast: 120,
		level: 8,
		affinity: ['role','melee','ranged'],
		description: `Instantly restores own HP.<br/>
			<span class="green">Cure Potency:</span> 500<br/>
			Cure potency varies with current attack power.`
	},
	
	//level 12
	arms_length: {
		name:"Arm's Length",
		recast: 60,
		level: 12,
		affinity: ['role','melee'],
		description: `Creates a barrier nullifying knockback and draw-in effects.<br/>
			<span class="green">Duration:</span> 5s<br/>
			<span class="green">Additional Effect:</span> <span class="yellow">Slow</span> +20% when barrier is struck<br/>
			<span class="green">Duration:</span> 15s<br/>`
	},
	'break': {
		name: "Break",
		type: "spell",
		cast: 2.5,
		recast: 2.5,
		potency: 50,
		level: 12,
		range: 25,
		affinity: ['role','caster','healer'],
		description: `Deals unaspected damage with a potency of 50.<br/>
			<span class="green">Additional Effect:</span> <span class="yellow">Heavy</span> +20%<br/>
			<span class="green">Duration:</span> 20s`
	},
	foot_graze: {
		name: "Foot Graze",
		recast: 30,
		level: 12,
		range: 3,
		affinity: ['role','ranged'],
		description: `Binds target.<br/>
			<span class="green">Duration:</span> 10s<br/>
			Cancels auto-attack upon execution.<br/>
			Target unbound if damage taken.`
	},
	low_blow: {
		name: "Low Blow",
		level: 12,
		recast: 25,
		range: 3,
		affinity: ['role','tank'],
		description: `Stuns target.<br/>
			<span class="green">Duration:</span> 5s`
	},
	
	//level 16
	drain: {
		name: "Drain",
		type: "spell",
		cast: 2.5,
		recast: 2.5,
		potency: 80,
		level: 16,
		range: 25,
		affinity: ['role','caster'],
		description: `Deals unaspected damage with a potency of 80.<br/>
			<span class="green">Additional Effect:</span> Absorbs a portion of damage dealt as HP`
	},
	leg_graze: {
		name: "Leg Graze",
		recast: 30,
		level: 16,
		range: 3,
		affinity: ['role','ranged'],
		description: `Inflicts target with <span class="yellow">Heavy</span> +40%.<br/>
			<span class="green">Duration:</span> 10s`
	},
	leg_sweep: {
		name: "Leg Sweep",
		recast: 40,
		level: 16,
		range: 3,
		affinity: ['role','melee'],
		description: `Stuns target.<br/>
			<span class="green">Duration:</span> 3s`
	},
	protect: {
		name: "Protect",
		type: "spell",
		cast: 3,
		level: 16,
		range: 25,
		radius: 15,
		mana: 1200,
		affinity: ['role','healer'],
		description: `Increases the physical and magic defense of target and all party members nearby target.<br/>
			<span class="green">Duration:</span> 30m`
	},
	provoke: {
		name: "Provoke",
		level: 16,
		recast: 40,
		range: 25,
		affinity: ['role','tank'],
		description: `Gesture threateningly, placing yourself at the top of a target's enmity list.`
	},
	
	//level 20
	convalescence: {
		name: "Convalescence",
		level: 16,
		recast: 120,
		affinity: ['role','tank'],
		description: `Increases own HP recovery via healing magic by 20%.<br/>
			<span class="green">Duration:</span> 20s`,
		execute(state) { setStatus('convalescence',true); }
	},
	diversion: {
		name: "Diversion",
		recast: 120,
		level: 20,
		affinity: ['role','caster', 'melee'],
		description: `Reduces enmity generation.<br/><br/>
			<span class="green">Duration:</span> 15s`,
		execute(state){ setStatus("diversion",true); }
	},
	esuna: {
		name: "Esuna",
		type: "spell",
		level: 20,
		cast: 1,
		range: 25,
		mana: 840,
		affinity: ['role','healer'],
		description: `Removes a single detrimental effect from target.`,
	},		
	peloton: {
		name: "Peloton",
		recast: 5,
		level: 20,
		radius: 25,
		affinity: ['role','ranged'],
		description: `Increases movement speed of self and nearby party members as long as they remain within distance.<br/>
			<span class="green">Duration:</span> 30s<br/>
			Effect also ends upon reuse or when enmity is generated. Cannot be used in battle.`,
	},
	
	//level 24
	anticipation: {
		name: "Anticipation",
		level: 24,
		recast: 60,
		affinity: ['role','tank'],
		description: `Increases parry rate by 30%.<br/>
			<span class="green">Duration:</span> 20s`,
		execute(state) { setStatus('anticipation',true); }
	},
	invigorate: {
		name: "Invigorate",
		recast: 120,
		level: 24,
		affinity: ['role','melee', 'ranged'],
		description: `Instantly restores 400 TP.`,
	},
	lucid_dreaming: {
		name: "Lucid Dreaming",
		recast: 120,
		level: 24,
		affinity: ['role','caster', 'healer'],
		description: `Reduces enmity by half.<br/>
			<span class="green">Additional Effect:</span> <span class="yellow">Refresh</span><br/>
			<span class="green">Refresh Potency:</span> 80<br/>
			<span class="green">Duration:</span> 21s`,
		execute(state){ setStatus("lucid_dreaming",true); }
	},
	
	//level 32
	bloodbath: {
		name: "Bloodbath",
		recast: 90,
		level: 32,
		affinity: ['role','melee'],
		description: `Converts a portion of physical damage dealt into HP.<br/>
			<span class="green">Duration:</sapn> 20s`,
		execute(state) {
			setStatus('bloodbath', true);
		}
	},
	reprisal: {
		name: "Reprisal",
		level: 24,
		recast: 60,
		range: 3,
		affinity: ['role','tank'],
		description: `Increases parry rate by 30%.<br/>
			<span class="green">Duration:</span> 20s`,
	},
	swiftcast: {
		name: "Swiftcast",
		recast: 60,
		level: 32,
		affinity: ['role','caster','healer'],
		description: `Next spell is cast immediately.<br/>
			<span class="green">Duration:</span> 10s`,
		execute(state){ setStatus("swiftcast",true); }
	},
	tactician: {
		name: "Tactician",
		recast: 180,
		level: 32,
		radius: 25,
		affinity: ['role','ranged'],
		description: `Gradually restores own TP and the TP of all nearby party members.<br/>
			<span class="green">Duration:</span> 30s<br/>
			<span class="green">Additional Effect:</span> Halves enmity`,
		execute(state) {
			setStatus("tactician", 30);
		}
	},
	
	//level 36
	awareness: {
		name: "Awareness",
		level: 36,
		recast: 120,
		affinity: ['role','tank'],
		description: `Nullifies chance of suffering critical damage.<br/>
			<span class="green">Duration:</span> 25s`,
		execute(state) { setStatus('awareness',true); }
	},
	eye_for_an_eye: {
		name: "Eye for an Eye",
		recast: 180,
		level: 36,
		range: 25,
		affinity: ['role','healer'],
		description: `Erects a magicked barrier around a single party member or pet.<br/>
			<span class="green">Duration:</span> 20s<br/>
			<span class="green">Barrier Effect:</span> 20% chance that when barrier is struck, the striker will deal 10% less damage<br/>
			<span class="green">Duration:</span> 10s`,
	},
	goad: {
		name: "Goad",
		recast: 180,
		level: 36,
		range: 25,
		affinity: ['role','melee'],
		description: `Refreshes TP of a single party member.<br/>
			<span class="green">Duration:</span> 30s`,
	},
	mana_shift: {
		name: "Mana Shift", 
		recast: 150,
		level: 36,
		range: 25,
		affinity: ['role','caster'],
		description: `Transfers up to 20% of own maximum MP to target party member.`
	},
	refresh: {
		name: "Refresh",
		recast: 180,
		level: 36,
		radius: 25,
		affinity: ['role','ranged'],
		description: `Gradually restores own MP and the MP of all nearby party members.<br/>
			<span class="green">Duration:</span> 30s<br/>
			<span class="green">Additional Effect:</span> Halves enmity`,
		execute(state) {
			setStatus("refresh", 30);
		}
	},
	
	//level 40
	apocatastasis: {
		name: "Apocatastasis",
		recast: 150,
		level: 40,
		range: 25,
		affinity: ['role','caster'],
		description: `Reduces a party member's magic vulnerability by 20%.<br/>
			<span class="green">Duration:</span> 10s`,
		execute(state) { setStatus('apocatastasis',true); }
	},
	feint: {
		name: "Feint",
		recast: 120,
		level: 40,
		range: 3,
		affinity: ['role','melee'],
		description: `Lowers target's strength and dexterity by 10%.<br/>
			<span class="green">Duration:</span> 10s`,
	},
	head_graze: {
		name: "Head Graze",
		recast: 30,
		level: 40,
		range: 25,
		affinity: ['role','ranged'],
		description: `Silences target.<br/>
			<span class="green">Duration:</span> 1s`,
	},
	interject: {
		name: "Interject",
		level: 36,
		recast: 120,
		range: 3,
		affinity: ['role','tank'],
		description: `Silences target.<br/>
			<span class="green">Duration:</span> 1s`,
	},
	largesse: {
		name: "Largesse",
		level: 40,
		recast: 90,
		affinity: ['role','healer'],
		description: `Increases healing magic potency by 20%.<br/>
			<span class="green">Duration:</span> 20s`,
		execute(state) { setStatus('largesse', true); },
	},
	
	//level 44
	arm_graze: {
		name: "Arm Graze",
		recast: 25,
		level: 44,
		range: 25,
		affinity: ['role','ranged'],
		description: `Stuns target.<br/>
			<span class="green">Duration:</span> 2s`,
	},
	crutch: {
		name: "Crutch",
		recast: 90,
		level: 44,
		range: 25,
		affinity: ['role','melee'],
		description: `Removes <span class="yellow">Bind</span> and <span class="yellow">Heavy</span> from target party member other than self.`,
	},
	surecast: {
		name: "Surecast",
		recast: 30,
		level: 44,
		affinity: ['role','caster','healer'],
		description: `Next spell is cast without interruption.<br/>
			<span class="green">Additional Effect:</span> Nullifies knockback and draw-in effects<br/>
			<span class="green">Duration:</span> 10s`,
		execute(state){ setStatus("surecast",true); }
	},
	ultimatum: {
		name: "Ultimatum",
		level: 44,
		recast: 90,
		radius: 5,
		affinity: ['role','tank'],
		description: `Provoke nearby enemies, placing yourself at the top of their enmity list.`,
	},
	
	//level 48
	erase: {
		name: "Erase",
		recast: 90,
		level: 48,
		range: 25,
		affinity: ['role','caster'],
		description: `Removes a single damage over time effect from target party member other than self.<br/>
			<span class="green">Additional Effect:</span> Restores target's HP<br/>
			<span class="green">Cure Potency:</span> 200`,
	},
	palisade: {
		name: "Palisade",
		recast: 150,
		level: 48,
		range: 25,
		affinity: ['role','ranged'],
		description: `Reduces physical damage taken by a party member by 20%.<br/>
			<span class="green">Duration:</span> 10s`,
	},
	rescue: {
		name: "Rescue",
		level: 48,
		recast: 150,
		range: 25,
		affinity: ['role','healer'],
		description: `Instantly draw target party member to your side. Cannot be used outside of combat or when target is suffering from certain enfeeblements.`,
	},
	shirk: {
		name: "Shirk",
		level: 48,
		recast: 120,
		range: 25,
		affinity: ['role','tank'],
		description: `Diverts 25% of enmity to target party member.`,
	},
	true_north: {
		name: "True North",
		recast: 150,
		level: 48,
		affinity: ['role','melee'],
		description: `Nullifies all action direction requirements.<br/>
			<span class="green">Duration:</span> 15s`,
		execute(state) {
			setStatus('true_north', true);
		}
	},
	
	//potions/other
	wait_for_mana: {
		name: "Wait for Mana",
		recast: 0,
		cast: 0,
		animTime: 0,
		affinity: ['role','caster'],
		description: `Take no action until the next mana tick.`,
		type: "spell",
		getCast(state){
			return state.nextTick - state.currentTime;
		}
	},
	max_ether: {
		name: "Max-Ether",
		recast: 300,
		affinity: ['role','caster','healer'],
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
		affinity: ['role','caster','healer'],
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
		affinity: ['role','caster'],
		description: `Intelligence +10% (Max 137)<br/>
			This diluted brew temporarily increases intelligence, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`,
		recastGroup(state){
			return 'potion';
		},
		execute(state) {
			setStatus("medicated", true);
		}
	},
	infusion_mind: {
		name: "Infusion of Mind",
		recast: 270,
		affinity: ['role','healer'],
		description: `Mind +10% (Max 137)<br/>
			This diluted brew temporarily increases mind, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`,
		recastGroup(state){
			return 'potion';
		},
		execute(state) {
			setStatus("medicated", true);
		}
	},
	infusion_vitality: {
		name: "Infusion of Vitality",
		recast: 270,
		affinity: ['role','tank'],
		description: `Vitality +10% (Max 137)<br/>
			This diluted brew temporarily increases vitality, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`,
		recastGroup(state){
			return 'potion';
		},
		execute(state) {
			setStatus("medicated", true);
		}
	},
	infusion_dexterity: {
		name: "Infusion of Dexterity",
		cast: 0,
		recast: 270,
		description: `Dexterity +10% (Max 137)<br/>
			This diluted brew temporarily increases dexterity, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`,
		affinity: ['role','melee', 'ranged'],
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
		description: `Strength +10% (Max 137)<br/>
			This diluted brew temporarily increases strength, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`,
		affinity: ['role','melee', 'tank'],
		recastGroup(state){
			return 'potion';
		},
		execute(state) {
			setStatus("medicated", true);
		}
	},
};

const baseStatus = {
	name: "status",
	duration: 0,
	stacks: 1,
	maxStacks: 1,
	tick(state) {},
	color: '#888888'
};


const general_status = {
	//general
	heavy: {
		name: "Heavy",
		duration: 20,
		color: "#A02F2F"
	},
	medicated: {
		name: "Medicated",
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
	},

	//healer
	cleric_stance: {
		name: "Cleric Stance",
		duration: 15,
		color: "#B03F3F",
	},

	largesse: {
		name: "Largesse",
		duration: 20,
		color: "#4FD03F",
	},

	//tank
	rampart: {
		name: "Rampart",
		duration: 20,
		color: "#406493",
	},
	convalescence: {
		name: "Convalescence",
		duration: 20,
		color: "#2F7F5F"
	},
	anticipation: {
		name: "Anticipation",
		duration: 20,
		color: "#0F90C0"
	},
	awareness: {
		name: "Awareness",
		duration: 25,
		color: "#D06F00",
	},
};

const statuses = Object.assign({}, general_status, blm_status, sam_status, brd_status);



function getRole(job){
	return roles[job];
}

function getJobActions(job){
	return jobActions[job];
}

function getRoleActions(role){
	var actions = {};
	for(var key in roleActions){
		var action = roleActions[key];
		if(action.affinity.indexOf(role) > -1)
			actions[key] = action;
	}
	return actions;
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

const role2jobs = {
	healer: "AST SCH WHM ",
	caster: "BLM RDM SMN ",
	melee: "DRG MNK NIN SAM ",
	tank: "DRK PLD WAR ",
	ranged: "BRD MCH ",
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