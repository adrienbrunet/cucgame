# coding: utf-8

# PYTHON
import copy

# DJANGO
from django.core.management.base import BaseCommand, CommandError

# OUR WEBAPP
from game.models import Player
from game.players import players


class Command(BaseCommand):
    help = 'Adds player to the game (just CUC players)'

    def handle(self, *args, **options):
        print('Adding Players')
        _players = copy.deepcopy(players)
        for player in _players:
            new_player, created = Player.objects.get_or_create(**player)
            if created:
                print('Player "%s" has been added.' % new_player.name)
