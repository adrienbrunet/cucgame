import json

from django.test import TestCase

from .factories import FightFactory


class TestFightViewSet(TestCase):
    def setUp(self):
        self.c = self.client
        self.fight = FightFactory.create()

    def test_cant_delete(self):
        req = self.c.delete('/api/fights/%s/' % self.fight.pk, format='json')
        assert req.status_code == 405

    def test_can_create(self):
        req = self.c.post(
            '/api/fights/',
            {'winner': self.fight.winner.pk, 'loser': self.fight.loser.pk, 'data': '[]'},
            format='json'
        )
        assert req.status_code == 201
        assert json.loads(req.content.decode('utf-8'))['pk'] is not None

    def test_cant_update(self):
        req = self.c.post(
            '/api/fights/%s/' % self.fight.pk,
            {'winner': self.fight.loser.pk, 'loser': self.fight.winner.pk, 'data': '[]'},
            format='json'
        )
        assert req.status_code == 405

    def test_can_list(self):
        req = self.c.get('/api/fights/', format='json')
        assert req.status_code == 200
        assert len(json.loads(req.content.decode('utf-8'))) == 1

    def test_can_retrieve(self):
        req = self.c.get('/api/fights/%s/' % self.fight.pk, format='json')
        assert req.status_code == 200

    def test_data_is_nested_for_player(self):
        req = self.c.get('/api/fights/%s/' % self.fight.pk, format='json')
        assert isinstance(
            json.loads(req.content.decode('utf-8'))['winner_data'],
            dict)

    def test_get_fight_data(self):
        req = self.c.get('/api/fights/%s/get_fight_data/?uuid=%s' % (
            self.fight.pk, self.fight.uuid), format='json')
        rep = json.loads(req.content.decode('utf-8'))
        assert isinstance(rep, dict)
        assert rep != []

    def test_get_fight_data_wrong_pk(self):
        req = self.c.get('/api/fights/%s/get_fight_data/?uuid=%s' % (
            self.fight.pk, 0000), format='json')
        rep = json.loads(req.content.decode('utf-8'))
        assert isinstance(rep, dict)
        assert rep == {}
