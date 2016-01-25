# DJANGO
from django.test import TestCase

# OUR WEBAPP
from .factories import FightFactory


class ManagerTest(TestCase):
    '''
    The idea is to test if our manager is taken into account and no extra
    queries is made when accessing the foreignkey attribute.
    '''

    def test_fight_manager(self):
        fight = FightFactory.create()

        with self.assertNumQueries(0):
            fight.winner.name
            fight.loser.name
