const blm_actions = {
	fire_i: {
		name: "Fire I",
		type: "spell",
		potency: 180,
		mana: 1440,
		cast: 2.5,
		affinity: ['BLM'],
		level: 2,
		range: 25,
		description: `
			Deals fire damage with a potency of 180.<br/>
			<span class="green">Additional Effect:</span> Grants <span class="yellow">Astral Fire</span> or removes <span class="yellow">Umbral Ice</span><br/>
			<span class="green">Duration:</span> 13s<br/>
			<span class="green">Additional Effect:</span> 40% chance next <span class="orange">Fire III</span> will cost no MP and have no casting time<br/>
			<span class="green">Duration:</span> 12s
		`, 
		execute(state) {
			if (hasStatus("umbral_ice")) {
				setStatus("umbral_ice", false);
			} else if (hasStatus("astral_fire")) {
				updateStatus("astral_fire", 1);
				updateStatus("umbral_heart", -1);
			} else {
				setStatus("astral_fire", true);
			}

			if (hasStatus("sharpcast")) {
				setStatus("sharpcast", false);
				setStatus("firestarter", true);
			}
		},
		getManaCost(state) {
			if (hasStatus('astral_fire'))
				return this.mana * (hasStatus('umbral_heart') ? 1 : 2);

			if (hasStatus('umbral_ice'))
				return this.mana * (getStacks('umbral_ice') > 1 ? 0.25 : 0.5);

			return this.mana;
		},
		getPotency(state) {
			var mod = 1;
			if (hasStatus('umbral_ice'))
				mod -= 0.1 * getStacks('umbral_ice');

			if (hasStatus('astral_fire'))
				mod += 0.2 + (0.2 * getStacks('astral_fire'));

			return this.potency * mod;
		},
		getCast(state) {
			if (hasStatus('umbral_ice'))
				if (getStacks('umbral_ice') == 3)
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
		affinity: ['BLM'],
		level: 18,
		radius: 5,
		range: 25,
		description: `
			Deals fire damage with a potency of 80 to target and all enemies nearby it.<br/>
			<span class="green">Additional Effect:</span> Grants <span class="yellow">Astral Fire</span> or removes <span class="yellow">Umbral Ice</span><br/>
			<span class="green">Duration:</span> 13s
		`, 
		execute(state) {
			if (hasStatus("umbral_ice")) {
				setStatus("umbral_ice", false);
			} else if (hasStatus("astral_fire")) {
				updateStatus("astral_fire", 1);
				updateStatus("umbral-heart", -1);
			} else {
				setStatus("astral_fire", true);
			}
		},
		getManaCost(state) {
			if (hasStatus('astral_fire'))
				return this.mana * (hasStatus('umbral_heart') ? 1 : 2);

			if (hasStatus('umbral_ice'))
				return this.mana * (getStacks('umbral_ice') > 1 ? 0.25 : 0.5);

			return this.mana;
		},
		getPotency(state) {
			var mod = 1;
			if (hasStatus('umbral_ice'))
				mod -= 0.1 * getStacks('umbral_ice');

			if (hasStatus('astral_fire'))
				mod += 0.2 + (0.2 * getStacks('astral_fire'));

			return this.potency * mod;
		},
		getCast(state) {
			if (hasStatus('umbral_ice'))
				if (getStacks('umbral_ice') == 3)
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
		affinity: ['BLM'],
		level: 34,
		range: 25,
		description: `
			Deals fire damage with a potency of 240.<br/>
			<span class="green">Additional Effect:</span> Grants <span class="yellow">Astral Fire III</span> and removes <span class="yellow">Umbral Ice</span><br/>
			<span class="green">Duration:</span> 13s
		`, 
		execute(state) {
			if (hasStatus("astral_fire") && !hasStatus("firestarter"))
				updateStatus("umbral_heart", -1);

			//always
			updateStatus("astral_fire", 3, true);
			if (hasStatus("umbral_ice"))
				setStatus("umbral_ice", false);

			if (hasStatus("firestarter"))
				setStatus("firestarter", false);
		},
		getCast(state) {
			if (hasStatus("firestarter"))
				return 0;
			if (hasStatus('umbral_ice'))
				if (getStacks('umbral_ice') == 3)
					return this.cast * 0.5;
			return this.cast;
		},
		getManaCost(state) {
			if (hasStatus("firestarter"))
				return 0;

			if (hasStatus('astral_fire'))
				return this.mana * (hasStatus('umbral_heart') ? 1 : 2);

			if (hasStatus('umbral_ice'))
				return this.mana * (getStacks('umbral_ice') > 1 ? 0.25 : 0.5);

			return this.mana;
		},
		isHighlighted(state) {
			return hasStatus('firestarter');
		},
		getPotency(state) {
			var mod = 1;
			if (hasStatus('umbral_ice'))
				mod -= 0.1 * getStacks('umbral_ice');

			if (hasStatus('astral_fire'))
				mod += 0.2 + (0.2 * getStacks('astral_fire'));

			return this.potency * mod;
		}
	},
	fire_iv: {
		name: "Fire IV",
		type: "spell",
		potency: 260,
		mana: 1200,
		cast: 3.0,
		range: 25,
		affinity: ['BLM'],
		level: 60,
		description: `
			Deals fire damage with a potency of 260.
			Can only be executed while under the effect of both <span class="yellow">Enochian</span> and <span class="yellow">Astral Fire</span>.
		`, 
		execute(state) {
			if (hasStatus("astral_fire"))
				updateStatus("umbral_heart", -1);
		},
		isUseable(state) {
			return hasAllStatus(['enochian', 'astral_fire']);
		},
		getManaCost(state) {
			if (hasStatus('astral_fire'))
				return this.mana * (hasStatus('umbral_heart') ? 1 : 2);

			if (hasStatus('umbral_ice'))
				return this.mana * (getStacks('umbral_ice') > 1 ? 0.25 : 0.5);

			return this.mana;
		},
		getPotency(state) {
			var mod = 1;
			if (hasStatus('umbral_ice'))
				mod -= 0.1 * getStacks('umbral_ice');

			if (hasStatus('astral_fire'))
				mod += 0.2 + (0.2 * getStacks('astral_fire'));

			return this.potency * mod;
		},
		getCast(state) {
			if (hasStatus('umbral_ice'))
				if (getStacks('umbral_ice') == 3)
					return this.cast * 0.5;
			return this.cast;
		}
	},
	flare: {
		name: "Flare",
		type: "spell",
		potency: 260,
		mana: 1200,
		cast: 4,
		range: 25,
		radius: 5,
		affinity: ['BLM'],
		level: 50,
		description: `
			Deals fire damage to a target and all enemies nearby it with a potency of 260 for the first enemy, 15% less for the second, 30% less for the third, 45% less for the fourth, 60% less for the fifth, and 70% less for all remaining enemies.<br/>
			<span class="green">Additional Effect:</span> Grants <span class="yellow">Astral Fire III</span> and removes <span class="yellow">Umbral Ice</span><br/>
			<span class="green">Duration:</span> 13s
		`, 
		execute(state) {
			updateStatus("astral_fire", 3, true);
			if (hasStatus("umbral_ice"))
				setStatus("umbral_ice", false);
			setStatus('umbral_heart', false);

		},
		getCast(state) {
			if (hasStatus('umbral_ice'))
				if (getStacks('umbral_ice') == 3)
					return this.cast * 0.5;
			return this.cast;
		},
		getPotency(state) {
			var mod = 1;
			if (hasStatus('umbral_ice'))
				mod -= 0.1 * getStacks('umbral_ice');

			if (hasStatus('astral_fire'))
				mod += 0.2 + (0.2 * getStacks('astral_fire'));
			//console.log(mod);
			return this.potency * mod;
		},
		getManaCost(state) {
			if (hasStatus('umbral_heart'))
				return state.maxMana / 3;

			return state.mana;
		},
		isUseable(state) {
			return state.mana >= this.mana;
		}
	},
	blizzard_i: {
		name: "Blizzard I",
		type: "spell",
		potency: 180,
		mana: 480,
		cast: 2.5,
		range: 25,
		affinity: ['BLM'],
		level: 1,
		description: `
			Deals ice damage with a potency of 180.<br/>
			<span class="green">Additional Effect:</span> Grants <span class="yellow">Umbral Ice</span> or removes <span class="yellow">Astral Fire</span><br/>
			<span class="green">Duration:</span> 13s
		`, 
		execute(state) {
			if (hasStatus("astral_fire"))
				setStatus("astral_fire", false);
			else
				updateStatus("umbral_ice", 1);
		},
		getManaCost(state) {
			if (hasStatus('astral_fire'))
				return this.mana * (getStacks('astral_fire') > 1 ? 0.25 : 0.5);

			return this.mana;
		},
		getPotency(state) {
			return this.potency * (1 - (0.1 * getStacks('astral_fire')));
		},
		getCast(state) {
			if (hasStatus('astral_fire'))
				if (getStacks('astral_fire') == 3)
					return this.cast * 0.5;
			return this.cast;
		}
	},
	blizzard_ii: {
		name: "Blizzard II",
		type: "spell",
		potency: 50,
		mana: 960,
		cast: 3,
		radius: 5,
		affinity: ['BLM'],
		level: 12,
		description: `
			Deals ice damage with a potency of 50 to all nearby enemies.<br/>
			<span class="green">Additional Effect:</span> <span class="yellow">Bind</span><br/>
			<span class="green">Duration:</span> 8s<br/>
			<span class="green">Additional Effect:</span> Grants <span class="yellow">Umbral Ice</span> or removes <span class="yellow">Astral Fire</span><br/>
			<span class="green">Duration:</span> 13s
		`, 
		execute(state) {
			if (hasStatus("astral_fire"))
				setStatus("astral_fire", false);
			else
				updateStatus("umbral_ice", 1);
		},
		getManaCost(state) {
			if (hasStatus('astral_fire'))
				return this.mana * (getStacks('astral_fire') > 1 ? 0.25 : 0.5);

			return this.mana;
		},
		getPotency(state) {
			return this.potency * (1 - (0.1 * getStacks('astral_fire')));
		},
		getCast(state) {
			if (hasStatus('astral_fire'))
				if (getStacks('astral_fire') == 3)
					return this.cast * 0.5;
			return this.cast;
		}
	},
	blizzard_iii: {
		name: "Blizzard III",
		type: "spell",
		potency: 240,
		mana: 1440,
		cast: 3.5,
		range: 25,
		affinity: ['BLM'],
		level: 40,
		description: `
			Deals ice damage with a potency of 240.<br/>
			<span class="green">Additional Effect:</span> Grants <span class="yellow">Umbral Ice III</span> and removes <span class="yellow">Astral Fire</span><br/>
			<span class="green">Duration:</span> 13s
		`, 
		execute(state) {
			updateStatus("umbral_ice", 3, true);
			if (hasStatus("astral_fire"))
				setStatus("astral_fire", false);
		},
		getManaCost(state) {
			if (hasStatus('astral_fire'))
				return this.mana * (getStacks('astral_fire') > 1 ? 0.25 : 0.5);

			return this.mana;
		},
		getPotency(state) {
			return this.potency * (1 - (0.1 * getStacks('astral_fire')));
		},
		getCast(state) {
			if (hasStatus('astral_fire'))
				if (getStacks('astral_fire') == 3)
					return this.cast * 0.5;
			return this.cast;
		}
	},
	blizzard_iv: {
		name: "Blizzard IV",
		type: "spell",
		potency: 260,
		mana: 1200,
		cast: 3,
		affinity: ['BLM'],
		level: 58,
		range: 25,
		description: `
			Deals ice damage with a potency of 260.<br/>
			<span class="green">Additional Effect:</span> Grants 3 <span class="yellow">Umbral Hearts</span><br/>
			<span class="green">Umbral Heart Bonus:</span> Nullifies <span class="yellow">Astral Fire</span>'s MP cost increase for <span class="orange">Fire spells</span> and reduces MP cost for <span class="orange">Flare</span> by two-thirds<br/>
			Can only be executed while under the effect of both <span class="yellow">Enochian</span> and <span class="yellow">Umbral Ice</span>.
		`, 
		execute(state) {
			updateStatus("umbral_heart", 3, true);
		},
		isUseable(state) {
			return hasAllStatus(['enochian', 'umbral_ice']);
		},
		getManaCost(state) {
			if (hasStatus('astral_fire'))
				return this.mana * (getStacks('astral_fire') > 1 ? 0.25 : 0.5);

			return this.mana;
		},
		getPotency(state) {
			return this.potency * (1 - (0.1 * getStacks('astral_fire')));
		},
		getCast(state) {
			if (hasStatus('astral_fire'))
				if (getStacks('astral_fire') == 3)
					return this.cast * 0.5;
			return this.cast;
		}
	},
	freeze: {
		name: "Freeze",
		type: "spell",
		potency: 100,
		mana: 2400,
		cast: 3,
		affinity: ['BLM'],
		level: 35,
		range: 25,
		radius: 5,
		description: `
			Covers a designated area in ice, dealing ice damage with a potency of 100.<br/>
			<span class="green">Additional Effect:</span> <span class="yellow">Bind</span><br/>
			<span class="green">Duration:</span> 15s<br/>
			<span class="green">Additional Effect:</span> Grants <span class="yellow">Umbral Ice</span> or removes <span class="yellow">Astral Fire</span><br/>
			<span class="green">Duration:</span> 13s
		`, 
		execute(state) {
			if (hasStatus("astral_fire"))
				setStatus("astral_fire", false);
			else
				updateStatus("umbral_ice", 1);
		},
		getManaCost(state) {
			if (hasStatus('astral_fire'))
				return this.mana * (getStacks('astral_fire') > 1 ? 0.25 : 0.5);

			return this.mana;
		},
		getPotency(state) {
			return this.potency * (1 - (0.1 * getStacks('astral_fire')));
		},
		getCast(state) {
			if (hasStatus('astral_fire'))
				if (getStacks('astral_fire') == 3)
					return this.cast * 0.5;
			return this.cast;
		}
	},
	thunder_i: {
		name: "Thunder I",
		type: "spell",
		potency: 30,
		mana: 960,
		cast: 2.5,
		affinity: ['BLM'],
		level: 6,
		range: 25,
		description: `
			Deals lightning damage with a potency of 30.<br/>
			<span class="green">Additional Effect:</span> Lightning damage over time<br/>
			<span class="green">Potency:</span> 40<br/>
			<span class="green">Duration:</span> 18s<br/>
			<span class="green">Additional Effect:</span> 10% chance after each tick that the next <span class="orange">Thunder</span> spell of any grade will add its full damage over time amount to its initial damage, have no cast time, and cost no MP<br/>
			<span class="green">Duration:</span> 12s<br/>
			Only one <span class="orange">Thunder</span> spell-induced damage over time effect per caster can be inflicted upon a single target.
		`, 
		getCast(state) {
			if (hasStatus("thundercloud"))
				return 0;
			return this.cast;
		},
		getManaCost(state) {
			if (hasStatus("thundercloud"))
				return 0;
			return this.mana
		},
		execute(state) {
			setStatus('thunder', true);
			setStatus("thundercloud", false);
			if (hasStatus("sharpcast")) {
				setStatus("sharpcast", false);
				setStatus("thundercloud", true);
			}
		},
		getPotency(state) {
			return hasStatus('thundercloud') ? this.potency + 240 : this.potency;
		},
		isHighlighted(state) {
			return hasStatus('thundercloud');
		},
		getReplacement(state) {
			return state.level > 45 ? 'thunder_iii' : false;
		}
	},
	thunder_ii: {
		name: "Thunder II",
		type: "spell",
		potency: 30,
		mana: 1440,
		cast: 3,
		affinity: ['BLM'],
		level: 26,
		range: 25,
		radius: 5,
		description: `
			Deals lightning damage with a potency of 30 to target and all enemies nearby it.<br/>
			<span class="green">Additional Effect:</span> Lightning damage over time<br/>
			<span class="green">Potency:</span> 30<br/>
			<span class="green">Duration:</span> 12s<br/>
			<span class="green">Additional Effect:</span> 3% chance after each tick that the next <span class="orange">Thunder</span> spell of any grade will add its full damage over time amount to its initial damage, have no cast time, and cost no MP<br/>
			<span class="green">Duration:</span> 12s<br/>
			Only one <span class="orange">Thunder</span> spell-induced damage over time effect per caster can be inflicted upon a single target.
		`, 
		getCast(state) {
			if (hasStatus("thundercloud"))
				return 0;
			return this.cast;
		},
		getManaCost(state) {
			if (hasStatus("thundercloud"))
				return 0;
			return this.mana
		},
		execute(state) {
			setStatus('thunder_ii', true);
			setStatus("thundercloud", false);
			if (hasStatus("sharpcast")) {
				setStatus("sharpcast", false);
				setStatus("thundercloud", true);
			}
		},
		isHighlighted(state) {
			return hasStatus('thundercloud');
		},
		getReplacement(state) {
			return state.level > 64 ? 'thunder_iv' : false;
		},
		getPotency(state) {
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
		affinity: ['BLM'],
		level: 45,
		range: 25,
		description: `
			Deals lightning damage with a potency of 70.<br/>
			<span class="green">Additional Effect:</span> Lightning damage over time<br/>
			<span class="green">Potency:</span> 40<br/>
			<span class="green">Duration:</span> 24s<br/>
			<span class="green">Additional Effect:</span> 10% chance after each tick that the next <span class="orange">Thunder</span> spell of any grade will add its full damage over time amount to its initial damage, have no cast time, and cost no MP<br/>
			<span class="green">Duration:</span> 12s<br/>
			Only one <span class="orange">Thunder</span> spell-induced damage over time effect per caster can be inflicted upon a single target.
		`, 
		getCast(state) {
			if (hasStatus("thundercloud"))
				return 0;
			return this.cast;
		},
		getManaCost(state) {
			if (hasStatus("thundercloud"))
				return 0;
			return this.mana
		},
		execute(state) {
			setStatus('thunder_iii', true);
			setStatus("thundercloud", false);
			if (hasStatus("sharpcast")) {
				setStatus("sharpcast", false);
				setStatus("thundercloud", true);
			}
		},
		isHighlighted(state) {
			return hasStatus('thundercloud');
		},
		getPotency(state) {
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
		affinity: ['BLM'],
		level: 64,
		range: 25,
		radius: 5,
		description: `
			Deals lightning damage with a potency of 50 to target and all enemies nearby it.<br/>
			<span class="green">Additional Effect:</span> Lightning damage over time<br/>
			<span class="green">Potency:</span> 30<br/>
			<span class="green">Duration:</span> 18s<br/>
			<span class="green">Additional Effect:</span> 3% chance after each tick that the next <span class="orange">Thunder</span> spell of any grade will add its full damage over time amount to its initial damage, have no cast time, and cost no MP<br/>
			<span class="green">Duration:</span> 12s<br/>
			Only one <span class="orange">Thunder</span> spell-induced damage over time effect per caster can be inflicted upon a single target.
		`, 
		getCast(state) {
			if (hasStatus("thundercloud"))
				return 0;
			return this.cast;
		},
		getManaCost(state) {
			if (hasStatus("thundercloud"))
				return 0;
			return this.mana
		},
		execute(state) {
			setStatus('thunder_iv', true);
			setStatus("thundercloud", false);
			if (hasStatus("sharpcast")) {
				setStatus("sharpcast", false);
				setStatus("thundercloud", true);
			}
		},
		isHighlighted(state) {
			return hasStatus('thundercloud');
		},
		getPotency(state) {
			return hasStatus('thundercloud') ? this.potency + 180 : this.potency;
		},
	},
	scathe: {
		name: "Scathe",
		type: "spell",
		potency: 100,
		mana: 960,
		cast: 0,
		affinity: ['BLM'],
		level: 15,
		range: 25,
		description: `
			Deals unaspected damage with a potency of 100.<br/>
			<span class="green">Additional Effect:</span> 20% chance potency will double
		`, 
		execute(state) {
			setStatus('sharpcast', false);
		},
		getPotency(state) {
			if (hasStatus('sharpcast')) {
				return this.potency * 2;
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
		affinity: ['BLM'],
		level: 70,
		range: 25,
		radius: 5,
		description: `
			Deals unaspected damage to a target and all enemies nearby it with a potency of 650 for the first enemy, 10% less for the second, 20% less for the third, 30% less for the fourth, 40% less for the fifth, and 50% less for all remaining enemies.<br/>
			Can only be executed while under the effect of <span class="yellow">Polyglot</span>. <span class="yellow">Polyglot</span> effect ends upon use.
		`, 
		execute(state) {
			setStatus('polyglot', false);
		},
		isUseable(state) {
			return hasStatus('polyglot');
		},

		isHighlighted(state) {
			return hasStatus('polyglot');
		}
	},
	sleep: {
		name: "Sleep",
		type: "spell",
		mana: 1200,
		cast: 2.5,
		affinity: ['BLM'],
		level: 10,
		range: 25,
		radius: 5,
		description: `
			Puts target to sleep.<br/>
			<span class="green">Duration:</span> 30s<br/>
			Cancels auto-attack upon execution.
		`, 
	},
	transpose: {
		name: "Transpose",
		recast: 12,
		affinity: ['BLM'],
		level: 4,
		description: `
			Swaps <span class="yellow">Astral Fire</span> with a single <span class="yellow">Umbral Ice</span>, or <span class="yellow">Umbral Ice</span> with a single <span class="yellow">Astral Fire</span>.
		`, 
		execute(state) {
			if (hasStatus('umbral_ice')) {
				setStatus('astral_fire', true);
				setStatus('umbral_ice', false);
			} else if (hasStatus('astral_fire')) {
				setStatus('umbral_ice', true);
				setStatus('astral_fire', false);
			}
		}

	},
	manaward: {
		name: "Manaward",
		recast: 120,
		affinity: ['BLM'],
		level: 30,
		description: `
			Creates a barrier that nullifies damage totaling up to 30% of maximum HP.<br/>
			<span class="green">Duration:</span> 20s
		`, 
	},
	convert: {
		name: "Convert",
		recast: 180,
		affinity: ['BLM'],
		level: 30,
		description: `Sacrifices 20% of maximum HP to restore 30% of MP. Cannot be executed when current HP is lower than 20%.`,
		execute(state) {
			setMana(state.mana + (state.maxMana * .2));
		}
	},
	aetherial_manipulation: {
		name: "Aetherial Manipulation",
		recast: 30,
		affinity: ['BLM'],
		level: 50,
		range: 25,
		description: `
			Rush to a target party member's side.<br/>
			Unable to cast if bound.
			`, 
	},
	ley_lines: {
		name: "Ley Lines",
		recast: 30,
		affinity: ['BLM'],
		level: 52,
		radius: 3,
		description: `
			Connects naturally occurring ley lines to create a circle of power which, while standing within it, reduces spell cast time and recast time, and auto-attack delay by 15%.<br/>
			<span class="green">Duration:</span> 30s
		`, 
		execute(state) {
			setStatus("ley_lines", true);
		}
	},
	sharpcast: {
		name: "Sharpcast",
		recast: 60,
		affinity: ['BLM'],
		level: 54,
		description: `
			Ensures the next <span class="orange">Scathe</span>, <span class="orange">Fire</span>, or <span class="orange">Thunder</span> spell cast will, for the first hit, trigger <span class="orange">Scathe</span>'s additional effect, <span class="yellow">Firestarter</span>, or <span class="yellow">Thundercloud</span> respectively.<br/>
			<span class="green">Duration:</span> 15s`, 
		execute(state) {
			setStatus("sharpcast", true);
		}
	},
	enochian: {
		name: "Enochian",
		recast: 30,
		affinity: ['BLM'],
		level: 56,
		description: `
			Increases magic damage dealt by 5%. Also allows the casting of <span class="orange">Blizzard IV</span> and <span class="orange">Fire IV</span>.<br/>
			<span class="green">Additional Effect</span>: Grants <span class="yellow">Polyglot</span> if <span class="yellow">Enochian</span> is maintained for 30s<br/>
			Can only be executed while under the effect of <span class="yellow">Astral Fire</span> or <span class="yellow">Umbral Ice</span>. Effect is canceled if <span class="yellow">Astral Fire</span> or <span class="yellow">Umbral Ice</span> end.
		`, 
		execute(state) {
			setStatus("enochian", true);
		},
		isUseable(state) {
			return hasAnyStatus(["umbral_ice", "astral_fire"]);
		}
	},
	between_the_lines: {
		name: "Between the Lines",
		recast: 3,
		affinity: ['BLM'],
		level: 64,
		range: 25,
		description: `
			Move instantly to <span class="yellow">Ley Lines</span> drawn by you.<br/>
			Cannot be executed while bound.`, 
		isUseable(state) {
			return hasStatus('ley_lines');
		}
	},
	triplecast: {
		name: "Triplecast",
		recast: 90,
		affinity: ['BLM'],
		level: 68,
		description: `
			The next three spells will require no cast time.<br/>
			<span class="green">Duration:</span> 15s`, 
		execute(state) {
			updateStatus("triplecast", 3, true);
		},
	}
};

const blm_status = {
	//BLM
	astral_fire: {
		name: "Astral Fire",
		duration: 13,
		maxStacks: 3,
		color: "#F05F2F"
	},
	umbral_ice: {
		name: "Umbral Ice",
		duration: 13,
		maxStacks: 3,
		color: "#5FD0F0",
		tick(state) {
			setMana(state.mana + (state.maxMana * (.15 + (.15 * getStacks('umbral_ice')))));
		}
	},
	ley_lines: {
		name: "Ley Lines",
		duration: 30,
		color: "#A05FF0"
	},
	triplecast: {
		name: "Triplecast",
		duration: 15,
		maxStacks: 3,
		color: "#1F1F6F"
	},
	umbral_heart: {
		name: "Umbral Hearts",
		duration: 30,
		maxStacks: 3,
		color: "#005FF0"
	},
	enochian: {
		name: "Enochian",
		duration: 30,
		color: "#7F5FB0"
	},
	polyglot: {
		name: "Polyglot",
		duration: 30,
		color: "#FFB2FE"
	},
	thundercloud: {
		name: "Thundercloud",
		duration: 12,
		color: "#C0B0F0"
	},
	sharpcast: {
		name: "Sharpcast",
		duration: 15,
		color: "#A05F7F"
	},
	firestarter: {
		name: "Firestarter",
		duration: 12,
		color: "#7F0F0F"
	},
	thunder: {
		name: "Thunder I",
		duration: 18,
		color: "#C0B02F",
		tick(state) {
			state.potency += 40;
		}
	},
	thunder_ii: {
		name: "Thunder II",
		duration: 12,
		color: "#C0B02F",
		tick(state) {
			state.potency += 30;
		}
	},
	thunder_iii: {
		name: "Thunder III",
		duration: 24,
		color: "#C0B02F",
		tick(state) {
			state.potency += 40;
			//console.log(state.currentTime + " - thunder iii");
		}
	},
	thunder_iv: {
		name: "Thunder IV",
		duration: 18,
		color: "#C0B02F",
		tick(state) {
			state.potency += 30;
		}
	},
	mana_ward: {
		name: " Manaward",
		duration: 20,
		color: "#C0A0C0",
	},
};
