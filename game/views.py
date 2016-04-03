from django.views.generic import ListView, TemplateView

from .models import Player


class Root(TemplateView):
    template_name = "game/home.html"


class ListPlayer(ListView):
    model = Player


class Rules(TemplateView):
    template_name = "game/rules.html"


class Replay(TemplateView):
    template_name = "game/replay.html"
