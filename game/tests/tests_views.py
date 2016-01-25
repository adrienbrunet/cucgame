from django.core.urlresolvers import reverse
from django.test import TestCase


class TestRoot(TestCase):
    def setUp(self):
        self.req = self.client.get(reverse('home'))

    def test_template(self):
        self.assertTemplateUsed('home.html')

    def test_status_code(self):
        assert self.req.status_code == 200


class TestResult(TestCase):
    def setUp(self):
        self.req = self.client.get(reverse('results'))

    def test_template(self):
        self.assertTemplateUsed('game/player_list.html')

    def test_status_code(self):
        assert self.req.status_code == 200

    def test_context(self):
        assert 'player_list' in self.req.context
