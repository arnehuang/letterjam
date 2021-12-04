from flask import request, current_app, jsonify
from . import letterjam
from .word import Word
from .game_status import GameStatus
from .player import Player
# from .hint_token import HintTokens TODO: refactor to hint tokens?
from .state import State
import json

logger = current_app.logger

state = State(players=[],
              words=[],
              history_log=[],
              status=GameStatus.waiting_to_start,
              hint_tokens=None)


@letterjam.route('/status')
def status():
    global state
    return jsonify(state.status.name), 200


@letterjam.route('/players', methods=['GET', 'POST'])
def players():
    global state
    # List current players
    if request.method == 'GET':
        return jsonify([json.dumps(vars(player)) for player in [Player('arne'), Player('ellen')]]), 200
        return jsonify([json.dumps(vars(player)) for player in state.players]), 200
    # Add a new player
    if request.method == 'POST':
        try:
            player = Player(request.form.get('player'))
            word_to_add = Word(request.form.get('word'), player)
            player.word = word_to_add
        except Exception as e:
            logger.error(e)
            return jsonify({'error': str(e)}), 500
        logger.info(
            f"REMOVE ME Adding word {word_to_add}, for player {player}")
        if state.status != GameStatus.waiting_to_start:
            e = f"Cannot add player, Game status is {state.status.name}"
            logger.error(e)
            return jsonify({'error': e}), 400
        # If we already have words, then check word length is valid
        if len(state.words) > 0:
            current_word_length = len(state.words[0].word)
            if current_word_length != len(word_to_add.word):
                e = f"Sorry, the current word length is {current_word_length}. Your word was not added."
                logger.error(e)
                return jsonify({'error': e}), 400
        state.players.append(player)
        state.words.append(word_to_add)
        state.history_log.append(f'Player {player.name} Joined')
        return jsonify(success=True)


@letterjam.route('/history_log/<player_name>')
def history_log(player_name):
    global state
    return state.history_log_for_player(player_name)


@letterjam.route('/game_board/<player_name>')
def game_board(player_name):
    global state
    player = list(
        filter(lambda player: player.name == player_name, state.players))[0]
    from . import generate_table_info
    return generate_table_info(state, player), 200


@letterjam.route('/start_game/<player_name>', methods=['POST'])
def _start_game(player_name):
    global state
    if state.status != GameStatus.waiting_to_start:
        e = f'Error: Current Game status is {state.status}'
        return jsonify({'error': str(e)}), 400
    from . import start_game
    start_game(state.words, state.players)
    state.history_log.append(f"Game started with players: {state.players}")
    state.status = GameStatus.in_progress
    return jsonify(success=True)


@letterjam.route('/advance/<player_name>', methods=['POST'])
def advance(player_name):
    global state
    player = list(
        filter(lambda player: player.name == player_name, state.players))[0]
    for word in state.words:
        if word.guesser == player:
            word.advance()
            state.history_log.append(f"{player} advanced")
    return jsonify(success=True)

@letterjam.route('/hint/<player_name>', methods=['POST'])
# Takes ?player=X&hint=Y
def hint(player_name):
    global state
    hint = request.form.get('hint')
    state.hint_count += 1
    state.history_log.append(
        f"Hint number {state.hint_count}: {player_name} says: {hint}.")
    state.save()
    return jsonify(success=True)

@letterjam.route('/reset')
def reset():
    global state
    state = State(players=[],
                  words=[],
                  history_log=[],
                  status=GameStatus.waiting_to_start,
                  hint_tokens=None)
    logger.warning("RESET!")
    return jsonify(success=True)


@letterjam.route('/load', methods=['POST'])
# Takes ?hint_count=xxx
def load():
    hint_count = request.form.get('hint_count')
    global state
    state = state.load(hint_count)
    return jsonify(success=True)
