class Player:
    def __init__(self, name, word=None, bot=False):
        self._name = name.lower()
        self._word = word
        self.bot = bot

    @property
    def name(self):
        return self._name

    @property
    def word(self):
        return self._word

    @word.setter
    def word(self, new_word):
        self._word = new_word

    @staticmethod
    def find_player_in_list(player_name, list_of_players):
        for player_in_list in list_of_players:
            if player_in_list.name == player_name:
                return player_in_list
        return None
    
    def is_bot(self):
        return self.bot

    def __repr__(self):
        return f"Player: {self.name}"
