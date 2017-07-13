/***************

CLASSES

 ***************/

class SAM_WeaponSkill extends WeaponSkill {
	constructor(name, level, potency, cast, tp, range, radius, kenki) {
		super(name, level, potency, cast, tp, range, radius, ['SAM']);
		this.kenki = kenki;
	}

	getCast(state) {

		return super.getCast(state) * (hasStatus('shifu') ? .85 : 1);
	}

	getRecast(state) {
		//console.log(state);
		return super.getRecast(state) * (hasStatus('shifu') ? .85 : 1);
	}

	execute(state) {
		super.execute(state);
		setResource1(state.resource_1 + this.kenki);
		if (hasStatus('hissatsu_kaiten'))
			setStatus('hissatsu_kaiten', false);
	}

	getPotency(state) {
		return super.getPotency(state) * (hasStatus('hissatsu_kaiten') ? 1.5 : 1);
	}
}

class SAM_Iaijutsu extends SAM_WeaponSkill {
	constructor(name, level, potency, range, radius) {
		super(name, level, potency, 1.8, 0, range, radius, 0);
		this.hidden = true;
	}
	execute(state) {
		super.execute(state);
		if (this.id === 'higanbana')
			setStatus(this.id, true);
		setStatus('sen_setsu', false);
		setStatus('sen_getsu', false);
		setStatus('sen_ka', false);
		
	}
}

class SAM_ComboWS extends SAM_WeaponSkill {
	constructor(name, level, potency, cast, tp, range, radius, kenki, comboPotency, comboActions, comboKenki, comboStatus) {
		super(name, level, potency, cast, tp, range, radius, kenki);
		this.comboPotency = comboPotency;
		this.comboActions = comboActions;
		this.comboKenki = comboKenki;
		this.comboStatus = comboStatus;
	}

	execute(state) {
		super.execute(state);
		if (this.isCombo(state)) {
			updateStatus('meikyo_shisui', -1);
			setResource1(state.resource_1 + this.comboKenki);
			for (var i = 0; i < this.comboStatus.length; i++)
				setStatus(this.comboStatus[i], true);
		}
		
	}

	isCombo(state) {
		if (this.comboActions.length > 0 && hasStatus('meikyo_shisui'))
			return true;
		return super.isCombo(state);
	}
}

class SAM_AoE_ComboWS extends SAM_ComboWS {
	constructor(name, level, potency, cast, tp, range, radius, kenki, comboPotency, comboActions, comboKenki, comboStatus) {
		super(name, level, potency, cast, tp, range, radius, kenki, comboPotency, comboActions, comboKenki, comboStatus);
		this.comboDamageSteps = [0];
	}

	getTargetPotency(state, target) {
		if (this.isCombo(state)) {
			if (target == 1) // primary target
				return this.getPotency(state);
			var index = Math.max(0, Math.min((target - 2), this.comboDamageSteps.length - 1));
			return this.getPotency(state) * this.comboDamageSteps[index];
		}
		return super.getTargetPotency(state, target);
	}
}

class SAM_Ability extends Ability {
	constructor(name, level, recast) {
		super(name, level, recast, 0, 0, ['SAM'])
	}
}

class SAM_DamageAbility extends DamageAbility {
	constructor(name, level, potency, recast, range, radius, kenki) {
		super(name, level, potency, recast, range, radius, ['SAM']);
		this.kenki = kenki;
	}

	execute(state) {
		super.execute(state);
		setResource1(state.resource_1 - this.kenki);
	}

	isUseable(state) {
		return state.resource_1 >= this.kenki;
	}
}

class SAM_Buff extends Buff {
	constructor(name, level, recast) {
		super(name, level, recast, ['SAM']);
	}
}

/***************

ACTIONS

 ***************/

const sam_actions = {
	hakaze: new SAM_WeaponSkill("Hakaze", 1, 150, 0, 60, 3, 0, 5),
	jinpu: new SAM_ComboWS("Jinpu", 2, 100, 0, 60, 3, 0, 0, 280, ['hakaze'], 5, ['jinpu']),
	gekko: new SAM_ComboWS("Gekko", 30, 100, 0, 50, 3, 0, 5, 400, ['jinpu'], 5, ['sen_getsu']),
	shifu: new SAM_ComboWS("Shifu", 18, 100, 0, 60, 3, 0, 0, 280, ['hakaze'], 5, ['shifu']),
	kasha: new SAM_ComboWS("Kasha", 40, 100, 0, 50, 3, 0, 5, 400, ['shifu'], 5, ['sen_ka']),
	yukikaze: new SAM_ComboWS("Yukikaze", 50, 100, 0, 50, 3, 0, 0, 340, ["hakaze"], 10, ['sen_setsu', 'yukikaze']),
	fuga: new SAM_WeaponSkill("Fuga", 26, 100, 0, 140, 0, 5, 5),
	mangetsu: new SAM_AoE_ComboWS("Mangetsu", 35, 100, 0, 140, 0, 5, 0, 200, ['fuga'], 10, ['sen_getsu']),
	oka: new SAM_AoE_ComboWS("Oka", 45, 100, 0, 140, 0, 5, 0, 200, ['fuga'], 10, ['sen_ka']),
	enpi: new SAM_WeaponSkill("Enpi", 15, 100, 0, 160, 15, 0, 10),

	iaijutsu: new SAM_WeaponSkill("Iaijutsu", 30, 0, 1.8, 0, 0, 0, 0),
	midare_setsugekka: new SAM_Iaijutsu("Midare Setsugekka", 50, 720, 3, 0),
	tenka_goken: new SAM_Iaijutsu("Tenka Goken", 40, 360, 0, 5),
	higanbana: new SAM_Iaijutsu("Higanbana", 30, 240, 3, 0),

	hagakure: new SAM_Ability("Hagakure", 68, 40),
	meikyo_shisui: new SAM_Buff("Meikyo Shisui", 50, 80),

	meditate: new SAM_Buff("Meditate", 50, 60),

	hissatsu_kaiten: new SAM_DamageAbility("Hissatsu: Kaiten", 52, 0, 5, 0, 0, 20),
	hissatsu_gyoten: new SAM_DamageAbility("Hissatsu: Gyoten", 54, 100, 10, 20, 0, 10),
	hissatsu_yaten: new SAM_DamageAbility("Hissatsu: Yaten", 56, 100, 10, 3, 0, 10),
	hissatsu_shinten: new SAM_DamageAbility("Hissatsu: Shinten", 62, 300, 1, 3, 0, 25),
	hissatsu_kyuten: new SAM_DamageAbility("Hissatsu: Kyuten", 64, 150, 1, 0, 5, 25),
	hissatsu_seigan: new SAM_DamageAbility("Hissatsu: Seigan", 66, 200, 1, 3, 0, 15),
	hissatsu_guren: new SAM_DamageAbility("Hissatsu: Guren", 70, 800, 120, 10, 5, 50),

	third_eye: new SAM_Buff("Third Eye", 6, 15),
	merciful_eyes: new SAM_Ability("Merciful Eyes", 58, 1),
	ageha: new SAM_DamageAbility("Ageha", 10, 250, 60, 3, 0, 10),
};

/***************

ACTION OVERRIDES

 ****************/
//AoE
sam_actions.fuga.damageSteps = [1];
sam_actions.hissatsu_kyuten.damageSteps = [1];
sam_actions.hissatsu_guren.damageSteps = [.75, .5];
sam_actions.tenka_goken.damageSteps = [.9, .8, .7, .6, .5];
sam_actions.mangetsu.damageSteps = [.9, .8, .7, .6, .5];
sam_actions.mangetsu.comboDamageSteps = [.95, .9, .85, .8, .75];
sam_actions.oka.damageSteps = [.9, .8, .7, .6, .5];
sam_actions.oka.comboDamageSteps = [.95, .9, .85, .8, .75];

 
 
//Enpi
sam_actions.enpi.execute = function (state) {
	setResource1(state.resource_1 + 10);
	if (hasStatus('enhanced_enpi'))
		setStatus('enhanced_enpi', false);
};
sam_actions.enpi.getPotency = function (state) {
	return hasStatus('enhanced_enpi') ? 300 : this.potency;
};
sam_actions.enpi.isHighlighted = function (state) {
	return hasStatus('enhanced_enpi');
};
//Hagakure
sam_actions.hagakure.isUseable = function (state) {
	return hasAnyStatus(['sen_ka', 'sen_getsu', 'sen_setsu']);
};
sam_actions.hagakure.execute = function (state) {
	var amt = 0;
	amt += hasStatus('sen_setsu') ? 20 : 0;
	amt += hasStatus('sen_getsu') ? 20 : 0;
	amt += hasStatus('sen_ka') ? 20 : 0;
	setResource1(state.resource_1 + amt);

	setStatus('sen_setsu', false);
	setStatus('sen_getsu', false);
	setStatus('sen_ka', false);
};
//Iaijutsu
sam_actions.iaijutsu.isUseable = function (state) {
	return false;
};
sam_actions.iaijutsu.getReplacement = function (state) {
	var count = 0;
	count += hasStatus('sen_setsu') ? 1 : 0;
	count += hasStatus('sen_getsu') ? 1 : 0;
	count += hasStatus('sen_ka') ? 1 : 0;
	if (count == 3)
		return 'midare_setsugekka';
	if (count == 2)
		return 'tenka_goken';
	if (count == 1)
		return 'higanbana';
	return false;
};
//Ageha
sam_actions.ageha.isUseable = function (state) {
	return false;
};
//Hissatsu: Seigan
sam_actions.hissatsu_seigan.isUseable = function (state) {
	return state.resource_1 >= this.kenki && hasStatus('eyes_open');
};
//Merciful Eyes
sam_actions.merciful_eyes.isUseable = function (state) {
	return hasStatus('eyes_open');
};
sam_actions.merciful_eyes.execute = function (state) {
	setStatus('eyes_open', false);
};
sam_actions.merciful_eyes.recastGroup = function () {
	return 'hissatsu_seigan';
};
//Hissatsu: Kaiten
sam_actions.hissatsu_kaiten.execute = function (state) {
	setResource1(state.resource_1 - this.kenki);
	setStatus('hissatsu_kaiten', true);
};
//Hissatsu: Yaten
sam_actions.hissatsu_yaten.execute = function (state) {
	setResource1(state.resource_1 - this.kenki);
	setStatus('enhanced_enpi', true);
};

sam_actions.ageha.execute = function (state) {
	setResource1(state.resource_1 + this.kenki);
};

/***************

STATUSES

 ***************/
const sam_status = {
	jinpu: new Status("Jinpu", 30, "#E0B000"),
	shifu: new Status("Shifu", 30, "#B07F6F"),
	yukikaze: new Status("Yukikaze", 30, "#6FA0E0"),
	sen_setsu: new Status("Setsu", 60, "#52CCD1"),
	sen_getsu: new Status("Getsu", 60, "#4D6DAC"),
	sen_ka: new Status("Ka", 60, "#D8615B"),
	higanbana: new Dot("Higanbana", 60, 35, "#7F2F1F"),
	meikyo_shisui: new StatusStack("Meikyo Shisui", 10, "#E04F4F", 3, 3),
	third_eye: new Status("Third Eye", 3, "#4F6F90"),
	eyes_open: new Status("Eyes Open", 15, "#5F4FE0"),
	enhanced_enpi: new Status("Enhanced Enpi", 15, "#4F3FB0"),
	hissatsu_kaiten: new Status("Hissatsu Kaiten", 10, "#C04F0F"),
	meditate: new Status('Meditate', 15, "#"),
}

/***************

STATUS OVERRIDES

 ****************/
sam_status.third_eye.finalize = function (state) {
	setStatus('eyes_open', true);
	setStatus('third_eye', false);
};

sam_status.meditate.tick = function (state) {
	setResource1(state.resource_1 + 10);
	return 0;
};

/***************

DESCRIPTIONS

 ***************/

sam_actions.hakaze.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>. <br/>
	<span class="green">Additional Effect:</span> Increases <span class="orange">Kenki Gauge</span> by 5`;
}
sam_actions.jinpu.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>. <br/>
	<span class="green">Combo Action:</span> <span class="orange">Hakaze</span> <br/>
	<span class="green">Combo Potency:</span> ${this.comboPotency} <br/>
	<span class="green">Combo Bonus:</span> Increases damage dealt by 10% <br/>
	<span class="green">Duration:</span> 30s <br/>
	<span class="green">Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by ${this.comboKenki}`;
}
sam_actions.gekko.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
	<span class="green">Combo Action:</span> <span class="orange">Jinpu</span><br/>
	<span class="green">Combo Potency:</span> ${this.comboPotency}<br/>
	<span class="green">Rear Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by ${this.kenki}<br/>
	<span class="green">Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by ${this.comboKenki}<br/>
	<span class="green">Combo Bonus:</span> Grants <span class="yellow">Getsu</span>`;
}
sam_actions.shifu.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
	<span class="green">Combo Action:</span> <span class="orange">Hakaze</span><br/>
	<span class="green">Combo Potency:</span> ${this.comboPotency}<br/>
	<span class="green">Combo Bonus:</span> Reduces weaponskill cast time and recast time, spell cast time and recast time, and auto-attack delay by 10%<br/>
	<span class="green">Duration:</span> 30s<br/>
	<span class="green">Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by ${this.comboKenki}`;
}
sam_actions.kasha.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
	<span class="green">Combo Action:</span> <span class="orange">Shifu</span><br/>
	<span class="green">Combo Potency:</span> ${this.comboPotency}<br/>
	<span class="green">Side Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by ${this.kenki}<br/>
	<span class="green">Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by ${this.comboKenki}<br/>
	<span class="green">Combo Bonus:</span> Grants <span class="yellow">Ka</span>`;
}
sam_actions.yukikaze.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
	<span class="green">Combo Action:</span> <span class="orange">Hakaze</span><br/>
	<span class="green">Combo Potency:</span> ${this.comboPotency}<br/>
	<span class="green">Combo Bonus:</span> Reduces target's slashing resistance by 10%<br/>
	<span class="green">Duration:</span> 30s<br/>
	<span class="green">Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by ${this.comboKenki}<br/>
	<span class="green">Combo Bonus:</span> Grants <span class="yellow">Setsu</span>`;
}
sam_actions.fuga.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> to all enemies in a cone before you.<br/>
	<span class="green">Additional Effect:</span> Increases <span class="orange">Kenki Gauge</span> by ${this.kenki}`;
}
sam_actions.mangetsu.getDesc = function (state) {
	return `Delivers an attack to all nearby enemies with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> for the first enemy, 10% less for the second, 20% less for the third, 30% less for the fourth, 40% less for the fifth, and 50% less for all remaining enemies.<br/>
	<span class="green">Combo Action:</span> <span class="orange">Fuga</span><br/>
	<span class="green">Combo Potency:</span> ${this.comboPotency} for the first enemy, 5% less for the second, 10% less for the third, 15% less for the fourth, 20% less for the fifth, and 25% less for all remaining enemies.<br/>
	<span class="green">Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by ${this.comboKenki}<br/>
	<span class="green">Combo Bonus:</span> Grants <span class="yellow">Getsu</span>`;
}
sam_actions.oka.getDesc = function (state) {
	return `Delivers an attack to nearby enemies with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> for the first enemy, 10% less for the second, 20% less for the third, 30% less for the fourth, 40% less for the fifth, and 50% less for all remaining enemies.<br/>
	<span class="green">Combo Action:</span> <span class="orange">Fuga</span><br/>
	<span class="green">Combo Potency:</span> ${this.comboPotency} for the first enemy, 5% less for the second, 10% less for the third, 15% less for the fourth, 20% less for the fifth, and 25% less for all remaining enemies.<br/>
	<span class="green">Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by ${this.comboKenki}<br/>
	<span class="green">Combo Bonus:</span> Grants <span class="yellow">Ka</span>`;
}
sam_actions.enpi.getDesc = function (state) {
	return `Delivers a ranged attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
	<span class="green">Enhanced Enpi Bonus Potency:</span> 300<br/>
	<span class="green">Additional Effect:</span> Increases <span class="orange">Kenki Gauge</span> by ${this.kenki}`;
}
sam_actions.hagakure.getDesc = function (state) {
	return `Converts <span class="yellow">Setsu</span>, <span class="yellow">Getsu</span>, and <span class="yellow">Ka</span> into <span class="orange">Kenki</span>. Each <span class="yellow">Sen</span> converted increases your <span class="orange">Kenki Gauge</span> by 20. Can only be executed if under the effect of at least one of the three statuses.`;
}
sam_actions.iaijutsu.getDesc = function (state) {
	return `Executes a weaponskill depending on current number of <span class="yellow">Sen</span> stored in <span class="orange">Sen Gauge</span>.<br/>
	<span class="green">1 Sen:</span> <span class="orange">Higanbana</span><br/>
	<span class="green">2 Sen:</span> <span class="orange">Tenka Goken</span><br/>
	<span class="green">3 Sen:</span> <span class="orange">Midare Setsugekka</span>`;
}
sam_actions.midare_setsugekka.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.`;
}
sam_actions.tenka_goken.getDesc = function (state) {
	return `Delivers an attack to all enemies in a cone before you with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> for the first enemy, 10% less for the second, 20% less for the third, 30% less for the fourth, 40% less for the fifth, and 50% less for all remaining enemies.`;
}
sam_actions.higanbana.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
	<span class="green">Additional Effect:</span> Damage over time<br/>
	<span class="green">Potency:</span> 35<br/>
	<span class="green">Duration:</span> 60s`;
}
sam_actions.meikyo_shisui.getDesc = function (state) {
	return `Execute up to 3 weaponskill combos without meeting combo prerequisites. Does not affect <span class="orange">Iaijutsu</span>.<br/>
	<span class="green">Duration:</span> 10s`;
}
sam_actions.ageha.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
	<span class="green">Additional Effect:</span> Increases <span class="orange">Kenki Gauge</span> by ${this.kenki} (30 if killing blow is dealt)<br/>
	Can only be executed when target's HP is below 20%.`;
}
sam_actions.third_eye.getDesc = function (state) {
	return `Reduces the amount of damage taken by the next attack by 5%.<br/>
	<span class="green">Duration:</span> 3s<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Open Eyes</span> when hit<br/>
	<span class="green">Duration:</span> 15s`;
}
sam_actions.meditate.getDesc = function (state) {
	return `Gradually increases your <span class="orange">Kenki Gauge</span>.<br/>
	<span class="green">Duration:</span> 15s<br/>
	<span class="orange">Kenki Gauge</span> not affected when used outside battle.<br/>
	Effect ends upon executing another action or moving.<br/>
	Cancels auto-attack upon execution.`;
}
sam_actions.hissatsu_gyoten.getDesc = function (state) {
	return `Rushes target and delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
	<span class="green">Kenki Gauge Cost:</span> ${this.kenki}<br/>
	Cannot be executed while bound.`;
}
sam_actions.hissatsu_shinten.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
	<span class="green">Kenki Gauge Cost:</span> ${this.kenki}`;
}
sam_actions.hissatsu_kyuten.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> to all nearby enemies.<br/>
	<span class="green">Kenki Gauge Cost:</span> ${this.kenki}`;
}
sam_actions.hissatsu_guren.getDesc = function (state) {
	return `Delivers an attack to all enemies in a straight line before you with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> for the first enemy, 25% less for the second, and 50% less for all remaining enemies.<br/>
	<span class="green">Kenki Gauge Cost:</span> ${this.kenki}`;
}
sam_actions.hissatsu_seigan.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
	<span class="green">Kenki Gauge Cost:</span> 15<br/>
	Can only be executed while under the effect of <span class="yellow">Open Eyes</span>.<br/>
	Shares a recast timer with <span class="orange">Merciful Eyes</span>.`;
}
sam_actions.merciful_eyes.getDesc = function (state) {
	return `Instantly restores own HP.<br/>
	<span class="green">Cure Potency:</span> 200<br/>
	Cure potency varies with current attack power.<br/>
	Can only be executed while under the effect of <span class="yellow">Open Eyes</span>.<br/>
	Shares a recast timer with <span class="orange">Hissatsu: Seigan</span>.`;
}
sam_actions.hissatsu_kaiten.getDesc = function (state) {
	return `Increases potency of next weaponskill by 50%.<br/>
	<span class="green">Duration:</span> 10s<br/>
	<span class="green">Kenki Gauge Cost:</span> ${this.kenki}`;
}
sam_actions.hissatsu_yaten.getDesc = function (state) {
	return `Delivers an attack with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
	<span class="green">Additional Effect:</span> 10-yalm backstep<br/>
	<span class="green">Additional Effect:</span> Grants <span class="yellow">Enhanced Enpi</span><br/>
	<span class="green">Duration:</span> 15s<br/>
	<span class="green">Kenki Gauge Cost:</span> ${this.kenki}<br/>
	Cannot be executed while bound.`;
}