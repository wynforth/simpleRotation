/***************

CLASSES

 ***************/

class RDM_Buff extends Buff {
	constructor(name, level, recast) {
		super(name, level, recast, ['RDM']);
	}
}

class RDM_Spell extends Spell {
	constructor(name, level, potency, cast, mana, range, radius, black, white) {
		super(name, level, potency, cast, mana, range, radius,['RDM'])
		this.black = black;
		this.white = white;
	}

	updateResources(state) {
		setResource1(state.resource_1 + this.black);
		setResource2(state.resource_2 + this.white);
	}

	execute(state) {
		super.execute(state);
		if (this.cast > 0) {
			if (hasStatus('swiftcast'))
				setStatus('swiftcast', false);
			else if (hasStatus('dualcast'))
				setStatus('dualcast', false);
			else if (this.getCast(state) > 0)
				setStatus('dualcast', true);
		}
		this.updateResources(state);
	}

	getCast(state) {
		return hasAnyStatus(['swiftcast','dualcast']) ? 0 : super.getCast(state);
	}
	
	getPotency(state){
		var base = super.getPotency(state);
		if(hasStatus('embolden')){
			var remaining = state.statuses['embolden'].duration;
			if(remaining > 16) return base * 1.10;
			if(remaining > 12) return base * 1.08;
			if(remaining > 8) return base * 1.06;
			if(remaining > 4) return base * 1.04;
			return base * 1.02;
		}
		return base;
	}
}

class RDM_WeaponSkill extends WeaponSkill {
	constructor(name, level, potency, cast, tp, range, radius, black, white) {
		super(name, level, potency, cast, tp, range, radius, ['RDM'])
		this.black = black;
		this.white = white;
	}

	updateResources(state) {
		setResource1(state.resource_1 - this.black);
		setResource2(state.resource_2 - this.white);
	}

	execute(state) {
		super.execute(state);
		this.updateResources(state);
	}

	isUseable(state) {
		if (state.resource_1 >= this.black && state.resource_2 >= this.white)
			return super.isUseable(state);
		return false;
	}
}

class RDM_ComboWS extends RDM_WeaponSkill {
	constructor(name, level, potency, cast, tp, range, radius, black, white, comboPotency, comboActions) {
		super(name, level, potency, cast, tp, range, radius, black, white);
		this.comboPotency = comboPotency;
		this.comboActions = comboActions;
	}
}

class RDM_Ability extends Ability {
	constructor(name, level, recast) {
		super(name, level, recast, 0, 0, ['RDM']);
	}
}

class RDM_DamageAbility extends DamageAbility {
	constructor(name, level, potency, recast, range, radius) {
		super(name, level, potency, recast, range, radius, ['RDM']);
	}
}

/***************

ACTIONS

 ***************/

const rdm_actions = {
	//melee
	riposte: new RDM_WeaponSkill("Riposte", 1, 130, 0, 100, 3, 0, 0, 0),
	zwerchhau: new RDM_ComboWS("Zwerchhau", 35, 100, 0, 100, 3, 0, 0, 0, 150, ['riposte', 'enchanted_riposte']),
	redoublement: new RDM_ComboWS("Redoublement", 50, 100, 0, 50, 3, 0, 0, 0, 230, ['zwerchhau', 'enchanted_zwerchhau']),
	//neutral
	jolt: new RDM_Spell("Jolt", 2, 180, 2, 360, 25, 0, 3, 3),
	impact: new RDM_Spell("Impact", 66, 270, 2, 360, 25, 0, 4, 4),
	//black magic
	verthunder: new RDM_Spell("Verthunder", 4, 300, 5, 480, 25, 0, 11, 0),
	verfire: new RDM_Spell("Verfire", 26, 270, 2, 360, 25, 0, 9, 0),
	verflare: new RDM_Spell("Verflare", 68, 550, 0, 600, 25, 5, 21, 0),
	//white magic
	veraero: new RDM_Spell("Veraero", 10, 300, 5, 480, 25, 0, 0, 11),
	verstone: new RDM_Spell("Verstone", 30, 270, 2, 360, 25, 0, 0, 9),
	verholy: new RDM_Spell("Verholy", 68, 550, 0, 600, 25, 5, 0, 21),
	//aoe
	scatter: new RDM_Spell("Scatter", 18, 100, 2, 480, 25, 5, 3, 3),
	moulinet: new RDM_WeaponSkill("Moulinet", 52, 60, 0, 200, 0, 5, 0, 0),
	//ogcd
	corps_a_corps: new RDM_DamageAbility("Corps-a-corps", 6, 130, 40, 25, 0),
	displacement: new RDM_DamageAbility("Displacement", 40, 130, 35, 3, 0),
	fleche: new RDM_DamageAbility("Fleche", 45, 420, 25, 3, 0),
	contre_sixte: new RDM_DamageAbility("Contre Sixte", 56, 300, 45, 25, 0),
	//buffs
	acceleration: new RDM_Buff("Acceleration", 50, 35),
	embolden: new RDM_Buff("Embolden", 58, 120),
	manafication: new RDM_Ability("Manafication", 60, 120),
	//non rotational
	tether: new RDM_Spell("Tether", 15, 0, 2.5, 1200, 25, 0, 0, 0),
	vercure: new RDM_Spell("Vercure", 54, 0, 2, 600, 25, 0, 0, 0),
	verraise: new RDM_Spell("Verraise", 64, 0, 10, 3600, 25, 0, 0, 0),
	//hidden
	jolt_ii: new RDM_Spell("Jolt II", 62, 240, 2, 360, 25, 0, 3, 3),
	enchanted_riposte: new RDM_WeaponSkill("Enchanted Riposte", 1, 210, 0, 100, 3, 0, 30, 30),
	enchanted_zwerchhau: new RDM_ComboWS("Enchanted Zwerchhau", 35, 100, 0, 100, 3, 0, 25, 25, 290, ['riposte', 'enchanted_riposte']),
	enchanted_redoublement: new RDM_ComboWS("Enchanted Redoublement", 50, 100, 0, 100, 3, 0, 25, 25, 470, ['zwerchhau', 'enchanted_zwerchhau']),
	enchanted_moulinet: new RDM_WeaponSkill("Enchanted Moulinet", 52, 60, 0, 200, 0, 5, 30, 30),
};

/***************

ACTION OVERRIDES

 ***************/
 //AoE
 
rdm_actions.scatter.damageSteps = [1];
rdm_actions.moulinet.damageSteps = [1];
rdm_actions.enchanted_moulinet.damageSteps = [1];
rdm_actions.contre_sixte.damageSteps = [.9, .8, .7, .6, .5];

rdm_actions.riposte.getReplacement = function (state) {
	if (state.resource_1 >= 30 && state.resource_2 >= 30)
		return 'enchanted_riposte';
	return false;
}
rdm_actions.enchanted_riposte.hidden = true;
rdm_actions.enchanted_riposte.recast = 1.5;

rdm_actions.jolt.getReplacement = function (state) {
	return (state.level >= 62) ? 'jolt_ii' : false;
}

rdm_actions.veraero.isHighlighted = function (state) {
	return hasStatus('acceleration');
}
rdm_actions.veraero.unique = function (state) {
	if (hasStatus('acceleration')) {
		setStatus('verstone_ready', true);
		setStatus('acceleration', false);
	}
}
rdm_actions.verthunder.isHighlighted = function (state) {
	return hasStatus('acceleration');
}
rdm_actions.verthunder.unique = function (state) {
	if (hasStatus('acceleration')) {
		setStatus('verfire_ready', true);
		setStatus('acceleration', false);
	}
}

rdm_actions.scatter.updateResources = function (state) {
	if (hasStatus('enhanced_scatter')) {
		setResource1(state.resource_1 + this.black + 5);
		setResource2(state.resource_2 + this.white + 5);
	} else {
		setResource1(state.resource_1 + this.black);
		setResource2(state.resource_2 + this.white);
	}
}

rdm_actions.verfire.unique = function (state) {
	setStatus('verfire_ready', false);
}
rdm_actions.verfire.isUseable = function (state) {
	return hasStatus('verfire_ready');
}
rdm_actions.verfire.isHighlighted = function (state) {
	return hasStatus('verfire_ready');
}

rdm_actions.verstone.unique = function (state) {
	setStatus('verstone_ready', false);
}
rdm_actions.verstone.isUseable = function (state) {
	return hasStatus('verstone_ready');
}
rdm_actions.verstone.isHighlighted = function (state) {
	return hasStatus('verstone_ready');
}

rdm_actions.zwerchhau.getReplacement = function (state) {
	if (state.resource_1 >= 25 && state.resource_2 >= 25)
		return 'enchanted_zwerchhau';
	return false;
}
rdm_actions.enchanted_zwerchhau.hidden = true;
rdm_actions.enchanted_zwerchhau.recast = 1.5;

rdm_actions.redoublement.getReplacement = function (state) {
	if (state.resource_1 >= 25 && state.resource_2 >= 25)
		return 'enchanted_redoublement';
	return false;
}
rdm_actions.enchanted_redoublement.hidden = true;
rdm_actions.enchanted_redoublement.recast = 2.2;

rdm_actions.moulinet.getReplacement = function (state) {
	if (state.resource_1 >= 30 && state.resource_2 >= 30)
		return 'enchanted_moulinet';
	return false;
}
rdm_actions.enchanted_moulinet.hidden = true;
rdm_actions.enchanted_redoublement.recast = 1.5;

rdm_actions.manafication.execute = function (state) {
	setResource1(state.resource_1 * 2);
	setResource2(state.resource_2 * 2);
	state.lastAction = '',
	state.lastActionTime = 0,
	state.lastCombo = false,
	setRecast('corps_a_corps', 0);
	setRecast('displacement', 0);
}

rdm_actions.jolt_ii.unique = function (state) {
	setStatus('impactful', true);
}
rdm_actions.jolt_ii.hidden = true;

rdm_actions.impact.unique = function (state) {
	setStatus('impactful', false);
}

rdm_actions.impact.isUseable = function (state) {
	return hasStatus('impactful');
}

rdm_actions.impact.isHighlighted = function (state) {
	return hasStatus('impactful');
}

rdm_actions.verflare.unique = function (state) {
	if (state.resource_1 < state.resource_2)
		setStatus('verfire_ready', true);
}

rdm_actions.verflare.isUseable = function (state) {
	return state.lastAction == 'enchanted_redoublement' && state.lastCombo;
}

rdm_actions.verflare.isHighlighted = function (state) {
	return this.isUseable(state);
}

rdm_actions.verholy.unique = function (state) {
	if (state.resource_1 > state.resource_2)
		setStatus('verstone_ready', true);
}

rdm_actions.verholy.isUseable = function (state) {
	return state.lastAction == 'enchanted_redoublement' && state.lastCombo;
}

rdm_actions.verholy.isHighlighted = function (state) {
	return this.isUseable(state);
}

/***************

STATUSES

 ***************/

const rdm_status = {
	dualcast: new Status('Dualcast', 60, "#fff"),
	verfire_ready: new Status("Verfire ready", 30, "#fff"),
	verstone_ready: new Status("Verstone ready", 30, "#fff"),
	enhanced_scatter: new Status('Enhanced Scatter', 10, "#fff"),
	acceleration: new Status('Acceleration', 10, "#fff"),
	embolden: new Status('Embolden', 20, "#fff"),
	impactful: new Status('Impactfule', 30, "#fff"),
};

/***************

STATUS OVERRIDES

 ***************/

/***************

DESCRIPTIONS

***************/


rdm_actions.riposte.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>. Action upgraded to <span class="orange">Enchanted Riposte</span> if both <span class="orange">Black Mana</span> and <span class="orange">White Mana</span> are at 30 or more.`;
}
rdm_actions.enchanted_riposte.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Balance Gauge Cost:</span> ${this.black} <span class="orange">Black Mana</span><br/>
		<span class="green">Balance Gauge Cost:</span> ${this.white} <span class="orange">White Mana</span>`;
}
rdm_actions.zwerchhau.getDesc = function (state) {
	return `Deals an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Combo Action:</span> <span class="orange">Riposte</span> or <span class="orange">Enchanted Riposte</span><br/>
		<span class="green">Combo Potency:</span> ${this.comboPotency}<br/>
		Action upgraded to <span class="orange">Enchanted Zwerchhau</span> if both <span class="orange">Black Mana</span> and <span class="orange">White Mana</span> are at 25 or more.`;
}
rdm_actions.enchanted_zwerchhau.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Combo Action:</span> <span class="orange">Riposte</span> or <span class="orange">Enchanted Riposte</span><br/>
		<span class="green">Combo Potency:</span> ${this.comboPotency}<br/>
		<span class="green">Balance Gauge Cost:</span> ${this.black} <span class="orange">Black Mana</span><br/>
		<span class="green">Balance Gauge Cost:</span> ${this.white} <span class="orange">White Mana</span>`;
}
rdm_actions.redoublement.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Combo Action:</span> <span class="orange">Zwerchhau</span> or <span class="orange">Enchanted Zwerchhau</span><br/>
		<span class="green">Combo Potency:</span> ${this.comboPotency}<br/>
		Action upgraded to <span class="orange">Enchanted Redoublement</span> if both <span class="orange">Black Mana</span> and <span class="orange">White Mana</span> are at 25 or more.`;
}
rdm_actions.enchanted_redoublement.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Combo Action:</span> <span class="orange">Enchanted Zwerchhau</span><br/>
		<span class="green">Combo Potency:</span> ${this.comboPotency}<br/>
		<span class="green">Balance Gauge Cost:</span> ${this.black} <span class="orange">Black Mana</span><br/>
		<span class="green">Balance Gauge Cost:</span> ${this.white} <span class="orange">White Mana</span>`;
}
rdm_actions.jolt.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Additional Effect:</span> Increases both <span class="orange">Black Mana</span> and <span class="orange">White Mana</span> by ${this.white}`;
}
rdm_actions.impact.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Additional Effect:</span> Increases both <span class="orange">Black Mana</span> and <span class="orange">White Mana</span> by ${this.white}<br/>
		Can only be executed while under the effect of <span class="yellow">Impactful</span>.`;
}
rdm_actions.verthunder.getDesc = function (state) {
	return `Deals lightning damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Additional Effect:</span> Increases <span class="orange">Black Mana</span> by ${this.black}<br/>
		<span class="green">Additional Effect:</span> 50% chance of becoming <span class="yellow">Verfire Ready</span><br/>
		<span class="green">Duration:</span> 30s`;
}
rdm_actions.verfire.getDesc = function (state) {
	return `Deals fire damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Additional Effect:</span> Increases <span class="orange">Black Mana</span> by ${this.black}<br/>
		Can only be executed while <span class="yellow">Verfire Ready</span> is active.`;
}
rdm_actions.verflare.getDesc = function (state) {
	return `Deals fire damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Additional Effect:</span> Increases <span class="orange">Black Mana</span> by ${this.black}<br/>
		<span class="green">Additional Effect:</span> 20% chance of becoming <span class="yellow">Verfire Ready</span><br/>
		<span class="green">Duration:</span> 30s<br/>
		Chance to become <span class="yellow">Verfire Ready</span> increases to 100% if <span class="orange">White Mana</span> is higher than <span class="orange">Black Mana</span> at time of execution.<br/>
		Can only be executed after landing <span class="orange">Enchanted Redoublement</span>.`;
}
rdm_actions.veraero.getDesc = function (state) {
	return `Deals wind damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Additional Effect:</span> Increases <span class="orange">White Mana</span> by ${this.white}<br/>
		<span class="green">Additional Effect:</span> 50% chance of becoming <span class="yellow">Verstone Ready</span><br/>
		<span class="green">Duration:</span> 30s`;
}
rdm_actions.verstone.getDesc = function (state) {
	return `Deals earth damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Additional Effect:</span> Increases <span class="orange">White Mana</span> by ${this.white}<br/>
		Can only be executed while <span class="yellow">Verstone Ready</span> is active.`;
}
rdm_actions.verholy.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Additional Effect:</span> Increases <span class="orange">White Mana</span> by ${this.white}<br/>
		<span class="green">Additional Effect:</span> 20% chance of becoming <span class="yellow">Verstone Ready</span><br/>
		<span class="green">Duration:</span> 30s<br/>
		Chance to become <span class="yellow">Verstone Ready</span> increases to 100% if <span class="orange">Black Mana</span> is higher than <span class="orange">White Mana</span> at time of execution.<br/>
		Can only be executed after landing <span class="orange">Enchanted Redoublement</span>.`;
}
rdm_actions.scatter.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> to target and all enemies nearby it.<br/>
		<span class="green">Additional Effect:</span> Increases both <span class="orange">Black Mana</span> and <span class="orange">White Mana</span> by ${this.white}<br/>
		<span class="green">Additional Effect:</span> 25% chance you are granted <span class="yellow">Enhanced Scatter</span><br/>
		<span class="green">Duration:</span> 10s<br/>
		<span class="green">Enhanced Scatter Bonus:</span> Increases <span class="orange">Black Mana</span> and <span class="orange">White Mana</span> by 8 instead of 3`;
}
rdm_actions.moulinet.getDesc = function (state) {
	return `Delivers an attack with a potency of 60 to all enemies in a cone before you. Action upgraded to <span class="orange">Enchanted Moulinet</span> if both <span class="orange">Black Mana</span> and <span class="orange">White Mana</span> are at 30 or more.`;
}
rdm_actions.enchanted_moulinet.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> to all enemies in a cone before you.<br/>
		<span class="green">Balance Gauge Cost:</span> ${this.black} <span class="orange">Black Mana</span><br/>
		<span class="green">Balance Gauge Cost:</span> ${this.white} <span class="orange">White Mana</span>`;
}
rdm_actions.corps_a_corps.getDesc = function (state) {
	return `Rushes target and delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		Cannot be executed while bound.`;
}
rdm_actions.displacement.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Additional Effect:</span> 15-yalm backstep<br/>
		Cannot be executed while bound.`;
}
rdm_actions.fleche.getDesc = function (state) {
	return `Deals an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.`;
}
rdm_actions.contre_sixte.getDesc = function (state) {
	return `Delivers an attack to all nearby enemies with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> for the first enemy, 10% less for the second, 20% less for the third, 30% less for the fourth, 40% less for the fifth, and 50% less for all remaining enemies.`;
}
rdm_actions.acceleration.getDesc = function (state) {
	return `Ensures the next <span class="orange">Verthunder</span> or <span class="orange">Veraero</span> spell cast will, for the first hit, trigger <span class="yellow">Verfire Ready</span> or <span class="yellow">Verstone Ready</span> respectively.<br/>
		<span class="green">Duration:</span> 10s`;
}
rdm_actions.embolden.getDesc = function (state) {
	return `Increases own magic damage dealt by 10% and physical damage dealt by nearby party members by 10%. Both effects are reduced by 20% every 4s.<br/>
		<span class="green">Duration:</span> 20s`;
}
rdm_actions.manafication.getDesc = function (state) {
	return `Doubles current <span class="orange">Black Mana</span> and <span class="orange">White Mana</span> levels.<br/>
		<span class="green">Additional Effect:</span> Resets <span class="orange">Corps-a-corps</span> and <span class="orange">Displacement</span> recast timers<br/>
		All combos are canceled upon execution of <span class="orange">Manafication</span>.`;
}
rdm_actions.tether.getDesc = function (state) {
	return `Binds target and all nearby enemies.<br/>
		<span class="green">Duration:</span> 20s<br/>
		Cancels auto-attack upon execution.`;
}
rdm_actions.vercure.getDesc = function (state) {
	return `Restores target's HP.<br/>
		<span class="green">Cure Potency:</span> 350`;
}
rdm_actions.verraise.getDesc = function (state) {
	return `Resurrects target to a weakened state.`;
}
rdm_actions.jolt_ii.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
		<span class="green">Additional Effect:</span> Increases both <span class="orange">Black Mana</span> and <span class="orange">White Mana</span> by ${this.white}<br/>
		<span class="green">Additional Effect:</span> Grants <span class="yellow">Impactful</span> status<br/>
		<span class="green">Duration:</span> 30s`;
}
