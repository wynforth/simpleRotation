const baseAction = {
	name: "Action",
	type: "ability",
	description: `Does an action`,
	cast: 0,
	recast: 2.5,
	nextCast: 0,
	potency: 0,
	mana: 0,
	tp: 0,
	animTime: 0.8,
	comboActions: [],
	comboPotency: 0,
	hidden: false,
	level: 1,
	
	recastGroup(){
		return this.type=='ability' ? this.id : 'global';
	},
	
	isCombo(state) {
		if(state.lastActionTime + 8000 > state.currentTime && this.comboActions.includes(state.lastAction)) {
			var action = getAction(state.lastAction);
			return action.comboActions.length > 0 ? state.lastCombo : true;
		}
		return false;
	},
	
	execute(state) { 
	},
	
	isLevel(state) {
		return this.level <= state.level;
	},
	
	isUseable(state) {
		return this.isLevel(state);
	},
	
	isHighlighted(state) {
		return false;
	},
	
	getReplacement(state) {
		return false;
	},
	
	getPotency(state) {
		if(this.comboActions.length == 0)
			return this.potency;
		return this.isCombo(state) ? this.comboPotency : this.potency;
	},
	
	getManaCost(state) {
		return this.mana;
	},
	
	getTPCost(state) {
		return this.tp;
	},
	
	getCast(state) {
		return this.cast;
	},
	
	getRecast(state) {
		return Math.max(0, this.nextCast - state.currentTime);
	}
};



const BLMactions = {
	fire_i: {
		name: "Fire I",
		type: "spell",
		potency: 180,
		mana: 1440,
		cast: 2.5,
		execute(state){
			if(hasStatus("umbral_ice")) {
				setStatus("umbral_ice",false);
			} else if(hasStatus("astral_fire")){
				updateStatus("astral_fire",1);
				updateStatus("umbral-heart",-1);
			} else {
				setStatus("astral_fire",true);
			}
			
			if(hasStatus("sharpcast")){
				setStatus("sharpcast",false);
				setStatus("firestarter",true);
			}
		},
		getManaCost(state){
			if(hasStatus('astral_fire'))
				return this.mana * (hasStatus('umbral_heart') ? 1:2);
			
			if(hasStatus('umbral_ice'))
				return this.mana * (getStacks('umbral_ice') > 1 ? 0.25:0.5);
				
			return this.mana;
		},
		getPotency(state){
			var mod = 1;
			if(hasStatus('umbral_ice'))
				mod -= 0.1 * getStacks('umbral_ice');
			
			if(hasStatus('astral_fire'))
				mod += 0.2 + (0.2 * getStacks('astral_fire'));
			
			return this.potency * mod;
		},
		getCast(state){
			if(hasStatus('umbral_ice'))
				if(getStacks('umbral_ice') == 3)
					return this.cast * 0.5;
			return this.cast;
		}
	},
	fire_ii: {
		name: "Fire II",
		type: "spell",
		potency: 80,
		mana: 1800,
		cast: 3.0,
		execute(state){
			if(hasStatus("umbral_ice")) {
				setStatus("umbral_ice",false);
			} else if(hasStatus("astral_fire")){
				updateStatus("astral_fire",1);
				updateStatus("umbral-heart",-1);
			} else {
				setStatus("astral_fire",true);
			}
		},
		getManaCost(state){
			if(hasStatus('astral_fire'))
				return this.mana * (hasStatus('umbral_heart') ? 1:2);
			
			if(hasStatus('umbral_ice'))
				return this.mana * (getStacks('umbral_ice') > 1 ? 0.25:0.5);
				
			return this.mana;
		},
		getPotency(state){
			var mod = 1;
			if(hasStatus('umbral_ice'))
				mod -= 0.1 * getStacks('umbral_ice');
			
			if(hasStatus('astral_fire'))
				mod += 0.2 + (0.2 * getStacks('astral_fire'));
			
			return this.potency * mod;
		},
		getCast(state){
			if(hasStatus('umbral_ice'))
				if(getStacks('umbral_ice') == 3)
					return this.cast * 0.5;
			return this.cast;
		}
	},
	fire_iii: {
		name: "Fire III",
		type: "spell",
		potency: 240,
		mana: 2400,
		cast: 3.5,
		execute(state){
			if(hasStatus("astral_fire") && !hasStatus("firestarter"))
				updateStatus("umbral_heart",-1);
			
			//always
			updateStatus("astral_fire",3,true);
			if(hasStatus("umbral_ice"))
				setStatus("umbral_ice",false);

			
			if(hasStatus("firestarter"))
				setStatus("firestarter",false);
		},
		getCast(state){
			if(hasStatus("firestarter")) return 0;
			if(hasStatus('umbral_ice'))
				if(getStacks('umbral_ice') == 3)
					return this.cast * 0.5;
			return this.cast;
		},
		getManaCost(state){
			if(hasStatus("firestarter")) return 0;
			
			if(hasStatus('astral_fire'))
				return this.mana * (hasStatus('umbral_heart') ? 1:2);
			
			if(hasStatus('umbral_ice'))
				return this.mana * (getStacks('umbral_ice') > 1 ? 0.25:0.5);
				
			return this.mana;
		},
		isHighlighted(state) {
			return hasStatus('firestarter');
		},
		getPotency(state){
			var mod = 1;
			if(hasStatus('umbral_ice'))
				mod -= 0.1 * getStacks('umbral_ice');
			
			if(hasStatus('astral_fire'))
				mod += 0.2 + (0.2 * getStacks('astral_fire'));
			
			return this.potency * mod;
		}
	},
	fire_iv: {
		name: "Fire IV",
		type: "spell",
		potency: 460,
		mana: 1200,
		cast: 3.0,
		execute(state){
			if(hasStatus("astral_fire"))
				updateStatus("umbral_heart",-1);
		},
		isUseable(state) {
			return hasAllStatus(['enochian','astral_fire']);
		},
		getManaCost(state){
			if(hasStatus('astral_fire'))
				return this.mana * (hasStatus('umbral_heart') ? 1:2);
			
			if(hasStatus('umbral_ice'))
				return this.mana * (getStacks('umbral_ice') > 1 ? 0.25:0.5);
				
			return this.mana;
		},
		getPotency(state){
			var mod = 1;
			if(hasStatus('umbral_ice'))
				mod -= 0.1 * getStacks('umbral_ice');
			
			if(hasStatus('astral_fire'))
				mod += 0.2 + (0.2 * getStacks('astral_fire'));
			
			return this.potency * mod;
		},
		getCast(state){
			if(hasStatus('umbral_ice'))
				if(getStacks('umbral_ice') == 3)
					return this.cast * 0.5;
			return this.cast;
		}
	},
	flare: {
		name: "Flare",
		type: "spell",
		potency: 260,
		mana: 0,
		cast: 4,
		execute(state){
			updateStatus("astral_fire",3,true);
			if(hasStatus("umbral_ice"))
				setStatus("umbral_ice",false);
			
		},
		getCast(state){
			if(hasStatus('umbral_ice'))
				if(getStacks('umbral_ice') == 3)
					return this.cast * 0.5;
			return this.cast;
		},
		getPotency(state){
			var mod = 1;
			if(hasStatus('umbral_ice'))
				mod -= 0.1 * getStacks('umbral_ice');
			
			if(hasStatus('astral_fire'))
				mod += 0.2 + (0.2 * getStacks('astral_fire'));
			//console.log(mod);
			return this.potency * mod;
		},
		getManaCost(state){
			if(hasStatus('umbral_heart'))
				return state.maxMana/3;
			
			return state.mana;
		},
		isUseable(state) {
			return state.mana > 1200;
		}
	},
	blizzard_i: {
		name: "Blizzard I",
		type: "spell",
		potency: 180,
		mana: 480,
		cast: 2.5,
		execute(state){
			if(hasStatus("astral_fire"))
				setStatus("astral_fire",false);
			else
				updateStatus("umbral_ice",1);
		}
	},
	blizzard_ii: {
		name: "Blizzard II",
		type: "spell",
		potency: 50,
		mana: 960,
		cast: 3,
		execute(state){
			if(hasStatus("astral_fire"))
				setStatus("astral_fire",false);
			else
				updateStatus("umbral_ice",1);
		}
	},
	blizzard_iii: {
		name: "Blizzard III",
		type: "spell",
		potency: 240,
		mana: 1440,
		cast: 3.5,
		execute(state){
			updateStatus("umbral_ice",3,true);
			if(hasStatus("astral_fire"))
				setStatus("astral_fire",false);
		}
	},
	blizzard_iv: {
		name: "Blizzard IV",
		type: "spell",
		potency: 260,
		mana: 1200,
		cast: 3,
		execute(state){
			updateStatus("umbral_heart",3,true);
		},
		isUseable(state) {
			return hasAllStatus(['enochian','umbral_ice']);
		}
	},
	freeze: {
		name: "Freeze",
		type: "spell",
		potency: 100,
		mana: 2400,
		cast: 3,
		execute(state){
			if(hasStatus("astral_fire"))
				setStatus("astral_fire",false);
			else
				updateStatus("umbral_ice",1);
		}
	},
	thunder_i: {
		name: "Thunder I",
		type: "spell",
		potency: 30,
		mana: 960,
		cast: 2.5,
		getCast(state){
			if(hasStatus("thundercloud")) return 0;
			return this.cast;
		}, 
		getManaCost(state){
			if(hasStatus("thundercloud")) return 0;
			return this.mana
		},
		execute(state){
			setStatus('thunder',true);
			setStatus("thundercloud",false);
			if(hasStatus("sharpcast")){
				setStatus("sharpcast",false);
				setStatus("thundercloud",true);
			}
		},
		getPotency(state){
			return hasStatus('thundercloud') ? this.potency + 240 : this.potency;
		},
		isHighlighted(state) {
			return hasStatus('thundercloud');
		},
		getReplacement(state){
			return state.level > 45 ? 'thunder_iii' : false;
		}
	},
	thunder_ii: {
		name: "Thunder II",
		type: "spell",
		potency: 30,
		mana: 1440,
		cast: 3,
		getCast(state){
			if(hasStatus("thundercloud")) return 0;
			return this.cast;
		}, 
		getManaCost(state){
			if(hasStatus("thundercloud")) return 0;
			return this.mana
		},
		execute(state){
			setStatus('thunder_ii',true);
			setStatus("thundercloud",false);
			if(hasStatus("sharpcast")){
				setStatus("sharpcast",false);
				setStatus("thundercloud",true);
			}
		},
		isHighlighted(state) {
			return hasStatus('thundercloud');
		},
		getReplacement(state){
			return state.level > 64 ? 'thunder_iv' : false;
		},
		getPotency(state){
			return hasStatus('thundercloud') ? this.potency + 120 : this.potency;
		},
	},
	thunder_iii: {
		name: "Thunder III",
		type: "spell",
		potency: 70,
		mana: 1920,
		cast: 2.5,
		hidden: true,
		level: 45,
		getCast(state){
			if(hasStatus("thundercloud")) return 0;
			return this.cast;
		}, 
		getManaCost(state){
			if(hasStatus("thundercloud")) return 0;
			return this.mana
		},
		execute(state){
			setStatus('thunder_iii',true);
			setStatus("thundercloud",false);
			if(hasStatus("sharpcast")){
				setStatus("sharpcast",false);
				setStatus("thundercloud",true);
			}
		},
		isHighlighted(state) {
			return hasStatus('thundercloud');
		},
		getPotency(state){
			return hasStatus('thundercloud') ? this.potency + 320 : this.potency;
		},
	},
	thunder_iv: {
		name: "Thunder IV",
		type: "spell",
		potency: 50,
		mana: 2160,
		cast: 3,
		hidden: true,
		level: 64,
		getCast(state){
			if(hasStatus("thundercloud")) return 0;
			return this.cast;
		}, 
		getManaCost(state){
			if(hasStatus("thundercloud")) return 0;
			return this.mana
		},
		execute(state){
			setStatus('thunder_iv',true);
			setStatus("thundercloud",false);
			if(hasStatus("sharpcast")){
				setStatus("sharpcast",false);
				setStatus("thundercloud",true);
			}
		},
		isHighlighted(state) {
			return hasStatus('thundercloud');
		},
		getPotency(state){
			return hasStatus('thundercloud') ? this.potency + 180 : this.potency;
		},
	},
	scathe: {
		name: "Scathe",
		type: "spell",
		potency: 100,
		mana: 960,
		cast: 0,
		execute(state){
			setStatus('sharpcast',false);
		},
		getPotency(state){
			if(hasStatus('sharpcast')){
				return this.potency*2;
			}
			return this.potency;
		}
	},
	foul: {
		name: "Foul",
		type: "spell",
		potency: 650,
		mana: 240,
		cast: 2.5,
		execute(state){
			setStatus('polyglot',false);
		},
		isUseable(state) {
			return hasStatus('polyglot');
		},
		
		isHiglighted(state){
			return hasStatus('polyglot');
		}
	},
	sleep: {
		name: "Sleep",
		type: "spell",
		mana: 1200,
		cast: 2.5
	},
	transpose: {
		name: "Transpose",
		recast: 12,
		execute(state){
			if(hasStatus('umbral_ice')){
				setStatus('astral_fire',true);
				setStatus('umbral_ice',false);
			} else if(hasStatus('astral-fire')){
				setStatus('umbral_ice',true);
				setStatus('astral_fire',false);
			}
		}
				
	},
	manaward: {
		name: "Manaward",
		recast: 120
	},
	convert: {
		name: "Convert",
		recast: 180
	},
	aetherial_manipulation: {
		name: "Aetherial Manipulation",
		recast: 30
	},
	ley_lines: {
		name: "Ley Lines",
		recast: 30,
		execute(state){ 
			setStatus("ley_lines",true); 
		}
	},
	sharpcast: {
		name: "Sharpcast",
		recast: 60,
		execute(state){ 
			setStatus("sharpcast",true); 
		}
	},
	enochian: {
		name: "Enochian",
		recast: 30,
		execute(state){
			setStatus("enochian",true);
		},
		isUseable(state) {
			return hasAnyStatus(["umbral_ice","astral_fire"]);
		}
	},
	between_the_lines: {
		name: "Between the Lines",
		recast: 3,
		isUseable(state){
			return hasStatus('ley_lines');
		}
	},
	triplecast: {
		name: "Triplecast",
		recast: 90,
		execute(state){
			updateStatus("triplecast",3,true);
		},
	}
};

const roleActions = {
	'caster': {
		addle: {
			name: "Addle",
			recast: 120,
			execute(state) { setStatus('addle',true); }
		},
		'break': {
			name: "Break",
			type: "spell",
			cast: 2.5,
			recast: 2.5,
			potency: 50,
			execute(state){ setStatus('heavy',true); }
		},
		drain: {
			name: "Drain",
			type: "spell",
			cast: 2.5,
			recast: 2.5,
			potency: 80,
		},
		diversion: {
			name: "Diversion",
			recast: 120,
			execute(state){ setStatus("diversion",true); }
		},
		lucid_dreaming: {
			name: "Lucid Dreaming",
			recast: 120,
			execute(state){ setStatus("lucid_dreaming",true); }
		},
		swiftcast: {
			name: "Swiftcast",
			recast: 60,
			execute(state){ setStatus("swiftcast",true); }
		},
		mana_shift: {
			name: "Mana Shift", 
			recast: 150,
		},
		apocatastasis: {
			name: "Apocatastasis",
			recast: 150,
			execute(state) { setStatus('apocatastasis',true); }
		},
		surecast: {
			name: "Surecast",
			recast: 30,
			execute(state){ setStatus("surecast",true); }
		},
		erase: {
			name: "Erase",
			recast: 90
		},
	}
};

const baseStatus = {name: "status", duration: 0, stacks: 1, maxStacks: 1, tick(state){ }};

const statuses = {
	//BLM
	astral_fire: {name: "Astral Fire", duration: 13, maxStacks: 3},
	umbral_ice: {
		name: "Umbral Ice", duration: 13, maxStacks: 3,
		tick(state){
			setMana(state.mana + (state.maxMana * (.15 + (.15 * getStacks('umbral_ice')))));
		}			
	},
	ley_lines: {name: "Ley Lines", duration: 30},
	triplecast: {name: "Triplecast", duration: 15, maxStacks: 3},
	umbral_heart: {name: "Umbral Hearts", duration: 30, maxStacks: 3},
	enochian: {name: "Enochian", duration: 30},
	polyglot: {name: "Polyglot", duration: 30},
	thundercloud: {name: "Thundercloud", duration: 12},
	sharpcast: {name: "Sharpcast", duration: 15},
	firestarter: {name: "Firestarter", duration: 12},
	thunder: {name: "Thunder I", duration: 18, tick(state){ state.potency += 40; }},
	thunder_ii: {name: "Thunder II", duration: 12, tick(state){ state.potency += 30; }},
	thunder_iii: {name: "Thunder III", duration: 24, tick(state){ state.potency += 40; }},
	thunder_iv: {name: "Thunder IV", duration: 18, tick(state){ state.potency += 30; }},
	
	//caster
	addle: {name: "Addle", duration: 10},
	swiftcast: {name: "Swiftcast", duration: 10, stacks: 1 },
	lucid_dreaming: {name: "Lucid Dreaming", duration: 21},
	diversion: {name: "Diversion", duration: 15},
	surecast: {name: "Surecast", duration: 10},
	apocatastasis: {name: "Apocatastasis", duration: 10},
	
	//general
	heavy:  {name:"Heavy", duration: 20},
}



function getRole(job){
	return roles[job];
}

function getJobActions(job){
	return jobActions[job];
}

function getRoleActions(role){
	return roleActions[role];
}

function getActions(state){
	return Object.assign({},getJobActions(state.job),getRoleActions(state.role));
}

const jobActions = {
	BLM: BLMactions
}

const roles = {
	BLM: 'caster'
}

const maxMana = {
	BLM: 15480
}