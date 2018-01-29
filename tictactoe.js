$(document).ready(function() {
	// define empty obj which refers to empty 9 squares 
	var obj = {};
	
	// message to choose 'X' or 'O'
	$("#mymodal").modal();
	
	/*
	user choosed 'O' then PC takes 'X'
	it's user's turn
	*/
	$("#o-btn").click(function() {
		window.usr = 'o';
		window.pc = 'x';
		$("#mymodal").modal("hide");
		return (usrTurn());
	});

	/*
	user chose 'X' then PC takes 'O'
	it's PC's turn
	*/
	$("#x-btn").click(function() {
		window.usr = 'x';
		window.pc = 'o';
		$("#mymodal").modal("hide");
		return (pcTurn());
	});

	/* 
	function to set 'X' or 'O' in an empty square,
	parameters: id = square id & char = 'X' or 'O'
	also add new property to 'obj' to save busy squares like ('id' : 'X') or ('id' : 'O')
	*/
	function set(id, char) {
		$('.col-xs-4').off('click');
		if (!obj[id]) {
			$("#" + id).addClass(char);
			obj[id] = char;
			$('.col-xs-4').off('click');
			$("#" + id).html(char).hide().fadeIn(100, function() {
				check();
			});
		}
	}
	
	/*
	function allows user to choose square,
	then call set() function sending chosen square id and letter that the use chose
	*/
	function usrTurn() {
		$('.col-xs-4').one('click', function() {
			if (!($(this).hasClass('x')) && !($(this).hasClass('o'))) {
				$('.col-xs-4').off('click');
				set(this.id, usr);
				setTimeout(pcTurn, 150);
			}
		})
	}
	
	/*
	PC do some tests to choose perfect square,
	each test equal a function returns true if one condition in this fuction was successfull,
	else if test returned nothing (false) PC do the next test.. and so on,
	eventually PC end his turn by calling user turn function.
	*/
	function pcTurn() {
		$('.col-xs-4').off('click');
		  if (!block()) {
				if (!oppCorner()) {
								if (!empCorner()) {
									empSide();
								}
			    }
		}
		return usrTurn();
	}
	
	/*
	1st test: checking if there is a direct chance to win 
	(which means two squares side by side contains PC letter) then set the third square to PC letter to finish the game, MUAHAHAHAHA
	*/
	function win() {
		var arr = [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
			[1, 4, 7],
			[2, 5, 8],
			[3, 6, 9],
			[1, 5, 9],
			[3, 5, 7]
		];
		for (var i in arr) {
			var row = arr[i];
			if (obj[row[0]] === pc && obj[row[1]] === pc && !(obj[row[2]])) {
				set(row[2], pc);
				return true;
			}
			if (obj[row[0]] === pc && obj[row[2]] === pc && !(obj[row[1]])) {
				set(row[1], pc);
				return true;
			}
			if (obj[row[1]] === pc && obj[row[2]] === pc && !(obj[row[0]])) {
				set(row[0], pc);
				return true;
			}
		}
	}

	/*
	2nd test: if there isn't a direct chance for PC to win (1st test), check if there is a direct chance for user to win and block it to prevent him from winning
	*/
	function block() {
		var arr = [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
			[1, 4, 7],
			[2, 5, 8],
			[3, 6, 9],
			[1, 5, 9],
			[3, 5, 7]
		];
		for (var i in arr) {
			var row = arr[i];
			if (obj[row[0]] === usr && obj[row[1]] === usr && !(obj[row[2]])) {
				set(row[2], pc);
				return true;
			}
			if (obj[row[0]] === usr && obj[row[2]] === usr && !(obj[row[1]])) {
				set(row[1], pc);
				return true;
			}
			if (obj[row[1]] === usr && obj[row[2]] === usr && !(obj[row[0]])) {
				set(row[0], pc);
				return true;
			}
		}
	}
	
	/*
	if there is no chance to win and no threats (first two tests), check if there is any chance to create a chance to win
	*/
	function fork() {

		if (!((obj[1]) || (obj[2]) || (obj[3]) || (obj[4]) || (obj[5]) || (obj[6]) || (obj[7]) || (obj[8]) || (obj[9])) && Math.random() >= 0.3) {
			var corners = [1, 3, 7, 9];
			set(corners[Math.round(Math.random() * 4) - 1], pc);
			return true;
		}

		// Three corners
		var arr1 = [
			[9, 3, 1],
			[3, 1, 7],
			[1, 7, 9],
			[7, 9, 3]
		];

		for (var i in arr1) {
			var row = arr1[i];
			if (obj[row[0]] === pc) {
				if ((obj[5]) && !(obj[row[2]])) {
					set(row[2], pc);
					return true;
				} else if (!(obj[row[1]]) && !(obj[((row[0] + row[1]) / 2)])) {
					set(row[1], pc);
					return true;
				}
			}
			if (obj[row[2]] === pc) {
				if ((obj[5]) && !(obj[row[0]])) {
					set(row[0], pc);
					return true;
				} else if (!(obj[row[1]]) && !(obj[((row[2] + row[1]) / 2)])) {
					set(row[1], pc);
					return true;
				}
			}
		}

		// center & Two corners
		var arr2 = [
			[1, 5, 3],
			[3, 5, 9],
			[9, 5, 7],
			[7, 5, 1]
		];

		for (var i in arr2) {
			var row = arr2[i];
			if (obj[row[0]] === pc && obj[row[1]] === pc && !(obj[row[2]])) {
				set(row[2], pc);
				return true;
			}
			if (obj[row[0]] === pc && obj[row[2]] === pc && !(obj[row[1]])) {
				set(row[1], pc);
				return true;
			}
			if (obj[row[1]] === pc && obj[row[2]] === pc && !(obj[row[0]])) {
				set(row[0], pc);
				return true;
			}
		}

	}

	/*
	4th test: prevent user from creating any chance to win	
	*/
	function blockFork() {

		if (obj[2] === usr && obj[6] === usr && !(obj[3])) {
			set(3, pc);
			return true;
		} else if (obj[8] === usr && obj[6] === usr && !(obj[9])) {
			set(9, pc);
			return true;
		} else if (obj[8] === usr && obj[4] === usr && !(obj[7])) {
			set(7, pc);
			return true;
		} else if (obj[2] === usr && obj[4] === usr && !(obj[1])) {
			set(1, pc);
			return true;
		}

		var arr1 = [
			[9, 3, 1],
			[3, 1, 7],
			[1, 7, 9],
			[7, 9, 3]
		];

		for (var i in arr1) {
			var row = arr1[i];

			if (obj[row[0]] === usr && obj[row[2]] === usr && !(obj[((row[1] + row[2]) / 2)])) {
				set(((row[1] + row[2]) / 2), pc);
				return true;
			}
			if (obj[row[2]] === usr && obj[row[0]] === usr && !(obj[((row[0] + row[1]) / 2)])) {
				set(((row[0] + row[1]) / 2), pc);
				return true;
			}
		}
	}

	/*
	previous tests failed ? center looks a strategic square, at least better than corners or sides
	*/
	function center() {
		if (!(obj[5])) {
			set(5, pc);
			return true;
		}
	}

	function oppCorner() {
		if (obj[1] === usr && !(obj[9])) {
			set(9, pc);
			return true;
		}
		if (obj[9] === usr && !(obj[1])) {
			set(1, pc);
			return true;
		}
		if (obj[3] === usr && !(obj[7])) {
			set(7, pc);
			return true;
		}
		if (obj[7] === usr && !(obj[3])) {
			set(3, pc);
			return true;
		}
	}
	
	/*
	seems that we have a draw, lets fill the empty corners
	*/
	function empCorner() {
		if (!(obj[9])) {
			set(9, pc);
			return true;
		}
		if (!(obj[1])) {
			set(1, pc);
			return true;
		}
		if (!(obj[7])) {
			set(7, pc);
			return true;
		}
		if (!(obj[3])) {
			set(3, pc);
			return true;
		}
	}
	
	/*
	fill the empty sides, Game Over.
	*/
	function empSide() {
		if (!(obj[2])) {
			return (set(2, pc));
		} else if (!(obj[4])) {
			return (set(4, pc));
		} else if (!(obj[6])) {
			return (set(6, pc));
		} else if (!(obj[8])) {
			return (set(8, pc));
		}
	}
	
	
	//For each set() function calling we check if we have a winner here

	function check() {
		var arr = [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
			[1, 4, 7],
			[2, 5, 8],
			[3, 6, 9],
			[1, 5, 9],
			[3, 5, 7]
		];
		for (var i in arr) {
			var row = arr[i];
			if (obj[row[0]] === pc && obj[row[1]] === pc && obj[row[2]] === pc) {
				$('.col-xs-4').off('click');
				window.lastWinner = 'pc';
				setTimeout(function() {
					$('#' + row[0] + ', #' + row[1] + ', #' + row[2]).effect('pulsate', {
						times: 1
					}, 400);
				}, 100);
				return (setTimeout(clearPC, 1200));
			}
		
  
    
     if (obj[row[0]] === usr && obj[row[1]] === usr && obj[row[2]] === usr) {
				$('.col-xs-4').off('click');
				window.lastWinner = 'usr';
				setTimeout(function() {
					$('#' + row[0] + ', #' + row[1] + ', #' + row[2]).effect('pulsate', {
						times: 1
					}, 400);
				}, 100);
				return (setTimeout(youWon, 1200));
			}
		}
    
		if((obj[1]) && (obj[2]) && (obj[3]) && (obj[4]) && (obj[5]) && (obj[6]) && (obj[7]) && (obj[8]) && (obj[9])) {
			return (setTimeout(clearDraw, 600));
		}
	}
	
	/*
	Oh yeah, PC wins 
	clear all squares, MUAHAHAHA image, start a new game
	*/
	function clearPC() {
		$("#loser").modal();
		$('#loser').on('hidden.bs.modal', function() {
			$('.col-xs-4').removeClass('x');
			$('.col-xs-4').removeClass('o');
			$('.col-xs-4').empty();
			for (var i = 1; i <= 9; i++) {
				obj[i] = '';
			} 
			usrTurn();
			return (usrTurn());
		});
	}
  
  function youWon() {
		$("#won").modal();
		$('#won').on('hidden.bs.modal', function() {
			$('.col-xs-4').removeClass('x');
			$('.col-xs-4').removeClass('o');
			$('.col-xs-4').empty();
			for (var i = 1; i <= 9; i++) {
				obj[i] = '';
			}
			usrTurn();
			return (usrTurn());
		});
	}
	
	/*
	Draw! .. draw image .. start a new game
	*/
	function clearDraw() {
		$("#draw").modal();
		$('#draw').on('hidden.bs.modal', function() {
			$('.col-xs-4').removeClass('x');
			$('.col-xs-4').removeClass('o');
			$('.col-xs-4').empty();
			for (var i = 1; i <= 9; i++) {
				obj[i] = '';
			}
			if (lastWinner == 'pc') {
				usrTurn();
			}
			return (usrTurn());
		});
	}

});