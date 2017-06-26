const SAMactions = {
	hakaze: {
		name: "Hakaze",
		type: "weaponskill",
		potency: 150,
		tp: 60,
		level: 1,
		execute(state) {
			setKenki(state.kenki+5);
		}
	},
	jinpu: {
		name: "Jinpu",
		type: "weaponskill",
		potency: 100,
		comboPotency: 280,
		comboActions: ["hakaze"],
		tp: 60,
		level: 2,
		execute(state) {
			if(this.isCombo(state))
				setKenki(state.kenki+5);
			setStatus('jinpu', true);
		},
		isHighlighted(state){
			return this.isCombo(state);
		}
	},
	gekko: {
		name: "Gekko",
		type: "weaponskill",
		potenchy: 100,
		comboPotency: 400,
		comboActions: ['jinpu'],
		tp: 50,
		level: 30,
		execute(state){
			setKenki(state.kenki + (this.isCombo(state) ? 10:5));
		},
		isHighlighted(state){
			return this.isCombo(state);
		},
	},
	shifu: {
		name: "Shifu",
		type: "weaponskill",
		potenchy: 100,
		comboPotency: 280,
		comboActions: ['hakaze'],
		tp: 60,
		level: 18,
		execute(state){
			if(this.isCombo(state))
				setKenki(state.kenki+5);
			setStatus('shifu', true);
		},
		isHighlighted(state){
			return this.isCombo(state);
		},
	},
	kasha: {
		name: "Kasha",
		type: "weaponskill",
		potenchy: 100,
		comboPotency: 400,
		comboActions: ['shifu'],
		tp: 50,
		level: 40,
		execute(state){
			setKenki(state.kenki + (this.isCombo(state) ? 10:5));
		},
		isHighlighted(state){
			return this.isCombo(state);
		},
	},
	yukikaze: {
		name: "Yukikaze",
		type: "weaponskill",
		potency: 100,
		comboPotency: 340,
		comboActions: ["hakaze"],
		tp: 50,
		level: 50,
		execute(state) {
			if(this.isCombo(state))
				setKenki(state.kenki+10);
			setStatus('yukikaze', true);
		},
		isHighlighted(state){
			return this.isCombo(state);
		}
	},
};

const sam_status = {
	kenki: {
		name: "Kenki",
		duration: 60,
		maxStacks: 100,
		color: "#FC3C3C"
	},
	jinpu: { 
		name: "Jinpu", 
		duration: 30,
		color: "#E0B000",
	},
	shifu: { 
		name: "Shifu", 
		duration: 30,
		color: "#B07F6F",
	},
	yukikaze: {
		name: "Yukikaze",
		duration: 30,
		color: "#6FA0E0",
	},
}