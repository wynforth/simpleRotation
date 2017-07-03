/***************

CLASSES

 ***************/

class BRD_WeaponSkill extends WeaponSkill {
	constructor(name, level, potency, cast, tp, range, radius) {
		super(name, level, potency, cast, tp, range, radius);
		this.affinity = ['BRD'];
	}

	getCast(state) {
		return super.getCast(state);
	}

	getRecast(state) {
		return super.getRecast(state);
	}

	execute(state) {
		super.execute(state);
	}

	getPotency(state) {
		return super.getPotency(state);
	}
}

class BRD_Spell extends Spell {
	constructor(name, level, potency, cast, range, radius) {
		super(name, level, potency, cast, range, radius);
		this.affinity = ['BRD'];
	}
}

class BRD_StatusWS extends BRD_WeaponSkill {
	constructor(name, level, potency, cast, tp, range, radius) {
		super(name, level, potency, cast, tp, range, radius);
	}

	execute(state) {
		setStatus(this.id, true);
	}
}

class BRD_Buff extends Buff {
	constructor(name, level, recast) {
		super(name, level, recast);
		this.affinity = ['BRD'];
	}
}

class BRD_Song extends Buff {
	constructor(name, level, potency, recast, range) {
		super(name, level, recast);
		this.potency = potency;
		this.range = range;
		this.type = "spell";
		this.affinity = ['BRD'];
	}

	execute(state) {
		super.execute(state);
		addRecast(this.recastGroup(), this.recast);
		addRecast('global', state.targetTime - state.currentTime);
	}

	recastGroup() {
		return this.id;
	}

	getRecast(state) {
		return 2.5;
	}

}

class BRD_Action extends BaseAction {
	constructor(name, level, potency, recast, range) {
		super(name, level);
		this.recast = recast;
		this.range = range;
		this.potency = potency;
		this.affinity = ['BRD'];
	}
}

/***************

ACTIONS

 ***************/

const brd_actions = {
	heavy_shot: new BRD_WeaponSkill("Heavy Shot", 1, 150, 0, 50, 25, 0),
	straight_shot: new BRD_StatusWS("Straight Shot", 2, 140, 0, 50, 25, 0),
	venomous_bite: new BRD_StatusWS("Venomous Bite", 6, 100, 0, 60, 25, 0),
	windbite: new BRD_StatusWS("Windbite", 30, 60, 0, 60, 25, 0),
	empyreal_arrow: new BRD_WeaponSkill("Empyreal Arrow", 54, 230, 0, 0, 25, 0),
	iron_jaws: new BRD_WeaponSkill("Iron Jaws", 56, 100, 0, 0, 25, 0),
	refulgent_arrow: new BRD_WeaponSkill("Refulgent Arrow", 70, 300, 0, 0, 25, 0),

	quick_nock: new BRD_WeaponSkill("Quick Nock", 18, 110, 0, 120, 12, 12),
	rain_of_death: new BRD_StatusWS("Rain of Death", 45, 100, 0, 0, 25, 8),

	sidewinder: new BRD_Action("Sidewinder", 60, 100, 60, 25),
	miserys_end: new BRD_Action("Misery's End", 10, 190, 12, 25),
	bloodletter: new BRD_Action("Bloodletter", 12, 130, 15, 25),

	raging_strikes: new BRD_Buff("Raging Strikes", 4, 80),
	barrage: new BRD_Buff("Barrage", 38, 90),
	foe_requiem: new BRD_Spell("Foe Requiem", 35, 100, 1.5, 0, 25),

	pitch_perfect: new BRD_Action("Pitch Perfect", 52, 0, 3, 25),
	mages_ballad: new BRD_Song("Mage's Ballad", 30, 100, 80, 25),
	armys_paeon: new BRD_Song("Army's Paeon", 40, 100, 80, 25),
	the_wanderers_minuet: new BRD_Song("The Wanderer's Minuet", 52, 100, 80, 25),
	battle_voice: new BRD_Buff("Battle Voice", 50, 180),
	troubadour: new BRD_Buff("Troubadour", 62, 180),

	natures_minne: new BRD_Buff("Nature's Minne", 66, 45),
	the_wardens_paean: new BRD_Buff("The Warden's Paean", 58, 45),
	repelling_shot: new BRD_Action("Repelling Shot", 15, 0, 30, 5),

	caustic_bite: new BRD_StatusWS("Caustic Bite", 64, 120, 0, 60, 25, 0),
	stormbite: new BRD_StatusWS("Stormbite", 64, 120, 0, 60, 25, 0),
};

/***************

ACTION OVERRIDES

 ****************/
brd_actions.venomous_bite.getReplacement = function (state) {
	return state.level >= 64 ? 'caustic_bite' : this.id;
}

brd_actions.windbite.getReplacement = function (state) {
	return state.level >= 64 ? 'stormbite' : this.id;
}

brd_actions.rain_of_death.recast = 15;
brd_actions.rain_of_death.recastGroup = function () {
	return 'bloodletter';
};

brd_actions.miserys_end.isUseable = function (state) {
	return false;
};

brd_actions.battle_voice.radius = 20;

brd_actions.foe_requiem.execute = function (state) {
	setStatus(this.id, !hasStatus(this.id));
};

brd_actions.pitch_perfect.isUseable = function (state) {
	return getStacks('the_wanderers_minuet') > 1;
}
brd_actions.pitch_perfect.getPotency = function (state) {
	return (getStacks('the_wanderers_minuet') - 1) * 100;
}

brd_actions.iron_jaws.execute = function (state) {
	var dots = ['venomous_bite', 'windbite', 'caustic_bite', 'stormbite'];
	for (var i = 0; i < dots.length; i++) {
		if (hasStatus(dots[i]))
			setStatus(dots[i], true);
	}
}

brd_actions.empyreal_arrow.recast = 15;
brd_actions.empyreal_arrow.execute = function (state) {
	addRecast(this.recastGroup(), this.recast);
	//addRecast('global', state.targetTime - state.currentTime);
}

brd_actions.empyreal_arrow.recastGroup = function () {
	return this.id;
}

brd_actions.empyreal_arrow.getRecast = function (state) {
	return 2.5;
}

brd_actions.sidewinder.getPotency = function (state) {
	var dots = 0;
	dots += hasAnyStatus(['venomous_bite', 'caustic_bite']) ? 1 : 0;
	dots += hasAnyStatus(['windbite', 'stormbite']) ? 1 : 0;
	var additional = 0;
	if (dots == 2)
		additional = 160;
	else if (dots == 1)
		additional = 75
			return this.potency + additional;
}

brd_actions.refulgent_arrow.isUseable = function (state) {
	return hasStatus('straiter_shot');
}

brd_actions.caustic_bite.hidden = true;
brd_actions.stormbite.hidden = true;

brd_actions.troubadour.isUseable = function (state) {
	return hasAnyStatus(['mages_ballad', 'armys_paeon', 'the_wanderers_minuet']);
}

brd_actions.troubadour.execute = function (state) {
	if (hasStatus('mages_ballad'))
		setStatus('troubadours_ballad', true);
	else if (hasStatus('armys_paeon'))
		setStatus('troubadours_paeon', true);
	else if (hasStatus('the_wanderers_minuet'))
		setStatus('troubadours_minuet', true);
}

/***************

STATUSES

 ***************/

const brd_status = {
	//BRD
	straight_shot: new Status("Straight Shot", 20, "#B01F00"),
	straighter_shot: new Status("Straighter Shot", 10, "#C7394B"),
	raging_strikes: new Status("Raging Strikes", 20, "#D03F00"),
	venomous_bite: new Dot("Venom", 18, "#905FE0", 40),
	windbite: new Dot("Windbite", 18, "#2F6FE0", 50),
	caustic_bite: new Dot("Poison", 30, "#905FE0", 45),
	stormbite: new Dot("Stormbite", 30, "#2F6FE0", 55),

	barrage: new Status("Barrage", 10, "#B07F2F"),
	foe_requiem: new Status("Foe Requiem", 10, "#90D0D0"),
	armys_paeon: new StatusStack("Army's Paeon", 30, "#D07F5F", 1, 5),
	troubadours_paeon: new Status("Troubadour", 30, "#D07F5F"),
	mages_ballad: new Status("Mage's Ballad", 30, "#A07FC0"),
	troubadours_ballad: new Status("Troubadour", 30, "#A07FC0"),
	the_wanderers_minuet: new StatusStack("The Wanderer's Minuet", 30, "#4F6F1F", 1, 4),
	troubadours_minuet: new Status("Troubadour", 30, "#4F6F1F"),
	battle_voice: new Status("Battle Voice", 20, "#7FD0E0"),

	the_wardens_paean: new Status("The Wardens Paean", 45, "#1D8D9E"),
	natures_minne: new Status("Nature's Minne", 15, "#52725F"),
};
/***************

STATUS OVERRIDES

 ***************/

brd_status.foe_requiem.tick = function (state) {
	if (state.mana < 600)
		setStatus('foe_requiem', false);
	else {
		setStatus('foe_requiem', true);
		setMana(state.mana - 600);
	}
}

/***************

DESCRIPTIONS

 ***************/

brd_actions.heavy_shot.getDesc = function (state) {
	return `Delivers an attack with a potency of ${this.getPotency(state).toFixed(0)}.<br/>
	<span class="green">Additional Effect:</span> 20% chance next <span class="orange">Straight Shot</span> will deal critical damage<br/>
	<span class="green">Duration:</span> 10s`;
};
brd_actions.straight_shot.getDesc = function (state) {
	return `Delivers an attack with a potency of ${this.getPotency(state).toFixed(0)}.<br/>
	<span class="green">Additional Effect:</span> Increases critical hit rate by 10%<br/>
	<span class="green">Duration:</span> 20s`;
};
brd_actions.raging_strikes.getDesc = function (state) {
	return `Increases damage dealt by 10%.<br/>
	<span class="green">Duration:</span> 20s`;
};
brd_actions.venomous_bite.getDesc = function (state) {
	return `Delivers an attack with a potency of ${this.getPotency(state).toFixed(0)}.<br/>
	<span class="green">Additional Effect:</span> <span class="yellow">Venom</span><br/>
	<span class="green">Potency:</span> 40<br/>
	<span class="green">Duration:</span> 18s`;
};
brd_actions.miserys_end.getDesc = function (state) {
	return `Delivers an attack with a potency of ${this.getPotency(state).toFixed(0)}.<br/>
	Can only be executed when target's HP is below 20%.`;
};
brd_actions.bloodletter.getDesc = function (state) {
	return `Delivers an attack with a potency of ${this.getPotency(state).toFixed(0)}.<br/>
	Shares a recast timer with <span class="orange">Rain of Death</span>.`;
};
brd_actions.repelling_shot.getDesc = function (state) {
	return `Jump 10 yalms back from current position. Cannot be executed while bound.`;
};
brd_actions.quick_nock.getDesc = function (state) {
	return `Delivers an attack with a potency of ${this.getPotency(state).toFixed(0)} to all enemies in a cone before you.`;
};
brd_actions.mages_ballad.getDesc = function (state) {
	return `Deals unaspected damage with a potency of ${this.getPotency(state).toFixed(0)}.<br/>
	<span class="green">Additional Effect:</span> Increases critical hit rate of all party members within a radius of 20 yalms by 2%<br/>
	<span class="green">Duration:</span> 30s<br/>
	Effect is lost if party members move out of hearing distance.<br/>
	<span class="green">Additional Effect:</span> Activates <span class="yellow">Repertoire</span>, resetting <span class="orange">Bloodletter</span> and <span class="orange">Rain of Death</span> recast time if critical damage over time is dealt by <span class="orange">Caustic Bite</span> or <span class="orange">Stormbite</span>`;
};
brd_actions.windbite.getDesc = function (state) {
	return `Deals wind damage with a potency of ${this.getPotency(state).toFixed(0)}.<br/>
	<span class="green">Additional Effect:</span> Wind damage over time<br/>
	<span class="green">Potency:</span> 50<br/>
	<span class="green">Duration:</span> 18s`;
};
brd_actions.foe_requiem.getDesc = function (state) {
	return `Increases damage taken by nearby enemies by 3%. MP is drained while singing. Effect is lost if targets move out of hearing distance, and ends upon reuse.`;
};
brd_actions.barrage.getDesc = function (state) {
	return `Triples the number of strikes for a single-target weaponskill. Additional effects added only once.<br/>
	<span class="green">Duration:</span> 10s`;
};
brd_actions.armys_paeon.getDesc = function (state) {
	return `Deals unaspected damage with a potency of ${this.getPotency(state).toFixed(0)}.<br/>
	<span class="green">Additional Effect:</span> Increases critical hit rate of all party members within a radius of 20 yalms by 2%<br/>
	<span class="green">Duration:</span> 30s<br/>
	Effect is lost if party members move out of hearing distance.<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Repertoire</span> if critical damage over time is dealt by <span class="orange">Caustic Bite</span> or <span class="orange">Stormbite</span><br/>
	<span class="green">Repertoire Effect:</span> Reduces weaponskill cast time and recast time, spell cast time and recast time, and auto-attack delay by 4%<br/>
	Can be stacked up to 4 times.`;
};
brd_actions.rain_of_death.getDesc = function (state) {
	return `Delivers an attack with a potency of ${this.getPotency(state).toFixed(0)} to target and all enemies nearby it.<br/>
	Shares a recast timer with <span class="orange">Bloodletter</span>.`;
};
brd_actions.battle_voice.getDesc = function (state) {
	return `Increases direct hit rate of all party members under the effect of your <span class="orange">Mage's Ballad</span>, <span class="orange">Army's Paeon</span>, or <span class="orange">The Wanderer's Minuet</span> by 15%.<br/>
	<span class="green">Duration:</span> 20s`;
};
brd_actions.the_wanderers_minuet.getDesc = function (state) {
	return `Deals unaspected damage with a potency of ${this.getPotency(state).toFixed(0)}.<br/>
	<span class="green">Additional Effect:</span> Increases critical hit rate of all party members within a radius of 20 yalms by 2%<br/>
	<span class="green">Duration:</span> 30s<br/>
	Effect is lost if party members move out of hearing distance.<br/>
	<span class="green">Additional Effect:</span> Allows execution of <span class="orange">Pitch Perfect</span> if critical damage over time is dealt by <span class="orange">Caustic Bite</span> or <span class="orange">Stormbite</span><br/>
	Can be stacked up to 3 times.`;
};
brd_actions.pitch_perfect.getDesc = function (state) {
	return `Delivers an attack with a potency of 100 when <span class="yellow">Repertoire</span> stack is 1, 240 when <span class="yellow">Repertoire</span> stack is 2, and 420 when <span class="yellow">Repertoire</span> stack is 3.<br/>
	Can only be executed when <span class="orange">The Wanderer's Minuet</span> is active.`;
};
brd_actions.empyreal_arrow.getDesc = function (state) {
	return `Delivers an attack with a potency of ${this.getPotency(state).toFixed(0)}. This weaponskill does not share a recast timer with any other actions.<br/>
	Guarantees the trigger of the additional effects for <span class="orange">Mage's Ballad</span>, <span class="orange">Army's Paeon</span>, and <span class="orange">The Wanderer's Minuet</span> when these actions are executed while under the effect of Empyreal Arrow.`;
};
brd_actions.iron_jaws.getDesc = function (state) {
	return `Delivers an attack with a potency of ${this.getPotency(state).toFixed(0)}.<br/>
	<span class="green">Additional Effect:</span> If the target is suffering from a <span class="orange">Caustic Bite</span> or <span class="orange">Stormbite</span> effect inflicted by you, the effect timer is reset`;
};
brd_actions.the_wardens_paean.getDesc = function (state) {
	return `Removes one select detrimental effect from a target party member or pet. If the target is not enfeebled, a barrier is created nullifying the target's next detrimental effect suffered.<br/>
	<span class="green">Duration:</span> 30s`;
};
brd_actions.sidewinder.getDesc = function (state) {
	return `Delivers an attack with a potency of ${this.getPotency(state).toFixed(0)}.<br/>
	<span class="green">Additional Effect:</span> If the target is suffering from a <span class="orange">Caustic Bite</span> or <span class="orange">Stormbite</span> effect inflicted by you, <span class="orange">Sidewinder</span> potency is increased to 175 for one effect, or 260 for both`;
};
brd_actions.troubadour.getDesc = function (state) {
	return `Adds an additional effect to the song currently being sung.<br/>
	<span class="green">Mage's Ballad Effect:</span> Increases maximum HP by 15%<br/>
	<span class="green">Army's Paeon Effect:</span> Reduces physical vulnerability by 10%<br/>
	<span class="green">The Wanderer's Minuet Effect:</span> Reduces magic vulnerability by 10%<br/>
	<span class="green">Duration:</span> 30s<br/>
	Can only be executed if a song is being sung.`;
};
brd_actions.caustic_bite.getDesc = function (state) {
	return `Delivers an attack with a potency of ${this.getPotency(state).toFixed(0)}.<br/>
	<span class="green">Additional Effect:</span> <span class="yellow">Poison</span><br/>
	<span class="green">Potency:</span> 45<br/>
	<span class="green">Duration:</span> 30s`;
};
brd_actions.stormbite.getDesc = function (state) {
	return `Deals wind damage with a potency of ${this.getPotency(state).toFixed(0)}.<br/>
	<span class="green">Additional Effect:</span> Wind damage over time<br/>
	<span class="green">Potency:</span> 55<br/>
	<span class="green">Duration:</span> 30s`;
};
brd_actions.natures_minne.getDesc = function (state) {
	return `Increases HP recovery via healing magic for a party member or self by 20%.<br/>
	<span class="green">Duration:</span> 15s`;
};
brd_actions.refulgent_arrow.getDesc = function (state) {
	return `Delivers an attack with a potency of ${this.getPotency(state).toFixed(0)}.<br/>
	Can only be executed while under the effect of <span class="yellow">Straighter Shot</span>.`;
};