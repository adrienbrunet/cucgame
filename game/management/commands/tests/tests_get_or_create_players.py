from django.test import TestCase


from game.models import Player
from ..get_or_create_players import Command


class TestGetOrCreatePlayers(TestCase):
    def test_players_are_added(self):
        nb_players = Player.objects.all().count()
        assert nb_players == 0

        Command().handle()
        nb_players = Player.objects.all().count()
        assert nb_players == 23
