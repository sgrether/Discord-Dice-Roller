/**
	Helper functions + functions that roll and calculate dice for different games
	Current game functions: VTM, DND, L5R
*/

//Roll die
function getRandomInt(min, max) {
  minN = Math.ceil(min);
  maxN = Math.floor(max)+1;
  return Math.floor(Math.random() * (maxN - minN)) + minN; //The maximum is exclusive and the minimum is inclusive
}

//Add exploding tens recursively for L5R
function addTens(num) {
	if (num == 10) return num + addTens(getRandomInt(1, 10));
	return num;
}

function VTM(roll) {
	//Initialize variables
	var params = roll, successes = 0, success = false, dc = 0, tens = false;

	//Check for exploding 10s
	if (params.includes("!")) tens = true;
	//Seperate dice from DC
	if (params.includes(" ")) {
		success = true;
		dc = params.split(" ").slice(1);
	if (tens == true) {
	    params = params.substring(1, params.length-2);
	} else {
		params = params.substring(0, params.length-2);
	}
}

    //Error message
	if (tens == true && success == false) {
		//message.channel.send('Only use ! when giving a DC.');
		return ('Only use ! when giving a DC.');
	}

    //Separate number of dice from the type of dice and initialize more variables
	params = params.split("d");
	var dice = params[1], num = params[0], str = '', randNum = 0, ones = false;

    //Roll dice and tally successes if DC is given
	for (i = 0; i < num; i++) {
		randNum = getRandomInt(1, dice);
		if (success == true && randNum >= dc) successes++;
		if (tens == true && randNum == 10) successes++;
		if (randNum == 1) ones = true;
		if (i > 0) {
			str = str.concat(' + ', randNum.toString());
		} else {
			str = randNum.toString();
		}
	}

    //If no DC given, print out all results
	if (success == false) {
		return str;
    //Otherwise print out results and number of successes
	} else {
		str = str.concat(' = ', successes.toString(), ' successes');
		//If DC given and no successes gained and at least a single '1' was rolled, it's a botch
		if (successes == 0 && ones == true) str = str.concat(', BOTCH!');
		return str;
	}
}

function DND(roll) {
	//Initialize variables
	var params = roll;

    //Separate into chunks and initialize variables
    params = params.split(' ');
    var randNum = 0, str = '', total = 0, crit = false, numDice = [], dice = [], bonus = false;
    if (roll.includes('+') || roll.includes('-')) {
      var mod = params[params.length-2], bonusNum = params[params.length-1];
      bonus = true;
    }

    //Separate number of dice from type of dice
    if (bonus == true) {
      for (i = 0; i < params.length-2; i++) {
        numDice[i] = params[i].split('d').slice(0, 1);
        dice[i] = params[i].split('d').slice(1);
      }
    } else {
      for (i = 0; i < params.length; i++) {
        numDice[i] = params[i].split('d').slice(0, 1);
        dice[i] = params[i].split('d').slice(1);
      }
    }

    //Roll dice and total them
    for (j = 0; j < numDice.length; j++) {
      for (k = 0; k < numDice[j]; k++) {
        randNum = getRandomInt(1, dice[j]);
        total += randNum;
        if (j == 0 && k == 0) {
          str = str.concat(randNum.toString(), ' (d', dice[j].toString(), ') ');
		    } else {
			    str = str.concat(' + ', randNum.toString(), ' (d', dice[j].toString(), ') ');
		    }
      }
    }

    //Check for natural 20s
    if (dice = 20 && total == 20) crit = true;
    if (bonus == true) {
      if (mod == '+') {
        total += parseInt(bonusNum); //Add bonus
        str = str.concat('+ ', bonusNum, ' = ', total);
      } else if (mod == '-') {
        total -= parseInt(bonusNum); //subtract bonus
        str = str.concat('- ', bonusNum, ' = ', total);
      }
    } else {
      str = str.concat('= ', total);
    }
    if (crit == true) str = str.concat(', CRITICAL!');

    return str;
}

function L5R(roll) {
	//Initialize variables
	var reroll = false, mod = 0, bonusNum = 0, bonus = false, params = roll;
	
	//Check for Emphasis
	if (params.includes("!")) {
		reroll = true;
		params = params.substring(1, params.length);
	}
	
	params = params.split(" ");
	
	if (message.content.includes('+') || message.content.includes('-')) {
      var mod = params[params.length-2], bonusNum = params[params.length-1];
      bonus = true;
    }
	
	//Split for total dice and kept dice / initialize variables
	params = params[0].split("k");
	var dice = params[0], kept = params[1], rolls = new Array(), total = 0, str = '';
	
	//Rolls dice
	for (i = 0; i < dice; i++) {
		rolls[i] = getRandomInt(1, 10);
		if (reroll == true && rolls[i] == 1) rolls[i] = getRandomInt(1, 10); 
		rolls[i] = addTens(rolls[i]);
	}
	
	//Add up the top rolls
	rolls = rolls.sort(function(a, b){return b - a});
	for (i = 0; i < kept; i++) {
		total += rolls[i];
	}
	
	//Put numbers in String for clean printing
	for (i = 0; i < dice; i++) {
		if (i + 1 == dice) {
			str = str.concat(rolls[i], ' = ');
		} else {
			str = str.concat(rolls[i], ', ');
		}
	}
	
	//Add bonus, if any
	if (bonus == true) {
		total += parseInt(bonusNum); //Add bonus
		str = str.concat(total, ' (', mod, bonusNum, ')');
    } else {
		str = str.concat(total);
	}

	return str;
}

function Twelve(roll) {
	//Initialize variables
	var params = roll;

    //Separate into chunks and initialize variables
    params = params.split(' ');
    var randNum = 0, str = '', numDice = 0, dice = 0, bonusNum = 0, successes = 0, dc = 0;
	
	//Grab DC for roll
	dc = params[1];
	
	//Check for aptitude bonuses
    if (roll.includes('!')) {
		if (params[params.length-1].length > 1) {
			bonusNum = 2;
		} else {
			bonusNum = 1;
		}
    }

    //Separate number of dice from type of dice
	numDice = params[0].split('d')[0];
	dice = params[0].split('d')[1];
	//console.log(numDice, ', ', dice, ', ', bonusNum, '\n');

    //Roll dice and total them
	for (j = 0; j < numDice; j++) {
		randNum = getRandomInt(1, dice);
		if (randNum >= dc) successes++;
		if (bonusNum >= 1 && randNum == 3) successes++;
		if (bonusNum == 2 && randNum == 6) successes++;
		if (j == 0) {
			str = str.concat(randNum.toString());
			//console.log(str, '\n');
		} else {
			str = str.concat(', ', randNum.toString());
			//console.log(str, '\n');
		}
	}
    
	str = str.concat(' = ', successes, ' Successes.');

    return str;
}

module.exports = { VTM, DND, L5R, Twelve };