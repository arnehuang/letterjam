import random
import string
from .player import Player
# from flask import current_app
# from flask_socketio import SocketIO, emit
# socketio = SocketIO(current_app)
# logger = current_app.logger


class Word:
    def __init__(self, word: str, player: Player, guesser: Player = None):
        self.word = word.upper()
        self.scrambled = Word.scramble(word) # Scrambled also contains bonus letters at endgame
        self.creator = player
        self.guesser = guesser
        self.revealed_idx = 0

    def __repr__(self):
        return "Word" + ','.join([str(x) for x in [self.word, self.scrambled, self.guesser, self.revealed_idx]])

    def advance(self, state):
        if self.revealed_idx >= len(self.word) - 1:
            self.scrambled += random.choice(string.ascii_lowercase)
        self.revealed_idx += 1
        state.update_history_log(f"{self.guesser} advanced")
        # socketio.emit('word advanced', {}, namespace='/word')

    def assign_guesser(self, players):
        # TODO: Assign a random guesser instead of a fixed one
        if self.guesser is None:
            self_idx = players.index(self.creator)
            if self_idx < len(
                    players) - 1:  # Array [a, b, c] has len 3 and idx 0, 1, 2. If it's 0 or 1, move right otherwise overflow
                guesser_idx = self_idx + 1
            else:
                guesser_idx = 0
            self.guesser = players[guesser_idx]
    # def assign_guesser(self, player: Player):
    #     self.guesser = player

    @staticmethod
    def scramble(word):
        l = list(word)
        random.shuffle(l)
        return ''.join(l)

    @staticmethod
    def word_for_guesser(guesser: Player, list_of_words):
        for word_in_list in list_of_words:
            if guesser == word_in_list.guesser:
                return word_in_list
        return None


