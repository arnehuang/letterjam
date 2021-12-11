from flask import request, current_app, jsonify
from . import letterjam
from .word import Word
from .game_status import GameStatus
from .player import Player
# from .hint_token import HintTokens TODO: refactor to hint tokens?
from .hint import Hint
from .state import State
import json

logger = current_app.logger

# from flask_socketio import SocketIO, emit
# socketio = SocketIO(current_app)
# @socketio.event
# def my_event(message):
#     logger.error("msg" + message)
#     emit('my response', {'data': 'got it!'})

# @socketio.on('connect')
# def test_connect():
#     logger.error("connected?")
#     print("connected?")
#     emit('my response', {'data': 'Connected'})

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
        return jsonify([player.name for player in state.players]), 200
    # Add a new player
    if request.method == 'POST':
        try:
            params = request.get_json()
            logger.info('delete me: ' + str(params))
            player = Player(params.get('player'))
            word_to_add = Word(params.get('word'), player)
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
        state.update_history_log(f'Player {player.name} joined')
        return jsonify(success=True)


@letterjam.route('/history_log/<player_name>')
def history_log(player_name):
    global state
    # History log shows latest action at the top, so reverse the list
    log = state.history_log_for_player(player_name)
    log.reverse()
    return jsonify(log), 200


@letterjam.route('/game_board/<player_name>')
def game_board(player_name):
    global state
    player = Player.find_player_in_list(player_name, state.players)
    if not player:
        return jsonify({'error': 'Player not found'}), 400
    from . import generate_table_info
    return jsonify(generate_table_info(state, player)), 200


@letterjam.route('/start_game', methods=['POST'])
def _start_game():
    global state
    if state.status != GameStatus.waiting_to_start:
        e = f'Error: Current Game status is {state.status}'
        return jsonify({'error': str(e)}), 400
    from . import start_game
    start_game(state.words, state.players)
    state.update_history_log(f"Game started with players: {state.players}")
    state.status = GameStatus.in_progress
    return jsonify(success=True)


@letterjam.route('/advance/<player_name>', methods=['POST'])
def advance(player_name):
    global state
    player = Player.find_player_in_list(player_name, state.players)
    if not player:
        return jsonify({'error': 'Player not found'}), 400
    for word in state.words:
        if word.guesser == player:
            word.advance()
            state.update_history_log(f"{player} advanced")
    return jsonify(success=True)


@letterjam.route('/hint/<hint_giver>', methods=['POST'])
# Takes ?player=X&hint=Y
def hint(hint_giver: str):
    global state
    hint_json = request.form.get('hint')
    # hint json looks like
    # {
    # 'letters':
    #   [
    #       {
    #           'raw': 'a', 'owner': 'playername',
    #       },
    #       {
    #           'raw': 'b', 'owner': 'playername2',
    #       },
    #   ],
    # }
    state.hint_count += 1
    state.update_history_log(
        Hint.from_json(hint_json,
                       Player.find_player_in_list(hint_giver, state.players),
                       state.hint_count,
                       state.players))
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


@letterjam.route('/load/<hint_count>', methods=['GET'])
def load(hint_count: str):
    logger.error(f"Loading from {hint_count}")
    global state
    state = state.load(int(hint_count))
    return jsonify(success=True)
