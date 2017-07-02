class BaseAction {
	constructor(name, level) {
		this.name = name;
		this.level = level;

		this.type = "ability";
		this.description = ``;
		this.cast = 0;
		this.recast = 2.5;
		this.potency = 0;
		this.mana = 0;
		this.tp = 0;
		this.animTime = 0.8;
		this.comboActions = [];
		this.comboPotency = 0;
		this.hidden = false;
		this.radius = 0;
		this.range = 0;
		this.affinity = [];
	}

	recastGroup() {
		return this.type == 'ability' ? this.id : 'global';
	}

	isCombo(state) {
		if (state.lastActionTime + 8 > state.currentTime && this.comboActions.includes(state.lastAction)) {
			var action = getAction(state.lastAction);
			return action.comboActions.length > 0 ? state.lastCombo : true;
		}
		return false;
	}

	execute(state) {}

	isLevel(state) {
		return this.level <= state.level;
	}

	isUseable(state) {
		return this.isLevel(state);
	}

	isHighlighted(state) {
		return this.isCombo(state);
	}

	getReplacement(state) {
		return false;
	}

	getPotency(state) {
		if (this.comboActions.length == 0)
			return this.potency;
		return this.isCombo(state) ? this.comboPotency : this.potency;
	}

	getManaCost(state) {
		return this.mana;
	}

	getTPCost(state) {
		return this.tp;
	}

	getCast(state) {
		return this.cast;
	}

	getRecast(state) {
		return this.recast;
		//return Math.max(0, this.nextCast - state.currentTime);
	}

	getImage() {
		return this.affinity[0] + "/" + this.id;
	}
}

class Buff extends BaseAction {
	constructor(name, level, recast) {
		super(name, level);
		this.recast = recast;
	}

	execute(state) {
		setStatus(this.id, true);
	}
}

class Spell extends BaseAction {
	constructor(name, level, potency, cast, mana, range, radius) {
		super(name, level);
		this.potency = potency;
		this.cast = cast;
		this.mana = mana;
		this.range = range;
		this.radius = radius;
		this.type = "spell";
	}

	getCast(state) {
		return this.cast * (state.spd / 2.5);
	}

	getRecast(state) {
		return this.recast * (state.spd / 2.5);
	}
}

class WeaponSkill extends BaseAction {
	constructor(name, level, potency, cast, tp, range, radius) {
		super(name, level);
		this.potency = potency;
		this.cast = cast;
		this.tp = tp;
		this.range = 3;
		this.radius = radius;
		this.type = "weaponskill";
	}

	getCast(state) {
		return this.cast * (state.sks / 2.5);
	}
	
	getRecast(state) {
		return this.recast * (state.sks / 2.5);
	}
}

class Status {
	constructor(name, duration, color) {
		this.name = name;
		this.duration = duration;
		this.color = color;
		this.stacks = 1;
		this.maxStacks = 1;
	};

	tick(state) {};
}

class StatusStack extends Status {
	constructor(name, duration, color, initial, max) {
		super(name, duration, color);
		this.stacks = initial;
		this.maxStacks = 3;
	};

	addStacks(amt) {
		this.stacks = Math.min(this.stacks + amt, this.maxStacks);
	}

	tick(state) {};
}

class Dot extends Status {
	constructor(name, duration, potency, color) {
		super(name, duration, color);
		this.potency = potency;
	}
	tick(state) {
		state += potency;
	};
}

class RoleAction extends BaseAction {
	constructor(name, level, recast, range, roles) {
		super(name);
		this.level = level;
		this.recast = recast;
		this.range = range;
		this.affinity = roles;
	}

	getImage() {
		return `role/${this.id}`;
	}
}

class RoleBuff extends RoleAction {
	constructor(name, level, recast, roles) {
		super(name, level, recast, 0, roles)
	}

	execute(state) {
		setStatus(this.id, true);
	}
}


const roleActions = {};

//level 8
roleActions.addle = new RoleAction("Addle", 8, 120, 25, ['caster']);
roleActions.addle.description = `Lowers target's intelligence and mind by 10%.<br/><span class="green">Duration:</span> 10s`;

roleActions.cleric_stance = new RoleBuff("Cleric Stance", 8, 90, ['healer']);
roleActions.cleric_stance.description = `Increases attack magic potency by 5%.<br/><span class="green">Duration:</span> 15s`;

roleActions.rampart = new RoleBuff("Rampart", 8, 90, ['tank']);
roleActions.rampart.description = `Reduces damage taken by 20%.<br/><span class="green">Duration:</span> 20s`;

roleActions.second_wind = new RoleAction("Second Wind", 8, 120, 0, ['melee','ranged']);
roleActions.second_wind.description = `Instantly restores own HP.<br/><span class="green">Cure Potency:</span> 500<br/>Cure potency varies with current attack power.`;
	
//level 12
roleActions.arms_length = new RoleAction("Arm's Length", 12, 60, 0, ['melee']);
roleActions.arms_length.description = `Creates a barrier nullifying knockback and draw-in effects.<br/><span class="green">Duration:</span> 5s<br/>
			<span class="green">Additional Effect:</span> <span class="yellow">Slow</span> +20% when barrier is struck<br/><span class="green">Duration:</span> 15s<br/>`;
			
roleActions.break = new RoleAction("Break", 12, 2.5, 25, ['caster','healer']);
roleActions.break.cast = 2.5;
roleActions.break.type = "spell";
roleActions.break.potency = 50;
roleActions.break.range = 25;
roleActions.break.description = `Deals unaspected damage with a potency of 50.<br/><span class="green">Additional Effect:</span> <span class="yellow">Heavy</span> +20%<br/><span class="green">Duration:</span> 20s`;
	
roleActions.foot_graze = new RoleAction("Foot Graze", 12, 30, 25, ['ranged']);
roleActions.foot_graze.description = `Binds target.<br/><span class="green">Duration:</span> 10s<br/>Cancels auto-attack upon execution.<br/>Target unbound if damage taken.`;

roleActions.low_blow = new RoleAction("Low Blow", 12, 30, 3, ['tank']);
roleActions.low_blow.description = `Stuns target.<br/><span class="green">Duration:</span> 5s`;

//level 16
roleActions.drain = new RoleAction("Drain", 16, 2.5, 25, ['caster']);
roleActions.drain.type ="spell";
roleActions.drain.cast = 2.5;
roleActions.drain.potency = 80;
roleActions.drain.description = `Deals unaspected damage with a potency of 80.<br/><span class="green">Additional Effect:</span> Absorbs a portion of damage dealt as HP`;

roleActions.leg_graze = new RoleAction("Leg Graze", 16, 30, 3, ['ranged']);
roleActions.leg_graze.description = `Inflicts target with <span class="yellow">Heavy</span> +40%.<br/><span class="green">Duration:</span> 10s`;

roleActions.leg_sweep = new RoleAction("Leg Sweep", 16, 40, 3, ['melee']);
roleActions.leg_sweep.description = `Stuns target.<br/><span class="green">Duration:</span> 3s`;

roleActions.protect = new RoleAction("Protect", 16, 2.5, 25, ['healer']);
roleActions.protect.type = "spell";
roleActions.protect.cast = 3;
roleActions.protect.radius = 15;
roleActions.protect.mana = 1200;
roleActions.protect.description = `Increases the physical and magic defense of target and all party members nearby target.<br/><span class="green">Duration:</span> 30m`;

roleActions.provoke = new RoleAction("Provoke", 16, 40, 25, ['tank']);
roleActions.provoke.description = `Gesture threateningly, placing yourself at the top of a target's enmity list.`;

//level 20
roleActions.convalescence = new RoleBuff("Convalescence", 16, 120, ['tank']);
roleActions.convalescence.description = `Increases own HP recovery via healing magic by 20%.<br/><span class="green">Duration:</span> 20s`;

roleActions.diversion = new RoleBuff("Diversion", 20, 120, ['caster', 'melee']);
roleActions.diversion.description = `Reduces enmity generation.<br/><br/><span class="green">Duration:</span> 15s`;

roleActions.esuna = new RoleAction("Esuna", 20, 2.5, 25, ['healer']);
roleActions.esuna.cast = 1;
roleActions.esuna.mana = 840;
roleActions.esuna.description = `Removes a single detrimental effect from target.`;

roleActions.peloton = new RoleAction("Peloton", 20, 5, 25, ['ranged'])
roleActions.peloton.description = `Increases movement speed of self and nearby party members as long as they remain within distance.<br/>
			<span class="green">Duration:</span> 30s<br/>Effect also ends upon reuse or when enmity is generated. Cannot be used in battle.`;

//level 24
roleActions.anticipation = new RoleBuff("Anticipation", 24, 60, ['tank']);
roleActions.anticipation.description = `Increases parry rate by 30%.<br/><span class="green">Duration:</span> 20s`;

roleActions.invigorate = new RoleAction("Invigorate", 24, 120, 0, ['melee', 'ranged']);
roleActions.invigorate.description = `Instantly restores 400 TP.`;
roleActions.invigorate.execute = function(state) { setTP(state.tp + 400); };

roleActions.lucid_dreaming = new RoleBuff("Lucid Dreaming", 24, 120, ['caster', 'healer']);
roleActions.lucid_dreaming.description = `Reduces enmity by half.<br/><span class="green">Additional Effect:</span> <span class="yellow">Refresh</span><br/>
			<span class="green">Refresh Potency:</span> 80<br/><span class="green">Duration:</span> 21s`;
			
//level 32

roleActions.bloodbath = new RoleBuff("Bloodbath", 32, 90, ['melee']);
roleActions.bloodbath.description = `Converts a portion of physical damage dealt into HP.<br/><span class="green">Duration:</sapn> 20s`;

roleActions.reprisal = new RoleBuff("Reprisal", 24, 60, ['tank']);
roleActions.reprisal.description = `Increases parry rate by 30%.<br/><span class="green">Duration:</span> 20s`;

roleActions.swiftcast = new RoleBuff("Swiftcast", 32, 60, ['caster','healer']);
roleActions.swiftcast.description = `Next spell is cast immediately.<br/><span class="green">Duration:</span> 10s`;

roleActions.tactician = new RoleBuff("Tactician", 32, 180, ['ranged']);
roleActions.tactician.range = 25;
roleActions.tactician.description = `Gradually restores own TP and the TP of all nearby party members.<br/>
			<span class="green">Duration:</span> 30s<br/><span class="green">Additional Effect:</span> Halves enmity`;

//level 36
roleActions.awareness = new RoleBuff("Awareness", 36, 120, ['tank']);
roleActions.awareness.description = `Nullifies chance of suffering critical damage.<br/><span class="green">Duration:</span> 25s`;

roleActions.eye_for_an_eye = new RoleAction("Eye for an Eye", 36, 180,  25, ['healer']);
roleActions.eye_for_an_eye.description = `Erects a magicked barrier around a single party member or pet.<br/><span class="green">Duration:</span> 20s<br/>
			<span class="green">Barrier Effect:</span> 20% chance that when barrier is struck, the striker will deal 10% less damage<br/><span class="green">Duration:</span> 10s`;
			
roleActions.goad = new RoleAction("Goad", 36, 180, 25, ['melee']);
roleActions.goad.description = `Refreshes TP of a single party member.<br/><span class="green">Duration:</span> 30s`;
	
roleActions.mana_shift = new RoleAction("Mana Shift",  36, 150, 25, ['caster']);
roleActions.mana_shift.description = `Transfers up to 20% of own maximum MP to target party member.`;

roleActions.refresh = new RoleBuff("Refresh", 36,  180, ['ranged']);
roleActions.refresh.radius = 25;
roleActions.refresh.description = `Gradually restores own MP and the MP of all nearby party members.<br/><span class="green">Duration:</span> 30s<br/><span class="green">Additional Effect:</span> Halves enmity`;

//level 40
roleActions.apocatastasis = new RoleAction("Apocatastasis", 40,  150, 25, ['caster']);
roleActions.apocatastasis.description = `Reduces a party member's magic vulnerability by 20%.<br/><span class="green">Duration:</span> 10s`;

roleActions.feint = new RoleAction("Feint", 40,  120, 3, ['melee']);
roleActions.feint.description = `Lowers target's strength and dexterity by 10%.<br/><span class="green">Duration:</span> 10s`;

roleActions.head_graze = new RoleAction("Head Graze", 40, 30, 25, ['ranged']);
roleActions.head_graze.description = `Silences target.<br/><span class="green">Duration:</span> 1s`;

roleActions.interject = new RoleAction("Interject", 36, 120, 3, ['tank']);
roleActions.interject.description = `Silences target.<br/><span class="green">Duration:</span> 1s`;

roleActions.largesse = new RoleBuff("Largesse",  40, 90, ['healer']);
roleActions.largesse.description = `Increases healing magic potency by 20%.<br/><span class="green">Duration:</span> 20s`;


//level 44
roleActions.arm_graze = new RoleAction("Arm Graze", 44, 25, 25, ['ranged']);
roleActions.arm_graze.description = `Stuns target.<br/><span class="green">Duration:</span> 2s`;

roleActions.crutch = new RoleAction("Crutch", 44 ,90, 25, ['melee']);
roleActions.crutch.description = `Removes <span class="yellow">Bind</span> and <span class="yellow">Heavy</span> from target party member other than self.`;

roleActions.surecast = new RoleBuff("Surecast", 44, 30,  ['caster','healer']);
roleActions.surecast.description = `Next spell is cast without interruption.<br/><span class="green">Additional Effect:</span> Nullifies knockback and draw-in effects<br/><span class="green">Duration:</span> 10s`;

roleActions.ultimatum = new RoleAction("Ultimatum",  44, 90, 0, ['tank']);
roleActions.ultimatum.radius = 5;
roleActions.ultimatum.description = `Provoke nearby enemies, placing yourself at the top of their enmity list.`;
	
	//level 48
roleActions.erase = new RoleAction("Erase", 48, 90, 25,  ['caster']);
roleActions.erase.description = `Removes a single damage over time effect from target party member other than self.<br/>
			<span class="green">Additional Effect:</span> Restores target's HP<br/><span class="green">Cure Potency:</span> 200`;

roleActions.palisade = new RoleAction("Palisade", 48, 150, 25, ['ranged']);
roleActions.palisade.description = `Reduces physical damage taken by a party member by 20%.<br/><span class="green">Duration:</span> 10s`;

roleActions.rescue = new RoleAction("Rescue", 48, 150, 25, ['healer']);
roleActions.rescue.description = `Instantly draw target party member to your side. Cannot be used outside of combat or when target is suffering from certain enfeeblements.`;

roleActions.shirk = new RoleAction("Shirk", 48, 120, 25, ['tank']);
roleActions.shirk.description = `Diverts 25% of enmity to target party member.`;

roleActions.true_north = new RoleBuff("True North", 48, 150,  ['melee']);
roleActions.true_north.description = `Nullifies all action direction requirements.<br/><span class="green">Duration:</span> 15s`;

	//potions/other
roleActions.wait_for_mana = new RoleAction("Wait for Mana", 1, 0, 0, ['caster']);
roleActions.wait_for_mana.cast = 0;
roleActions.wait_for_mana.animTime = 0;
roleActions.wait_for_mana.description = `Take no action until the next mana tick.`;
roleActions.wait_for_mana.type = "spell";
roleActions.wait_for_mana.getCast = function(state){	return state.nextTick - state.currentTime; };

roleActions.max_ether = new RoleAction("Max-Ether", 1, 300, 0, ['caster','healer']);
roleActions.max_ether.description = `Restores up to 16% of MP (1360 points max).<br/>Processed via the alchemical extraction of aetheric essence occurring in elemental crystals, the contents of this vial instantly restore a considerable amount of MP.`,
roleActions.max_ether.recastGroup = function(state){ return 'potion';	};
roleActions.max_ether.execute = function(state){ setMana(state.mana + Math.min(state.maxMana * .16, 1360)); };

roleActions.max_ether_hq = new RoleAction("Max-Ether HQ", 1, 270, 0, ['caster','healer']);
roleActions.max_ether_hq.description = `Restores up to 20% of MP (1700 points max).<br/>Processed via the alchemical extraction of aetheric essence occurring in elemental crystals, the contents of this vial instantly restore a considerable amount of MP.`,
roleActions.max_ether_hq.recastGroup = function(state){ return 'potion';	};
roleActions.max_ether_hq.execute = function(state){ setMana(state.mana + Math.min(state.maxMana * .2, 1700)); };

roleActions.infusion_intelligence = new RoleBuff("Infusion of Intelligence", 1, 270, ['caster']);
roleActions.infusion_intelligence.description = `Intelligence +10% (Max 137)<br/>
			This diluted brew temporarily increases intelligence, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`;
roleActions.infusion_intelligence.recastGroup = function(state) { return 'potion'; };
roleActions.infusion_intelligence.execute = function(state) { setStatus("medicated", true); };

roleActions.infusion_mind = new RoleBuff("Infusion of Mind", 1, 270, ['healer']);
roleActions.infusion_mind.description = `Mind +10% (Max 137)<br/>
			This diluted brew temporarily increases Mind, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`;
roleActions.infusion_mind.recastGroup = function(state){ return 'potion'; };
roleActions.infusion_mind.execute = function(state) { setStatus("medicated", true);	};

roleActions.infusion_strength = new RoleBuff("Infusion of Strength", 1, 270, ['melee', 'tank']);
roleActions.infusion_strength.description = `Strength +10% (Max 137)<br/>
			This diluted brew temporarily increases Strength, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`;
roleActions.infusion_strength.recastGroup = function(state){ return 'potion'; };
roleActions.infusion_strength.execute = function(state) { setStatus("medicated", true);	};

roleActions.infusion_dexterity = new RoleBuff("Infusion of Dexterity", 1, 270, ['melee','ranged']);
roleActions.infusion_dexterity.description = `Dexterity +10% (Max 137)<br/>
			This diluted brew temporarily increases Dexterity, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`;
roleActions.infusion_dexterity.recastGroup = function(state){ return 'potion'; };
roleActions.infusion_dexterity.execute = function(state) { setStatus("medicated", true); };

roleActions.infusion_vitality = new RoleBuff("Infusion of Vitality", 1, 270, ['tank']);
roleActions.infusion_vitality.description = `Vitality +10% (Max 137)<br/>
			This diluted brew temporarily increases Vitality, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`;
roleActions.infusion_vitality.recastGroup = function(state){ return 'potion';	};
roleActions.infusion_vitality.execute = function(state) { setStatus("medicated", true);	};

const general_status = {
	//general
	heavy: new Status( "Heavy", 20, "#A02F2F"),
	medicated: new Status("Medicated", 30, "#2F5F90"),
	//caster
	addle: new Status("Addle", 10, "#6F3FA0"),
	swiftcast: new Status("Swiftcast",  10, "#E090C0"),
	lucid_dreaming: new Status("Lucid Dreaming",  21, "#905F7F"),
	diversion: new Status("Diversion", 15, "#6FF07F"),
	surecast: new Status("Surecast", 10, "#7FA0A0"),
	apocatastasis: new Status("Apocatastasis", 10, "#904FC0"),
	//ranged
	tactician: new Status("Tactitian", 30,  "#E0901F"),
	refresh: new Status("Refresh", 30, "#7F7FC0"),
	//melee
	true_north: new Status("True North", 15, "#C07F4F"),
	bloodbath: new Status("Bloodbath", 20, "#D00F0F"),
	//healer
	cleric_stance: new Status("Cleric Stance", 15, "#B03F3F"),
	largesse: new Status("Largesse", 20, "#4FD03F"),
	//tank
	rampart: new Status("Rampart", 20, "#406493"),
	convalescence: new Status("Convalescence", 20, "#2F7F5F"),
	anticipation: new Status("Anticipation", 20, "#0F90C0"),
	awareness: new Status("Awareness", 25, "#D06F00")
};

general_status.tactician.tick = function(state) { setTP(state.tp + 50); };
general_status.refresh.tick = function(state) { setMana(state.mana + (state.maxMana * .02)); };

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

const defaults = {
	DRK: {
		mana: 0,
		sks: 2.46,
		spd: 2.5,
	},
	PLD: {
		mana: 8000,
		sks: 2.4,
		spd: 2.5,
	},
	WAR: {
		mana: 0,
		sks: 2.46,
		spd: 2.5,
	},
	AST: {
		mana: 0,
		sks: 2.5,
		spd: 2.47,
	},
	SCH: {
		mana: 0,
		sks: 2.5,
		spd: 2.42,
	},
	WHM: {
		mana: 0,
		sks: 2.5,
		spd: 2.45,
	},
	DRG: {
		mana: 0,
		sks: 2.33,
		spd: 2.5,
	},
	MNK: {
		mana: 0,
		sks: 2.43,
		spd: 2.5,
	},
	NIN: {
		mana: 0,
		sks: 2.42,
		spd: 2.5,
	},
	SAM: {
		mana: 0,
		sks: 2.38,
		spd: 2.5,
	},
	BRD: {
		mana: 0,
		sks: 2.4,
		spd: 2.5,
	},
	MCH: {
		mana: 0,
		sks: 2.42,
		spd: 2.5,
	},
	RDM: {
		mana: 0,
		sks: 2.5,
		spd: 2.35,
	},
	SMN: {
		mana: 15480,
		sks: 2.5,
		spd: 2.29,
	},
	BLM: {
		mana: 15480,
		sks: 2.5,
		spd: 2.39,
	},
	'': {
		mana: 0,
		sks: 2.5,
		spd: 2.5,
	}
}