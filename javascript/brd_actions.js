const brd_actions = {
	heavy_shot: {
		name: "Heavy Shot",
		type: "weaponskill",
		affinity: ['BRD'],
		level: 1,
		potency: 150,
	},
	straight_shot: {
		name: "Straight Shot",
		type: "weaponskill",
		affinity: ['BRD'],
		level: 2,
		potency: 140,
		execute(state) {
			setStatus("straight_shot", true);
		}
	},
	raging_strikes: {
		name: "Raging Strikes",
		affinity: ['BRD'],
		level: 4,
		recast: 80,
		execute(state) {
			setStatus("raging_strikes", true);
		}
	},
	venomous_bite: {
		name: "Venomous Bite",
		type: "weaponskill",
		affinity: ['BRD'],
		level: 6,
		potency: 100,
		execute(state) {
			setStatus("venomous_bite", true);
		}
	},
	miserys_end: {
		name: "Misery's End",
		potency: 190,
		affinity: ['BRD'],
		level: 10,
		recast: 12,
	},
	bloodletter: {
		name: "Bloodletter",
		potency: 130,
		affinity: ['BRD'],
		level: 12,
		recast: 15,
	},
	repelling_shot: {
		name: "Repelling Shot",
		affinity: ['BRD'],
		level: 15,
		recast: 30,
	},
	quick_nock: {
		name: "Quick Nock",
		type: "weaponskill",
		affinity: ['BRD'],
		level: 18,
		potency: 110,
	},
	windbite: {
		name: "Windbite",
		type: "weaponskill",
		tp: 60,
		affinity: ['BRD'],
		level: 30,
		potency: 60,
		execute(state) {
			setStatus('windbite', true);
		}
	},
	mages_ballad: {
		name: "Mage's Ballad",
		//type: "spell",
		affinity: ['BRD'],
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
		affinity: ['BRD'],
		level: 35,
		potency: 100,
		cast: 1.5,
		execute(state) {
			setStatus('foe_requiem', true);
		}
	},
	barrage: {
		name: "Barrage",
		affinity: ['BRD'],
		level: 38,
		recast: 90,
		execute(state) {
			setStatus('barrage', true);
		}
	},
	armys_paeon: {
		name: "Army's Paeon",
		//type: "spell",
		recast: 80,
		affinity: ['BRD'],
		level: 40,
		potency: 100,
		execute(state) {
			setStatus('armys_paeon', true);
		}
	},
	rain_of_death: {
		name: "Rain of Death",
		recast: 15,
		affinity: ['BRD'],
		level: 45,
		potency: 100,
		recastGroup() {
			return 'bloodletter';
		}
	},
	battle_voice: {
		name: "Battle Voice",
		affinity: ['BRD'],
		level: 50,
		recast: 180,
		execute(state) {
			setStatus('battle_voice', true);
		}
	},
	the_wanderers_minuet: {
		name: "The Wanderer's Minuet",
		//type: "spell",
		affinity: ['BRD'],
		level: 52,
		potency: 100,
		recast: 80,
		execute(state) {
			setStatus('the_wanderers_minuet', true);
		},
	},

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
			if (state.mana < 600)
				setStatus('foe_requiem', false);
			else {
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
};
