from .player import Player

class Letter:
    HIDDEN_FORM = '?'

    def __init__(self, raw, owner: Player) -> None:
        self.raw = raw.upper()
        self.owner = owner

    def is_hidden_for_player(self, player: Player) -> bool:
        return self.owner == player

    def representation_for_player(self, player: Player) -> str:
        if self.is_hidden_for_player(player):
            return self.HIDDEN_FORM
        return self.raw

    @staticmethod
    def from_json(json: dict, owner: Player, players_list) -> 'Letter':
        # Looks like
        #       {
        #           'raw': 'a', 'owner': 'playername',
        #       },
        raw = json['raw']
        try:
            # Owner may be missing - manual input from hint interface
            owner = Player.find_player_in_list(json.get('owner'), players_list)
        except KeyError:
            owner = None
        return Letter(raw, owner)

    def __str__(self) -> str:
        return self.raw

    def __repr__(self) -> str:
        return self.raw
