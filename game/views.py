from django.views.generic import TemplateView, ListView

from .models import Player


class Root(TemplateView):
    template_name = "home.html"


class ListPlayer(ListView):
    model = Player
