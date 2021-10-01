class Player:
    def __init__(self, name, word=None):
        self._name = name.lower()
        self._word = word

    @property
    def name(self):
        return self._name

    @property
    def word(self):
        return self._word

    @word.setter
    def word(self, new_word):
        self._word = new_word

    def __repr__(self):
        return f"Player: {self.name}"
