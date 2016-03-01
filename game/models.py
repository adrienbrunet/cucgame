from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from .elo import get_new_scores
from .managers import FightManager


class Fight(models.Model):
    """
    We store in this model what happens in the fight in a jsonField.
    A uuid is used to store/retrieve the fights
    """
    uuid = models.CharField(max_length=255, unique=True)
    date = models.DateTimeField(auto_now_add=True, null=True)
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
    """
    Most of the player data are store in angular in the client.
    We keep here the elo score of the player. Default: 1000
    """
    elo_score = models.IntegerField(default=1000)
    name = models.CharField(max_length=255)

    class Meta:
        ordering = ['-elo_score']

    def __str__(self):
        return self.name


@receiver(post_save, sender=Fight)
def update_elo_score(sender, **kwargs):
    fight = kwargs["instance"]
    if kwargs["created"]:
        winner = fight.winner
        loser = fight.loser
        score_winner, score_loser = get_new_scores(
            winner.elo_score,
            loser.elo_score,
            1
        )
        winner.elo_score = score_winner
        loser.elo_score = score_loser
        winner.save()
        loser.save()
