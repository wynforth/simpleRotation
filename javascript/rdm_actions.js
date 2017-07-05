/***************

CLASSES

 ***************/


class RDM_Buff extends Buff {
	constructor(name, level, recast) {
		super(name, level);
		this.recast = recast;
	}

	execute(state) {
		setStatus(this.id, true);
	}
}

class RDM_Spell extends Spell {
	constructor(name, level, potency, cast, mana, range, radius, black, white) {
		super(name, level, potency, cast, mana, range, radius)
		this.black = black;
		this.white = white;
		this.affinity = ['RDM'];
	}
	
	execute(state){
		super.execute(state);
		if(hasStatus('dualcast'))
			setStatus('dualcast', false);
		else
			setStatus('dualcast', true);
		
	}
	
	getCast(state) {
		return hasStatus('dualcast') ? 0 : super.getCast(state);
	}

	getRecast(state) {
		return super.getRecast(state)
	}
}

class RDM_WeaponSkill extends WeaponSkill {
	constructor(name, level, potency, cast, tp, range, radius, black, white){
		super(name, level, potency, cast, tp, range, radius) 
		this.affinity = ['RDM'];
	}

	getCast(state) {
		return this.cast * (state.sks / 2.5);
	}

	getRecast(state) {
		return this.recast * (state.sks / 2.5);
	}
}
 
 class RDM_Ability extends BaseAction {
	constructor(name, level, recast) {
		super(name);
		this.level = level;
		this.recast = recast;
		this.affinity = ['RDM'];
	}
}

 class RDM_DamageAbility extends RDM_Ability {
	constructor(name, level, potency, recast, range, radius) {
		super(name, level, recast);
		this.potency = potency;
		this.range = range;
		this.radius = radius;
	}
}
 
/***************

ACTIONS

 ***************/

const rdm_actions = { 
	riposte: new RDM_WeaponSkill("Riposte", 1, 130, 0, 0, 3, 0, 0, 0),
	jolt: new RDM_Spell("Jolt", 2, 180, 2, 999, 25, 0, 3, 3),
	verthunder: new RDM_Spell("Verthunder", 4, 300, 5, 999, 25, 0, 11, 0),
	corps_a_corps: new RDM_DamageAbility("Corps-a-corps", 6, 130, 40, 25, 0),
	veraero: new RDM_Spell("Veraero", 4, 300, 5, 999, 25, 0, 0, 11),
};

/***************

ACTION OVERRIDES

 ***************/

/***************

STATUSES

 ***************/

const rdm_status = { 
		
	dualcast: new Status('Dualcast',60,"#"),
};

/***************

STATUS OVERRIDES

 ***************/

 
/***************

DESCRIPTIONS

 ***************/