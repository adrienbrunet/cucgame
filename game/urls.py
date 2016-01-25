# coding: utf-8

# Copyright Luna Technology 2016


from django.conf.urls import url

from . import views


urlpatterns = [
    url(r'^$', views.Root.as_view(), name='home'),
    url(r'^results/$', views.ListPlayer.as_view(), name='results'),
]
