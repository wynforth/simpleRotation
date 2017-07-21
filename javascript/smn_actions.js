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

	execute(state) {
		super.execute(state);

		if (hasStatus('swiftcast') && (this.cast > 0))
			setStatus('swiftcast', false);
	}
	
	onAdd(state){
		/*
		if(hasStatus('summon_bahamut') && this.id != 'wyrmwave'){
			console.log('bahamut casting wyrmwave');
			addAction('wyrmwave', false);
		
		}
		*/
	}

	getCast(state) {
		return hasStatus('swiftcast') ? 0 : super.getCast(state);
	}
	
	getPotency(state){
		return super.getPotency(state) * (hasStatus('dreadwyrm_trance') ? 1.1 : 1);
	}
}

class SMN_PetSpell extends Spell {
	constructor(name, level, potency, range, radius) {
		super(name, level, potency, 0, 0, range, radius, ['SMN'])
		//this.recast = 1.5;
		this.animTime = 0;
		this.type = 'ability';
	}
	
	execute(state) {
		super.execute(state);
	}
	
	recastGroup() {
		return 'pet';
	}
}

class SMN_RuinSpell extends SMN_Spell{
	constructor(name, level, potency, cast, mana) {
		super(name, level, potency, cast, mana, 25, 0);
	}
	
	getPotency(state){
		return (this.potency + (hasStatus('ruination') ? 20 : 0)) * (hasStatus('dreadwyrm_trance') ? 1.1 : 1);
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
	
	execute(state){
		super.execute(state);
		updateStatus('aetherflow',-1);
		updateStatus('aethertrail_attunement', 1);
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
}

/***************

ACTIONS

 ***************/

const smn_actions = { 
	ruin: new SMN_RuinSpell('Ruin', 1, 100, 2.5, 240),
	ruin_ii: new SMN_RuinSpell('Ruin II', 38, 100, 0, 480),
	ruin_iii: new SMN_RuinSpell('Ruin III', 54, 150, 2.5, 1440),
	ruin_iv: new SMN_RuinSpell('Ruin IV', 62, 200, 2.5, 240),
	
	bio: new SMN_StatusSpell('Bio', 2,  0, 0, 480, 25, 0),
	bio_ii: new SMN_StatusSpell('Bio II', 26, 0, 0, 720, 25, 0),
	bio_iii: new SMN_StatusSpell('Bio III', 66, 0, 0, 720, 25, 0), 
	miasma: new SMN_StatusSpell('Miasma', 10, 20, 2.5, 600, 25, 0),
	miasma_ii: new SMN_StatusSpell('Miasma II', 66, 50, 2.5, 600, 25, 0),
	
	tri_disaster: new SMN_Ability('Tri-Disaster', 56, 60, 25),
	
	aetherflow: new SMN_Buff('Aetherflow', 6, 60),
	energy_drain: new SMN_AetherAbility('Energy Drain', 6, 150, 3, 25, 0),
	bane: new SMN_AetherAbility('Bane', 30, 0, 10, 25, 8),
	fester: new SMN_AetherAbility('Fester', 35, 0, 5, 25, 0),
	painflare: new SMN_AetherAbility('Painflare', 52, 200, 5, 25, 5),
	
	dreadwyrm_trance: new SMN_Buff('Dreadwyrm Trance', 58, 20),
	deathflare: new SMN_DamageAbility('Deathflare', 60, 400, 15, 25, 5),
	summon_bahamut: new SMN_Buff('Summon Bahamut', 70, 30),
	enkindle_bahamut: new SMN_Ability('Enkindle Bahamut', 70, 13, 25),
	aetherpact: new SMN_Buff('Aetherpact', 64, 90),
	
	shadowflare: new SMN_DamageAbility('Shadowflare', 50, 50, 60, 25, 5), 
	rouse: new SMN_Buff('Rouse', 42, 60),
	enkindle: new SMN_Ability('Enkindle', 50, 180, 25),

	tri_bind: new SMN_Spell('Tri-Bind', 40, 30, 3, 1200, 25, 5),
	physick: new SMN_Spell('Physick', 4, 0, 2, 600, 25, 0),
	resurrection: new SMN_Spell('Resurrection', 18, 0, 8, 3600, 25, 0),
	
	summon: new SMN_Spell('Summon', 4, 0, 6, 1200, 0, 0),
	summon_ii: new SMN_Spell('Summon II', 4, 0, 6, 1200, 0, 0),
	summon_iii: new SMN_Spell('Summon III', 4, 0, 6, 1200, 0, 0),
	
	wyrmwave: new SMN_PetSpell('Wyrmwave', 70, 160, 25, 0),
};

/***************

ACTION OVERRIDES

 ***************/
 //AoE
 smn_actions.painflare.damageSteps = [1];
 smn_actions.tri_bind.damageSteps = [1];
 
 
 smn_actions.bio.getReplacement = function(state){
	 if(state.level >= 66)
		 return 'bio_iii';
	 if(state.level >= 26)
		 return 'bio_ii';
	 return false;
 }
 
  smn_actions.miasma.getReplacement = function(state){
	 if(state.level >= 66)
		 return 'miasma_ii';
	 return false;
 }
 
 smn_actions.bio_ii.hidden = true;
 smn_actions.bio_iii.hidden = true;
 smn_actions.miasma_ii.hidden = true;
 
 smn_actions.ruin.getReplacement = function(state){
	 return hasStatus('further_ruin') ? 'ruin_iv' : false;
 }
 
 smn_actions.ruin_iii.getReplacement = function(state){
	 return hasStatus('further_ruin') ? 'ruin_iv' : false;
 }
 
 smn_actions.ruin_iii.getManaCost = function(state){
	 return this.mana * (hasStatus('dreadwyrm_trance') ? .2 : 1);
 }
 
 smn_actions.ruin_iv.hidden = true;
 
 
 smn_actions.aetherflow.unique = function(state){
	 setMana(state.mana +(state.maxMana * .10));
 }
 
 smn_actions.aetherflow.isUseable = function(state){
	 return getStacks('aethertrail_attunement') < 3 && !hasStatus('dreadwyrm_trance');
 }
 
 smn_actions.fester.getPotency = function(state){
	 var potency = 0;
	 potency += hasAnyStatus(['bio','bio_ii','bio_iii']) ? 150 : 0;
	 potency += hasAnyStatus(['miasma','miasma_ii']) ? 150 : 0;
	 return potency;
 }
 
 smn_actions.fester.isUseable = function(state){
	 return (getStacks('aetherflow') > 0) && hasAnyStatus(['bio','bio_ii','bio_iii','miasma','miasma_ii']);
 }

 smn_actions.shadowflare.unique = function(state){
	 setStatus('shadowflare', true);
 }
 
 smn_actions.tri_disaster.unique = function(state){
	 setStatus('ruination', true);
	 if(state.level < 66){
		 setStatus('bio_ii', true);
		 setStatus('miasma', true);
	 } else {
		 setStatus('bio_iii', true);
		 setStatus('miasma_ii', true);
	 }
 }
 
 smn_actions.dreadwyrm_trance.unique = function(state){
	 setRecast('tri_disaster', 0);
	 setStatus('aethertrail_attunement', false);
 }
 
 smn_actions.dreadwyrm_trance.isUseable = function(state){
	 return (getStacks('aethertrail_attunement') >= 3) && !hasStatus('summon_bahamut');
 }
 
 smn_actions.deathflare.unique = function(state){
	 setStatus('dreadwyrm_trance', false);
 }
 
 smn_actions.deathflare.isUseable = function(state){
	 return hasStatus('dreadwyrm_trance');
 }
 
 
 smn_actions.summon_bahamut.unique = function(state){
	 updateStatus('dreadwyrm_aether', -2);
 }

 smn_actions.summon_bahamut.isUseable = function(state){
	 return true; //getStacks('dreadwyrm_aether') >= 2;
 }
 
  smn_actions.enkindle_bahamut.isUseable = function(state){
	 return hasStatus('summon_bahamut');
 }
 
/***************

STATUSES

 ***************/

const smn_status = { 
	bio: new Dot('Bio', 18, 40, "#88BE50"),
	bio_ii: new Dot('Bio II', 30, 35, "#88BE50"),
	bio_iii: new Dot('Bio III', 30, 40, "#88BE50"),
	miasma: new Dot('Miasma', 24, 35, "#721DD7"),
	miasma_ii: new Dot('Miasma II', 30, 40, "#721DD7"),
	aetherflow: new StatusStack('Aetherflow', 120, "#864014", 3, 3), 
	aethertrail_attunement: new StatusStack('Aethertrail Attunement', 120, "#fff", 1, 3), 
	rouse: new Status('Rouse', 20, "#188FF0"),
	shadowflare: new AoE_Dot('Shadowflare', 15, 50, "#9A2498"),
	summon_bahamut: new Status('Summon Bahamut', 20, "#fff"),
	further_ruin: new Status('Further Ruin', 12, "#fff"),
	ruination: new Status('Ruination', 20, "#4BA1EC"),
	dreadwyrm_trance : new Status('Dreadwyrm Trance', 16, "#C1294D"),
	dreadwyrm_aether : new StatusStack('Dreadwyrm Aether', 60, "#fff", 1, 10),
};

/***************

STATUS OVERRIDES

 ***************/
smn_status.dreadwyrm_trance.finalize = function(state){
	updateStatus('dreadwyrm_aether', 1);
}
 
/***************

DESCRIPTIONS

 ***************/
 
 
smn_actions.ruin.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.`;
}
smn_actions.ruin_ii.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.`;
}
smn_actions.ruin_iii.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
MP cost reduced while in <span class="yellow">Dreadwyrm Trance</span>.`;
}
smn_actions.ruin_iv.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
Can only be executed while under the effect of <span class="yellow">Further Ruin</span>.`;
}
smn_actions.bio.getDesc = function (state) {
	return `Deals unaspected damage over time.<br/>
<span class="green">Potency:</span> 40<br/>
<span class="green">Duration:</span> 18s`;
}
smn_actions.bio_ii.getDesc = function (state) {
	return `Deals unaspected damage over time.<br/>
<span class="green">Potency:</span> 35<br/>
<span class="green">Duration:</span> 30s`;
}
smn_actions.bio_iii.getDesc = function (state) {
	return `Deals unaspected damage over time.<br/>
<span class="green">Potency:</span> 40<br/>
<span class="green">Duration:</span> 30s`;
}
smn_actions.miasma.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
<span class="green">Additional Effect:</span> Unaspected damage over time<br/>
<span class="green">Potency:</span> 35<br/>
<span class="green">Duration:</span> 24s`;
}
smn_actions.miasma_ii.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
<span class="green">Additional Effect:</span> Unaspected damage over time<br/>
<span class="green">Potency:</span> 40<br/>
<span class="green">Duration:</span> 30s`;
}
smn_actions.tri_disaster.getDesc = function (state) {
	return `Inflicts target with <span class="orange">Bio III</span> and <span class="orange">Miasma III</span>.<br/>
<span class="green">Additional Effect:</span> Inflicts target with <span class="yellow">Ruination</span>, increasing the potency of <span class="orange">Ruin</span> spells used against target by 20<br/>
<span class="green">Duration:</span> 15s`;
}
smn_actions.aetherflow.getDesc = function (state) {
	return `Restores 10% of maximum MP.<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Aetherflow III</span><br/>
<span class="green">Duration:</span> Infinite<br/>
Aetherflow not granted to gauge slots affected by <span class="yellow">Aethertrail Attunement</span>. Cannot use while under the effect of <span class="yellow">Dreadwyrm Trance</span>.`;
}
smn_actions.energy_drain.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
<span class="green">Additional Effect:</span> Absorbs a portion of damage dealt as HP and restores MP<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Aethertrail Attunement</span><br/>
<span class="green">Aetherflow Gauge Cost:</span> 1`;
}
smn_actions.bane.getDesc = function (state) {
	return `Spreads a target's <span class="orange">Bio</span> and <span class="orange">Miasma</span> effects to nearby enemies.<br/>
Potency is reduced by 20% for the second enemy, 40% for the third, 60% for the fourth, and 80% for all remaining enemies.<br/>
<span class="green">Duration:</span> Time remaining on original effect<br/>
<span class="green">Additional Effect:</span> 15% chance that <span class="orange">Bio</span> and <span class="orange">Miasma</span> duration resets if shorter than original effect duration<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Aethertrail Attunement</span><br/>
<span class="green">Aetherflow Gauge Cost:</span> 1`;
}
smn_actions.fester.getDesc = function (state) {
	return `Cause wounds inflicted by <span class="orange">Bio</span> and <span class="orange">Miasma</span> spells to fester, dealing damage with a potency of 150 for one effect, 300 for both. <span class="calc">potency ${this.getPotency(state).toFixed(0)}</span><br/>
Can only be executed when the original spells were cast by you.<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Aethertrail Attunement</span><br/>
<span class="green">Aetherflow Gauge Cost:</span> 1`;
}
smn_actions.painflare.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> to target and all enemies nearby it.<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Aethertrail Attunement</span><br/>
<span class="green">Aetherflow Gauge Cost:</span> 1`;
}
smn_actions.dreadwyrm_trance.getDesc = function (state) {
	return `Increases magic damage dealt by 10% while lowering the MP cost of <span class="orange">Ruin III</span>.<br/>
<span class="green">Duration:</span> 16s<br/>
<span class="green">Additional Effect:</span> Resets <span class="orange">Tri-disaster</span> recast timer<br/>
Increases Trance Gauge when effect ends.<br/>
Can only be executed when <span class="yellow">Aethertrail Attunement</span> stack is 3 and <span class="yellow">Demi-Bahamut</span> is not summoned.<br/>
<span class="yellow">Aethertrail Attunement</span> is achieved upon executing an <span class="orange">Aetherflow</span> action.<br/>
Cannot execute <span class="orange">Aetherflow</span> while under the effect of <span class="yellow">Dreadwyrm Trance</span>.`;
}
smn_actions.deathflare.getDesc = function (state) {
	return `Deals unaspected damage to a target and all enemies nearby it with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> for the first enemy, 10% less for the second, 20% less for the third, 30% less for the fourth, 40% less for the fifth, and 50% less for all remaining enemies.<br/>
Can only be executed while in <span class="yellow">Dreadwyrm Trance</span>. <span class="yellow">Dreadwyrm Trance</span> fades upon execution.`;
}
smn_actions.summon_bahamut.getDesc = function (state) {
	return `Summons <span class="yellow">Demi-Bahamut</span> to fight by your side. Each time you use an action on a target, <span class="yellow">Demi-Bahamut</span> will execute <span class="orange">Wyrmwave</span> on the same target.<br/>
<span class="green">Duration:</span> 20s<br/>
<span class="green">Dreadwyrm Aether Cost:</span> 2<br/>
Cannot summon <span class="yellow">Demi-Bahamut</span> unless a pet is already summoned. Current pet will leave the battlefield while <span class="yellow">Demi-Bahamut</span> is present, and return once gone. Cannot use while under the effect of <span class="yellow">Dreadwyrm Trance</span>.`;
}
smn_actions.enkindle_bahamut.getDesc = function (state) {
	return `Orders <span class="yellow">Demi-Bahamut</span> to execute <span class="orange">Akh Morn</span>.`;
}
smn_actions.aetherpact.getDesc = function (state) {
	return `Orders pet to execute <span class="orange">Devotion</span>. Party member must be within 30 yalms of the pet.`;
}
smn_actions.shadowflare.getDesc = function (state) {
	return `Envelops a designated area in a veil of magicked shadows, dealing damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> to any enemies who enter.<br/>
<span class="green">Duration:</span> 15s<br/>
<span class="green">Additional Effect:</span> Slow +5%<br/>
Cannot be used with any other area-creating actions.`;
}
smn_actions.rouse.getDesc = function (state) {
	return `Increases healing magic potency and damage dealt by pet by 40%. While roused, pet will be immune to <span class="yellow">Stun</span>, <span class="yellow">Sleep</span>, <span class="yellow">Bind</span>, and <span class="yellow">Heavy</span>.<br/>
<span class="green">Duration:</span> 20s`;
}
smn_actions.enkindle.getDesc = function (state) {
	return `Commands pet to use its signature attack.`;
}
smn_actions.tri_bind.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span> to target and all enemies nearby it.<br/>
<span class="green">Additional Effect:</span> <span class="yellow">Bind</span><br/>
<span class="green">Duration:</span> 20s`;
}
smn_actions.physick.getDesc = function (state) {
	return `Restores target's HP.<br/>
<span class="green">Cure Potency:</span> 400`;
}
smn_actions.resurrection.getDesc = function (state) {
	return `Resurrects target to a weakened state.`;
}
smn_actions.summon.getDesc = function (state) {
	return `Summons a caster-type pet to fight at your side.`;
}
smn_actions.summon_ii.getDesc = function (state) {
	return `Summons a tank-type pet to fight at your side.`;
}
smn_actions.summon_iii.getDesc = function (state) {
	return `Summons an attacker-type pet to fight at your side.`;
}
smn_actions.wyrmwave.getDesc = function (state) {
	return `Deals unaspected damage with a potency of <span class="calc">${this.getPotency(state).toFixed(0)}</span>.<br/>
Will only execute while <span class="yellow">Demi-Bahamut</span> is summoned.`;
}