/***************

CLASSES

 ***************/

 class MNK_WeaponSkill extends WeaponSkill {
	constructor(name, level, potency, tp, range, radius) {
		super(name, level, potency, 0, tp, range, radius, ['MNK']);
	}
	
	getPotencyMod(state){
		var mod = 1;
		mod += getStacks('greased_lightning') * .1;
		mod += (hasStatus('twin_snakes') ? .1 : 0);
		mod += (hasStatus('dragon_kick') ? .1 : 0);
		mod += (hasStatus('fists_of_fire') ? .05 : 0);
		mod += (hasStatus('riddle_of_fire') ? .3 : 0);
		return mod;
	}
	
	getPotency(state){
		
		return super.getPotency(state) * this.getPotencyMod(state);
	}
	
	getCast(state){
		var base = super.getCast(state);
		var mod = 1;
		mod -= getStacks('greased_lightning') * .05;
		
		mod += (hasStatus('riddle_of_fire')? .15 : 0);
		
		return base * mod;
	}
	
	getRecast(state){
		var base = super.getRecast(state);
		var mod = 1;
		mod -= getStacks('greased_lightning') * .05;
		
		mod += (hasStatus('riddle_of_fire')? .15 : 0);
		
		return base * mod;
	}

}

 class MNK_StanceWS extends MNK_WeaponSkill {
	constructor(name, level, potency, tp, range, radius, stance_from, stance_to) {
		super(name, level, potency, tp, range, radius);
		this.stance_from = stance_from;
		this.stance_to = stance_to;
	}
	
	execute(state) {
		super.execute(state);
		if((hasStatus('coeurl_form') && this.stance_from == 'coeurl_form') || hasStatus('perfect_balance'))
			updateStatus('greased_lightning', 1);
		
		setStatus('opoopo_form', false);
		setStatus('raptor_form', false);
		setStatus('coeurl_form', false);
		setStatus(this.stance_to, true);
	}

	isUseable(state){
		if(this.stance_from == 'opoopo_form' || hasStatus('perfect_balance'))
			return super.isUseable(state);
		return hasStatus(this.stance_from) && super.isUseable(state);
	}
	
	isHighlighted(state){
		return hasStatus(this.stance_from);
	}
	
}


class MNK_PositionalWS extends MNK_StanceWS {
	constructor(name, level, potency, tp, range, radius, stance_from, stance_to, facing, facing_potency) {
		super(name, level, potency, tp, range, radius, stance_from, stance_to);
		this.facing = facing;
		this.facing_potency = facing_potency;
	}
	
	getPotency(state){
		if(state.positionals)
			return this.facing_potency * this.getPotencyMod(state);
		return  super.getPotency(state);
	}
}

class MNK_Ability extends Ability {
	constructor(name, level, recast) {
		super(name, level, recast, 0, 0, ['MNK'])
	}
}

class MNK_DamageAbility extends DamageAbility {
	constructor(name, level, potency, recast, range, radius) {
		super(name, level, potency, recast, range, radius, ['MNK']);
	}

}

class MNK_Buff extends Buff {
	constructor(name, level, recast) {
		super(name, level, recast, ['MNK']);
	}
}

class MNK_Fist extends MNK_Buff{
	constructor(name, level){
		super(name, level, 3);
	}
	
	execute(state){
		super.execute(state);
		setStatus('fists_of_earth', false);
		setStatus('fists_of_wind', false);
		setStatus('fists_of_fire', false);
		setStatus(this.id, true);
	}
	
	
	recastGroup(state){
		return 'fist';
	}
}

/***************

ACTIONS

 ***************/

const mnk_actions = { 
	bootshine: new MNK_PositionalWS("Bootshine", 1, 140, 50, 3, 0, 'opoopo_form', 'raptor_form', 'rear', 140*1.5),
	true_strike: new MNK_PositionalWS("True Strike", 4, 140, 50, 3, 0, 'raptor_form', 'coeurl_form', 'rear', 180),
	demolish: new MNK_PositionalWS("Demolish", 30, 30, 40, 3, 0, 'coeurl_form','opoopo_form', 'rear', 70),
	
	dragon_kick: new MNK_PositionalWS("Dragon Kick", 50, 100, 50, 3, 0, 'opoopo_form', 'raptor_form', 'flank', 140),
	twin_snakes: new MNK_PositionalWS("Twin Snakes", 18, 100, 50, 3, 0, 'raptor_form', 'coeurl_form', 'flank', 130),
	snap_punch: new MNK_PositionalWS("Snap Punch", 6, 130, 40, 3, 0, 'coeurl_form', 'opoopo_form', 'flank', 170),
	
	arm_of_the_destroyer: new MNK_StanceWS("Arm of the Destroyer", 26, 50, 130, 0, 5, 'opoopo_form', 'raptor_form', 50),
	one_ilm_punch: new MNK_StanceWS("One Ilm Punch", 45, 120, 120, 3, 0, 'raptor_form', 'coeurl_form'),
	rockbreaker: new MNK_StanceWS("Rockbreaker", 30, 130, 120, 5, 5, 'coeurl_form', 'opoopo_form'),
	
	form_shift: new MNK_WeaponSkill("Form Shift", 52, 0, 0, 0, 0),
	meditation: new MNK_Ability("Meditation", 54, 1.2),
	the_forbidden_chakra: new MNK_DamageAbility("The Forbidden Chakra", 54, 250, 5, 3, 0),
	purification: new MNK_Ability("Purification", 58, 120),
	
	elixer_field: new MNK_DamageAbility("Elixer Field", 56, 220, 30, 0, 5),
	steel_peak: new MNK_DamageAbility("Steel Peak", 38, 150, 40, 3, 0),
	shoulder_tackle: new MNK_DamageAbility("Shoulder Tackle", 35, 100, 30, 20, 0),
	howling_fist: new MNK_DamageAbility("Howling Fist", 46, 210, 60, 10, 10),
	tornado_kick: new MNK_DamageAbility("Tornado Kick", 60, 330, 10, 3, 0),
	
	perfect_balance: new MNK_Buff("Perfect Balance", 50, 180),
	internal_release: new MNK_Buff("Internal Release", 10, 60),
	mantra: new MNK_Buff("Mantra", 42, 120),
		
	fists_of_earth: new MNK_Fist("Fists of Earth", 15),
	fists_of_wind: new MNK_Fist("Fists of Wind", 34),
	fists_of_fire: new MNK_Fist("Fists of Fire", 40),

	riddle_of_earth: new MNK_Buff("Riddle of Earth", 64, 60),
	riddle_of_wind: new MNK_DamageAbility("Riddle of Wind", 66, 65, 0, 20, 0),	
	riddle_of_fire: new MNK_Buff("Riddle of Earth", 68, 60),
	brotherhood: new MNK_Buff("Brotherhood", 70, 90),

	earth_tackle: new MNK_DamageAbility("Earth Tackle", 66, 100, 30, 10, 0),	
	wind_tackle: new MNK_DamageAbility("Wind Tackle", 66, 65, 30, 20, 0),	
	fire_tackle: new MNK_DamageAbility("Fire Tackle", 66, 130, 30, 20, 0),
	
	};

/***************

ACTION OVERRIDES

 ***************/

mnk_actions.bootshine.getPotency = function(state){
	if(hasAnyStatus([this.stance_from, 'perfect_balance']))
		if(state.positionals)
			return this.facing_potency * this.getPotencyMod(state);
	return this.potency * this.getPotencyMod(state);
}
 
mnk_actions.dragon_kick.unique = function(state){
	setStatus(this.id, true);
}
mnk_actions.twin_snakes.unique = function(state){
	setStatus(this.id, true);
}
mnk_actions.demolish.unique = function(state){
	setStatus(this.id, true);
}

mnk_actions.arm_of_the_destroyer.damageSteps = [1];
mnk_actions.rockbreaker.damageSteps = [1];

mnk_actions.form_shift.unique = function(state){
	if(hasStatus('opoopo_form'))
	{
		setStatus('opoopo_form', false);
		setStatus('raptor_form', true);
	} else if(hasStatus('raptor_form'))
	{
		setStatus('raptor_form', false);
		setStatus('coeurl_form', true);
	} else if(hasStatus('coeurl_form'))
	{
		setStatus('coeurl_form', false);
		setStatus('opoopo_form', true);
	} else {
		setStatus('opoopo_form', true);
	}
	
}

mnk_actions.meditation.animTime = mnk_actions.meditation.recast;
mnk_actions.meditation.unique = function(state){
	updateStatus('chakra',1);
}

mnk_actions.meditation.isUseable = function(state){
	return getStacks('chakra') < 5;
}

mnk_actions.the_forbidden_chakra.isUseable = function(state){
	return getStacks('chakra') == 5;
}
mnk_actions.the_forbidden_chakra.unique = function(state){
	setStatus('chakra', false);
}

mnk_actions.purification.isUseable = function(state){
	return getStacks('chakra') == 5;
}

mnk_actions.purification.unique = function(state){
	setTp(state.tp + 300);
	setStatus('chakra', false);
}


mnk_actions.elixer_field.damageSteps = [1];

mnk_actions.shoulder_tackle.getReplacement = function(state){
	if(state.level >= 66){
		if(hasStatus('fists_of_fire'))
			return 'fire_tackle';
		if(hasStatus('fists_of_earth'))
			return 'earth_tackle';
		if(hasStatus('fists_of_wind'))
			if(hasStatus('riddle_of_wind'))
				return 'riddle_of_wind';
			else
				return 'wind_tackle';
	}
	return false;
}

mnk_actions.earth_tackle.hidden = true;
mnk_actions.wind_tackle.hidden = true;
mnk_actions.wind_tackle.unique = function(state){
	setStatus('riddle_of_wind', true);
}
mnk_actions.fire_tackle.hidden = true;

mnk_actions.riddle_of_wind.hidden = true;
mnk_actions.riddle_of_wind.unique = function(state){
	setStatus('riddle_of_wind',false);
}

mnk_actions.howling_fist.damageSteps = [1];

mnk_actions.tornado_kick.isUseable = function(state){
	return getStacks('greased_lightning')  == 3;
}
mnk_actions.tornado_kick.unique = function(state){
	setStatus('greased_lightning', false);
}

mnk_actions.riddle_of_earth.unique = function(state){
	setStatus('fists_of_earth', true);
	setStatus('fists_of_fire', false);
	setStatus('fists_of_wind', false);
	if(hasStatus('greased_lightning'))
		updateStatus('greased_lightning', 0);
}

mnk_actions.riddle_of_fire.unique = function(state){
	setStatus('fists_of_earth', false);
	setStatus('fists_of_fire', true);
	setStatus('fists_of_wind', false);
}

/***************

STATUSES

 ***************/

const mnk_status = {
	opoopo_form: new Status("Opo-opo Form", 10, "#fff"),
	raptor_form: new Status("Raptor Form", 10, "#fff"),
	coeurl_form: new Status("Coeurl Form", 10, "#fff"),
	internal_release: new Status("Internal Release", 15, "#fff"),
	greased_lightning: new StatusStack("Greased Lightning", 16, "#fff", 1, 3),
	
	dragon_kick: new Status("Dragon Kick", 15, "#fff"),
	twin_snakes: new Status("Twin Snakes", 15, "#fff"),
	demolish: new Dot("Demolish", 18, 50, "#fff"),
	
	fists_of_earth: new Status("Fists of Earth", 99, "#fff"),
	fists_of_wind: new Status("Fists of Wind", 99, "#fff"),
	fists_of_fire: new Status("Fists of Fire", 99, "#fff"),

	mantra: new Status("Mantra", 15, "#fff"),
	perfect_balance: new Status("Perfect Balance", 10, "#fff"),
		
	brotherhood: new Status("Brotherhood", 15, "#fff"),
	chakra: new StatusStack("Chakra",99, "#fff", 1, 5),

	riddle_of_earth: new Status("Riddle of Earth", 30, "#fff"),
	earths_reply: new Status("Earth's Reply", 30, "#fff"),
	riddle_of_wind: new Status("Riddle of Wind", 5, "#fff"),
	riddle_of_fire: new Status("Riddle of Fire", 20, "#fff"),
};

/***************

STATUS OVERRIDES

 ***************/
mnk_status.fists_of_earth.finalize = function(state){
	setStatus('riddle_of_earth', false);
}

mnk_status.fists_of_fire.finalize = function(state){
	setStatus('riddle_of_fire', false);
}
 
/***************

DESCRIPTIONS

 ***************/
 
mnk_actions.bootshine.getDesc = function (state) {
	return `Delivers an attack with a potency of 140.<br/>
<span class="green">Opo-opo Form Bonus:</span> Critical damage if dealt from a target's rear<br/>
<span class="green">Additional Effect:</span> Changes form to <span class="orange">raptor</span><br/>
<span class="green">Duration:</span> 10s`;
}
mnk_actions.true_strike.getDesc = function (state) {
	return `Delivers an attack with a potency of 140.<br/>
180 when executed from a target's rear.<br/>
Can only be executed when in <span class="orange">raptor</span> form.<br/>
<span class="green">Additional Effect:</span> Changes form to <span class="orange">coeurl</span><br/>
<span class="green">Duration:</span> 10s`;
}
mnk_actions.demolish.getDesc = function (state) {
	return `Delivers an attack with a potency of 30.<br/>
70 when executed from a target's rear.<br/>
Can only be executed when in <span class="orange">coeurl</span> form.<br/>
<span class="green">Additional Effect:</span> Damage over time<br/>
<span class="green">Potency:</span> 50<br/>
<span class="green">Duration:</span> 18s<br/>
<span class="green">Additional Effect:</span> Changes form to <span class="orange">opo-opo</span><br/>
<span class="green">Duration:</span> 10s<br/>
<span class="green">Additional Effect:</span> Grants <span class="yellow">Greased Lightning</span><br/>
<span class="green">Duration:</span> 16s<br/>
<span class="green">Greased Lightning Bonus:</span> Increases damage dealt by 10% and reduces weaponskill cast time and recast time, spell cast time and recast time, and auto-attack delay by 5%`;
}
mnk_actions.dragon_kick.getDesc = function (state) {
	return `Delivers an attack with a potency of 100.<br/>
140 when executed from a target's flank.<br/>
<span class="green">Opo-opo Form Bonus:</span> Reduces target's blunt resistance by 10%<br/>
<span class="green">Duration:</span> 15s<br/>
<span class="green">Additional Effect:</span> Changes form to <span class="orange">raptor</span><br/>
<span class="green">Duration:</span> 10s`;
}
mnk_actions.twin_snakes.getDesc = function (state) {
	return `Delivers an attack with a potency of 100.<br/>
130 when executed from a target's flank.<br/>
Can only be executed when in <span class="orange">raptor</span> form.<br/>
<span class="green">Additional Effect:</span> Increases damage by 10%<br/>
<span class="green">Duration:</span> 15s<br/>
<span class="green">Additional Effect:</span> Changes form to <span class="orange">coeurl</span><br/>
<span class="green">Duration:</span> 10s`;
}
mnk_actions.snap_punch.getDesc = function (state) {
	return `Delivers an attack with a potency of 130.<br/>
170 when executed from a target's flank.<br/>
Can only be executed when in <span class="orange">coeurl</span> form.<br/>
<span class="green">Additional Effect:</span> Changes form to <span class="orange">opo-opo</span><br/>
<span class="green">Duration:</span> 10s<br/>
<span class="green">Additional Effect:</span> Grants <span class="yellow">Greased Lightning</span><br/>
<span class="green">Duration:</span> 16s<br/>
<span class="green">Greased Lightning Bonus:</span> Increases damage dealt by 10% and reduces weaponskill cast time and recast time, spell cast time and recast time, and auto-attack delay by 5%`;
}
mnk_actions.arm_of_the_destroyer.getDesc = function (state) {
	return `Delivers an attack with a potency of 50 to all nearby targets.<br/>
<span class="green">Opo-opo Form Bonus:</span> <span class="yellow">Silence</span><br/>
<span class="green">Duration:</span> 1s<br/>
<span class="green">Additional Effect:</span> Changes form to <span class="orange">raptor</span><br/>
<span class="green">Duration:</span> 10s`;
}
mnk_actions.one_ilm_punch.getDesc = function (state) {
	return `Delivers an attack with a potency of 120.<br/>
Can only be executed when in <span class="orange">raptor</span> form.<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Stun</span><br/>
<span class="green">Duration:</span> 1s<br/>
<span class="yellow">Stun</span> is impervious to stun nullifying effects.<br/>
<span class="green">Additional Effect:</span> Changes form to <span class="orange">coeurl</span><br/>
<span class="green">Duration:</span> 10s`;
}
mnk_actions.rockbreaker.getDesc = function (state) {
	return `Delivers an attack with a potency of 130 to all enemies in a cone before you.<br/>
Can only be executed when in <span class="orange">coeurl</span> form.<br/>
<span class="green">Additional Effect:</span> Changes form to <span class="orange">opo-opo</span><br/>
<span class="green">Duration:</span> 10s<br/>
<span class="green">Additional Effect:</span> Grants <span class="yellow">Greased Lightning</span><br/>
<span class="green">Duration:</span> 16s<br/>
<span class="green">Greased Lightning Bonus:</span> Increases damage dealt by 10% and reduces weaponskill cast time and recast time, spell cast time and recast time, and auto-attack delay by 5%`;
}
mnk_actions.form_shift.getDesc = function (state) {
	return `Shifts your current form to the next in the sequence. If no form is being used when executed, you will move into the <span class="orange">opo-opo</span> form.`;
}
mnk_actions.meditation.getDesc = function (state) {
	return `Opens a chakra. Up to five chakra can be opened at once.<br/>
Shares a recast timer with all other weaponskills.`;
}
mnk_actions.the_forbidden_chakra.getDesc = function (state) {
	return `Delivers an attack with a potency of 250.<br/>
Can only be executed while under the effect of the <span class="yellow">Fifth Chakra</span>. The five chakras close upon execution.`;
}
mnk_actions.purification.getDesc = function (state) {
	return `Restores 300 TP.<br/>
Can only be executed while under the effect of the <span class="yellow">Fifth Chakra</span>. The five chakras close upon execution.`;
}
mnk_actions.elixer_field.getDesc = function (state) {
	return `Delivers an attack with a potency of 220 to all nearby enemies.`;
}
mnk_actions.steel_peak.getDesc = function (state) {
	return `Delivers an attack with a potency of 150.`;
}
mnk_actions.shoulder_tackle.getDesc = function (state) {
	return `Rushes target and delivers an attack with a potency of 100.<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Stun</span><br/>
<span class="green">Duration:</span> 2s<br/>
Cannot be executed while bound.`;
}
mnk_actions.howling_fist.getDesc = function (state) {
	return `Delivers an attack with a potency of 210 to all enemies in a straight line before you.`;
}
mnk_actions.tornado_kick.getDesc = function (state) {
	return `Delivers an attack with a potency of 330.<br/>
Can only be executed while under the effect of <span class="yellow">Greased Lightning</span> III. Effect fades upon execution.`;
}
mnk_actions.perfect_balance.getDesc = function (state) {
	return `Allows execution of weaponskills which require a certain form, without being in that form.
<span class="green">Duration:</span> 10s`;
}
mnk_actions.internal_release.getDesc = function (state) {
	return `Increases critical hit rate by 30%.<br/>
<span class="green">Duration:</span> 15s`;
}
mnk_actions.mantra.getDesc = function (state) {
	return `Increases HP recovery via healing magic by 20% for self and nearby party members.<br/>
<span class="green">Duration:</span> 15s`;
}
mnk_actions.fists_of_earth.getDesc = function (state) {
	return `Reduces damage taken by 10%.<br/>
Cannot be used with <span class="orange">Fists of Fire</span> or <span class="orange">Fists of Wind</span>, and shares recast timer with both.<br/>
Effect ends upon reuse.`;
}
mnk_actions.fists_of_wind.getDesc = function (state) {
	return `Increases movement speed.<br/>
Cannot be used with <span class="orange">Fists of Earth</span> or <span class="orange">Fists of Fire</span>, and shares recast timer with both.<br/>
Effect ends upon reuse.`;
}
mnk_actions.fists_of_fire.getDesc = function (state) {
	return `Increases damage dealt by 5%.<br/>
Cannot be used with <span class="orange">Fists of Earth</span> or <span class="orange">Fists of Wind</span>, and shares recast timer with both.<br/>
Effect ends upon reuse.`;
}
mnk_actions.riddle_of_earth.getDesc = function (state) {
	return `Grants <span class="yellow">Fists of Earth</span>. Also grants <span class="yellow">Earth's Reply</span> if damage is taken while active.<br/>
<span class="green">Duration:</span> 30s<br/>
<span class="green">Additional Effect:</span> Extends <span class="yellow">Greased Lightning</span> duration to maximum<br/>
<span class="green">Earth's Reply Bonus:</span> Reduces damage taken by 10%<br/>
<span class="green">Duration:</span> 30s<br/>
Both <span class="yellow">Riddle of Earth</span> and <span class="yellow">Earth's Reply</span> are canceled if <span class="yellow">Fists of Earth</span> ends.`;
}
mnk_actions.riddle_of_wind.getDesc = function (state) {
	return `Rushes target and delivers an attack with a potency of 65.<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Stun</span><br/>
<span class="green">Duration:</span> 2s<br/>
Can only be executed while under the effect of <span class="yellow">Fists of Wind</span> and <span class="yellow">Riddle of Wind</span><br/>
Cannot be executed while bound.`;
}
mnk_actions.riddle_of_fire.getDesc = function (state) {
	return `Increases damage dealt by 30% while increasing weaponskill recast time by 15%. Also grants <span class="yellow">Fists of Fire</span>.<br/>
<span class="green">Duration:</span> 20s<br/>
<span class="yellow">Riddle of Fire</span> is canceled if <span class="yellow">Fists of Fire</span> ends.`;
}
mnk_actions.brotherhood.getDesc = function (state) {
	return `Increases physical damage dealt by nearby party members by 5%. Also grants a 30% chance of opening a chakra when party members under the effect of <span class="yellow">Brotherhood</span> execute a weaponskill.<br/>
<span class="green">Duration:</span> 15s`;
}
mnk_actions.earth_tackle.getDesc = function (state) {
	return `Rushes target and delivers an attack with a potency of 100.<br/>
<span class="green">Additional Effect:</span> 10-yalm knockback<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Stun</span><br/>
<span class="green">Duration:</span> 2s<br/>
Can only be executed while under the effect of <span class="yellow">Fists of Earth</span>.<br/>
Cannot be executed while bound.`;
}
mnk_actions.wind_tackle.getDesc = function (state) {
	return `Rushes target and delivers an attack with a potency of 65.<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Stun</span><br/>
<span class="green">Duration:</span> 2s<br/>
<span class="green">Additional Effect:</span> Grants <span class="yellow">Riddle of Wind</span><br/>
<span class="green">Duration:</span> 5s<br/>
Can only be executed while under the effect of <span class="orange">Fists of Wind</span>.<br/>
Cannot be executed while bound.`;
}
mnk_actions.fire_tackle.getDesc = function (state) {
	return `Rushes target and delivers an attack with a potency of 130.<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Stun</span><br/>
<span class="green">Duration:</span> 2s<br/>
Can only be executed while under the effect of <span class="orange">Fists of Fire</span>.<br/>
Cannot be executed while bound.`;
}