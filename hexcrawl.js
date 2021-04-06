//function for adding dice rolls to the Adventure Log

function diceOutput ( size, result, name ) {
	let maxmin = '';	
	if (result == size) {
		maxmin = ' max';
	};
	if (result == 1) {
		maxmin = ' min';
	};
	
	if (size == 4) {
		Count4 += 1;
	} else if (size == 6) {
		Count6 += 1;
	} else if (size == 8) {
		Count8 += 1;
	} else if (size == 10) {
		Count10 += 1;
	} else if (size == 12) {
		Count12 += 1;
	} else if (size == 20) {
		Count20 += 1;
	} else {
		Count100 += 1;
	};
	
	//establish dice count c
	var c = (Count100 * 2) + Count4 + Count6 + Count8 + Count10 + Count12 + Count20;
	
	//add to total dice roll	
	DiceTotal += result;
	
	//log the name and dice result in the console
	if (name !== undefined) {console.log('Adventure Dice: ' + name + ': ' + result)};
	
	//Adds Dice-So-Nice funcitonality 
	//Caps the script at 20 dice
	
	if ( c < 21 ) {
	// drops a comma into the json string when it's not the first dice that gets rolled
		if ( dsnStr.length > 25 ) { dsnStr += ', ' };	
		if ( size != 100 ) {
			dsnStr += '{ "result": ' + result + ', "resultLabel": ' + result + ', "type": "d' + size + '", "vectors": [], "options": {} }';
		} else {
			var n = result % 10;
			
			if (n != 0) {
				var d10 = n;
			} else {
				var d10 = 10;
			};
			
			var d100 = (result - d10);
			
			if ( d100 == 0 ) { 
				var r100 = 10;
			} else {
				var r100 = ( d100 / 10 );
			};
			
			dsnStr += '{ "result": ' + r100 + ', "d100Result": ' + result + ', "resultLabel": ' + d100 + ', "type": "d100", "vectors": [], "options": {} }, ';
			dsnStr += '{ "result": ' + d10 + ', "d100Result": ' + result + ', "resultLabel": ' + d10 + ', "type": "d10", "vectors": [], "options": {} }';
		};
	};

	return '<li class="roll die d' + size + maxmin + '">' + result + '</li>';
};

function ReplaceRolls (str) {

	const diceNames1 = ['1d4','1d4','1d6','1d6','1d8','1d8','1d10','1d10'];

	diceNames1.forEach(name => {
		if (str.includes(name)) {
			let r = new Roll(name).roll().total;
			diceContent += diceOutput(name.substr(2,(name.length - 2)),r,'text replace');
			str = str.replace(name,r);
		};
	});

	const diceNames2 = ['2d4','2d4','2d6','2d6','2d8','2d8','2d10','2d10'];

	diceNames2.forEach(name => {
		if (str.includes(name)) {
			let r1 = new Roll('1' + name.substr(1,(name.length - 1))).roll().total;
				diceContent += diceOutput(name.substr(2,(name.length - 2)),r1,'text replace');
			let r2 = new Roll('1' + name.substr(1,(name.length - 1))).roll().total;
				diceContent += diceOutput(name.substr(2,(name.length - 2)),r2,'text replace');
			str = str.replace(name,(r1+r2));
		};
	});

	return str;
};

function collapsibleText (header, str) {
	msgContent += '<div class="dice-roll"><div class="dice-result"><div class="dice-formula"><h4 class="dice-total">'  + header + '</h4></div><div class="dice-tooltip" style="display: none;"><div class="dice">';
	msgContent += str + '</div></div></div></div>';
};

function getLight ( time ) {
	let hr = time.substr(0,2)
	if (+hr >= 20 ) {
		return 'nighttime';
	} else if (+hr >= 18) {
		return 'dusk';
	} else if (+hr >= 7 ) {
		return 'daylight';
	} else if (+hr >= 5 ) {
		return 'dawn';
	} else {
		return 'nighttime';
	};
};

function newtime ( t ) {
	let m = (+game.Gametime.getTimeString().substr(0,2) * 60 ) + (+game.Gametime.getTimeString().substr(3,2));
	let nt = String(Math.floor((m + t)/60) % 24).padStart(2,'0') + ':' + String((m + t) % 60).padStart(2,'0') + ':00';
	game.Gametime.advanceTime({minutes: t});
	msgContent += 'Travel ends at <strong>' + nt.substr(0,5) + '</strong>, travelling at <strong>' + getLight(nt) + '</strong>.<br/><br/>';
};

function treasureTable (h) {
	let r = new Roll('1d100').roll().total;
		diceOutput (100,r,'treasuretable')
		
	if (r > 98) {
		let { results, roll} = game.tables.getName("Magic Item Table " + tableHexType[h].rareLoot).roll();
			let tableNumber = roll.total;
			let tableText = results[0].text;
			diceContent += diceOutput(100, tableNumber,'magic item table');

		console.log('Treasure: Greater Magic Item');			
		return 'a single magical item, one ' + tableText;

		
	} else if (r > 95) {
		let {results, roll} = game.tables.getName("Magic Item Table " + tableHexType[h].commonLoot).roll();
			let tableNumber = roll.total;
			let tableText = results[0].text;
			diceContent += diceOutput(100, tableNumber,'magic item table');

		console.log('Treasure: Lesser Magic Item');			
		return 'a single magical item, one ' + tableText;
		
	} else if (r > 85) {
		// a large alchemist's pouch, containing 1d4 pristine monster parts and 1d4 herbs
		let partRoll = new Roll('1d10').roll().total;
			diceContent += diceOutput(10,partRoll,'large alchemist pouch');
			
		let partNumber = partRoll + tableHexType[h].monsterLevel;
		let partRarity = ''
		
		if (partNumber > 16) {
			partRarity = 'very rare';
		} else if (partNumber > 13) {
			partRarity = 'rare';
		} else if (partNumber > 10) {
			partRarity = 'uncommon';
		} else {
			partRarity = 'common';
		};
		
		let r2 = new Roll('1d4').roll().total;
			diceContent += diceOutput(4, r2,'large alchemist pouch');
		
		let {results, roll} = game.tables.getName('Herbs_' + h).roll();
			let herbNumber = roll.total;
			let herbText = results[0].text;
			diceContent += diceOutput(12, herbNumber,'large alchemist pouch');
		
		let r = new Roll('1d4').roll().total;
			diceContent += diceOutput(4,r,'large alchemist pouch');

		console.log('Treasure: Large Alchemists Pouch');						
		return "a large alchemist's bag containing <strong>" + herbText + " x" + r + "</strong> and <strong>" + partRarity + " rarity monster parts x" + r2 + "</strong>";
		
	} else if (r > 75) {
		// a small alchemist's bag, containing 1d4 pristine monster parts
		let partRoll = new Roll('1d10').roll().total;
			diceContent += diceOutput(10,partRoll,'small alchemist pouch');
			
		let partNumber = partRoll + tableHexType[h].monsterLevel;
		let partRarity = ''
		
		if (partNumber > 16) {
			partRarity = 'very rare';
		} else if (partNumber > 13) {
			partRarity = 'rare';
		} else if (partNumber > 10) {
			partRarity = 'uncommon';
		} else {
			partRarity = 'common';
		};
		
		let r2 = new Roll('1d4').roll().total;
			diceContent += diceOutput(4, r2,'small alchemist pouch');

		console.log('Treasure: Small Alchemists Pouch (monster parts)');					
		return "a small alchemist's bag containing <strong>" + partRarity + " rarity monster parts x" + r2 + "</strong>";
		
	} else if (r > 65) {
		// a small alchemist's bag, containing 1d4 herbs
		let {results, roll} = game.tables.getName('Herbs_' + h).roll();
			let herbNumber = roll.total;
			let herbText = results[0].text;
			diceContent += diceOutput(12, herbNumber,'small alchemist pouch');
		
		let r = new Roll('1d4').roll().total;
			diceContent += diceOutput(4,r,'small alchemist pouch');

		console.log('Treasure: Small Alchemists Pouch (herbs)');						
		return "a small alchemist's bag containing <strong>" + herbText + " x" + r + "</strong>";
			
			
	} else if (r > 50) {
		let { results, roll} = game.tables.getName("SRD Mundane Weapons").roll();
			let tableNumber = roll.total;
			let tableText = results[0].text;
			diceContent += diceOutput(100, tableNumber,'mundane weapons');

		console.log('Treasure: Weapon');						
		return 'a single weapon, one ' + tableText;
		
	} else {
		let { results, roll} = game.tables.getName("Adventuring Gear").roll();
			let tableNumber = roll.total;
			let tableText = results[0].text;
			diceContent += diceOutput(100, tableNumber,'adventuring gear');

		console.log('Treasure: Mundane Adventuring Gear');						
		return 'a single piece of mundane adventuring gear, one ' + ReplaceRolls(tableText);
		
	};
	
};

//Array Matrix for Physical Dice (JSON)
var dsnStr = '{"throws":[{"dice":[';

//Array Matrix for Terrain
const tableHexType = {
	Beach: {
		speed: 180,
		survivalRating: 5,
		encounterChance: 50,
		commonLoot: 'A',
		rareLoot: 'F',
		monsterLevel: 1
	},
	Jungle: {
		speed: 360,
		survivalRating: 10,
		encounterChance: 65,
		commonLoot: 'A',
		rareLoot: 'F',
		monsterLevel: 2
	},
	Swamp: {
		speed: 240,
		survivalRating: 13,
		encounterChance: 75,
		commonLoot: 'A',
		rareLoot: 'F',
		monsterLevel: 3
	},
	Plains: {
		speed: 240,
		survivalRating: 5,
		encounterChance: 75,
		commonLoot: 'A',
		rareLoot: 'F',
		monsterLevel: 4
	},
	Firelands: {
		speed: 240,
		survivalRating: 5,
		encounterChance: 75,
		commonLoot: 'A',
		rareLoot: 'G',
		monsterLevel: 5
	},
	Tundra: {
		speed: 360,
		survivalRating: 10,
		encounterChance: 75,
		commonLoot: 'A',
		rareLoot: 'G',
		monsterLevel: 5
	},
	Mountains: {
		speed: 480,
		survivalRating: 12,
		encounterChance: 85,
		commonLoot: 'A',
		rareLoot: 'G',
		monsterLevel: 7
	},
	SnowyMountains: {
		speed: 540,
		survivalRating: 14,
		encounterChance: 85,
		commonLoot: 'B',
		rareLoot: 'G',
		monsterLevel: 7
	},
	Forest: {
		speed: 360,
		survivalRating: 10,
		encounterChance: 85,
		commonLoot: 'B',
		rareLoot: 'G',
		monsterLevel: 8
	},
	Feywild: {
		speed: 360,
		survivalRating: 13,
		encounterChance: 90,
		commonLoot: 'C',
		rareLoot: 'H',
		monsterLevel: 9
	},
	BlightedLands: {
		speed: 240,
		survivalRating: 15,
		encounterChance: 75,
		commonLoot: 'D',
		rareLoot: 'H',
		monsterLevel: 10
	}
};

//  start the form
let msgContent = '';
let pace = 'none';

//variables needed for the 'Adventure Dice' Display
var Count4 = 0;
var Count6 = 0;
var Count8 = 0;
var Count10 = 0;
var Count12 = 0;
var Count20 = 0;
var Count100 = 0;
var DiceTotal = 0;
let DiceString = '';

//prime the 'Adventure Dice' Display
let diceContent = '<div class="dice-roll"><div class="dice-result"><div class="dice-formula">Adventure Dice</div><div class="dice-tooltip" style="display: block;"><section class="tooltip-part"><div class="dice"><ol class="dice-rolls">';

//form content
let formContent = '<form>';

formContent += '<div class="form-group"><label>Hex Type:</label><select id="hex-type" name="hex-type">';
const tableHex = ["Beach","Jungle","Swamp","Plains","Firelands","Tundra","Mountains","SnowyMountains","Forest","Feywild","BlightedLands"];
tableHex.forEach(name => {
	formContent += '<option value="' + name + '">' + name + '</option>';
});
formContent += '</select></div>';

formContent += '<div class="form-group"><label>Terrain Type:</label><select id="terrain-type" name="terrain-type">';
const tableTerrain = ["along the road", "normally"];
tableTerrain.forEach(name => {
	 formContent += '<option value="' + name + '">' + name + '</option>';
});
formContent += '</select></div>';
 
formContent += '<div class="form-group"><label>Special Event Tile:</label><select id="special-event" name="special-event">';
const tableSpecial = ["No","Yes"];
tableSpecial.forEach(name => {
	 formContent += '<option value="' + name + '">' + name + '</option>';
});
formContent += '</select></div>';
 
formContent += '<div class="form-group"><label>Patrol Risk:</label><select id="near-city" name="near-city">';
const tablePatrol = ["Not Near a City", "1 Space from a City", "2 Spaces + Along Road"];
tablePatrol.forEach(name => {
	 formContent += '<option value="' + name + '">' + name + '</option>';
});
formContent += '</select></div>';

formContent += '</form>';


new Dialog({
    title: "Frank's Hex Crawl Helper",
    content: formContent,
    buttons: {
        slow: {
            icon: "<i class='fas fa-hiking'></i>",
            label: 'Exploring',
            callback: () => pace = 'exploring'
        }, 
        fast: {
            icon: "<i class='fas fa-running'></i>",
            label: 'Travelling',
            callback: () => pace = 'travelling'
        }
    },
    default: "slow",
    close: html => {
		if (pace != 'none') {
			//  define results
			let hexType = html.find('[name="hex-type"]')[0].value;
			let terrainType = html.find('[name="terrain-type"]')[0].value;
			let specialEvent = html.find('[name="special-event"]')[0].value;
			let patrolType = html.find('[name="near-city"]')[0].value;
			
			console.log('hexType: ' + hexType);
			
			// Form Message Content
			msgContent += 'Travel Begins at <strong>' + game.Gametime.getTimeString().substr(0,5) + '</strong>, travelling at <strong>'+ getLight(game.Gametime.getTimeString()) + '</strong>.<br/>';
			msgContent += 'The Party is <strong>' + pace + ' ' + terrainType + '</strong> through a region of <strong>' + hexType + '</strong> terrain.<br/>'; 

			//		weather table
			let { results, roll} = game.tables.getName("Hexcrawl_Weather").roll();
				let weatherNumber = roll.total;
				let weatherText = results[0].text;
				
				diceContent += diceOutput(100, weatherNumber,'weather');
			    msgContent += 'The weather is <strong>' + weatherText + '</strong>.<br/>';			
			
			//Travel Time Calculation
			//Establish Base Speed
			let basespeed = tableHexType[hexType].speed;
			let pacemod = 1;
			let terrainmod = 1;
			let weathermod = 1;
			
				//Establish pace
			if (pace == 'exploring') {pacemod = 1} else {pacemod = 0.5};
				//Establish terrain type
			if (terrainType == 'along the road') {terrainmod = 0.5} else {terrainmod = 1};
				//Establish weather impact
			if (weatherNumber > 89) {weathermod = 1.5} else {weathermod = 1};
			let TotalTime = basespeed * pacemod * terrainmod * weathermod;
			
			msgContent += 'Total travel time is ' + Math.round(TotalTime * 100 / 60 ) / 100 + ' hours.<br/>';
			newtime(TotalTime);
			
			//Survival Check DC
			let basesurvivaldc = tableHexType[hexType].survivalRating;
			let pacesurvivaldc = 0;
			let terrainsurvivaldc = 0;
			let weathersurvivaldc = 0;
			let nightsurvivaldc = 0;
			
			if (pace == 'exploring') {pacesurvivaldc = 2};
			if (terrainType == 'along the road') {terrainsurvivaldc = -2};
			if (weatherNumber == 100) {weathersurvivaldc = 5} else if (weatherNumber > 89) {weathersurvivaldc = 2};
			if (getLight(game.Gametime.getTimeString()) == 'nighttime') {nightsurvivaldc = 4 };
			let survival_dice_1 = new Roll('1d4').roll().total;
				diceContent += diceOutput(4,survival_dice_1,'survival dice');
			let survival_dice_2 = new Roll('1d4').roll().total;
				diceContent += diceOutput(4,survival_dice_2,'survival dice');
				
			msgContent += 'Survival Check: <strong>DC ' + (basesurvivaldc + survival_dice_1 + survival_dice_2 + pacesurvivaldc + nightsurvivaldc + terrainsurvivaldc + weathersurvivaldc) + '</strong> to remain on course.<br/><br/>';
			
			console.log('base:' + basesurvivaldc + ', dice1:' + survival_dice_1 + ', dice2:' +  survival_dice_2 + ', pace:' +  pacesurvivaldc + ', time:' +  nightsurvivaldc + ', terrain:' +  terrainsurvivaldc + ', weather:' +  weathersurvivaldc);
			
			//Encounters on the Road
			if (terrainType == "along the road") {
				let {results, roll} = game.tables.getName("Roadside Encounters").roll();
					let roadNumber = roll.total;
					let roadText = results[0].text;
				
				if (pace == "exploring") {
					let prob_road = new Roll('1d6').roll().total;
					diceContent += diceOutput(6, prob_road,'road dice');
					if (prob_road == 6) {
						collapsibleText('Encounter on the Road', '<strong>Roadside Encounter:</strong> ' + roadText);
						diceContent += diceOutput(100, roadNumber,'road dice');
					};
				};
				
				if (pace == "travelling") {
					let prob_road = new Roll('1d12').roll().total;
					diceContent += diceOutput(12, prob_road,'road dice');
					if (prob_road == 12) {
						collapsibleText('Encounter on the Road', '<strong>Roadside Encounter:</strong> ' + roadText);
						diceContent += diceOutput(100, roadNumber,'road dice');
					};
				};
				
			};

			//Special Event
			if ( specialEvent == 'Yes') {
				collapsibleText('Special Event','Stop! This space has a special event!');	
			};
			
			//Wandering Monsters
			if ((hexType == "Jungle") || (hexType == "Tundra") || (hexType == "SnowyMountains") || (hexType == "Jungle") || (hexType == "Feywild")) {
				let {results, roll} = game.tables.getName("Hexcrawl_Wandering_Monster").roll();
					let wamoNumber = roll.total;
					let wamoText = results[0].text;
					
					let mname = '';
					if (hexType == "Jungle") {
						mname = "T-Rex";
					} else if (hexType == "Tundra" || hexType == "SnowyMountains") {
						mname = "Abominable Yeti";
					} else {
						mname = "Adult Green Dragon";
					};
					
					wamoText = wamoText.replace("[Wandering Monster]",mname);
					
					diceContent += diceOutput(100, wamoNumber,'wandering monster');
					collapsibleText('Wandering Monster', '<strong>T-Rex Alert:</strong> ' + wamoText + '<br/><br/>');
			};
			            
			//Encounters: One encounter for 'travelling' speed; 2 encounters for 'exploring' speed.
			
			let beastDC = '';
			let encText = '';
			let encNumber = '';
			
			let prob_encounter1 = new Roll('1d100').roll().total;
				diceContent += diceOutput(100,prob_encounter1,'encounter1');
				if (prob_encounter1 > (100 - tableHexType[hexType].encounterChance)) {

					//set skinning DC
					let prob_beastDC = new Roll('1d6').roll().total;
						diceContent += diceOutput(6, prob_beastDC,'encounter 1: skinning');
					
					beastDC = ReplaceRolls("If any non-humanoid creatures were encountered, a <strong>DC " + (4 + prob_beastDC + tableHexType[hexType].monsterLevel) + "</strong> Skinning (dexterity or wisdom) check can yield pristine monster parts and 1dx pounds of meat, where x represents the size of the creature's hit dice.");
			
					if (pace == "travelling") {
						let {results, roll} = game.tables.getName("Hexcrawl_Encounter_Travelling").roll();
							encText = results[0].text;
							encNumber = roll.total;
							diceContent += diceOutput(8, encNumber,'encounter 1:encounter type');
					};
					
					if (pace == "exploring") {
						let {results, roll} = game.tables.getName("Hexcrawl_Encounter_Exploring").roll();
							encText = results[0].text;
							encNumber = roll.total;
							diceContent += diceOutput(12, encNumber, 'encounter 1:encounter type');
					};
						
						
					let {results, roll} = game.tables.getName("Hexcrawl_Encounters_" + hexType).roll();
						let enemyNumber = roll.total;
						let enemyText = results[0].text;
						diceContent += diceOutput(100,enemyNumber,'encounter 1: enemy number');
					
					collapsibleText('Random Encounter #1', 'You encounter ' + ReplaceRolls(enemyText + ' ' + encText + '.') + '<br/><br/>If successful, this encounter may yield the following treasure: <strong>' + treasureTable(hexType) + '</strong>.<br/><br/>' + beastDC);
				};
				
			if (pace == "exploring") {
				
				let prob_encounter2 = new Roll('1d100').roll().total;
					diceContent += diceOutput(100,prob_encounter2,'encounter 2');
					
					if (prob_encounter2 > (100 - tableHexType[hexType].encounterChance)) {
				
						let prob_beastDC = new Roll('1d6').roll().total;
							diceContent += diceOutput(6, prob_beastDC,'encounter 2: skinning');
						
						beastDC = ReplaceRolls("If any non-humanoid creatures were encountered, a <strong>DC " + (4 + prob_beastDC + tableHexType[hexType].monsterLevel) + "</strong> Skinning (dexterity or wisdom) check can yield pristine monster parts and 1dx pounds of meat, where x represents the size of the creature's hit dice.");
								
		
						if (pace == "travelling") {
							let {results, roll} = game.tables.getName("Hexcrawl_Encounter_Travelling").roll();
								encText = results[0].text;
								encNumber = roll.total;
								diceContent += diceOutput(8, encNumber,'encounter 2: encounter type');
						};
						
						if (pace == "exploring") {
							let {results, roll} = game.tables.getName("Hexcrawl_Encounter_Exploring").roll();
								encText = results[0].text;
								encNumber = roll.total;
								diceContent += diceOutput(12, encNumber,'encounter 2: encounter type');
						};
						
						
						
						let {results, roll} = game.tables.getName("Hexcrawl_Encounters_" + hexType).roll();
							let enemyNumber = roll.total;
							let enemyText = results[0].text;
							diceContent += diceOutput(100,enemyNumber,'encounter 2: enemy number');
		
						//script to pull from encounter table
						collapsibleText('Random Encounter #2', 'You encounter ' + ReplaceRolls(enemyText + ' ' + encText + '.') + '<br/><br/>If successful, this encounter may yield the following treasure: <strong>' + treasureTable(hexType) + '</strong>.<br/><br/>' + beastDC);
					};
			};
			
			//Patrols
			if (patrolType != "Not Near a City") {
				let prob_patrol = new Roll('1d10').roll().total;
				let patrol_dc = ''
				diceContent += diceOutput(10,prob_patrol,'patrol');
				
				if (pace == 'exploring') {
					patrol_dc = 'DC 10'
				} else {
					patrol_dc = 'DC 14'
				};
				
				if (patrolType == "1 Space from a City" ) {
					if (prob_patrol > 8 ) {collapsibleText('City Patrol', ReplaceRolls('You encounter a patrol of <strong> 2d4 </strong> (5) soldiers from the nearest city, on patrol.  To avoid the patrol, a <strong>' + patrol_dc + '</strong> stealth (dexterity) check is required.'))};
				} else {
					if (prob_patrol > 9 ) {collapsibleText('City Patrol', ReplaceRolls('You encounter a patrol of <strong> 2d4 </strong> (5) soldiers from the nearest city, on patrol.  To avoid the patrol, a <strong>' + patrol_dc + '</strong> stealth (dexterity) check is required.'))};
				};
			};
			
			//Treasure Hunting (Exploring)
			if (pace == "exploring") {
				//roll a d100: treasure encounter table 
				let {results, roll} = game.tables.getName("Hexcrawl_Treasure_Locations").roll();
					let treasNumber = roll.total;
					let treasText = results[0].text;
					
					diceContent += diceOutput(100, treasNumber,'exploration treasure');
					
					collapsibleText('Exploration', treasText + '<br/> <br/> Further investigation of the space could reveal the following treasure: <strong>' + treasureTable(hexType) + '</strong>.');
			};
			
			//Foraging
			
			if (pace == "exploring") {
				let herbVolume = '';
				let herbDice = '';
				
				let prob_herbs = new Roll('1d12').roll().total;
				diceContent += diceOutput(12, prob_herbs,'herbs');
								
				let {results, roll} = game.tables.getName('Herbs_' + hexType).roll();
					let herbNumber = roll.total;
					let herbText = results[0].text;
					diceContent += diceOutput(12, herbNumber,'herbs');
				
				if (prob_herbs == 12 ) {
					herbVolume = 'densely populated with';
					herbDice = '3d4';
				} else if (prob_herbs > 8 ) {
					herbVolume = 'populated with';
					herbDice = '2d4';
				} else {
					herbVolume = 'sparsely populated with';
					herbDice = '1d4';
				};
				
				collapsibleText('Herb Foraging', 'The area of the <strong>' + hexType + '</strong> that the party is exploring is ' + herbVolume + ' blooming <strong>' + herbText + '</strong>. <br/><br/> A successful <strong>DC 15</strong> herbalism (Wisdom) or nature (Intelligence) check will yield <strong>' + herbDice + ' / 2 </strong> (rounded up) herbs.<br/></br');
				
			};

			//Total All of the Dice
			if (Count100 != 0) { DiceString += Count100 + 'd100'};
			if (Count20 != 0) { DiceString += ' + ' + Count20 + 'd20'};
			if (Count12 != 0) { DiceString += ' + ' + Count12 + 'd12'};
			if (Count10 != 0) { DiceString += ' + ' + Count10 + 'd10'};
			if (Count8 != 0) { DiceString += ' + ' + Count8 + 'd8'};
			if (Count6 != 0) { DiceString += ' + ' + Count6 + 'd6'};
			if (Count4 != 0) { DiceString += ' + ' + Count4 + 'd4'};
			
			diceContent +=   '</ol><header class="part-header flexrow">';
            diceContent +=   '<span class="part-formula">' + DiceString + '</span>';
            diceContent +=   '<span class="part-total">' + DiceTotal + '</span>';
            diceContent +=   '</header></div></section></div><h4 class="dice-total">Show/Hide</h4></div></div>';
			
			let chatData = {
				content: msgContent,
				whisper: game.users.entities.filter(u => u.isGM).map(u => u._id),
				flavor: 'Adventure Content'
			};
			
			setProperty(chatData, 'flags.core.canPopout', true);
			
			let diceData = {
				content: diceContent
			};
			
			//Send Chat Messages
			ChatMessage.create(chatData, {});
			ChatMessage.create(diceData, {});
			
			//Send Physical Dice Rolls			
			dsnStr += ']}]}'; /* close the JSON String */
			const dsnObj = JSON.parse(dsnStr); /*convert to JSON object*/

			console.log(dsnStr);	
			console.log(dsnObj);
			
			game.dice3d.show(dsnObj,game.user,true); /*roll dice for all users*/

		}
    } 
}).render(true);