# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-01 23:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_auto_20160124_2019'),
    ]

    operations = [
        migrations.AddField(
            model_name='fight',
            name='date',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
