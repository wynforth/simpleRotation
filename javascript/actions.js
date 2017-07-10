/***************

GENERAL CLASSES

 ***************/
 
class BaseAction {
	constructor(name, level, affinity) {
		this.name = name;
		this.level = level;
		this.affinity = affinity;
		
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
		this.damageSteps = [0];
		
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
	
	unique(state) {}
	execute(state) {
		this.unique(state);
	}

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
	
	getTargetPotency(state, target) {
		if(target == 1) // primary target
			return this.getPotency(state);
		var index = Math.max(0, Math.min((target - 2), this.damageSteps.length - 1));
		return this.getPotency(state) * this.damageSteps[index];
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

	getDesc(state) {
		return `Description not set for ${this.id}`;
	}
}

class Buff extends BaseAction {
	constructor(name, level, recast, affinity) {
		super(name, level, affinity);
		this.recast = recast;
	}

	execute(state) {
		super.execute(state);
		setStatus(this.id, true);
	}
}

class Ability extends BaseAction {
	constructor(name, level, recast, range, radius, affinity){
		super(name, level, affinity);
		this.recast = recast;
		this.range = range;
		this.radius = radius;
	}
	
}

class DamageAbility extends Ability {
	constructor(name, level, potency, recast, range, radius, affinity){
		super(name, level, recast, range, radius, affinity);
		this.potency = potency;
	}
}

class Spell extends BaseAction {
	constructor(name, level, potency, cast, mana, range, radius, affinity) {
		super(name, level, affinity);
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
	constructor(name, level, potency, cast, tp, range, radius, affinity) {
		super(name, level, affinity);
		this.potency = potency;
		this.cast = cast;
		this.tp = tp;
		this.range = 3; // 'melee' range
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

// STATUS Classes

class Status {
	constructor(name, duration, color) {
		this.name = name;
		this.duration = duration;
		this.color = color;
		this.stacks = 1;
		this.maxStacks = 1;
		this.id = this.name.replace(" ", "_").toLowerCase();
	};

	tick(state) {};

	finalize(state) {};
	
	getImg() {
		//console.log(this);
		var icon = this.id;
		if (this.stacks > 1)
			icon = this.id + "_" + "i".repeat(this.stacks);
		//console.log(icon);
		return `<img src="img/status/${icon}.png" />`;
	}
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
		//console.log("TICK: " + this.id + " for " + this.potency);
		state.potency += this.potency;
	};

	getTotalPotency(state) {
		return (this.duration / 3) * this.potency;
	}
}

class AoE_Dot extends Dot {
	constructor(name, duration, potency, color) {
		super(name, duration, potency, color);
	}
	tick(state) {
		//console.log("TICK: " + this.id + " for " + this.potency);
		state.potency += this.potency * state.targets;
	};
}

/***************

ROLE CLASSES

 ***************/


class Role_Action extends BaseAction {
	constructor(name, level, recast, range, roles) {
		super(name, level, roles);
		this.recast = recast;
		this.range = range;
	}

	getImage() {
		return `role/${this.id}`;
	}
}

class Role_Spell extends Spell{
	constructor(name, level, potency, cast, mana, range, radius, roles){
		super(name, level, potency, cast, mana, range, radius, roles)
	}
	
	getImage() {
		return `role/${this.id}`;
	}
}

class Role_Buff extends Buff {
	constructor(name, level, recast, roles) {
		super(name, level, recast, roles)
	}

	execute(state) {
		setStatus(this.id, true);
	}
	getImage() {
		return `role/${this.id}`;
	}
}

class Role_Potion extends Role_Buff {
	constructor(name, level, recast, roles) {
		super(name, level, recast, roles)
	}

	execute(state) {
		setStatus('medicated', true);
	}

	recastGroup() {
		return 'potion';
	};
}

const roleActions = {
	//level 8
	addle: new Role_Action("Addle", 8, 120, 25, ['caster']),
	cleric_stance: new Role_Buff("Cleric Stance", 8, 90, ['healer']),
	rampart: new Role_Buff("Rampart", 8, 90, ['tank']),
	second_wind: new Role_Action("Second Wind", 8, 120, 0, ['melee', 'ranged']),
	//level 12
	arms_length: new Role_Action("Arm's Length", 12, 60, 0, ['melee']),
	break: new Role_Spell("Break", 12, 50, 2.5, 600, 25, 0, ['caster', 'healer']),
	foot_graze: new Role_Action("Foot Graze", 12, 30, 25, ['ranged']),
	low_blow: new Role_Action("Low Blow", 12, 30, 3, ['tank']),
	//level 16
	drain: new Role_Spell("Drain", 16, 80, 2.5, 600, 25, 0, ['caster']),
	leg_graze: new Role_Action("Leg Graze", 16, 30, 3, ['ranged']),
	leg_sweep: new Role_Action("Leg Sweep", 16, 40, 3, ['melee']),
	protect: new Role_Spell("Protect", 16, 0, 3, 1200, 0, 15, ['healer']),
	provoke: new Role_Action("Provoke", 16, 40, 25, ['tank']),
	//level 20
	convalescence: new Role_Buff("Convalescence", 16, 120, ['tank']),
	diversion: new Role_Buff("Diversion", 20, 120, ['caster', 'melee']),
	esuna: new Role_Spell("Esuna", 20, 0, 1, 840, 25, 0, ['healer']),
	peloton: new Role_Action("Peloton", 20, 5, 25, ['ranged']),
	//level 24
	anticipation: new Role_Buff("Anticipation", 24, 60, ['tank']),
	invigorate: new Role_Action("Invigorate", 24, 120, 0, ['melee', 'ranged']),
	lucid_dreaming: new Role_Buff("Lucid Dreaming", 24, 120, ['caster', 'healer']),
	//level 32
	bloodbath: new Role_Buff("Bloodbath", 32, 90, ['melee']),
	reprisal: new Role_Buff("Reprisal", 32, 60, ['tank']),
	swiftcast: new Role_Buff("Swiftcast", 32, 60, ['caster', 'healer']),
	tactician: new Role_Buff("Tactician", 32, 180, ['ranged']),
	//level 36
	awareness: new Role_Buff("Awareness", 36, 120, ['tank']),
	eye_for_an_eye: new Role_Action("Eye for an Eye", 36, 180, 25, ['healer']),
	goad: new Role_Action("Goad", 36, 180, 25, ['melee']),
	mana_shift: new Role_Action("Mana Shift", 36, 150, 25, ['caster']),
	refresh: new Role_Buff("Refresh", 36, 180, ['ranged']),
	//level 40
	apocatastasis: new Role_Action("Apocatastasis", 40, 150, 25, ['caster']),
	feint: new Role_Action("Feint", 40, 120, 3, ['melee']),
	head_graze: new Role_Action("Head Graze", 40, 30, 25, ['ranged']),
	interject: new Role_Action("Interject", 36, 120, 3, ['tank']),
	largesse: new Role_Buff("Largesse", 40, 90, ['healer']),
	//level 44
	arm_graze: new Role_Action("Arm Graze", 44, 25, 25, ['ranged']),
	crutch: new Role_Action("Crutch", 44, 90, 25, ['melee']),
	surecast: new Role_Buff("Surecast", 44, 30, ['caster', 'healer']),
	ultimatum: new Role_Action("Ultimatum", 44, 90, 0, ['tank']),
	//level 48
	erase: new Role_Action("Erase", 48, 90, 25, ['caster']),
	palisade: new Role_Action("Palisade", 48, 150, 25, ['ranged']),
	rescue: new Role_Action("Rescue", 48, 150, 25, ['healer']),
	shirk: new Role_Action("Shirk", 48, 120, 25, ['tank']),
	true_north: new Role_Buff("True North", 48, 150, ['melee']),
	//other
	wait_for_mana: new Role_Spell("Wait for Mana", 1, 0, 0, 0, 0, 0, ['caster']),
	max_ether_hq: new Role_Action("Max-Ether HQ", 1, 270, 0, ['caster', 'healer']),
	infusion_intelligence: new Role_Potion("Infusion of Intelligence", 1, 270, ['caster']),
	infusion_mind: new Role_Potion("Infusion of Mind", 1, 270, ['healer']),
	infusion_strength: new Role_Potion("Infusion of Strength", 1, 270, ['melee', 'tank']),
	infusion_dexterity: new Role_Potion("Infusion of Dexterity", 1, 270, ['melee', 'ranged']),
	infusion_vitality: new Role_Potion("Infusion of Vitality", 1, 270, ['tank']),
};

/***************

ACTION OVERRIDES

 ***************/

roleActions.invigorate.execute = function (state) {
	setTP(state.tp + 400);
};

roleActions.tactician.range = 25;
roleActions.refresh.radius = 25;

roleActions.ultimatum.radius = 5;

roleActions.wait_for_mana.recast = 0;
roleActions.wait_for_mana.animTime = 0;
roleActions.wait_for_mana.getCast = function (state) {
	return state.nextTick - state.currentTime;
};

roleActions.max_ether_hq.execute = function (state) {
	setMana(state.mana + Math.min(state.maxMana * .2, 1700));
};

/***************

DESCRIPTIONS

 ***************/

roleActions.addle.getDesc = function (state) {
	return `Lowers target's intelligence and mind by 10%.<br/><span class="green">Duration:</span> 10s`;
}
roleActions.cleric_stance.getDesc = function (state) {
	return `Increases attack magic potency by 5%.<br/><span class="green">Duration:</span> 15s`;
}
roleActions.rampart.getDesc = function (state) {
	return `Reduces damage taken by 20%.<br/><span class="green">Duration:</span> 20s`;
}
roleActions.second_wind.getDesc = function (state) {
	return `Instantly restores own HP.<br/><span class="green">Cure Potency:</span> 500<br/>Cure potency varies with current attack power.`;
}
roleActions.arms_length.getDesc = function (state) {
	return `Creates a barrier nullifying knockback and draw-in effects.<br/><span class="green">Duration:</span> 5s<br/>
			<span class="green">Additional Effect:</span> <span class="yellow">Slow</span> +20% when barrier is struck<br/><span class="green">Duration:</span> 15s<br/>`;
}
roleActions.break.getDesc = function (state) {
	return `Deals unaspected damage with a potency of 50.<br/><span class="green">Additional Effect:</span> <span class="yellow">Heavy</span> +20%<br/><span class="green">Duration:</span> 20s`;
}
roleActions.foot_graze.getDesc = function (state) {
	return `Binds target.<br/><span class="green">Duration:</span> 10s<br/>Cancels auto-attack upon execution.<br/>Target unbound if damage taken.`;
}
roleActions.low_blow.getDesc = function (state) {
	return `Stuns target.<br/><span class="green">Duration:</span> 5s`;
}
roleActions.drain.getDesc = function (state) {
	return `Deals unaspected damage with a potency of 80.<br/><span class="green">Additional Effect:</span> Absorbs a portion of damage dealt as HP`;
}
roleActions.leg_graze.getDesc = function (state) {
	return `Inflicts target with <span class="yellow">Heavy</span> +40%.<br/><span class="green">Duration:</span> 10s`;
}
roleActions.leg_sweep.getDesc = function (state) {
	return `Stuns target.<br/><span class="green">Duration:</span> 3s`;
}
roleActions.protect.getDesc = function (state) {
	return `Increases the physical and magic defense of target and all party members nearby target.<br/><span class="green">Duration:</span> 30m`;
}
roleActions.provoke.getDesc = function (state) {
	return `Gesture threateningly, placing yourself at the top of a target's enmity list.`;
}
roleActions.convalescence.getDesc = function (state) {
	return `Increases own HP recovery via healing magic by 20%.<br/><span class="green">Duration:</span> 20s`;
}
roleActions.diversion.getDesc = function (state) {
	return `Reduces enmity generation.<br/><br/><span class="green">Duration:</span> 15s`;
}
roleActions.esuna.getDesc = function (state) {
	return `Removes a single detrimental effect from target.`;
}
roleActions.peloton.getDesc = function (state) {
	return `Increases movement speed of self and nearby party members as long as they remain within distance.<br/>
			<span class="green">Duration:</span> 30s<br/>Effect also ends upon reuse or when enmity is generated. Cannot be used in battle.`;
}
roleActions.anticipation.getDesc = function (state) {
	return `Increases parry rate by 30%.<br/><span class="green">Duration:</span> 20s`;
}
roleActions.invigorate.getDesc = function (state) {
	return `Instantly restores 400 TP.`;
}
roleActions.lucid_dreaming.getDesc = function (state) {
	return `Reduces enmity by half.<br/><span class="green">Additional Effect:</span> <span class="yellow">Refresh</span><br/>
			<span class="green">Refresh Potency:</span> 80<br/><span class="green">Duration:</span> 21s`;
}
roleActions.bloodbath.getDesc = function (state) {
	return `Converts a portion of physical damage dealt into HP.<br/><span class="green">Duration:</sapn> 20s`;
}
roleActions.reprisal.getDesc = function (state) {
	return `Increases parry rate by 30%.<br/><span class="green">Duration:</span> 20s`;
}
roleActions.swiftcast.getDesc = function (state) {
	return `Next spell is cast immediately.<br/><span class="green">Duration:</span> 10s`;
}
roleActions.tactician.getDesc = function (state) {
	return `Gradually restores own TP and the TP of all nearby party members.<br/>
			<span class="green">Duration:</span> 30s<br/><span class="green">Additional Effect:</span> Halves enmity`;
}
roleActions.awareness.getDesc = function (state) {
	return `Nullifies chance of suffering critical damage.<br/><span class="green">Duration:</span> 25s`;
}
roleActions.eye_for_an_eye.getDesc = function (state) {
	return `Erects a magicked barrier around a single party member or pet.<br/><span class="green">Duration:</span> 20s<br/>
			<span class="green">Barrier Effect:</span> 20% chance that when barrier is struck, the striker will deal 10% less damage<br/><span class="green">Duration:</span> 10s`;
}
roleActions.goad.getDesc = function (state) {
	return `Refreshes TP of a single party member.<br/><span class="green">Duration:</span> 30s`;
}
roleActions.mana_shift.getDesc = function (state) {
	return `Transfers up to 20% of own maximum MP to target party member.`;
}
roleActions.refresh.getDesc = function (state) {
	return `Gradually restores own MP and the MP of all nearby party members.<br/><span class="green">Duration:</span> 30s<br/><span class="green">Additional Effect:</span> Halves enmity`;
}
roleActions.apocatastasis.getDesc = function (state) {
	return `Reduces a party member's magic vulnerability by 20%.<br/><span class="green">Duration:</span> 10s`;
}
roleActions.feint.getDesc = function (state) {
	return `Lowers target's strength and dexterity by 10%.<br/><span class="green">Duration:</span> 10s`;
}
roleActions.head_graze.getDesc = function (state) {
	return `Silences target.<br/><span class="green">Duration:</span> 1s`;
}
roleActions.interject.getDesc = function (state) {
	return `Silences target.<br/><span class="green">Duration:</span> 1s`;
}
roleActions.largesse.getDesc = function (state) {
	return `Increases healing magic potency by 20%.<br/><span class="green">Duration:</span> 20s`;
}
roleActions.arm_graze.getDesc = function (state) {
	return `Stuns target.<br/><span class="green">Duration:</span> 2s`;
}
roleActions.crutch.getDesc = function (state) {
	return `Removes <span class="yellow">Bind</span> and <span class="yellow">Heavy</span> from target party member other than self.`;
}
roleActions.surecast.getDesc = function (state) {
	return `Next spell is cast without interruption.<br/><span class="green">Additional Effect:</span> Nullifies knockback and draw-in effects<br/><span class="green">Duration:</span> 10s`;
}
roleActions.ultimatum.getDesc = function (state) {
	return `Provoke nearby enemies, placing yourself at the top of their enmity list.`;
}
roleActions.erase.getDesc = function (state) {
	return `Removes a single damage over time effect from target party member other than self.<br/>
			<span class="green">Additional Effect:</span> Restores target's HP<br/><span class="green">Cure Potency:</span> 200`;
}
roleActions.palisade.getDesc = function (state) {
	return `Reduces physical damage taken by a party member by 20%.<br/><span class="green">Duration:</span> 10s`;
}
roleActions.rescue.getDesc = function (state) {
	return `Instantly draw target party member to your side. Cannot be used outside of combat or when target is suffering from certain enfeeblements.`;
}
roleActions.shirk.getDesc = function (state) {
	return `Diverts 25% of enmity to target party member.`;
}
roleActions.true_north.getDesc = function (state) {
	return `Nullifies all action direction requirements.<br/><span class="green">Duration:</span> 15s`;
}
roleActions.wait_for_mana.getDesc = function (state) {
	return `Take no action until the next mana tick.`;
}
roleActions.max_ether_hq.getDesc = function (state) {
	return `Restores up to 20% of MP (1700 points max).<br/>Processed via the alchemical extraction of aetheric essence occurring in elemental crystals, the contents of this vial instantly restore a considerable amount of MP.`
}
roleActions.infusion_intelligence.getDesc = function (state) {
	return `Intelligence +10% (Max 137)<br/>
			This diluted brew temporarily increases intelligence, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`;
}
roleActions.infusion_mind.getDesc = function (state) {
	return `Mind +10% (Max 137)<br/>
			This diluted brew temporarily increases Mind, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`;
}
roleActions.infusion_strength.getDesc = function (state) {
	return `Strength +10% (Max 137)<br/>
			This diluted brew temporarily increases Strength, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`;
}
roleActions.infusion_dexterity.getDesc = function (state) {
	return `Dexterity +10% (Max 137)<br/>
			This diluted brew temporarily increases Dexterity, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`;
}
roleActions.infusion_vitality.getDesc = function (state) {
	return `Vitality +10% (Max 137)<br/>
			This diluted brew temporarily increases Vitality, but for twice the duration of similar potions.<br/>
			<span class="green">Duration:</span> 30s`;
}

/***************

STATUSES

 ***************/

const general_status = {
	//general
	heavy: new Status("Heavy", 20, "#A02F2F"),
	stun: new Status("Stun", 6, "#A02F2F"),
	blind: new Status("Blind", 12, "#A02F2F"),
	pacification: new Status("Pacification", 6, "#A02F2F"),
	medicated: new Status("Medicated", 30, "#2F5F90"),
	//caster
	addle: new Status("Addle", 10, "#6F3FA0"),
	swiftcast: new Status("Swiftcast", 10, "#E090C0"),
	lucid_dreaming: new Status("Lucid Dreaming", 21, "#905F7F"),
	diversion: new Status("Diversion", 15, "#6FF07F"),
	surecast: new Status("Surecast", 10, "#7FA0A0"),
	apocatastasis: new Status("Apocatastasis", 10, "#904FC0"),
	//ranged
	tactician: new Status("Tactitian", 30, "#E0901F"),
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

/***************

STATUS OVERRIDES

 ***************/

general_status.tactician.tick = function (state) {
	setTP(state.tp + 50);
};
general_status.refresh.tick = function (state) {
	setMana(state.mana + (state.maxMana * .02));
};



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
		mana: 9000,
		sks: 2.4,
		spd: 2.5,
	},
	MCH: {
		mana: 0,
		sks: 2.42,
		spd: 2.5,
	},
	RDM: {
		mana: 14000,
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
		mana: 1000,
		sks: 2.5,
		spd: 2.5,
	}
}