//initialization

var rotation = [];
var state = {};


initialize('');

function removeRotationAction(index){
	rotation.splice(index,1);
	update();
}	

/*
table structure:

row:
 - cast name
 - start time
 - end time
 - total potency
 - resource cost
 - buff columns
 -- if buff time remaining > end time = solid fill
 -- if buff time remaining < end time = striped/dark fill
 */
function advanceTime(time, resultTable){
	if(time == 0) return;
	//do up to just the next tick clock
	//console.log(state.currentTime + " advancing by " + time + "s delay");
	if(time >= state.nextTick - state.currentTime){
		//console.log(state.currentTime + ' dot/mana tick happening first');
		
		var tick = state.nextTick - state.currentTime;
		state.currentTime += tick;
		//console.log(state.currentTime + " dot tick then " + (time-tick) + "s delay");
		if(!hasStatus('astral_fire'))
			setMana(state.mana + (state.maxMana*.02));
		setTP(state.tp + 60);
		state.nextTick += 3;
		
		updateDots(tick);
		tickDots(resultTable);
		
		time -= tick;
		
	} 
	state.currentTime = state.currentTime + time;
	updateDots(time);
	
}

function tickDots(resultTable) {
	for (var key in state.statuses) {
		//console.log(state.statuses[key].name + " - " + state.statuses[key].duration);

		var potency = state.statuses[key].tick(state);
		
		if (potency > 0) {
			state.potency += potency;
			var status = getStatus(key);
			var row = {
				name: `*${status.name}*`,
				type: 'dot',
				id: key,
				mana: 0,
				tp: 0,
				startTime: state.currentTime,
				endTime: state.currentTime,
				statuses: {}
			};
			row.potency = potency;
			for (var key in state.statuses) {
				if (resultTable[0].indexOf(key) < 0)
					resultTable[0].push(key);
				//row.statuses[key] = {id: key, stacks: getStacks(key), duration: state.statuses[key].duration};
				row.statuses[key] = state.statuses[key];
			}

			resultTable.push(row);
		}
	}
}

function updateDots(time){
	//update statuses
	var toRemove = [];
	for(var key in state.statuses){
		state.statuses[key].duration -= time;
		if(state.statuses[key].duration <= 0)
			toRemove.push(key);
		else if(state.statuses[key].duration > 60) // fake 'infinite'
			state.statuses[key].duration = 120;
	}
	//console.log(toRemove);
	
	for(var i=0; i < toRemove.length; i++){
		if(toRemove[i] == "enochian"){
			
			//do this localy?
			if(hasAnyStatus(['astral_fire','umbral_ice'])){
				var status = getStatus('enochian');
				state.statuses['enochian'].duration += status.duration;
				setStatus('polyglot',true);
				
			} else {
				setStatus(toRemove[i],false);
			}

		} else {
		
			setStatus(toRemove[i],false);
		}
	}
}

function calculatePotency(action){
	var potency = action.getPotency(state);
	if (state.targets == 1)
		return potency;
	//console.log(action);
	for(var i = 2; i <= state.targets; i++){
		
		var p = action.getTargetPotency(state, i)
		if(p==0) break;
	console.log(`${action.name} hitting target ${i} for ${p} potency`);
		potency += p;
	}
		
	return potency;
}

function calculateManaCost(mana){
	return mana;
}

function calculateTPCost(tp){
	return tp;
}

function playRotation(){
	var resultTable = [];
	resultTable.push([]); //first row is list of statuses;
	
	state = resetState(state.job);
	//figure out a better way to do this. job classes with initializers?
	setStatus('aetherflow', (state.job == 'SMN' || state.job == 'SCH')); //always start with aetherflow
	
	clearRotationButtons();
	
	for(var i=0; i < rotation.length; i++){
		var row = {};
		row.statuses = {};
		var action = rotation[i];
		
		
		//console.log(action.name);
		if(action.type != 'ability'){
			//not oGCD we advance to targetTime;
			advanceTime(state.targetTime-state.currentTime, resultTable);
		}
		//display rotation action
		addRotationAction(i,action.id);
		
		row.name = action.name;
		row.id = action.id;
		row.type = action.type;
		row.startTime = state.currentTime;
		
		
		//determine cast time and cost at start of cast, and next action time
		var castTime = action.getCast(state);
		var mana = calculateManaCost(action.getManaCost(state));
		var tp = calculateTPCost(action.getTPCost(state));
		
		//determine time to take next action
		//if its not an ability (ie its on the gcd) the time is the longest of the cast time, the gcd, or the animation lock (in the cast of swiftcast)
		//if this delay is shorter than the already built in delay, we use that
		//for abilities, its either the current delay or the animation time
		var delay = action.animTime;
		if(action.type != "ability"){
			//state.cast.start = state.currentTime;
			//state.cast.end = castTime;
			//time till next action, longest of cast time, recast time, or animation lock
			delay = Math.max(castTime, delay);
			state.targetTime = state.currentTime + Math.max(action.getRecast(state), delay, state.targetTime-state.currentTime);
		} else {
			state.targetTime = state.currentTime + Math.max(delay, state.targetTime-state.currentTime);
		}
		//execute the action
		
		
		//update current time to when this action is ussuable: 
		addRecast(action.recastGroup(),action.getRecast(state));
		advanceTime(delay, resultTable);

		//remove cost
		
		setMana(state.mana - mana);
		row.mana = mana;
		
		setTP(state.tp - tp);
		row.tp = tp;
		
		//add potency
		var potency = calculatePotency(action);
		state.potency += potency;
		row.potency = potency;
		
		
		
		action.execute(state);
		if(action.type != 'ability'){
			//array of weaponskills or spells that dont break combos
			if(["iaijutsu", "higanbana", "midare_setsugekka", "tenka_goken"].indexOf(action.id) == -1){
				state.lastActionTime = state.currentTime;
				state.lastCombo = action.isCombo(state);
				state.lastAction = action.id;
			}
		}
		
		for(var key in state.statuses){
			if(resultTable[0].indexOf(key) < 0)
				resultTable[0].push(key);
			//row.statuses[key] = {id: key, stacks: getStacks(key), duration: state.statuses[key].duration};
			row.statuses[key] = state.statuses[key];
		}
		
		row.endTime = state.currentTime;
		resultTable.push(row);
	}
	var index = resultTable.length;
	advanceTime(state.targetTime-state.currentTime, resultTable);
	if(resultTable.length > 1)
		resultTable[index-1].endTime = state.currentTime; //update the final action end time
	//console.log(state);
	return resultTable;
}

/*
what to do when an action is clicked
- check if it can be used
- add it to the rotation
- play through the rotation
- update all things that need updating
-- rotation
-- statuses
-- actions
-- resources
-- dps results
*/
function addAction(name, doUpdate = true){
	if(!actionUsable(name)) {
		console.log("Cannot use " + name + " right now. Add Error message handling?");
		return;
	}
	
	const action = getAction(name);
	if(!action){
		console.log("Error could not find action: "+name);
		return;
	}
	rotation.push(action);
	action.onAdd(state);

	if(doUpdate)
		update();
	else
		console.log(name + ': skipping update');
	
}

function drawResultTable(result){
	//console.log(result);
	if(result.length < 2) return;
	
	var statuses = result[0].sort();
	
	var tbl_body = "";
    var odd_even = false;
	
	
	$(".rotation-table thead .status-col").remove();
	$(".rotation .scroll").html('');
	for(var i=0; i < statuses.length; i++){
		var status = getStatus(statuses[i]);
		var tbl_hdr = "";
		tbl_hdr += `<td class=\"status-col\">${status.getImg(true)}</td>`;
		$(".rotation-table thead tr").append(tbl_hdr);
	}
	
	for(var i=1; i < result.length; i++)
	{
		
		var row = result[i];
		var action = getAction(row.id);
		var tbl_row = "";
		tbl_row += `<td><img src="img/${action.getImage()}.png" title="${row.name}"/>${row.name}</td>`;
		tbl_row += "<td>" + row.startTime.toFixed(2) + "</td>";
		tbl_row += "<td>" + (row.endTime - row.startTime).toFixed(2) + "</td>";
		tbl_row += "<td>" + row.potency.toFixed(2) + "</td>";
		tbl_row += "<td class=\"mp-text\">" + row.mana + "</td>";
		tbl_row += "<td class=\"tp-text\">" + row.tp + "</td>";

		//scrollable section
		var scalar = 25;
		var div = `<div class="${row.type}" style="left: ${row.startTime * scalar}; width: ${(row.endTime - row.startTime) * scalar}"><img src="img/${action.getImage()}.png" title="${row.name}"/></div>`;
		$(".rotation .scroll").append(div);
		
		for(var j=0; j < statuses.length; j++){
			//console.log(row.statuses.hasOwnProperty(statuses[j]));
			if(row.statuses.hasOwnProperty(statuses[j])){
				var status = row.statuses[statuses[j]];
				tbl_row += `<td><div class="center status-block" style="background-color: ${status.color}"></div></td>`;
			} else {
				tbl_row += "<td></td>";
			}
		}
		
		
        tbl_body += "<tr>" + tbl_row + "</tr>";
		
		
        odd_even = !odd_even;               
	}
	
	$(".rotation-table tbody").html(tbl_body);
	
}


function update(){
	var result;
	result = playRotation();
	drawResultTable(result);
	
	//updateRotationButtons();
	updateStatuses();
	updateActionButtons();
	updateStats();	
}

// Click Handlers
$(".actions .action").click(function(e) {
	var name = $(this).data("action");
	console.log("Adding: " + name);
	addAction(name);
});

$(".jobs .job").click(function(e) {
	var name = $(this).data("name");
	console.log("changing to : " + name);
	changeJob(name);
});

$("input").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        $("form").submit();
    }
});
