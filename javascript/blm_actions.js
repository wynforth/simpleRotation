

const blm_actions = {
	
	
	
};

const blm_status = {
	//BLM
	astral_fire: {
		name: "Astral Fire",
		duration: 13,
		maxStacks: 3,
		color: "#F05F2F"
	},
	umbral_ice: {
		name: "Umbral Ice",
		duration: 13,
		maxStacks: 3,
		color: "#5FD0F0",
		tick(state) {
			setMana(state.mana + (state.maxMana * (.15 + (.15 * getStacks('umbral_ice')))));
		}
	},
	ley_lines: {
		name: "Ley Lines",
		duration: 30,
		color: "#A05FF0"
	},
	triplecast: {
		name: "Triplecast",
		duration: 15,
		maxStacks: 3,
		color: "#1F1F6F"
	},
	umbral_heart: {
		name: "Umbral Hearts",
		duration: 30,
		maxStacks: 3,
		color: "#005FF0"
	},
	enochian: {
		name: "Enochian",
		duration: 30,
		color: "#7F5FB0"
	},
	polyglot: {
		name: "Polyglot",
		duration: 30,
		color: "#FFB2FE"
	},
	thundercloud: {
		name: "Thundercloud",
		duration: 12,
		color: "#C0B0F0"
	},
	sharpcast: {
		name: "Sharpcast",
		duration: 15,
		color: "#A05F7F"
	},
	firestarter: {
		name: "Firestarter",
		duration: 12,
		color: "#7F0F0F"
	},
	thunder_i: {
		name: "Thunder I",
		duration: 18,
		color: "#C0B02F",
		tick(state) {
			state.potency += 40;
		}
	},
	thunder_ii: {
		name: "Thunder II",
		duration: 12,
		color: "#C0B02F",
		tick(state) {
			state.potency += 30;
		}
	},
	thunder_iii: {
		name: "Thunder III",
		duration: 24,
		color: "#C0B02F",
		tick(state) {
			state.potency += 40;
			//console.log(state.currentTime + " - thunder iii");
		}
	},
	thunder_iv: {
		name: "Thunder IV",
		duration: 18,
		color: "#C0B02F",
		tick(state) {
			state.potency += 30;
		}
	},
	mana_ward: {
		name: " Manaward",
		duration: 20,
		color: "#C0A0C0",
	},
};

class BLMAction extends BaseAction {
	constructor(name, level, recast, range){
		super(name);
		this.level = level;
		this.recast = recast;
		this.range = range;
		this.affinity = ['BLM'];
	}
}

class BLMBuff extends Buff {
	constructor(name, level, recast){
		super(name, level, recast);
		this.affinity = ['BLM'];
	}
}

class BLMSpell extends Spell {
	constructor(name, potency, cast, mana, level, range, radius){
		super(name, potency, cast, mana, level, range, radius);
		this.affinity = ['BLM'];
	}
	
	getPotency(state){
		return super.getPotency(state) * (hasStatus('enochian') ? 1.05:1);
	}
}

class FireSpell extends BLMSpell {
	constructor(name, potency, cast, mana, level, range, radius){
		super(name, potency, cast, mana, level, range, radius);
	}
	
	getManaCost(state) {
		if (hasStatus('astral_fire'))
			return super.getManaCost(state) * (hasStatus('umbral_heart') ? 1 : 2);

		if (hasStatus('umbral_ice'))
			return super.getManaCost(state) * (getStacks('umbral_ice') > 1 ? 0.25 : 0.5);

		return super.getManaCost(state);
	}
	
	getPotency(state){
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
	constructor(name, potency, cast, mana, level, range, radius){
		super(name, potency, cast, mana, level, range, radius);
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
	constructor(name, potency, cast, mana, level, range, radius){
		super(name, potency, cast, mana, level, range, radius);
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

//Fire
blm_actions.fire_i = new FireSpell("Fire I", 180, 2.5, 1400, 2, 25, 0);
blm_actions.fire_i.description = `Deals fire damage with a potency of 180.<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Astral Fire</span> or removes <span class="yellow">Umbral Ice</span><br/>
	<span class="green">Duration:</span> 13s<br/>
	<span class="green">Additional Effect:</span> 40% chance next <span class="orange">Fire III</span> will cost no MP and have no casting time<br/>
	<span class="green">Duration:</span> 12s`;
blm_actions.fire_i.execute = function(state) {
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

//Fire II
blm_actions.fire_ii = new FireSpell("Fire II", 80, 3.0, 1800, 18, 25, 5);
blm_actions.fire_ii.description=`Deals fire damage with a potency of 80 to target and all enemies nearby it.<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Astral Fire</span> or removes <span class="yellow">Umbral Ice</span><br/>
	<span class="green">Duration:</span> 13s`;
blm_actions.fire_ii.execute = function(state) {
	if (hasStatus("umbral_ice")) {
		setStatus("umbral_ice", false);
	} else if (hasStatus("astral_fire")) {
		updateStatus("astral_fire", 1);
		updateStatus("umbral-heart", -1);
	} else {
		setStatus("astral_fire", true);
	}
};

//Fire III
blm_actions.fire_iii = new FireSpell("Fire III", 240, 3.5, 2400, 34, 25, 0);
blm_actions.fire_iii.description=`Deals fire damage with a potency of 240.<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Astral Fire III</span> and removes <span class="yellow">Umbral Ice</span><br/>
	<span class="green">Duration:</span> 13s`;
blm_actions.fire_iii.execute = function(state) {
	if (hasStatus("astral_fire") && !hasStatus("firestarter"))
		updateStatus("umbral_heart", -1);

	//always
	updateStatus("astral_fire", 3, true);
	if (hasStatus("umbral_ice"))
		setStatus("umbral_ice", false);

	if (hasStatus("firestarter"))
		setStatus("firestarter", false);
};

//Fire IV
blm_actions.fire_iv = new FireSpell("Fire IV", 260, 3.0, 1200, 60, 25, 0);
blm_actions.fire_iv.description = `Deals fire damage with a potency of 260.
	Can only be executed while under the effect of both <span class="yellow">Enochian</span> and <span class="yellow">Astral Fire</span>.`;
blm_actions.fire_iv.execute = function(state) {
	if (hasStatus("astral_fire"))
		updateStatus("umbral_heart", -1);
};
blm_actions.fire_iv.isUseable = function(state) {
	return hasAllStatus(['enochian', 'astral_fire']);
};

//Flare
blm_actions.flare = new FireSpell("Flare", 260, 4.0, 1200, 50, 25, 5);
blm_actions.flare.description = `Deals fire damage to a target and all enemies nearby it with a potency of 260 for the first enemy, 15% less for the second, 30% less for the third, 45% less for the fourth, 60% less for the fifth, and 70% less for all remaining enemies.<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Astral Fire III</span> and removes <span class="yellow">Umbral Ice</span><br/>
	<span class="green">Duration:</span> 13s`; 
blm_actions.flare.execute = function(state) {
	updateStatus("astral_fire", 3, true);
	if (hasStatus("umbral_ice"))
		setStatus("umbral_ice", false);
	setStatus('umbral_heart', false);
};
blm_actions.flare.getManaCost = function(state) {
	if (hasStatus('umbral_heart'))
		return Math.max(this.mana, state.maxMana / 3);
	return Math.max(this.mana, state.mana);
};

//Blizzard
blm_actions.blizzard_i = new IceSpell("Blizzard I", 180, 2.5, 480, 1, 25, 0);
blm_actions.blizzard_i.description = `Deals ice damage with a potency of 180.<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Umbral Ice</span> or removes <span class="yellow">Astral Fire</span><br/>
	<span class="green">Duration:</span> 13s`;

//Blizzard II
blm_actions.blizzard_ii = new IceSpell("Blizzard II", 50, 3.0, 960, 12, 0, 5);
blm_actions.blizzard_ii.description = `Deals ice damage with a potency of 50 to all nearby enemies.<br/>
	<span class="green">Additional Effect:</span> <span class="yellow">Bind</span><br/>
	<span class="green">Duration:</span> 8s<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Umbral Ice</span> or removes <span class="yellow">Astral Fire</span><br/>
	<span class="green">Duration:</span> 13s`;

//Blizzard III	
blm_actions.blizzard_iii = new IceSpell("Blizzard III", 240, 3.5, 1440, 40 , 25, 5);
blm_actions.blizzard_iii.description = `Deals ice damage with a potency of 240.<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Umbral Ice III</span> and removes <span class="yellow">Astral Fire</span><br/>
	<span class="green">Duration:</span> 13s`; 
blm_actions.blizzard_iii.execute = function(state) {
	updateStatus("umbral_ice", 3, true);
	if (hasStatus("astral_fire"))
		setStatus("astral_fire", false);
};

//Blizzard IV
blm_actions.blizzard_iv = new IceSpell("Blizzard IV", 260, 3.0, 1200, 58, 25, 0);
blm_actions.blizzard_iv.description = `Deals ice damage with a potency of 260.<br/>
	<span class="green">Additional Effect:</span> Grants 3 <span class="yellow">Umbral Hearts</span><br/>
	<span class="green">Umbral Heart Bonus:</span> Nullifies <span class="yellow">Astral Fire</span>'s MP cost increase for <span class="orange">Fire spells</span> and reduces MP cost for <span class="orange">Flare</span> by two-thirds<br/>
	Can only be executed while under the effect of both <span class="yellow">Enochian</span> and <span class="yellow">Umbral Ice</span>.`; 
blm_actions.blizzard_iv.execute = function(state) {
	updateStatus("umbral_heart", 3, true);
};
blm_actions.blizzard_iv.isUseable = function(state) {
	return hasAllStatus(['enochian', 'umbral_ice']);
};

//Freeze
blm_actions.freeze = new IceSpell("Freeze", 100, 3.0, 2400, 35, 25, 5);
blm_actions.freeze.description = `Covers a designated area in ice, dealing ice damage with a potency of 100.<br/>
	<span class="green">Additional Effect:</span> <span class="yellow">Bind</span><br/>
	<span class="green">Duration:</span> 15s<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Umbral Ice</span> or removes <span class="yellow">Astral Fire</span><br/>
	<span class="green">Duration:</span> 13s`;
	
	
//Thunder
blm_actions.thunder_i = new ThunderSpell("Thunder I", 30, 2.5, 960, 6, 25, 0);
blm_actions.thunder_i.description = `Deals lightning damage with a potency of 30.<br/>
	<span class="green">Additional Effect:</span> Lightning damage over time<br/>
	<span class="green">Potency:</span> 40<br/>
	<span class="green">Duration:</span> 18s<br/>
	<span class="green">Additional Effect:</span> 10% chance after each tick that the next <span class="orange">Thunder</span> spell of any grade will add its full damage over time amount to its initial damage, have no cast time, and cost no MP<br/>
	<span class="green">Duration:</span> 12s<br/>
	Only one <span class="orange">Thunder</span> spell-induced damage over time effect per caster can be inflicted upon a single target.`;
blm_actions.thunder_i.getReplacement = function(state){
	return (state.level >= 45) ? 'thunder_iii' : false;
};

//Thunder
blm_actions.thunder_ii = new ThunderSpell("Thunder II", 30, 3.0, 1440, 26, 25, 5);
blm_actions.thunder_ii.description = `Deals lightning damage with a potency of 30 to target and all enemies nearby it.<br/>
	<span class="green">Additional Effect:</span> Lightning damage over time<br/>
	<span class="green">Potency:</span> 30<br/>
	<span class="green">Duration:</span> 12s<br/>
	<span class="green">Additional Effect:</span> 3% chance after each tick that the next <span class="orange">Thunder</span> spell of any grade will add its full damage over time amount to its initial damage, have no cast time, and cost no MP<br/>
	<span class="green">Duration:</span> 12s<br/>
	Only one <span class="orange">Thunder</span> spell-induced damage over time effect per caster can be inflicted upon a single target.`;
blm_actions.thunder_ii.getReplacement = function(state){
	return (state.level >= 64) ? 'thunder_iv' : false;
};

//Thunder
blm_actions.thunder_iii = new ThunderSpell("Thunder III", 70, 2.5, 1920, 45, 25, 0);
blm_actions.thunder_iii.hidden = true;
blm_actions.thunder_iii.description = `Deals lightning damage with a potency of 70.<br/>
	<span class="green">Additional Effect:</span> Lightning damage over time<br/>
	<span class="green">Potency:</span> 40<br/>
	<span class="green">Duration:</span> 24s<br/>
	<span class="green">Additional Effect:</span> 10% chance after each tick that the next <span class="orange">Thunder</span> spell of any grade will add its full damage over time amount to its initial damage, have no cast time, and cost no MP<br/>
	<span class="green">Duration:</span> 12s<br/>
	Only one <span class="orange">Thunder</span> spell-induced damage over time effect per caster can be inflicted upon a single target.`;

//Thunder
blm_actions.thunder_iv = new ThunderSpell("Thunder I", 50, 3.0, 2160, 64, 25, 5);
blm_actions.thunder_iv.hidden = true;
blm_actions.thunder_iv.description = `Deals lightning damage with a potency of 50 to target and all enemies nearby it.<br/>
	<span class="green">Additional Effect:</span> Lightning damage over time<br/>
	<span class="green">Potency:</span> 30<br/>
	<span class="green">Duration:</span> 18s<br/>
	<span class="green">Additional Effect:</span> 3% chance after each tick that the next <span class="orange">Thunder</span> spell of any grade will add its full damage over time amount to its initial damage, have no cast time, and cost no MP<br/>
	<span class="green">Duration:</span> 12s<br/>
	Only one <span class="orange">Thunder</span> spell-induced damage over time effect per caster can be inflicted upon a single target.`;

//Scathe
blm_actions.scathe = new BLMSpell("Scathe", 100, 0, 960, 15, 25, 0);
blm_actions.scathe.description = `Deals unaspected damage with a potency of 100.<br/>
	<span class="green">Additional Effect:</span> 20% chance potency will double`;
blm_actions.scathe.execute = function(state) {
	setStatus('sharpcast', false);
};
blm_actions.scathe.getPotency = function(state) {
	var mod = 1;
	mod += hasStatus('enochian') ? 0.05 : 0;
	mod += hasStatus('sharpcast') ? 1 : 0;
	return this.potency * mod;
};
	
//Foul
blm_actions.foul = new BLMSpell("Foul", 650, 2.5, 240, 70, 25, 5);
blm_actions.foul.description = `Deals unaspected damage to a target and all enemies nearby it with a potency of 650 for the first enemy, 10% less for the second, 20% less for the third, 30% less for the fourth, 40% less for the fifth, and 50% less for all remaining enemies.<br/>
	Can only be executed while under the effect of <span class="yellow">Polyglot</span>. <span class="yellow">Polyglot</span> effect ends upon use.`; 
blm_actions.foul.execute = function(state) {
	setStatus('polyglot', false);
};
blm_actions.foul.isUseable = function(state) {
	return hasStatus('polyglot') && state.mana >= this.getManaCost(state);
};
blm_actions.foul.isHighlighted = function(state) {
	return hasStatus('polyglot');
};

//sleep
blm_actions.sleep = new BLMSpell("Sleep", 0, 2.5, 1200, 10, 25, 5);
blm_actions.sleep.description = `Puts target to sleep.<br/><span class="green">Duration:</span> 30s<br/>Cancels auto-attack upon execution.`;

//Ability
//Transpose

blm_actions.transpose = new BLMAction("Transpose", 4, 12, 0);
blm_actions.transpose.description = `Swaps <span class="yellow">Astral Fire</span> with a single <span class="yellow">Umbral Ice</span>, or <span class="yellow">Umbral Ice</span> with a single <span class="yellow">Astral Fire</span>.`; 
blm_actions.transpose.execute = function(state) {
	if (hasStatus('umbral_ice')) {
		setStatus('astral_fire', true);
		setStatus('umbral_ice', false);
	} else if (hasStatus('astral_fire')) {
		setStatus('umbral_ice', true);
		setStatus('astral_fire', false);
	}
};



blm_actions.ley_lines = new BLMBuff("Ley Lines",52, 30);
blm_actions.ley_lines.radius = 3;
blm_actions.ley_lines.description = `Connects naturally occurring ley lines to create a circle of power which, while standing within it, reduces spell cast time and recast time, and auto-attack delay by 15%.<br/><span class="green">Duration:</span> 30s`;

blm_actions.sharpcast = new BLMBuff("Sharpcast", 54, 60);
blm_actions.sharpcast.description = `Ensures the next <span class="orange">Scathe</span>, <span class="orange">Fire</span>, or <span class="orange">Thunder</span> spell cast will, for the first hit, trigger <span class="orange">Scathe</span>'s additional effect, <span class="yellow">Firestarter</span>, or <span class="yellow">Thundercloud</span> respectively.<br/><span class="green">Duration:</span> 15s`;

blm_actions.enochian = new BLMBuff("Enochian", 56, 30);
blm_actions.enochian.description = `Increases magic damage dealt by 5%. Also allows the casting of <span class="orange">Blizzard IV</span> and <span class="orange">Fire IV</span>.<br/>
	<span class="green">Additional Effect</span>: Grants <span class="yellow">Polyglot</span> if <span class="yellow">Enochian</span> is maintained for 30s<br/>
	Can only be executed while under the effect of <span class="yellow">Astral Fire</span> or <span class="yellow">Umbral Ice</span>. Effect is canceled if <span class="yellow">Astral Fire</span> or <span class="yellow">Umbral Ice</span> end.`;
blm_actions.enochian.isUseable = function(state) { return hasAnyStatus(["umbral_ice", "astral_fire"]); };

blm_actions.triplecast = new BLMBuff("Triplecast", 68, 90);
blm_actions.triplecast.description = `The next three spells will require no cast time.<br/><span class="green">Duration:</span> 15s`;
blm_actions.triplecast.execute = function(state){ updateStatus(this.id, 3, true); };

blm_actions.convert = new BLMAction("Convert", 30, 180, 0);
blm_actions.convert.description = `Sacrifices 20% of maximum HP to restore 30% of MP. Cannot be executed when current HP is lower than 20%.`,
blm_actions.convert.execute = function(state) {	setMana(state.mana + (state.maxMana * .2));	};

blm_actions.manaward = new BLMAction("Manaward", 30, 120, 0);
blm_actions.manaward.description = `Creates a barrier that nullifies damage totaling up to 30% of maximum HP.<br/><span class="green">Duration:</span> 20s`; 

blm_actions.aetherial_manipulation = new BLMAction("Aetherial Manipulation", 50, 30, 25);
blm_actions.aetherial_manipulation.description = `Rush to a target party member's side.<br/>Unable to cast if bound.`;

blm_actions.between_the_lines = new BLMAction("Between the Lines", 64, 3, 25);
blm_actions.between_the_lines.description = `Move instantly to <span class="yellow">Ley Lines</span> drawn by you.<br/>Cannot be executed while bound.`;
blm_actions.between_the_lines.isUseable = function(state) {	return hasStatus('ley_lines');	};