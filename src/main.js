import tictactoeCore from 'tictactoe_core'
import Player from 'tictactoe_core/lib/Player'
import prompt from 'prompt'
import readlineSync from 'readline-sync'

let playerPromptSchema = {
  properties: {
    firstPlayerName: {
      required: true,
      description: 'First player name: ',
      default: 'Player 1'
    },
    secondPlayerName: {
      required: true,
      description: 'Second player name: ',
      default: 'Player 2'
    }
  }
}

var finished = false

let game = tictactoeCore.default()
let board = game.board
let turn = 1

game.onWinnerListener = function(player) {
  finished = true
  if (player === null) {
    console.log("Game was a draw");
  } else {
    console.log(`Player ${player.name} wins.`)
  }
}

let players = []

prompt.start();
prompt.get(playerPromptSchema, function(err, result) {
  if (err) {
    console.log(err.message)
  }
  console.log('Players:');
  console.log('  First Player: ' + result.firstPlayerName);
  console.log('  Second Player: ' + result.secondPlayerName);
  createPlayer('X', result.firstPlayerName)
  createPlayer('O', result.secondPlayerName)
  playNextTurn()
})

function playNextTurn() {
  if (finished) {
    return
  }
  let turnData = nextTurn()
  drawBoard()
  console.log(turnData.message);
  let x = readlineSync.questionInt('Column: ', {limit: number => {
    return number > 0 && number < board.width
  }})
  let y = readlineSync.questionInt('Row: ', {limit: number => {
    return number > 0 && number < board.height
  }})
  try {
    turnData.player.play(x, y)
  } catch (e) {
    console.log(e.message);
    turn--
  } finally {
    playNextTurn()
  }
}

function createPlayer(id, name) {
  let player = new Player(id, name)
  players.push(player)
  game.addPlayer(player)
}

function nextTurn() {
  turn = (turn + 1) % 2
  let player = players[turn]
  return {message: `${player.name} (${player.id}) turn`, player: player}
}

// function returnInt(element) {
//   return parseInt(element, 10);
// }

function drawBoard() {
  let board = game.board
  for (let x = board.width; x !== 0; x--) {
    for (let y = board.height; y !== 0; y--) {
      let cell = board.getCell(x, y) || '-'
      process.stdout.write(cell);
    }
    process.stdout.write("\n");
  }
  process.stdout.write("\n");
}
