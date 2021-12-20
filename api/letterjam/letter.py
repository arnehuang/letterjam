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
    def from_json(json: dict, seen_players, hint_giver: Player, players_list, words_list, state) -> 'Letter':
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
            print(f"Guesser: {guesser}")
            print(f"guesser is_bot: {guesser.is_bot()}")
            print(f"seen_players: {seen_players}")
            if guesser.is_bot() and guesser not in seen_players:
                print(f"{guesser.name} is a bot, but not in seen_players")
                Word.word_for_guesser(guesser, words_list).advance(state)
        except (KeyError, AttributeError) as e:
            guesser = None
        return Letter(raw, guesser)

    def __str__(self) -> str:
        return self.raw

    def __repr__(self) -> str:
        return self.raw
