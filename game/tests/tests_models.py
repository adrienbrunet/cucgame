from django.test import TestCase

from .factories import FightFactory, PlayerFactory


class TestFight(TestCase):
    def setUp(self):
        self.fight = FightFactory.create()

    def test_str(self):
        _str = self.fight.__str__()
        assert 'Fight' in _str
        assert 'vs' in _str
        assert self.fight.winner.name in _str
        assert self.fight.loser.name in _str


class TestPlayer(TestCase):
    def setUp(self):
        self.player = PlayerFactory.create()

    def test_str(self):
        assert self.player.__str__() == self.player.name

    def test_ordering(self):
        from ..models import Player
        self.player2 = PlayerFactory.create(elo_score=0)
        self.player3 = PlayerFactory.create(elo_score=100)
        self.player4 = PlayerFactory.create(elo_score=10000)

        list_players = list(Player.objects.all())
        assert list_players == [self.player4, self.player, self.player3, self.player2]
