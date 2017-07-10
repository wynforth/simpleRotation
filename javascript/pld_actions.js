/***************

CLASSES

 ***************/

class PLD_WeaponSkill extends WeaponSkill {
	constructor(name, level, potency, tp, range, radius) {
		super(name, level, potency, 0, tp, range, radius, ['PLD']);
	}

	execute(state) {
		super.execute(state);

	}

	getPotency(state) {
		return super.getPotency(state) * (hasStatus('fight_or_flight') ? 1.25 : 1) * (hasStatus('shield_oath') ? .85 : 1);
	}
}

class PLD_ComboWS extends PLD_WeaponSkill {
	constructor(name, level, potency, tp, range, radius, comboPotency, comboActions) {
		super(name, level, potency, tp, range, radius);
		this.comboPotency = comboPotency;
		this.comboActions = comboActions;
	}
}

class PLD_Buff extends Buff {
	constructor(name, level, recast) {
		super(name, level, recast, ['PLD']);
	}
}

class PLD_Spell extends Spell {
	constructor(name, level, potency, cast, mana, range, radius) {
		super(name, level, potency, cast, mana, range, radius, ['PLD']);
	}

	getPotency(state) {
		return super.getPotency(state) * (hasStatus('requiescat') ? 1.20 : 1) * (hasStatus('shield_oath') ? .85 : 1);
	}
}

class PLD_Stance extends PLD_Spell {
	constructor(name, level, mana) {
		super(name, level, 0, 0, mana, 0, 0);
	}

	execute(state) {
		super.execute(state);
		if (this.id == 'shield_oath')
			setStatus('sword_oath', false);
		else
			setStatus('shield_oath', false);
		setStatus(this.id, !hasStatus(this.id));

		setResource1(state.resource_1 / 2);
	}

	getManaCost(state) {
		if (hasStatus(this.id))
			return 0;
		return super.getManaCost(state);
	}
}

class PLD_Ability extends Ability {
	constructor(name, level, recast) {
		super(name, level, recast, 0, 0, ['PLD'])
	}

	getPotency(state) {
		return super.getPotency(state) * (hasStatus('shield_oath') ? .85 : 1);
	}
}

class PLD_OathAbility extends Ability {
	constructor(name, level, recast, cost) {
		super(name, level, recast, 0, 0, ['PLD'])
		this.oathcost = cost;
	}

	execute(state) {
		super.execute(state);
		setStatus(this.id, true);
		setResource1(state.resource_1 - this.oathcost);
	}

	isUseable(state) {
		return (state.resource_1 >= this.oathcost) && super.isUseable(state);
	}
}

class PLD_DamageAbility extends DamageAbility {
	constructor(name, level, potency, recast, range, radius) {
		super(name, level, potency, recast, range, radius, ['PLD']);
	}
}

/***************

ACTIONS

 ***************/

const pld_actions = {
	fast_blade: new PLD_WeaponSkill("Fast Blade", 1, 160, 60, 3, 0),

	savage_blade: new PLD_ComboWS("Savage Blade", 4, 100, 60, 3, 0, 210, ['fast_blade']),
	rage_of_halone: new PLD_ComboWS("Rage of Halone", 26, 100, 50, 3, 0, 270, ['savage_blade']),

	riot_blade: new PLD_ComboWS("Riot Blade", 10, 100, 60, 3, 0, 240, ['fast_blade']),
	royal_authority: new PLD_ComboWS("Royal Authority", 60, 100, 50, 3, 0, 360, ['riot_blade']),
	goring_blade: new PLD_ComboWS("Goring Blade", 54, 100, 50, 3, 0, 250, ['riot_blade']),

	total_eclipse: new PLD_WeaponSkill("Total Eclipse", 46, 110, 140, 0, 5),
	flash: new PLD_Spell("Flash", 6, 0, 0, 999, 0, 5),

	shield_lob: new PLD_WeaponSkill("Shield Lob", 15, 120, 50, 25, 0),
	shield_bash: new PLD_WeaponSkill("Shield Bash", 18, 110, 0, 3, 0),
	shield_swipe: new PLD_DamageAbility("Shield Swipe", 30, 150, 15, 3, 0),

	shield_oath: new PLD_Stance("Shield Oath", 30, 400),
	sword_oath: new PLD_Stance("Sword Oath", 35, 400),

	spirits_within: new PLD_DamageAbility("Spirits Within", 45, 300, 30, 3, 0),
	circle_of_scorn: new PLD_DamageAbility("Circle of Scorn", 50, 100, 25, 0, 5),

	requiescat: new PLD_DamageAbility("Requiescat", 68, 350, 60, 25, 0),
	holy_spirit: new PLD_Spell("Holy Spirit", 64, 430, 1.5, 1800, 25, 0),
	clemency: new PLD_Spell("Clemency", 58, 0, 1.5, 1400, 25, 0),

	sheltron: new PLD_OathAbility("Sheltron", 52, 5, 50),
	intervention: new PLD_OathAbility("Intervention", 62, 10, 50),

	fight_or_flight: new PLD_Buff("Fight or Flight", 2, 60),
	divine_veil: new PLD_Buff("Divine Veil", 56, 120),
	sentinel: new PLD_Buff("Sentinel", 38, 180),
	bulwark: new PLD_Buff("Bulwark", 46, 180),
	cover: new PLD_Buff("Cover", 40, 120),
	tempered_will: new PLD_Buff("Tempered Will", 42, 180),
	passage_of_arms: new PLD_Buff("Passage of Arms", 70, 120),
	hallowed_ground: new PLD_Buff("Hallowed Ground", 50, 420),
};

/***************

ACTION OVERRIDES

 ***************/

pld_actions.flash.unique = function (state) {
	setStatus('blind', true);
}

pld_actions.goring_blade.unique = function(state) {
	if(this.isCombo(state))
		setStatus(this.id, true);
}

pld_actions.circle_of_scorn.unique = function(state) {
	setStatus(this.id, true);
}

pld_actions.riot_blade.unique = function (state) {
	setMana(state.mana + (state.maxMana * 0.2));
}

pld_actions.shield_bash.unique = function (state) {
	setStatus('stun', true);
}

pld_actions.shield_swipe.unique = function (state) {
	setStatus('pacification', true);
}

pld_actions.requiescat.unique = function (state) {
	if (state.mana / state.maxMana >= .8) {
		setStatus('requiescat', true);
	}
}

pld_actions.holy_spirit.unique = function (state) {
	if (hasStatus('shield_oath'))
		setResource1(state.resource_1 + 20);
}

/***************

STATUSES

 ***************/

const pld_status = {
	shield_oath: new Status('Shield Oath', 120, '#F0E184'),
	sword_oath: new Dot('Sword Oath', 120, 75, '#76C1C5'),
	bulwark: new Status('Bulwark', 15, '#2198CE'),
	sentinel: new Status('Sentinel', 10, '#0069B1'),
	cover: new Status('Cover', 12, '#9AD5B3'),
	tempered_will: new Status('Tempered Will', 10, '#292DAA'),
	fight_or_flight: new Status('Fight or Flight', 25, '#C54227'),
	circle_of_scorn: new Dot("Circle of Scorn", 15, 30, "#D54D16"),
	goring_blade: new Dot("Goring Blade", 21, 60, "#AC4617"),
	hallowed_ground: new Status("Hallowed Ground", 10, "#E5D8AA"),
	sheltron: new Status("Sheltron", 10, "#84937F"),
	divine_veil: new Status("Divine Veil", 30, "#323460"),
	intervention: new Status("Intervention", 6, "#2148A8"),
	requiescat: new Status("Requiescat", 12, "#374FB7"),
	passage_of_arms: new Status("Passage of Arms", 12, "#565E91"),

};

/***************

STATUS OVERRIDES

 ***************/

pld_status.sword_oath.tick = function (state) {
	state.potency += this.potency;
	setResource1(state.resource_1 + 5);
}

/***************

DESCRIPTIONS

 ***************/

pld_actions.fast_blade.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.`;
}

pld_actions.fight_or_flight.getDesc = function (state) {
	return `Increases physical damage dealt by 25%.`;
}

pld_actions.savage_blade.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
<span class="green">Additional Effect:</span> Increased enmity<br/>
<span class="green">Combo Action:</span> <span class="orange">Fast Blade</span><br/>
<span class="green">Combo Potency:</span> 210`; 
}

pld_actions.flash.getDesc = function (state) {
	return `Increases enmity in all nearby enemies.<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Blind</span><br/>
<span class="green">Duration:</span> 12s`; 
}

pld_actions.riot_blade.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
<span class="green">Combo Action:</span> <span class="orange">Fast Blade</span><br/>
<span class="green">Combo Potency:</span> 240<br/>
<span class="green">Combo Bonus:</span> Restores MP`; 
}

pld_actions.shield_lob.getDesc = function (state) {
	return `Delivers a ranged attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
<span class="green">Additional Effect:</span> Increased enmity`; 
}

pld_actions.shield_bash.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Stun</span><br/>
<span class="green">Duration:</span> 6s`; 
}

pld_actions.rage_of_halone.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>. <br/>
<span class="green">Additional Effect:</span> Increased enmity <br/>
<span class="green">Combo Action:</span> <span class="orange">Savage Blade</span> <br/>
<span class="green">Combo Potency:</span> 270`; 
}

pld_actions.shield_swipe.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>. <br/>
Can only be executed immediately after blocking an attack.<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Pacification</span><br/>
<span class="green">Duration:</span> 6s<br/>
<span class="green">Additional Effect:</span> Increased enmity`; 
}

pld_actions.shield_oath.getDesc = function (state) {
	return `Reduces damage taken by 20%, while reducing damage dealt by 15% and increasing enmity. <br/>
Cannot be used with <span class="orange">Sword Oath</span>.<br/>
Effect ends upon reuse.`; 
}

pld_actions.sword_oath.getDesc = function (state) {
	return `Deals additional damage with a potency of 75 after each auto-attack. Damage affected by weapon delay. <br/>
Cannot be used with <span class="orange">Shield Oath</span>. <br/>
Effect ends upon reuse.`; 
}

pld_actions.sentinel.getDesc = function (state) {
	return `Reduces damage taken by 40%.<br/>
<span class="green">Duration:</span> 10s`; 
}

pld_actions.cover.getDesc = function (state) {
	return `Take all damage intended for another party member, suffering only 80% of it.<br/>
<span class="green">Duration:</span> 12s<br/>
Can only be executed when member is closer than 10 yalms. Does not activate with certain attacks.`; 
}

pld_actions.tempered_will.getDesc = function (state) {
	return `Immediately cures <span class="yellow">Bind</span> and <span class="yellow">Heavy</span>, while preventing knockback and draw-in effects.<br/>
<span class="green">Duration:</span> 10s`; 
}

pld_actions.spirits_within.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
Potency decreases as own HP decreases.`; 
}

pld_actions.bulwark.getDesc = function (state) {
	return `Increases block rate by 60%.<br/>
<span class="green">Duration:</span> 15s`; 
}

pld_actions.total_eclipse.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> to all nearby enemies.`;
}

pld_actions.circle_of_scorn.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> to all nearby enemies.<br/>
<span class="green">Additional Effect:</span> Increased enmity <br/>
<span class="green">Additional Effect:</span> Damage over time<br/>
<span class="green">Potency:</span> 30<br/>
<span class="green">Duration:</span> 15s`; 
}

pld_actions.hallowed_ground.getDesc = function (state) {
	return `Renders you impervious to most attacks.<br/>
<span class="green">Duration:</span> 10s`; 
}

pld_actions.sheltron.getDesc = function (state) {
	return `Blocks the next attack.<br/>
<span class="green">Additional Effect:</span> Partial MP restored upon block<br/>
<span class="green">Duration:</span> 10s<br/>
<span class="green">Oath Gauge Cost:</span> 50`; 
}

pld_actions.goring_blade.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
<span class="green">Combo Action:</span> <span class="orange">Riot Blade</span><br/>
<span class="green">Combo Potency:</span> 250<br/>
<span class="green">Combo Bonus:</span> Damage over time<br/>
<span class="green">Potency:</span> 60<br/>
<span class="green">Duration:</span> 21s`; 
}

pld_actions.divine_veil.getDesc = function (state) {
	return `Upon HP recovery via healing magic cast by self or a party member, a protective barrier is cast on all party members within a radius of 15 yalms.<br/>
<span class="green">Duration:</span> 30s<br/>
<span class="green">Barrier Effect:</span>: Prevents damage up to 10% of your maximum HP<br/>
<span class="green">Duration:</span> 30s<br/>
Effect ends upon additional HP recovery via healing magic.`; 
}

pld_actions.clemency.getDesc = function (state) {
	return `Restores target's HP.<br/>
<span class="green">Cure Potency:</span> 1200<br/>
<span class="green">Additional Effect:</span> Restores to self 50% of HP restored to target if target is a party member`; 
}

pld_actions.royal_authority.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
<span class="green">Combo Action:</span> <span class="orange">Riot Blade</span><br/>
<span class="green">Combo Potency:</span> 360`; 
}

pld_actions.intervention.getDesc = function (state) {
	return `Reduces target party member's damage taken by 10%.<br/>
<span class="green">Duration:</span> 6s<br/>
<span class="green">Additional Effect:</span> Increases damage reduction by another 50% of the effect of <span class="yellow">Rampart</span> or <span class="yellow">Sentinel</span> if either are active.<br/>
<span class="green">Oath Gauge Cost:</span> 50`; 
}

pld_actions.holy_spirit.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
<span class="green">Shield Oath Bonus:</span>: Increases <span class="orange">Oath Gauge</span> by 20`; 
}

pld_actions.requiescat.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>. Potency decreases as own MP decreases.<br/>
<span class="green">Additional Effect:</span> Increases attack magic and healing magic potency by 20% if current MP is at 80% or higher.<br/>
<span class="green">Duration:</span> 12s`; 
}

pld_actions.passage_of_arms.getDesc = function (state) {
	return `Increases block rate by 100% and creates a designated area in a cone behind you in which party members will only suffer 85% of all damage inflicted.<br/>
<span class="green">Duration:</span> 18s<br/>
Effect ends upon using another action or moving (including facing a different direction).<br/>
Cancels auto-attack upon execution.`; 
}