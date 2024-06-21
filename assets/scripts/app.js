const { resetTestProcesses } = require("appium-webdriveragent/build/lib/utils");

const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVEN_GAME_OVER = "GAME_OVER";
const enteredValue = prompt("Maximum Health", "100");

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
  let logEntry;
  if (event === LOG_EVENT_PLAYER_ATTACK) {
    logEntry = {
      event: event,
      value: value,
      target: "MONSTER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
    battleLog.push(logEntry);
  } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry = {
      event: event,
      value: value,
      target: "MONSTER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
    battleLog.push(logEntry);
  } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    logEntry = {
      event: event,
      value: value,
      target: "PLAYER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
    battleLog.push(logEntry);
  } else if (event === LOG_EVENT_PLAYER_HEAL) {
    logEntry = {
      event: event,
      value: value,
      target: "PLAYER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
    battleLog.push(logEntry);
  } else if (event === LOG_EVEN_GAME_OVER) {
    logEntry = {
      event: event,
      value: value,
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
    battleLog.push(logEntry);
  }
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function attackMonster(mode) {
  let maxDamage;
  let logEvent;
  if (mode === MODE_ATTACK) {
    maxDamage = ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_ATTACK;
  } else if (mode === MODE_STRONG_ATTACK) {
    (maxDamage = STRONG_ATTACK_VALUE),
      (logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK);
  }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentPlayerHealth, currentMonsterHealth);
  endRoud();
}

function endRoud() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage.currentMonsterHealth,
    currentPlayerHealth
  );
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("The bonus life saved you");
  }
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!");
    writeToLog(
      LOG_EVEN_GAME_OVER,
      "GAME OVER",
      currentPlayerHealth,
      currentMonsterHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost");
    writeToLog(
      LOG_EVEN_GAME_OVER,
      "MONSTER WON",
      currentPlayerHealth,
      currentMonsterHealth
    );
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("Its a draw!");
    writeToLog(
      LOG_EVEN_GAME_OVER,
      "A DRAW",
      currentPlayerHealth,
      currentMonsterHealth
    );
  }
  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackHandler() {
  attackMonster("ATTACK");
}

function stongAttackHandler() {
  attackMonster("STRONG_ATTACK");
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal more than your max healt");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(HEAL_VALUE);
  currentPlayerHealth += HEAL_VALUE;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRoud();
}
function printLogHandler() {
  console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", stongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
