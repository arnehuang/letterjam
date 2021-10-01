from flask import render_template, flash, redirect, url_for, request, current_app, g, jsonify
from . import letterjam
from .word import Word
from .game_status import GameStatus
from .player import Player
# from .hint_token import HintTokens TODO: refactor to hint tokens?
from .state import State

logger = current_app.logger

state = State(players=[],
              words=[],
              history_log=[],
              status=GameStatus.waiting_to_start,
              hint_tokens=None)


@letterjam.route('/')
def index():
    global state
    return render_template('index.html',
                           history_log=state.history_log,
                           status=state.status,
                           players=state.players)


@letterjam.route('/add_player', methods=['POST'])
# Adding requires /add_player?word=X&player=Y
def add_player():
    try:
        player = Player(request.form.get('player'))
        word_to_add = Word(request.form.get('word'), player)
        player.word = word_to_add
    except Exception as e:
        flash(str(e))
        logger.error(e)
        return redirect(url_for('letterjam.index'))
    logger.info(f"REMOVE ME Adding word {word_to_add}, for player {player}")

    current_word_length = 0
    global state
    if state.status != GameStatus.waiting_to_start:
        logger.error(f"Cannot add player, Game status is {state.status.name}")
        flash(f"Cannot add player, Game status is {state.status.name}")
        return redirect(url_for('letterjam.index'))
    for a_word in state.words:
        current_word_length = len(a_word.word)
        break
    if current_word_length != 0 and current_word_length != len(word_to_add.word):
        flash(f"Sorry, the current word length is {current_word_length}. Your word was not added. ")
        return redirect(url_for('letterjam.index'))
    state.players.append(player)
    state.words.append(word_to_add)
    state.history_log.append(f'Player {player.name} Joined')
    return redirect(url_for('letterjam.current_status', player_name=player.name))


@letterjam.route('/current_status/<player_name>')
def current_status(player_name):
    global state
    player = list(filter(lambda player: player.name == player_name, state.players))[0]
    from . import generate_table_info
    table_info = generate_table_info(state, player)
    return render_template('current_status.html',
                           table_info=table_info,
                           history_log=state.history_log,
                           player=player,
                           status=state.status
                           )


@letterjam.route('/start_game/<player_name>', methods=['POST'])
def _start_game(player_name):
    global state
    if state.status == GameStatus.waiting_to_start:
        from . import start_game
        start_game(state.words, state.players)
        state.history_log.append(f"Game started with players: {state.players}")
        state.status = GameStatus.in_progress
    # Otherwise, don't attempt to start the game. Just directly go to your player's current status
    return redirect(url_for('letterjam.current_status', player_name=player_name))


@letterjam.route('/advance/<player_name>', methods=['POST'])
def advance(player_name):
    global state
    player = list(filter(lambda player: player.name == player_name, state.players))[0]
    for word in state.words:
        if word.guesser == player:
            word.advance()
            state.history_log.append(f"{player} advanced")
    return redirect(url_for('letterjam.current_status', player_name=player.name))


@letterjam.route('/hint/<player_name>', methods=['POST'])
# Takes ?player=X&hint=Y
def hint(player_name):
    global state
    hint = request.form.get('hint')
    state.hint_count += 1
    state.history_log.append(f"Hint number {state.hint_count}: {player_name} says: {hint}.")
    state.save()
    # TODO: refresh everyones page - callback in the html to listen for refresh
    return redirect(url_for('letterjam.current_status', player_name=player_name))


@letterjam.route('/reset')
def reset():
    global state
    state = State(players=[],
                  words=[],
                  history_log=[],
                  status=GameStatus.waiting_to_start,
                  hint_tokens=None)
    logger.warning("RESET!")
    return redirect(url_for('letterjam.index'))


@letterjam.route('/load', methods=['POST'])
# Takes ?hint_count=xxx
def load():
    hint_count = request.form.get('hint_count')
    global state
    state = state.load(hint_count)
    return redirect(url_for('letterjam.index'))
