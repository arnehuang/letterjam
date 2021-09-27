from flask import render_template, flash, redirect, url_for, request, current_app, g, jsonify
from . import letterjam
from .word import Word
from .game_status import GameStatus

logger = current_app.logger
players = []
words = []
history_log = []
status = GameStatus.waiting_to_start


@letterjam.route('/')
def index():
    # Has button to add player
    # Has button to reset
    logger.info('Hit Index')
    global history_log
    return render_template('index.html', history_log=history_log)


@letterjam.route('/add_player', methods=['POST'])
# Adding requires /add_player?word=X&player=Y
def add_player():
    players_word = request.form.get('word')
    player = request.form.get('player')
    logger.info(f"Adding word {players_word}, for player {player}")
    word_length = 0
    global words, history_log, players, status
    if status != GameStatus.waiting_to_start:
        logger.error(f"Cannot add player, Game status is {status.name}")
        history_log.append(f"Cannot add player, Game status is {status.name}")
        return redirect(url_for('letterjam.index'))
    for a_word in words:
        word_length = len(a_word.word)
        break
    if word_length != 0 and word_length != len(players_word):
        history_log.append(f"Sorry, the current word length is {word_length}. Your word was not added. ")
        return render_template('index.html',
                               history_log=history_log
                               )
    words.append(Word(players_word, player))
    players.append(player)
    history_log.append(f'Player {player} Joined')
    return redirect(url_for('letterjam.current_status', player=player))


@letterjam.route('/current_status/<player>')
def current_status(player):
    global words, history_log, players, status
    from . import generate_table_info
    # TODO: FLESH OUT GENERATE TABLE INFO
    table_info = generate_table_info(words, players, player, status)
    return render_template('current_status.html',
                           table_info=table_info,
                           history_log=history_log,
                           player=player,
                           status=status
                           )


@letterjam.route('/start_game/<player>', methods=['POST'])
def _start_game(player):
    global words, history_log, players, status
    if status == GameStatus.waiting_to_start:
        from . import start_game
        start_game(words, players)
        history_log.append(f"Game started with players: {players}")
        status = GameStatus.in_progress
    # Otherwise, don't attempt to start the game. Just directly go to your player's current status
    return redirect(url_for('letterjam.current_status', player=player))


@letterjam.route('/advance/<player>', methods=['POST'])
def advance(player):
    global words, history_log
    for word in words:
        if word.guesser == player:
            word.advance()
            history_log.append(f"{player} advanced")
    return redirect(url_for('letterjam.current_status', player=player))


@letterjam.route('/hint/<player>', methods=['POST'])
# Takes ?player=X&hint=Y
def hint(player):
    global history_log
    hint = request.form.get('hint')
    history_log.append(f"{player} gave hint: {hint}")
    # TODO: refresh everyones page - callback in the html to listen for refresh
    return redirect(url_for('letterjam.current_status', player=player))


@letterjam.route('/reset')
def reset():
    global words, history_log, players, status
    players = []
    words = []
    history_log = []
    status = GameStatus.waiting_to_start
    logger.warning("RESET!")
    return redirect(url_for('letterjam.index'))
