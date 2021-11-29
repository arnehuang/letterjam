import enum


class GameStatus(enum.Enum):
    not_created = 0
    waiting_to_start = 1
    in_progress = 2
    waiting_for_clue = 3
