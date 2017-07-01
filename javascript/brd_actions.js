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
	constructor(name, level, potency, cast,  range, radius) {
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

	execute(state){
		super.execute(state);
		addRecast(this.recastGroup(), this.recast);
		addRecast('global', state.targetTime - state.currentTime);
	}
	
	recastGroup(){
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
	straight_shot: new BRD_StatusWS("Straight Shot", 2,  140, 0, 50, 25, 0),
	raging_strikes: new BRD_Buff("Raging Strikes", 4, 80),
	venomous_bite: new BRD_StatusWS("Venomous Bite",6, 100, 0, 60, 25, 0),
	windbite: new BRD_StatusWS( "Windbite", 30, 60, 0, 60, 25, 0),
	quick_nock: new BRD_WeaponSkill("Quick Nock", 18,  110, 0, 120, 12, 12),
	rain_of_death: new BRD_StatusWS("Rain of Death", 45, 100, 0, 0, 25, 8),
	
	miserys_end: new BRD_Action("Misery's End",10, 190, 12, 25),

	bloodletter: new BRD_Action("Bloodletter",12,130, 15, 25),
	repelling_shot: new BRD_Action("Repelling Shot", 15, 0, 30, 5),

	foe_requiem: new BRD_Spell("Foe Requiem",  35, 100, 1.5, 0, 25),

	barrage: new BRD_Buff("Barrage", 38, 90),
	mages_ballad: new BRD_Song("Mage's Ballad", 30, 100, 80, 25),
	armys_paeon: new BRD_Song("Army's Paeon", 40, 100, 80, 25),
	the_wanderers_minuet: new BRD_Song("The Wanderer's Minuet", 52, 100, 80, 25),
	battle_voice: new BRD_Buff("Battle Voice",50,180),
};

/***************

ACTION OVERRIDES

 ****************/
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


/***************

STATUSES

***************/

const brd_status = {
	//BRD
	straight_shot: new Status( "Straight Shot", 20,"#B01F00"),
	raging_strikes: new Status( "Raging Strikes", 20, "#D03F00"),
	venomous_bite: new Dot("Venom", 18, "#905FE0", 40),
	windbite: new Dot( "Windbite",18, "#2F6FE0",50),
	mages_ballad: new Status("Mage's Ballad", 30,"#A07FC0"),
	foe_requiem: new Status("Foe Requiem",10, "#90D0D0"),
		
	barrage: new Status( "Barrage",10, "#B07F2F"),
	
	armys_paeon: new Status( "Army's Paeon", 30, "#D07F5F"),
	battle_voice: new Status( "Battle Voice", 20, "#7FD0E0"),
	the_wanderers_minuet: new Status("The Wanderer's Minuet",30, "#4F6F1F"),
};
/***************

STATUS OVERRIDES

 ***************/
 /*
 brd_status.foe_requiem.tick = function(state) {
			if (state.mana < 600)
				setStatus('foe_requiem', false);
			else {
				setStatus('foe_requiem', true);
				setMana(state.mana - 600);
			}
		}
		*/
 
/***************

DESCRIPTIONS

***************/

