const sam_actions = {
	hakaze: {
		name: "Hakaze",
		type: "weaponskill",
		potency: 150,
		tp: 60,
		level: 1,
		range: 3,
		description: `
			Delivers an attack with a potency of 150. <br/>
			<span class="green">Additional Effect:</span> Increases <span class="orange">Kenki Gauge</span> by 5`,
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
		range: 3,
		description: `
			Delivers an attack with a potency of 100. <br/>
			<span class="green">Combo Action:</span> <span class="orange">Hakaze</span> <br/>
			<span class="green">Combo Potency:</span> 280 <br/>
			<span class="green">Combo Bonus:</span> Increases damage dealt by 10% <br/>
			<span class="green">Duration:</span> 30s <br/>
			<span class="green">Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by 5`,
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
		range: 3,
		description: `
			Delivers an attack with a potency of 100.<br/>
			<span class="green">Combo Action:</span> <span class="orange">Jinpu</span><br/>
			<span class="green">Combo Potency:</span> 400<br/>
			<span class="green">Rear Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by 5<br/>
			<span class="green">Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by 5<br/>
			<span class="green">Combo Bonus:</span> Grants <span class="yellow">Getsu</span>`,
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
		range: 3,
		description: `
			Delivers an attack with a potency of 100.<br/>
			<span class="green">Combo Action:</span> <span class="orange">Hakaze</span><br/>
			<span class="green">Combo Potency:</span> 280<br/>
			<span class="green">Combo Bonus:</span> Reduces weaponskill cast time and recast time, spell cast time and recast time, and auto-attack delay by 10%<br/>
			<span class="green">Duration:</span> 30s<br/>
			<span class="green">Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by 5`,
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
		range: 3,
		description: `
			Delivers an attack with a potency of 100.<br/>
			<span class="green">Combo Action:</span> <span class="orange">Shifu</span><br/>
			<span class="green">Combo Potency:</span> 400<br/>
			<span class="green">Side Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by 5<br/>
			<span class="green">Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by 5<br/>
			<span class="green">Combo Bonus:</span> Grants <span class="yellow">Ka</span>`,
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
		range: 3,
		description: `
			Delivers an attack with a potency of 100.<br/>
			<span class="green">Combo Action:</span> <span class="orange">Hakaze</span><br/>
			<span class="green">Combo Potency:</span> 340<br/>
			<span class="green">Combo Bonus:</span> Reduces target's slashing resistance by 10%<br/>
			<span class="green">Duration:</span> 30s<br/>
			<span class="green">Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by 10<br/>
			<span class="green">Combo Bonus:</span> Grants <span class="yellow">Setsu</span>`,
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
		radius: 5,
		description: `
			Delivers an attack with a potency of 100 to all enemies in a cone before you.<br/>
			<span class="green">Additional Effect:</span> Increases <span class="orange">Kenki Gauge</span> by 5`,
	},
	mangetsu: {
		name: "Mangetsu",
		type: "weaponskill",
		potency: 100,
		tp: 140,
		comboPotency: 200,
		comboActions: ['fuga'],
		radius: 5,
		description: `
			Delivers an attack to all nearby enemies with a potency of 100 for the first enemy, 10% less for the second, 20% less for the third, 30% less for the fourth, 40% less for the fifth, and 50% less for all remaining enemies.<br/>
			<span class="green">Combo Action:</span> <span class="orange">Fuga</span><br/>
			<span class="green">Combo Potency:</span> 200 for the first enemy, 5% less for the second, 10% less for the third, 15% less for the fourth, 20% less for the fifth, and 25% less for all remaining enemies.<br/>
			<span class="green">Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by 10<br/>
			<span class="green">Combo Bonus:</span> Grants <span class="yellow">Getsu</span>`,
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
		radius: 5,
		description: `
			Delivers an attack to nearby enemies with a potency of 100 for the first enemy, 10% less for the second, 20% less for the third, 30% less for the fourth, 40% less for the fifth, and 50% less for all remaining enemies.<br/>
			<span class="green">Combo Action:</span> <span class="orange">Fuga</span><br/>
			<span class="green">Combo Potency:</span> 200 for the first enemy, 5% less for the second, 10% less for the third, 15% less for the fourth, 20% less for the fifth, and 25% less for all remaining enemies.<br/>
			<span class="green">Combo Bonus:</span> Increases <span class="orange">Kenki Gauge</span> by 10<br/>
			<span class="green">Combo Bonus:</span> Grants <span class="yellow">Ka</span>`,
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
		range: 15,
		description: `
			Delivers a ranged attack with a potency of 100.<br/>
			<span class="green">Enhanced Enpi Bonus Potency:</span> 300<br/>
			<span class="green">Additional Effect:</span> Increases <span class="orange">Kenki Gauge</span> by 10`,
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
	hagakure: {
		name: "Hagakure",
		recast: 40,
		level: 68,
		description: `
			Converts <span class="yellow">Setsu</span>, <span class="yellow">Getsu</span>, and <span class="yellow">Ka</span> into <span class="orange">Kenki</span>. Each <span class="yellow">Sen</span> converted increases your <span class="orange">Kenki Gauge</span> by 20. Can only be executed if under the effect of at least one of the three statuses.`,
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
	iaijutsu: {
		name: "Iaijutsu",
		type: "weaponskill",
		level: 30,
		description: `
			Executes a weaponskill depending on current number of <span class="yellow">Sen</span> stored in <span class="orange">Sen Gauge</span>.<br/>
			<span class="green">1 Sen:</span> <span class="orange">Higanbana</span><br/>
			<span class="green">2 Sen:</span> <span class="orange">Tenka Goken</span><br/>
			<span class="green">3 Sen:</span> <span class="orange">Midare Setsugekka</span>`,
		isUseable(state) { return false;},
		getReplacement(state){
			var count = 0;
			count += hasStatus('sen_setsu') ? 1:0;
			count += hasStatus('sen_getsu') ? 1:0;
			count += hasStatus('sen_ka') ? 1:0;
			if(count == 3) return 'midare_setsugekka';
			if(count == 2) return 'tenka_goken';
			if(count == 1) return 'higanbana';
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
		range: 3,
		description: `
			Delivers an attack with a potency of 720.`,
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
		radius: 5,
		description: `
			Delivers an attack to all enemies in a cone before you with a potency of 360 for the first enemy, 10% less for the second, 20% less for the third, 30% less for the fourth, 40% less for the fifth, and 50% less for all remaining enemies.`,
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
		range: 3,
		description: `
			Delivers an attack with a potency of 240.<br/>
			<span class="green">Additional Effect:</span> Damage over time<br/>
			<span class="green">Potency:</span> 35<br/>
			<span class="green">Duration:</span> 60s`,
		execute(state){
			setStatus('higanbana', true);
			setStatus('sen_setsu', false);
			setStatus('sen_getsu', false);
			setStatus('sen_ka', false);
		}
	},
	meikyo_shisui: {
		name: "Meikyo Shisui",
		level: 50,
		recast: 80,
		description: `
			Execute up to 3 weaponskill combos without meeting combo prerequisites. Does not affect <span class="orange">Iaijutsu</span>.<br/>
			<span class="green">Duration:</span> 10s`,
		execute(state){
			updateStatus('meikyo_shisui', 3, true);
		}
	},
	ageha: {
		name: "Ageha",
		level: 10,
		recast: 60,
		potency: 250,
		description: `
			Delivers an attack with a potency of 250.<br/>
			<span class="green">Additional Effect:</span> Increases <span class="orange">Kenki Gauge</span> by 10 (30 if killing blow is dealt)<br/>
			Can only be executed when target's HP is below 20%.`,
		execute(state) {
			setKenki(state.kenki + 10);
		}
		
	},
	third_eye: {
		name: "Third Eye",
		recast: 15,
		level: 6,
		description: `
			Reduces the amount of damage taken by the next attack by 5%.<br/>
			<span class="green">Duration:</span> 3s<br/>
			<span class="green">Additional Effect:</span> Grants <span class="yellow">Open Eyes</span> when hit<br/>
			<span class="green">Duration:</span> 15s`,
		execute(state){
			setStatus("third_eye", true);
		}
	},
	merciful_eyes: {
		name: "Merciful Eyes",
		recast: 1,
		level: 58,
		description: `
			Instantly restores own HP.<br/>
			<span class="green">Cure Potency:</span> 200<br/>
			Cure potency varies with current attack power.<br/>
			Can only be executed while under the effect of <span class="yellow">Open Eyes</span>.<br/>
			Shares a recast timer with <span class="orange">Hissatsu: Seigan</span>.`,
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
	meditate: {
		name: "Meditate",
		level: 50,
		description: `
			Gradually increases your <span class="orange">Kenki Gauge</span>.<br/>
			<span class="green">Duration:</span> 15s<br/>
			<span class="orange">Kenki Gauge</span> not affected when used outside battle.<br/>
			Effect ends upon executing another action or moving.<br/>
			Cancels auto-attack upon execution.`,
	},
	hissatsu_kaiten: {
		name: "Hissatsu Kaiten",
		level: 52,
		kenki: 20,
		recast: 5,
		description: `
			Increases potency of next weaponskill by 50%.<br/>
			<span class="green">Duration:</span> 10s<br/>
			<span class="green">Kenki Gauge Cost:</span> 20`,
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
		range: 20,
		description: `
			Rushes target and delivers an attack with a potency of 100.<br/>
			<span class="green">Kenki Gauge Cost:</span> 10<br/>
			Cannot be executed while bound.`,
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
		range: 3,
		description: `
			Delivers an attack with a potency of 100.<br/>
			<span class="green">Additional Effect:</span> 10-yalm backstep<br/>
			<span class="green">Additional Effect:</span> Grants <span class="yellow">Enhanced Enpi</span><br/>
			<span class="green">Duration:</span> 15s<br/>
			<span class="green">Kenki Gauge Cost:</span> 10<br/>
			Cannot be executed while bound.`,
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
		range: 3,
		description: `
			Delivers an attack with a potency of 300.<br/>
			<span class="green">Kenki Gauge Cost:</span> 25`,
		isUseable(state){
			return state.kenki >= this.kenki;
		},
		execute(state){
			setKenki(state.kenki - this.kenki);
		}
	},
	hissatsu_kyuten: {
		name: "Hissatsu Kyuten",
		level: 64,
		kenki: 25,
		potency: 150,
		recast: 1,
		radius: 5,
		description: `
			Delivers an attack with a potency of 150 to all nearby enemies.<br/>
			<span class="green">Kenki Gauge Cost:</span> 25`,
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
		range: 3,
		description: `
			Delivers an attack with a potency of 200.<br/>
			<span class="green">Kenki Gauge Cost:</span> 15<br/>
			Can only be executed while under the effect of <span class="yellow">Open Eyes</span>.<br/>
			Shares a recast timer with <span class="orange">Merciful Eyes</span>.`,
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
		description: `
			Delivers an attack to all enemies in a straight line before you with a potency of 800 for the first enemy, 25% less for the second, and 50% less for all remaining enemies.<br/>
			<span class="green">Kenki Gauge Cost:</span> 50`,
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