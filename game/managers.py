from django.db import models


class SelectRelatedManager(models.Manager):
    use_for_related_fields = True

    def get_queryset(self):
        if hasattr(self, 'related_fields'):
            return super().get_queryset().select_related(*self.related_fields)
        else:
            return super().get_queryset().select_related()


class FightManager(SelectRelatedManager):
    related_fields = ['winner', 'loser']
