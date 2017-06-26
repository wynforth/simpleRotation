const brd_actions = {
	heavy_shot: {
		name: "Heavy Shot",
		type: "weaponskill",
		level: 1,
		potency: 150,
	},
	straight_shot: {
		name: "Straight Shot",
		type: "weaponskill",
		level: 2,
		potency: 140,
		execute(state) {
			setStatus("straight_shot", true);
		}
	},
	raging_strikes: {
		name: "Raging Strikes",
		level: 4,
		recast: 80,
		execute(state) {
			setStatus("raging_strikes", true);
		}
	},
	venomous_bite: {
		name: "Venomous Bite",
		type: "weaponskill",
		level: 6,
		potency: 100,
		execute(state) {
			setStatus("venomous_bite", true);
		}
	},
	miserys_end: {
		name: "Misery's End",
		potency: 190,
		level: 10,
		recast: 12,
	},
	bloodletter: {
		name: "Bloodletter",
		potency: 130,
		level: 12,
		recast: 15,
	},
	repelling_shot: {
		name: "Repelling Shot",
		level: 15,
		recast: 30,
	},
	quick_nock: {
		name: "Quick Nock",
		type: "weaponskill",
		level: 18,
		potency: 110,
	},
	windbite: {
		name: "Windbite",
		type: "weaponskill",
		tp: 60,
		level: 30,
		potency: 60,
		execute(state) {
			setStatus('windbite', true);
		}
	},
	mages_ballad: {
		name: "Mage's Ballad",
		//type: "spell",
		level: 30,
		potency: 100,
		recast: 80,
		execute(state) {
			setStatus('mages_ballad', true);
			//setStatus('repertoire', true);
		}
	},
	foe_requiem: {
		name: "Foe Requiem",
		type: "spell",
		level: 35,
		potency: 100,
		cast: 1.5,
		execute(state) {
			setStatus('foe_requiem', true);
		}
	},
	barrage: {
		name: "Barrage",
		level: 38,
		recast: 90,
		execute(state){
			setStatus('barrage',true);
		}
	},
	armys_paeon: {
		name: "Army's Paeon",
		//type: "spell",
		recast: 80,
		level: 40,
		potency: 100,
		execute(state){
			setStatus('armys_paeon', true);
		}
	},
	rain_of_death: {
		name: "Rain of Death",
		recast: 15,
		level: 45,
		potency: 100,
		recastGroup() {
			return 'bloodletter';
		}
	},
	battle_voice: {
		name: "Battle Voice",
		level: 50,
		recast: 180,
		execute(state){
			setStatus('battle_voice', true);
		}
	},
	the_wanderers_minuet: {
		name: "The Wanderer's Minuet",
		//type: "spell",
		level: 52,
		potency: 100,
		recast: 80,
		execute(state): {
			setStatus('the_wanderers_minuet', true);
		},
	},
		
	
	
	
	//ranged
	second_wind: {
		name: "Second Wind",
		recast: 120,
	},
	foot_graze: {
		name: "Foot Graze",
		recast: 30,
	},
	leg_graze: {
		name: "Leg Graze",
		recast: 30,
	},
	peloton: {
		name: "Peloton",
		recast: 5
	},
	invigorate: {
		name: "Invigorate",
		recast: 120,
		execute(state){
			setTP(state.tp + 400);
		}
	},
	tactician: {
		name: "Tactician",
		recast: 180,
		execute(state) {
			setStatus("tactician", 30);
		}
	},
	refresh: {
		name: "Refresh",
		recast: 180,
		execute(state) {
			setStatus("refresh", 30);
		}
	},
	head_graze: {
		name: "Head Graze",
		recast: 30,
	},
	arm_graze: {
		name: "Arm Graze",
		recast: 25
	},
	palisade: {
		name: "Palisade",
		recast: 150
	}
};


const brd_status = {
	//BRD
	straight_shot: {
		name: "Straight Shot",
		duration: 20,
		color: "#B01F00",
	},
	raging_strikes: {
		name: "Raging Strikes",
		duration: 20,
		color: "#D03F00",
	},
	venomous_bite: {
		name: "Venom",
		duration: 18,
		color: "#905FE0",
		tick(state) {
			state.potency += 40;
		}
	},
	windbite: {
		name: "Windbite",
		duration: 18,
		color: "#2F6FE0",
		tick(state) {
			state.potency += 50;
		}
	},
	mages_ballad: {
		name: "Mage's Ballad",
		duration: 30,
		color: "#A07FC0",
	},
	foe_requiem: {
		name: "Foe Requiem",
		duration: 10,
		color: "#90D0D0",
		tick(state) {
			if(state.mana < 600)
				setStatus('foe_requiem',false);
			else{
				setStatus('foe_requiem', true);
				setMana(state.mana - 600);
			}
		}
	},
	barrage: {
		name: "Barrage",
		duration: 10,
		color: "#B07F2F",
	},
	armys_paeon: {
		name: "Army's Paeon",
		duration: 30,
		color: "#D07F5F",
	},
	battle_voice: {
		name: "Battle Voice",
		duration: 20,
		color: "#7FD0E0",
	},
	the_wanderers_minuet: {
		name: "The Wanderer's Minuet",
		duration: 30,
		color: "#4F6F1F",
	},
		
		
		
	//ranged
	tactician: {
		name: "Tactitian",
		duration: 30,
		color: "#E0901F",
		tick(state) {
			setTP(state.tp + 50);
		}
	},
	refresh: {
		name: "Refresh",
		duration: 30,
		color: "#7F7FC0",
		tick(state) {
			setMana(state.mana + (state.maxMana * .02));
		}
	}
};