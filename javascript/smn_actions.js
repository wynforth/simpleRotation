/***************

CLASSES

 ***************/
class SMN_Buff extends Buff {
	constructor(name, level, recast) {
		super(name, level, recast, ['SMN']);
	}
}

class SMN_Spell extends Spell {
	constructor(name, level, potency, cast, mana, range, radius) {
		super(name, level, potency, cast, mana, range, radius, ['SMN'])
	}

	unique(state) {}

	execute(state) {
		super.execute(state);
		this.unique(state);

		if (hasStatus('swiftcast'))
			setStatus('swiftcast', false);
	}

	getCast(state) {
		return hasStatus('swiftcast') ? 0 : super.getCast(state);
	}
	
	getPotency(state){
		return super.getPotency(state);
	}
}

class SMN_StatusSpell extends SMN_Spell {
	constructor(name, level, potency, cast, mana, range, radius) {
		super(name, level, potency, cast, mana, range, radius)
	}
	
	execute(state){
		super.execute(state);
		setStatus(this.id, true);
	}
}

class SMN_AetherAbility extends Ability {
	constructor(name, level, potency, recast, range, radius) {
		super(name, level, recast, range, radius, ['SMN']);
		this.potency = potency;
	}
	
	unique(state) {};
	
	execute(state){
		super.execute(state);
		this.unique(state);
		updateStatus('aetherflow',-1);
	}
	
	isUseable(state){
		return getStacks('aetherflow') > 0;
	}
}

class SMN_Ability extends Ability {
	constructor(name, level, recast, range){
		super(name, level, recast, range, 0, ['SMN']);
	}
	
}

class SMN_DamageAbility extends DamageAbility {
	constructor(name, level, potency, recast, range, radius){
		super(name, level, potency, recast, range, radius, ['SMN']);
	}
	
	unique(state) {}
	execute(state){
		super.execute(state);
		this.unique(state);
	}
}

/***************

ACTIONS

 ***************/

const smn_actions = { 
	ruin: new SMN_Spell('Ruin', 1, 100, 2.5, 240, 25, 0),
	bio: new SMN_StatusSpell('Bio', 2,  0, 0, 480, 25, 0),
	physick: new SMN_Spell('Physick', 4, 0, 2, 600, 25, 0),
	aetherflow: new SMN_Buff('Aetherflow', 6, 60),
	energy_drain: new SMN_AetherAbility('Energy Drain', 6, 150, 3, 25, 0),
	miasma: new SMN_StatusSpell('Miasma', 10, 20, 2.5, 600, 25, 0),
	resurrection: new SMN_Spell('Resurrection', 18, 0, 8, 3600, 25, 0),
	bio_ii: new SMN_StatusSpell('Bio II', 26, 0, 0, 720, 25, 0),
	bane: new SMN_AetherAbility('Bane', 30, 0, 10, 25, 8),
	ruin_ii: new SMN_Spell('Ruin II', 38, 100, 0, 480, 25, 0),
	rouse: new SMN_Buff('Rouse', 42, 60),
	shadowflare: new SMN_DamageAbility('Shadowflare', 50, 0, 60, 25, 5), 
	
	fester: new SMN_AetherAbility('Fester', 35, 0, 5, 25, 0),
	tri_bind: new SMN_Spell('Tri-Bind', 40, 0, 3, 1200, 25, 5),
	enkindle: new SMN_Ability('Enkindle', 50, 180, 25),
	painflare: new SMN_AetherAbility('Painflare', 52, 200, 5, 25, 5),
	ruin_iii: new SMN_Spell('Ruin III', 54, 150, 2.5, 1440, 25, 5),
	tri_disaster: new SMN_Ability('Tri-Disaster', 56, 60, 25),
	
	dreadwyrm_trance: new SMN_Buff('Dreadwyrm Trance', 58, 20),
	deathflare: new SMN_DamageAbility('Deathflare', 60, 400, 15, 25, 5),
	ruin_iv: new SMN_Spell('Ruin IV', 62, 200, 2.5, 240, 25, 0),
	aetherpact: new SMN_Buff('Aetherpact', 64, 90),
	bio_iii: new SMN_StatusSpell('Bio III', 66, 0, 0, 720, 25, 0), 
	miasma_ii: new SMN_StatusSpell('Miasma II', 66, 50, 2.5, 600, 25, 0),
	summon_bahamut: new SMN_Buff('Summon Bahamut', 70, 30),
	enkindle_bahamut: new SMN_Ability('Enkindle Bahamut', 70, 13, 25),
};

/***************

ACTION OVERRIDES

 ***************/
 
 smn_actions.aetherflow.unique = function(state){
	 setMana(state.mana +(state.maxMana * .10));
 }

/***************

STATUSES

 ***************/

const smn_status = { 
	bio: new Dot('Bio', 18, 40, "#fff"),
	miasma: new Dot('Miasma', 24, 35, "#fff"),
	aetherflow: new StatusStack('Aetherflow', 60, "#fff", 3, 3), 
	bio_ii: new Dot('Bio II', 30, 35, "#fff"),
	rouse: new Status('Rouse', 20, "#fff"),
	shadowflare: new Dot('Shadowflare', 15, 50, "#fff"),
	bio_iii: new Dot('Bio III', 30, 40, "#fff"),
	miasma_ii: new Dot('Miasma II', 30, 40, "#fff"),
	summon_bahamut: new Status('Summon Bahamut', 20, "#fff"),
	
	
	
	
};

/***************

STATUS OVERRIDES

 ***************/

 
/***************

DESCRIPTIONS

 ***************/