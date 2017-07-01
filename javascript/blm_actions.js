/***************

CLASSES

***************/

class BLMAction extends BaseAction {
	constructor(name, level, recast, range) {
		super(name, level);
		this.recast = recast;
		this.range = range;
		this.affinity = ['BLM'];
	}
}

class BLMBuff extends Buff {
	constructor(name, level, recast) {
		super(name, level, recast);
		this.affinity = ['BLM'];
	}
}

class BLMSpell extends Spell {
	constructor(name, level, potency, cast, mana, range, radius) {
		super(name, level, potency, cast, mana, range, radius);
		this.affinity = ['BLM'];
	}

	getPotency(state) {
		return super.getPotency(state) * (hasStatus('enochian') ? 1.05 : 1);
	}
}

class FireSpell extends BLMSpell {
	constructor(name, level, potency, cast, mana, range, radius) {
		super(name, level, potency, cast, mana, range, radius);
	}
	execute(state) {
		if (hasStatus("umbral_ice")) {
			setStatus("umbral_ice", false);
		} else if (hasStatus("astral_fire")) {
			updateStatus("astral_fire", 1);
			updateStatus("umbral-heart", -1);
		} else {
			setStatus("astral_fire", true);
		}
	}

	getManaCost(state) {
		if (hasStatus('astral_fire'))
			return super.getManaCost(state) * (hasStatus('umbral_heart') ? 1 : 2);

		if (hasStatus('umbral_ice'))
			return super.getManaCost(state) * (getStacks('umbral_ice') > 1 ? 0.25 : 0.5);

		return super.getManaCost(state);
	}

	getPotency(state) {
		var mod = 1;
		if (hasStatus('umbral_ice'))
			mod -= 0.1 * getStacks('umbral_ice');

		if (hasStatus('astral_fire'))
			mod += 0.2 + (0.2 * getStacks('astral_fire'));

		return super.getPotency(state) * mod;
	}

	getCast(state) {
		if (hasStatus('umbral_ice'))
			if (getStacks('umbral_ice') == 3)
				return super.getCast(state) * 0.5;
		return super.getCast(state);
	}
}

class IceSpell extends BLMSpell {
	constructor(name, level, potency, cast, mana, range, radius) {
		super(name, level, potency, cast, mana, range, radius);
	}

	execute(state) {
		if (hasStatus("astral_fire"))
			setStatus("astral_fire", false);
		else
			updateStatus("umbral_ice", 1);
	}

	getManaCost(state) {
		if (hasStatus('astral_fire'))
			return super.getManaCost(state) * (getStacks('astral_fire') > 1 ? 0.25 : 0.5);

		return this.mana;
	}

	getPotency(state) {
		return super.getPotency(state) * (1 - (0.1 * getStacks('astral_fire')));
	}

	getCast(state) {
		if (hasStatus('astral_fire'))
			if (getStacks('astral_fire') == 3)
				return super.getCast(state) * 0.5;
		return super.getCast(state);
	}
}

class ThunderSpell extends BLMSpell {
	constructor(name, level, potency, cast, mana, range, radius) {
		super(name, level, potency, cast, mana, range, radius);
	}

	getCast(state) {
		if (hasStatus("thundercloud"))
			return 0;
		return super.getCast(state);
	}

	getManaCost(state) {
		if (hasStatus("thundercloud"))
			return 0;
		return super.getManaCost(state);
	}

	execute(state) {
		//only 1 thunder active at a time
		setStatus("thunder_i", false);
		setStatus("thunder_ii", false);
		setStatus("thunder_iii", false);
		setStatus("thunder_iv", false);
		setStatus(this.id, true);
		setStatus("thundercloud", false);
		if (hasStatus("sharpcast")) {
			setStatus("sharpcast", false);
			setStatus("thundercloud", true);
		}
	}

	getPotency(state) {
		return hasStatus('thundercloud') ? this.potency + 240 : this.potency;
	}

	isHighlighted(state) {
		return hasStatus('thundercloud');
	}
}
/***************

ACTIONS

***************/

const blm_actions = {
	fire_i: new FireSpell("Fire I", 2, 180, 2.5, 1400, 25, 0),
	fire_ii: new FireSpell("Fire II", 18, 80, 3.0, 1800, 25, 5),
	fire_iii: new FireSpell("Fire III", 34, 240, 3.5, 2400, 25, 0),
	fire_iv: new FireSpell("Fire IV", 60, 260, 3.0, 1200, 25, 0),
	flare: new FireSpell("Flare", 50, 260, 4.0, 1200, 25, 5),

	blizzard_i: new IceSpell("Blizzard I", 1, 180, 2.5, 480, 25, 0),
	blizzard_ii: new IceSpell("Blizzard II", 12, 50, 3.0, 960, 0, 5),
	blizzard_iii: new IceSpell("Blizzard III", 40, 240, 3.5, 1440, 25, 5),
	blizzard_iv: new IceSpell("Blizzard IV", 58, 260, 3.0, 1200, 25, 0),
	freeze: new IceSpell("Freeze", 35, 100, 3.0, 2400, 25, 5),

	thunder_i: new ThunderSpell("Thunder I", 6, 30, 2.5, 960, 25, 0),
	thunder_ii: new ThunderSpell("Thunder II", 26, 30, 3.0, 1440, 25, 5),
	thunder_iii: new ThunderSpell("Thunder III", 45, 70, 2.5, 1920, 25, 0),
	thunder_iv: new ThunderSpell("Thunder IV", 64, 50, 3.0, 2160, 25, 5),

	scathe: new BLMSpell("Scathe", 15, 100, 0, 960, 25, 0),
	foul: new BLMSpell("Foul", 70, 650, 2.5, 240, 25, 5),
	sleep: new BLMSpell("Sleep", 10, 0, 2.5, 1200, 25, 5),

	transpose: new BLMAction("Transpose", 4, 12, 0),
	ley_lines: new BLMBuff("Ley Lines", 52, 30),
	sharpcast: new BLMBuff("Sharpcast", 54, 60),
	enochian: new BLMBuff("Enochian", 56, 30),
	triplecast: new BLMBuff("Triplecast", 68, 90),
	convert: new BLMAction("Convert", 30, 180, 0),
	manaward: new BLMAction("Manaward", 30, 120, 0),
	aetherial_manipulation: new BLMAction("Aetherial Manipulation", 50, 30, 25),
	between_the_lines: new BLMAction("Between the Lines", 64, 3, 25)
};

/***************

ACTION OVERRIDES

 ***************/
//Fire I
blm_actions.fire_i.execute = function (state) {
	if (hasStatus("umbral_ice")) {
		setStatus("umbral_ice", false);
	} else if (hasStatus("astral_fire")) {
		updateStatus("astral_fire", 1);
		updateStatus("umbral_heart", -1);
	} else {
		setStatus("astral_fire", true);
	};

	if (hasStatus("sharpcast")) {
		setStatus("sharpcast", false);
		setStatus("firestarter", true);
	};
};
//Fire III
blm_actions.fire_iii.execute = function (state) {
	if (hasStatus("astral_fire") && !hasStatus("firestarter"))
		updateStatus("umbral_heart", -1);
	updateStatus("astral_fire", 3, true);
	if (hasStatus("umbral_ice"))
		setStatus("umbral_ice", false);
	if (hasStatus("firestarter"))
		setStatus("firestarter", false);
};
//Fire IV
blm_actions.fire_iv.execute = function (state) {
	if (hasStatus("astral_fire"))
		updateStatus("umbral_heart", -1);
};
blm_actions.fire_iv.isUseable = function (state) {
	return hasAllStatus(['enochian', 'astral_fire']);
};
//Flare
blm_actions.flare.execute = function (state) {
	updateStatus("astral_fire", 3, true);
	if (hasStatus("umbral_ice"))
		setStatus("umbral_ice", false);
	setStatus('umbral_heart', false);
};
blm_actions.flare.getManaCost = function (state) {
	if (hasStatus('umbral_heart'))
		return Math.max(this.mana, state.maxMana / 3);
	return Math.max(this.mana, state.mana);
};
//Blizzard III
blm_actions.blizzard_iii.execute = function (state) {
	updateStatus("umbral_ice", 3, true);
	if (hasStatus("astral_fire"))
		setStatus("astral_fire", false);
};
//Blizzard IV
blm_actions.blizzard_iv.execute = function (state) {
	setStatus("umbral_heart", true);
};
blm_actions.blizzard_iv.isUseable = function (state) {
	return hasAllStatus(['enochian', 'umbral_ice']);
};

//Thunder I
blm_actions.thunder_i.getReplacement = function (state) {
	return (state.level >= 45) ? 'thunder_iii' : false;
};
blm_actions.thunder_ii.getReplacement = function (state) {
	return (state.level >= 64) ? 'thunder_iv' : false;
};
blm_actions.thunder_iii.hidden = true;
blm_actions.thunder_iv.hidden = true;

//scathe
blm_actions.scathe.execute = function (state) {
	setStatus('sharpcast', false);
};
blm_actions.scathe.getPotency = function (state) {
	var mod = 1;
	mod += hasStatus('enochian') ? 0.05 : 0;
	mod += hasStatus('sharpcast') ? 1 : 0;
	return this.potency * mod;
};
//Foul
blm_actions.foul.execute = function (state) {
	setStatus('polyglot', false);
};
blm_actions.foul.isUseable = function (state) {
	return hasStatus('polyglot') && state.mana >= this.getManaCost(state);
};
blm_actions.foul.isHighlighted = function (state) {
	return hasStatus('polyglot');
};
//Transpose
blm_actions.transpose.execute = function (state) {
	if (hasStatus('umbral_ice')) {
		setStatus('astral_fire', true);
		setStatus('umbral_ice', false);
	} else if (hasStatus('astral_fire')) {
		setStatus('umbral_ice', true);
		setStatus('astral_fire', false);
	}
};
//Ley Lines
blm_actions.ley_lines.radius = 3;
//Enochian
blm_actions.enochian.isUseable = function (state) {
	return hasAnyStatus(["umbral_ice", "astral_fire"]);
};
//Convert
blm_actions.convert.execute = function (state) {
	setMana(state.mana + (state.maxMana * .2));
};
//Between The Lines
blm_actions.between_the_lines.isUseable = function (state) {
	return hasStatus('ley_lines');
};

/***************

STATUSES

***************/

const blm_status = {
	//BLM
	astral_fire: new StatusStack("Astral Fire", 13, "#F05F2F", 1, 3),
	umbral_ice: new StatusStack("Umbral Ice", 13, "#5FD0F0", 1, 3),
	triplecast: new StatusStack("Triplecast", 15, "#1F1F6F", 3, 3),
	umbral_heart: new StatusStack("Umbral Hearts", 30, "#005FF0", 3, 3),
	//
	ley_lines: new Status("Ley Lines", 30, "#A05FF0"),
	enochian: new Status("Enochian", 30, "#7F5FB0"),
	polyglot: new Status("Polyglot", 30, "#FFB2FE"),
	thundercloud: new Status("Thundercloud", 12, "#C0B0F0"),
	sharpcast: new Status("Sharpcast", 15, "#A05F7F"),
	firestarter: new Status("Firestarter", 12, "#7F0F0F"),
	mana_ward: new Status("Manaward", 20, "#C0A0C0"),
	//dots
	thunder_i: new Dot("Thunder I", 18, 40, "#C0B02F"),
	thunder_ii: new Dot("Thunder II", 12, 30, "#C0B02F"),
	thunder_iii: new Dot("Thunder III", 24, 40, "#C0B02F"),
	thunder_iv: new Dot("Thunder IV", 18, 30, "#C0B02F"),
};

/***************

STATUS OVERRIDES

 ***************/
 
blm_status.umbral_ice.tick = function (state) {
	setMana(state.mana + (state.maxMana * (.15 + (.15 * this.stacks))));
};
/***************

DESCRIPTIONS

***************/
blm_actions.fire_i.description = `Deals fire damage with a potency of 180.<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Astral Fire</span> or removes <span class="yellow">Umbral Ice</span><br/>
	<span class="green">Duration:</span> 13s<br/>
	<span class="green">Additional Effect:</span> 40% chance next <span class="orange">Fire III</span> will cost no MP and have no casting time<br/>
	<span class="green">Duration:</span> 12s`;
blm_actions.fire_ii.description = `Deals fire damage with a potency of 80 to target and all enemies nearby it.<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Astral Fire</span> or removes <span class="yellow">Umbral Ice</span><br/>
	<span class="green">Duration:</span> 13s`;
blm_actions.fire_iii.description = `Deals fire damage with a potency of 240.<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Astral Fire III</span> and removes <span class="yellow">Umbral Ice</span><br/>
	<span class="green">Duration:</span> 13s`;
blm_actions.fire_iv.description = `Deals fire damage with a potency of 260.
	Can only be executed while under the effect of both <span class="yellow">Enochian</span> and <span class="yellow">Astral Fire</span>.`;
blm_actions.flare.description = `Deals fire damage to a target and all enemies nearby it with a potency of 260 for the first enemy, 15% less for the second, 30% less for the third, 45% less for the fourth, 60% less for the fifth, and 70% less for all remaining enemies.<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Astral Fire III</span> and removes <span class="yellow">Umbral Ice</span><br/>
	<span class="green">Duration:</span> 13s`;
blm_actions.blizzard_i.description = `Deals ice damage with a potency of 180.<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Umbral Ice</span> or removes <span class="yellow">Astral Fire</span><br/>
	<span class="green">Duration:</span> 13s`;
blm_actions.blizzard_ii.description = `Deals ice damage with a potency of 50 to all nearby enemies.<br/>
	<span class="green">Additional Effect:</span> <span class="yellow">Bind</span><br/>
	<span class="green">Duration:</span> 8s<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Umbral Ice</span> or removes <span class="yellow">Astral Fire</span><br/>
	<span class="green">Duration:</span> 13s`;
blm_actions.blizzard_iii.description = `Deals ice damage with a potency of 240.<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Umbral Ice III</span> and removes <span class="yellow">Astral Fire</span><br/>
	<span class="green">Duration:</span> 13s`;
blm_actions.blizzard_iv.description = `Deals ice damage with a potency of 260.<br/>
	<span class="green">Additional Effect:</span> Grants 3 <span class="yellow">Umbral Hearts</span><br/>
	<span class="green">Umbral Heart Bonus:</span> Nullifies <span class="yellow">Astral Fire</span>'s MP cost increase for <span class="orange">Fire spells</span> and reduces MP cost for <span class="orange">Flare</span> by two-thirds<br/>
	Can only be executed while under the effect of both <span class="yellow">Enochian</span> and <span class="yellow">Umbral Ice</span>.`;
blm_actions.freeze.description = `Covers a designated area in ice, dealing ice damage with a potency of 100.<br/>
	<span class="green">Additional Effect:</span> <span class="yellow">Bind</span><br/>
	<span class="green">Duration:</span> 15s<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Umbral Ice</span> or removes <span class="yellow">Astral Fire</span><br/>
	<span class="green">Duration:</span> 13s`;
blm_actions.thunder_i.description = `Deals lightning damage with a potency of 30.<br/>
	<span class="green">Additional Effect:</span> Lightning damage over time<br/>
	<span class="green">Potency:</span> 40<br/>
	<span class="green">Duration:</span> 18s<br/>
	<span class="green">Additional Effect:</span> 10% chance after each tick that the next <span class="orange">Thunder</span> spell of any grade will add its full damage over time amount to its initial damage, have no cast time, and cost no MP<br/>
	<span class="green">Duration:</span> 12s<br/>
	Only one <span class="orange">Thunder</span> spell-induced damage over time effect per caster can be inflicted upon a single target.`;
blm_actions.thunder_ii.description = `Deals lightning damage with a potency of 30 to target and all enemies nearby it.<br/>
	<span class="green">Additional Effect:</span> Lightning damage over time<br/>
	<span class="green">Potency:</span> 30<br/>
	<span class="green">Duration:</span> 12s<br/>
	<span class="green">Additional Effect:</span> 3% chance after each tick that the next <span class="orange">Thunder</span> spell of any grade will add its full damage over time amount to its initial damage, have no cast time, and cost no MP<br/>
	<span class="green">Duration:</span> 12s<br/>
	Only one <span class="orange">Thunder</span> spell-induced damage over time effect per caster can be inflicted upon a single target.`;
blm_actions.thunder_iii.description = `Deals lightning damage with a potency of 70.<br/>
	<span class="green">Additional Effect:</span> Lightning damage over time<br/>
	<span class="green">Potency:</span> 40<br/>
	<span class="green">Duration:</span> 24s<br/>
	<span class="green">Additional Effect:</span> 10% chance after each tick that the next <span class="orange">Thunder</span> spell of any grade will add its full damage over time amount to its initial damage, have no cast time, and cost no MP<br/>
	<span class="green">Duration:</span> 12s<br/>
	Only one <span class="orange">Thunder</span> spell-induced damage over time effect per caster can be inflicted upon a single target.`;
blm_actions.thunder_iv.description = `Deals lightning damage with a potency of 50 to target and all enemies nearby it.<br/>
	<span class="green">Additional Effect:</span> Lightning damage over time<br/>
	<span class="green">Potency:</span> 30<br/>
	<span class="green">Duration:</span> 18s<br/>
	<span class="green">Additional Effect:</span> 3% chance after each tick that the next <span class="orange">Thunder</span> spell of any grade will add its full damage over time amount to its initial damage, have no cast time, and cost no MP<br/>
	<span class="green">Duration:</span> 12s<br/>
	Only one <span class="orange">Thunder</span> spell-induced damage over time effect per caster can be inflicted upon a single target.`;
blm_actions.scathe.description = `Deals unaspected damage with a potency of 100.<br/>
	<span class="green">Additional Effect:</span> 20% chance potency will double`;
blm_actions.foul.description = `Deals unaspected damage to a target and all enemies nearby it with a potency of 650 for the first enemy, 10% less for the second, 20% less for the third, 30% less for the fourth, 40% less for the fifth, and 50% less for all remaining enemies.<br/>
	Can only be executed while under the effect of <span class="yellow">Polyglot</span>. <span class="yellow">Polyglot</span> effect ends upon use.`;
blm_actions.sleep.description = `Puts target to sleep.<br/>
	<span class="green">Duration:</span> 30s<br/>
	Cancels auto-attack upon execution.`;
blm_actions.transpose.description = `Swaps <span class="yellow">Astral Fire</span> with a single <span class="yellow">Umbral Ice</span>, or <span class="yellow">Umbral Ice</span> with a single <span class="yellow">Astral Fire</span>.`;
blm_actions.ley_lines.description = `Connects naturally occurring ley lines to create a circle of power which, while standing within it, reduces spell cast time and recast time, and auto-attack delay by 15%.<br/><span class="green">Duration:</span> 30s`;
blm_actions.sharpcast.description = `Ensures the next <span class="orange">Scathe</span>, <span class="orange">Fire</span>, or <span class="orange">Thunder</span> spell cast will, for the first hit, trigger <span class="orange">Scathe</span>'s additional effect, <span class="yellow">Firestarter</span>, or <span class="yellow">Thundercloud</span> respectively.<br/><span class="green">Duration:</span> 15s`;
blm_actions.enochian.description = `Increases magic damage dealt by 5%. Also allows the casting of <span class="orange">Blizzard IV</span> and <span class="orange">Fire IV</span>.<br/>
	<span class="green">Additional Effect</span>: Grants <span class="yellow">Polyglot</span> if <span class="yellow">Enochian</span> is maintained for 30s<br/>
	Can only be executed while under the effect of <span class="yellow">Astral Fire</span> or <span class="yellow">Umbral Ice</span>. Effect is canceled if <span class="yellow">Astral Fire</span> or <span class="yellow">Umbral Ice</span> end.`;
blm_actions.triplecast.description = `The next three spells will require no cast time.<br/>
	<span class="green">Duration:</span> 15s`;
blm_actions.convert.description = `Sacrifices 20% of maximum HP to restore 30% of MP. Cannot be executed when current HP is lower than 20%.`,
blm_actions.manaward.description = `Creates a barrier that nullifies damage totaling up to 30% of maximum HP.<br/>
	<span class="green">Duration:</span> 20s`;
blm_actions.aetherial_manipulation.description = `Rush to a target party member's side.<br/>Unable to cast if bound.`;
blm_actions.between_the_lines.description = `Move instantly to <span class="yellow">Ley Lines</span> drawn by you.<br/>
	Cannot be executed while bound.`;