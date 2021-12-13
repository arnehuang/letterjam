from .player import Player
from .word import Word
class Letter:
    HIDDEN_FORM = '?'

    def __init__(self, raw, guesser: Player) -> None:
        self.raw = raw.upper()
        self.guesser = guesser

    def is_hidden_for_player(self, player: Player) -> bool:
        return self.guesser == player

    def representation_for_player(self, player: Player) -> str:
        if self.is_hidden_for_player(player):
            return self.HIDDEN_FORM
        return self.raw

    @staticmethod
    def from_json(json: dict, hint_giver: Player, players_list, words_list) -> 'Letter':
        # Looks like
        #       {
        #           'raw': 'a', 'owner': 'playername',
        #       },
        # The Owner is the player who has the scrambled word, i.e. the guesser of the word
        raw = json['raw']
        guesser = json.get('owner')
        try:
            # Owner may be missing - other input from hint interface
            guesser = Player.find_player_in_list(json.get('owner'), players_list)
            if hint_giver.name == guesser.name:
                guessers_word = Word.word_for_guesser(guesser, words_list)
                raw = guessers_word.scrambled[guessers_word.revealed_idx]
        except (KeyError, AttributeError) as e:
            guesser = None
        return Letter(raw, guesser)

    def __str__(self) -> str:
        return self.raw

    def __repr__(self) -> str:
        return self.raw
