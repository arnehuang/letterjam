from flask import Blueprint, current_app
# import functools

letterjam = Blueprint('letterjam', __name__, template_folder='templates')
from . import routes
from .game_status import GameStatus

logger = current_app.logger


def start_game(words, players):
    for word in words:
        word.assign_guesser(players)
    for word in words:
        if word.guesser is None:
            raise ValueError
    logger.info("Successfully assigned word guessers")


# @functools.lru_cache(maxsize=64)
def generate_table_info(state, player):
    words, players, status = state.words, state.players, state.status
    table_info = list()
    table_info.append([a_player.name for a_player in players])  # First row is player names
    if status == GameStatus.waiting_to_start:
        return table_info
    word_length = max([len(a_word.scrambled) for a_word in words])
    # Assume words are in same order as players
    words_reordered_by_guessers = []
    for a_player in players:
        for a_word in words:
            if a_word.guesser == a_player:
                words_reordered_by_guessers.append(a_word)

    for i, check_word in enumerate(words_reordered_by_guessers):
        # print(check_word.guesser == players[i])
        assert check_word.guesser == players[i]

    current_players_index = players.index(player)
    # Generate rows below
    for row_idx in range(0, word_length):
        row_to_add = []
        for col_idx, a_word in enumerate(words_reordered_by_guessers):
            if row_idx > len(a_word.word) - 1:
                letter_to_append = 'bonus'
                if row_idx < len(a_word.scrambled):  # Word is a word that has extra letters
                    if col_idx != current_players_index:
                        letter_to_append = a_word.scrambled[row_idx]
                    else:
                        letter_to_append = 'Revealed'
            elif row_idx > a_word.revealed_idx:  # Not revealed yet
                letter_to_append = '$'
            elif col_idx == current_players_index:  # Own players board
                letter_to_append = 'Revealed'
            else:
                letter_to_append = a_word.scrambled[row_idx]
            row_to_add.append(letter_to_append)
        table_info.append(row_to_add)
    logger.info(f"Table info is: {table_info}")
    return table_info
