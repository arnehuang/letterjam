import random
import string


class Word:
    def __init__(self, word, player):
        self.word = word.upper()
        self.scrambled = Word.scramble(word)
        self.creator = player
        self.guesser = None
        self.revealed_idx = 0

    def __repr__(self):
        return ','.join([str(x) for x in [self.word, self.scrambled, self.guesser, self.revealed_idx]])

    def advance(self):
        if self.revealed_idx >= len(self.word) -1:
            self.scrambled += random.choice(string.ascii_lowercase)
        self.revealed_idx += 1

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

    @staticmethod
    def scramble(word):
        l = list(word)
        random.shuffle(l)
        return ''.join(l)
