from rest_framework import serializers

from .models import Fight, Player


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ('pk', 'name', 'elo_score', )


class FightSerializer(serializers.ModelSerializer):
    winner_data = PlayerSerializer(read_only=True, source='winner')
    loser_data = PlayerSerializer(read_only=True, source='loser')
    uuid = serializers.ReadOnlyField()

    class Meta:
        model = Fight
        fields = ('pk', 'uuid', 'data', 'winner', 'loser', 'winner_data', 'loser_data')
