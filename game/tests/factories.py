# PYTHON
import factory
from uuid import uuid4

# OUR WEBAPP
from ..models import Fight, Player


class FightFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Fight

    uuid = factory.Sequence(lambda n: uuid4())
    data = factory.Sequence(lambda n: '{}')
    winner = factory.SubFactory('game.tests.factories.PlayerFactory')
    loser = factory.SubFactory('game.tests.factories.PlayerFactory')


class PlayerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Player

    name = factory.Sequence(lambda n: 'Player %03d' % n)
