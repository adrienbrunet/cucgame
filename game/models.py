from django.db import models

from .managers import FightManager


class Fight(models.Model):
    '''
    we store in this model what happens in the fight in a jsonField.
    A uuid is used to store/retrieve the fights
    '''
    uuid = models.CharField(max_length=255, unique=True)
    data = models.TextField()
    winner = models.ForeignKey('Player', related_name='fights_won')
    loser = models.ForeignKey('Player', related_name='fights_lost')

    objects = FightManager()

    def __str__(self):
        return "Fight {uuid}: {winner} vs {loser}".format(
            uuid=self.uuid,
            winner=self.winner.name,
            loser=self.loser.name)


class Player(models.Model):
    '''
    Most of the player data are store in angular in the client.
    We keep here the elo score of the player. Default: 1000
    '''
    elo_score = models.IntegerField(default=1000)
    name = models.CharField(max_length=255)

    class Meta:
        ordering = ['-elo_score']

    def __str__(self):
        return self.name
