import tictactoeCore from 'tictactoe_core'
import Player from 'tictactoe_core/lib/Player'
import prompt from 'prompt'
import readlineSync from 'readline-sync'
import _ from 'underscore'

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

let score = {}
let players = []
let turn = 1

var finished
let game
let board
initializeBoard()

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
    promptNewGame()
    return
  }
  let turnData = nextTurn()
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
    drawBoard()
    playNextTurn()
  }
}

function createPlayer(id, name) {
  let player = new Player(id, name)
  players.push(player)
  game.addPlayer(player)
  score[id] = 0
}

function nextTurn() {
  turn = (turn + 1) % 2
  let player = players[turn]
  return {message: `${player.name} (${player.id}) turn`, player: player}
}

function drawBoard() {
  let board = game.board
  process.stdout.write("\n");
  for (let x = board.width; x !== 0; x--) {
    for (let y = 1; y <= board.height; y++) {
      let cell = board.getCell(x - 1, y - 1) || '_'
      process.stdout.write(`${cell}\t`);
    }
    process.stdout.write("\n");
  }
  process.stdout.write("\n");
}

function promptNewGame() {
  if (!readlineSync.keyInYN('Do you want to play another one?')) {
    process.exit();
    return
  }
  initializeBoard()
  playNextTurn()
}

function onWinnerListener(player) {
  finished = true
  console.log('');
  if (player === null) {
    console.log("Game was a draw");
  } else {
    console.log(`${player.name} (${player.id}) wins.`)
    score[player.id]++
    _.each(players, printScore)
  }
  console.log('');
}

function printScore(player) {
  console.log(`${player.name} wins: ${score[player.id]}`);
}

function initializeBoard() {
  finished = false
  game = tictactoeCore.default()
  board = game.board
  game.onWinnerListener = onWinnerListener
  if (players.length > 0) {
    _.each(players, function(player) {
      game.addPlayer(player)
    })
  }
}
