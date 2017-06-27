const sam_actions = {
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
			if(this.isCombo(state) || hasStatus('meikyo_shisui')){
				updateStatus('meikyo_shisui', -1);
				setKenki(state.kenki+5);
				setStatus('jinpu', true);
			}
		},
		isHighlighted(state){
			return this.isCombo(state) || hasStatus('meikyo_shisui');
		},
		getPotency(state) {
			return (this.isCombo(state) || hasStatus('meikyo_shisui')) ? this.comboPotency : this.potency;
		}
	},
	gekko: {
		name: "Gekko",
		type: "weaponskill",
		potency: 100,
		comboPotency: 400,
		comboActions: ['jinpu'],
		tp: 50,
		level: 30,
		execute(state){
			if(this.isCombo(state) || hasStatus('meikyo_shisui')){
				updateStatus('meikyo_shisui', -1);
				setKenki(state.kenki + 10);
				setStatus("sen_getsu", true);
				
			} else {
				setKenki(state.kenki+5);
			}
		},
		isHighlighted(state){
			return this.isCombo(state) || hasStatus('meikyo_shisui');
		},
		getPotency(state) {
			return (this.isCombo(state) || hasStatus('meikyo_shisui')) ? this.comboPotency : this.potency;
		}
	},
	shifu: {
		name: "Shifu",
		type: "weaponskill",
		potency: 100,
		comboPotency: 280,
		comboActions: ['hakaze'],
		tp: 60,
		level: 18,
		execute(state){
			if(this.isCombo(state) || hasStatus('meikyo_shisui')){
				updateStatus('meikyo_shisui', -1);
				setKenki(state.kenki+5);
				setStatus('shifu', true);
			}
		},
		isHighlighted(state){
			return this.isCombo(state) || hasStatus('meikyo_shisui');
		},
		getPotency(state) {
			return (this.isCombo(state) || hasStatus('meikyo_shisui')) ? this.comboPotency : this.potency;
		}
	},
	kasha: {
		name: "Kasha",
		type: "weaponskill",
		potency: 100,
		comboPotency: 400,
		comboActions: ['shifu'],
		tp: 50,
		level: 40,
		execute(state){
			if(this.isCombo(state) || hasStatus('meikyo_shisui')){
				updateStatus('meikyo_shisui', -1);
				setKenki(state.kenki + 10);
				setStatus('sen_ka',true);
			} else {
				setKenki(state.kenki+5);
			}
		},
		isHighlighted(state){
			return this.isCombo(state) || hasStatus('meikyo_shisui');
		},
		getPotency(state) {
			return (this.isCombo(state) || hasStatus('meikyo_shisui')) ? this.comboPotency : this.potency;
		}
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
			if(this.isCombo(state) || hasStatus('meikyo_shisui')){
				updateStatus('meikyo_shisui', -1);
				setKenki(state.kenki+10);
				setStatus('yukikaze', true);
				setStatus("sen_setsu", true);
			}
			
		},
		isHighlighted(state){
			return this.isCombo(state) || hasStatus('meikyo_shisui');
		},
		getPotency(state) {
			return (this.isCombo(state) || hasStatus('meikyo_shisui')) ? this.comboPotency : this.potency;
		}
	},
	fuga: {
		name: "Fuga",
		type: "weaponskill",
		potency: 100,
		tp: 140,
		level: 26,
	},
	mangetsu: {
		name: "Mangetsu",
		type: "weaponskill",
		potency: 100,
		tp: 140,
		comboPotency: 200,
		comboActions: ['fuga'],
		execute(state){
			if(this.isCombo(state) || hasStatus('meikyo_shisui')){
				updateStatus("meikyo_shisui", -1);
				setStatus('sen_getsu',true);
				setKenki(state.kenki + 10);
			}
		},
		isHighlighted(state){
			return this.isCombo(state) || hasStatus('meikyo_shisui');
		},
		getPotency(state) {
			return (this.isCombo(state) || hasStatus('meikyo_shisui')) ? this.comboPotency : this.potency;
		}
	},
	oka: {
		name: "Oka",
		type: "weaponskill",
		potency: 100,
		tp: 140,
		comboPotency: 200,
		comboActions: ['fuga'],
		execute(state){
			console.log('pop');
			if(this.isCombo(state) || hasStatus('meikyo_shisui')){
				updateStatus('meikyo_shisui', -1);
				setStatus('sen_ka',true);
				setKenki(state.kenki + 10);
			}
			
		},
		isHighlighted(state){
			return this.isCombo(state) || hasStatus('meikyo_shisui');
		},
		getPotency(state) {
			return (this.isCombo(state) || hasStatus('meikyo_shisui')) ? this.comboPotency : this.potency;
		}
	},
	enpi: {
		name: "Enpi",
		potency: 100,
		level: 15,
		tp: 160,
		execute(state){
			setKenki(state.kenki+10);
			if(hasStatus('enhanced_enpi'))
				setStatus('enhanced_enpi', false);
		},
		getPotency(state){
			return hasStatus('enhanced_enpi') ? 300:this.potency;
		},
		isHighlighted(state){
			return hasStatus('enhanced_enpi');
		}
	},
	iaijutsu: {
		name: "Iaijutsu",
		type: "weaponskill",
		level: 30,
		isUseable(state) { return false;},
		getReplacement(state){
			var count = 0;
			count += hasStatus('sen_setsu') ? 1:0;
			count += hasStatus('sen_getsu') ? 1:0;
			count += hasStatus('sen_ka') ? 1:0;
			if(count == 3)
				return 'midare_setsugekka';
			if(count == 2)
				return 'tenka_goken';
			if(count == 1)
				return 'higanbana';
			return false;
		}
	},
	midare_setsugekka: {
		name: "Midare Setsugekka",
		type: "weaponskill",
		hidden: true,
		potency: 720,
		cast: 1.8,
		level: 50,
		execute(state){
			setStatus('sen_setsu', false);
			setStatus('sen_getsu', false);
			setStatus('sen_ka', false);
		}
	},
	tenka_goken: {
		name: "Tenka Goken",
		type: "weaponskill",
		hidden: true,
		potency: 360,
		cast: 1.8,
		level: 40,
		execute(state){
			setStatus('sen_setsu', false);
			setStatus('sen_getsu', false);
			setStatus('sen_ka', false);
		}
	},
	higanbana: {
		name: "Higanbana",
		type: "weaponskill",
		hidden: true,
		potency: 240,
		cast: 1.8,
		level: 30,
		execute(state){
			setStatus('higanbana', true);
			setStatus('sen_setsu', false);
			setStatus('sen_getsu', false);
			setStatus('sen_ka', false);
		}
	},
	ageha: {
		name: "Ageha",
		level: 10,
		recast: 60,
		potency: 250,
		execute(state) {
			setKenki(state.kenki + 10);
		}
		
	},
	meikyo_shisui: {
		name: "Meikyo Shisui",
		level: 50,
		recast: 80,
		execute(state){
			updateStatus('meikyo_shisui', 3, true);
		}
	},
	third_eye: {
		name: "Third Eye",
		recast: 15,
		level: 6,
		execute(state){
			setStatus("third_eye", true);
		}
	},
	merciful_eyes: {
		name: "Merciful Eyes",
		recast: 1,
		level: 58,
		isUseable(state){
			return hasStatus('eyes_open');
		},
		execute(state){
			setStatus('eyes_open', false);
		},
		recastGroup(){
			return 'hissatsu_seigan';
		}
	},
	hagakure: {
		name: "Hagakure",
		recast: 40,
		level: 68,
		isUseable(state){
			return hasAnyStatus(['sen_ka','sen_getsu', 'sen_setsu']);
		},
		execute(state){
			var amt = 0;
			amt += hasStatus('sen_setsu') ? 20:0;
			amt += hasStatus('sen_getsu') ? 20:0;
			amt += hasStatus('sen_ka') ? 20:0;
			setKenki(state.kenki + amt);
			
			setStatus('sen_setsu', false);
			setStatus('sen_getsu', false);
			setStatus('sen_ka', false);
		}
	},
	meditate: {
		name: "Meditate",
		level: 50,
	},
	hissatsu_kaiten: {
		name: "Hissatsu Kaiten",
		level: 52,
		kenki: 20,
		recast: 5,
		isUseable(state){
			return state.kenki >= this.kenki;
		},
		execute(state){
			setKenki(state.kenki - this.kenki);
			setStatus('hissatsu_kaiten', true);
		}
	},
	hissatsu_gyoten: {
		name: "Hissatsu Gyoten",
		level: 54,
		kenki: 10,
		potency: 100,
		recast: 10,
		isUseable(state){
			return state.kenki >= this.kenki;
		},
		execute(state){
			setKenki(state.kenki - this.kenki);
		}
	},
	hissatsu_yaten: {
		name: "Hissatsu Yaten",
		level: 56,
		kenki: 10,
		potency: 100,
		recast: 10,
		isUseable(state){
			return state.kenki >= this.kenki;
		},
		execute(state){
			setKenki(state.kenki - this.kenki);
			setStatus('enhanced_enpi',true);
		}
	},
	hissatsu_shinten: {
		name: "Hissatsu Shinten",
		level: 62,
		kenki: 25,
		potency: 300,
		recast: 1,
		isUseable(state){
			return state.kenki >= this.kenki;
		},
		execute(state){
			setKenki(state.kenki - this.kenki);
		}
	},
	hissatsu_seigan: {
		name: "Hissatsu Seigan",
		level: 66,
		kenki: 15,
		potency: 200,
		recast: 1,
		isUseable(state){
			return state.kenki >= this.kenki && hasStatus('eyes_open');
		},
		execute(state){
			setKenki(state.kenki - this.kenki);
		}
	},
	hissatsu_guren: {
		name: "Hissatsu Guren",
		level: 62,
		kenki: 50,
		potency: 800,
		recast: 120,
		isUseable(state){
			return state.kenki >= this.kenki;
		},
		execute(state){
			setKenki(state.kenki - this.kenki);
		}
	}
	
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
	sen_setsu: {
		name: "Setsu",
		duration: 60,
		color: "#52CCD1",
	},
	sen_getsu: {
		name: "Getsu",
		duration: 60,
		color: "#4D6DAC",
	},
	sen_ka: {
		name: "Ka",
		duration: 60,
		color: "#D8615B",
	},
	higanbana: {
		name: "Higanbana",
		duration: 60,
		color: "#7F2F1F",
		tick(state) {
			state.potency += 35;
		}
	},
	meikyo_shisui: {
		name: "Meikyo Shisui",
		duration: 10,
		maxStacks: 3,
		color: "#E04F4F",
	},
	third_eye: {
		name: "Third Eye",
		duration: 3,
		color: "#4F6F90",
		tick(state){
			setStatus('eyes_open', true);
			setStatus('third_eye', false);
		}
	},
	eyes_open: {
		name: "Eyes Open",
		duration: 15,
		color: "#5F4FE0",
	},
	enhanced_enpi: {
		name: "Enhanced Enpi",
		duration: 15,
		color: "#4F3FB0"
	},
	hissatsu_kaiten: {
		name: "Hissatsu Kaiten",
		duration: 10,
		color: "#C04F0F"
	}
}