from flask import Blueprint, current_app

letterjam = Blueprint('letterjam', __name__, template_folder='templates')
from . import routes
from .game_status import GameStatus
from .player import Player

logger = current_app.logger


def start_game(words, players):
    for word in words:
        word.assign_guesser(players)
    for word in words:
        if word.guesser is None:
            raise ValueError
    logger.info("Successfully assigned word guessers")


def generate_table_info(state, player: Player):
    words, players, status = state.words, state.players, state.status
    bonus_letters = state.bonus_letters
    table_info = {a_player.name: [] for a_player in players}
    table_info['Bonus Letters'] = bonus_letters
    if status == GameStatus.waiting_to_start:
        return table_info
    word_length = max([len(a_word.scrambled) for a_word in words])

    words_reordered_by_guessers = [
        a_word for a_player in players for a_word in words
        if a_word.guesser == a_player
    ]
    # for a_player in players:
    #     for a_word in words:
    #         if a_word.guesser == a_player:
    #             words_reordered_by_guessers.append(a_word)
    # TODO: remove this once i've verified the above works
    for i, check_word in enumerate(words_reordered_by_guessers):
        assert check_word.guesser == players[i]

    current_players_index = players.index(player)

    for letter_idx in range(0, word_length):
        for player_idx, a_word in enumerate(words_reordered_by_guessers):
            if letter_idx > len(a_word.word) - 1:
                letter_to_append = 'PLACEHOLDER'
                if letter_idx < len(a_word.scrambled
                                 ):  # Word is a word that has extra letters
                    if player_idx != current_players_index:
                        letter_to_append = a_word.scrambled[letter_idx].upper()
                    else:
                        letter_to_append = 'REVEALED'
            elif letter_idx > a_word.revealed_idx:  # Not revealed yet
                letter_to_append = 'BLANK'
            elif player_idx == current_players_index:  # Own players board
                letter_to_append = 'REVEALED'
            else:
                letter_to_append = a_word.scrambled[letter_idx].upper()
            table_info[players[player_idx].name].append(letter_to_append)
    logger.info(f"Table info is: {table_info}")
    return table_info
