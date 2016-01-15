from django.views.generic import TemplateView


class Root(TemplateView):
    template_name = "home.html"
