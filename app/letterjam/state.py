import pickle
from pathlib import Path


class State:
    DIR_NAME = Path(__file__).absolute().parent

    def __init__(self, players, words, history_log, status, hint_tokens, hint_count=0):
        self._players = players
        self._words = words
        self._history_log = history_log
        self._status = status
        self._hint_tokens = hint_tokens
        self.hint_count = hint_count  # todo - decprecate in favour of hint objects?

    @property
    def players(self):
        return self._players

    @property
    def words(self):
        return self._words

    @property
    def history_log(self):
        return self._history_log

    @property
    def status(self):
        return self._status

    @property
    def hint_tokens(self):
        return self._hint_tokens

    @status.setter
    def status(self, value):
        self._status = value

    def hint_count(self):
        return len(self.hint_tokens.tokens_taken())

    def save(self):
        SAVE_PATH = (State.DIR_NAME).joinpath(str(self.hint_count))
        pickle.dump(self, open(SAVE_PATH, 'wb'))

    @staticmethod
    def load(version):
        return pickle.load(open((State.DIR_NAME).joinpath(version), 'rb'))
