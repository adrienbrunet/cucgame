from django.test import TestCase


from ..forms import FightForm
from .factories import PlayerFactory


class TestFightForm(TestCase):
    def setUp(self):
        self.winner = PlayerFactory.create()
        self.loser = PlayerFactory.create()
        self.form = FightForm()
        self.players = {
            'winner': self.winner.pk,
            'loser': self.loser.pk,
        }

    def test_form_is_invalid(self):
        assert self.form.is_valid() is False

    def test_form_is_invalid_without_data(self):
        form = FightForm(self.players)
        assert form.is_valid() is False

    def test_form_is_valid_with_data(self):
        self.players.update({'data': '[]'})
        form = FightForm(self.players)
        assert form.is_valid()
