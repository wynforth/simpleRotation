/***************

CLASSES

 ***************/

 class MNK_WeaponSkill extends WeaponSkill {
	constructor(name, level, potency, tp, range, radius) {
		super(name, level, potency, 0, tp, range, radius, ['MNK']);
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
		setStatus(this.stance_from, false);
		setStatus(this.stance_to, true);
	}

	isUseable(state){
		if(this.stance_from == 'opoopo_form')
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
	dragon_kick: new MNK_PositionalWS("Dragon Kick", 50, 100, 50, 3, 0, 'opoopo_form', 'raptor_form', 'flank', 140),
	arm_of_the_destroyer: new MNK_StanceWS("Arm of the Destroyer", 26, 50, 130, 0, 5, 'opoopo_form', 'raptor_form', 50),
	
	true_strike: new MNK_PositionalWS("True Strike", 4, 140, 50, 3, 0, 'raptor_form', 'coeurl_form', 'rear', 180),
	twin_snakes: new MNK_PositionalWS("Twin Snakes", 18, 100, 50, 3, 0, 'raptor_form', 'coeurl_form', 'flank', 130),
	one_ilm_punch: new MNK_StanceWS("One Ilm Punch", 45, 120, 120, 3, 0, 'raptor_form', 'coeurl_form'),
	
	snap_punch: new MNK_PositionalWS("Snap Punch", 6, 130, 40, 3, 0, 'coeurl_form', 'opoopo_form', 'flank', 170),
	demolish: new MNK_PositionalWS("Demolish", 30, 30, 40, 3, 0, 'coeurl_form','opoopo_form', 'rear', 70),
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
	wind_tackle: new MNK_DamageAbility("Earth Tackle", 66, 65, 30, 20, 0),	
	fire_tackle: new MNK_DamageAbility("Earth Tackle", 66, 130, 30, 20, 0),
	
	};

/***************

ACTION OVERRIDES

 ***************/

/***************

STATUSES

 ***************/

const mnk_status = {
	opoopo_form: new Status("Opo-opo Form", 10, "#fff"),
	raptor_form: new Status("Raptor Form", 10, "#fff"),
	coeurl_form: new Status("Coeurl Form", 10, "#fff"),
	internal_release: new Status("Internal Release", 15, "#fff"),
	greased_lightning: new StatusStack("Greased Lightning", 16, "#fff", 1, 3),

	fists_of_earth: new Status("Fists of Earth", 99, "#fff"),
	fists_of_wind: new Status("Fists of Wind", 99, "#fff"),
	fists_of_fire: new Status("Fists of Fire", 99, "#fff"),

	mantra: new Status("Mantra", 15, "#fff"),
	perfect_balance: new Status("Perfect Balance", 10, "#fff"),
		
	brotherhood: new Status("Brotherhood", 15, "#fff"),

	riddle_of_earth: new Status("Riddle of Earth", 30, "#fff"),
	earths_reply: new Status("Earth's Reply", 30, "#fff"),
	riddle_of_wind: new Status("Riddle of Wind", 5, "#fff"),
	riddle_of_fire: new Status("Riddle of Fire", 20, "#fff"),
};

/***************

STATUS OVERRIDES

 ***************/

 
/***************

DESCRIPTIONS

 ***************/