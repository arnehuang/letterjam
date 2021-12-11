from .player import Player
from .letter import Letter


class Hint:
    def __init__(self, number, letters, giver: Player) -> None:
        self.number = number
        self._letters = letters
        self.giver = None

    @property
    def letters(self) -> str:
        return self._letters

    @letters.setter
    def letters(self, letters) -> None:
        self._letters = letters

    def representation_for_player(self, player: Player) -> str:
        representation = f"Hint {self.number}: {self.giver.name} says "
        for letter in self._letters:
            representation += letter.representation_for_player(player)
        return representation

    @staticmethod
    def from_json(json, giver, number, players_list) -> 'Hint':
        # json looks like
        # {
        # 'letters':
        #   [
        #       {
        #           'raw': 'a', 'owner': 'playername',
        #       },
        #       {
        #           'raw': 'b', 'owner': 'playername2',
        #       },
        #   ],
        # }
        letters = []
        for letter_json in json['letters']:
            letters.append(Letter.from_json(letter_json, players_list))
        return Hint(letters, giver, number)

    def __str__(self) -> str:
        return self._letters

    def __repr__(self) -> str:
        return self._letters
