# coding: utf-8

# DJANGO
from django import forms

# OUR WEBAPP
from .models import Fight


class FightForm(forms.ModelForm):
    class Meta:
        model = Fight
        fields = ('winner', 'loser', 'data')
