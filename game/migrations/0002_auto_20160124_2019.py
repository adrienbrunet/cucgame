# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-01-24 20:19
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='fight',
            name='player_1',
        ),
        migrations.RemoveField(
            model_name='fight',
            name='player_2',
        ),
        migrations.AddField(
            model_name='fight',
            name='loser',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='fights_lost', to='game.Player'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='fight',
            name='winner',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='fights_won', to='game.Player'),
            preserve_default=False,
        ),
    ]