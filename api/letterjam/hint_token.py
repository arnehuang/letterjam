import enum


class TokenColors(enum.Enum):
    red = 0
    green = 1


class HintToken:
    def __init__(self, color, bot=None):
        self._color = color
        self._player = None
        self._bot = bot

    @property
    def color(self):
        # Color can only be set on initialization
        return self._color

    @property
    def bot(self):
        # bot can only be set on initialization
        return self._bot

    @property
    def player(self):
        return self._player

    @player.setter
    def player(self, player):
        self._player = player

    def is_bot(self):
        return (self.bot is not None) and self.is_not_taken()

    def is_taken(self):
        return self.player is not None  # TODO: Test this

    def is_not_taken(self):
        return not self.is_taken()


class HintTokens:
    BASE_TOKENS = 10

    def __init__(self, num_players, bots=None):
        if bots is None:
            bots = []
        self.num_players = num_players
        self.red_tokens = self._generate_red_tokens()
        self.green_tokens = self._generate_green_tokens(bots)
        self.unlocked = False

    def _generate_red_tokens(self):
        return [HintToken(TokenColors.red) for i in range(0, 4)]

    def _generate_green_tokens(self, bots):
        player_tokens = [HintToken(TokenColors.green) for i in range(0, self.BASE_TOKENS)]
        bot_tokens = [HintToken(TokenColors.green, bot=bot) for bot in bots]
        return player_tokens + bot_tokens

    def remaining_tokens(self):
        return [token for token in self.red_tokens + self.green_tokens if token.is_not_taken()]

    def tokens_taken(self):
        return [token for token in self.red_tokens + self.green_tokens if token.is_taken()]

    def take_token(self, player):
        # Returns True if successful, False = no more tokens left
        if self.num_players < 4:
            raise NotImplementedError
        # a player always takes a red token if they don't already have one
        if self.red_token_available():
            self._take_red_token(player)
            return True
        if self.green_token_available():
            self._take_green_token(player)
            return True
        return False

    def _take_red_token(self, player):
        for a_red_token in self.red_tokens:
            if a_red_token.is_not_taken():
                a_red_token.player = player
                self.try_unlock_token()
                return

    def _take_green_token(self, player):
        for a_green_token in self.green_tokens:
            if a_green_token.is_not_taken():
                a_green_token.player = player
                return

    def red_token_available(self):
        return any([token.is_not_taken() for token in self.red_tokens])

    def green_token_available(self):
        return any([token.is_not_taken() for token in self.green_tokens])

    def try_unlock_token(self):
        # Happens when all 4 red tokens are taken
        if (not self.red_token_available()) and (not self.unlocked):
            self.green_tokens.append(HintToken(TokenColors.green))
            self.unlocked = True
            print("Token Unlocked!")
