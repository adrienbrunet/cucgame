from django.views.generic import ListView, TemplateView

from .models import Player


class Root(TemplateView):
    template_name = "home.html"


class ListPlayer(ListView):
    model = Player


class Rules(TemplateView):
    template_name = "rules.html"
