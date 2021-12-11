import pickle
from pathlib import Path

from letterjam.game_status import GameStatus
from .hint import Hint

# from flask import current_app
# from flask_socketio import SocketIO, emit
# socketio = SocketIO(current_app)
# logger = current_app.logger
# @socketio.on('connect')
# def handle_message(data):
#     logger.error('received message: ' + data)
class State:
    DIR_NAME = Path(__file__).absolute().parent

    def __init__(self,
                 players,
                 words,
                 history_log,
                 status: GameStatus,
                 hint_tokens,
                 hint_count=0):
        self._players = players
        self._words = words
        self._history_log = history_log
        self._status: GameStatus = status
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
        # socketio.emit('status updated', {'status': value}, namespace='/status')

    def update_history_log(self, entry):
        self.history_log.append(entry)
        # socketio.emit('history updated', {'history': self.history_log})

    def hint_count(self):
        return len(self.hint_tokens.tokens_taken())

    def save(self):
        SAVE_PATH = (State.DIR_NAME).joinpath(str(self.hint_count))
        pickle.dump(self, open(SAVE_PATH, 'wb'))

    def history_log_for_player(self, player):
        # History log is a list of strings
        # Search each string for hints
        # If a log entry is a hint, replace players names with their letters
        # This needs to be done  after "says:".
        # The hint will be formatted as translated_hint, player_to_hide_from
        #
        return [
            entry.representation_for_player(player) if isinstance(entry, Hint) else entry
            for entry in self.history_log
        ]

    @staticmethod
    def load(version):
        return pickle.load(open((State.DIR_NAME).joinpath(version), 'rb'))
