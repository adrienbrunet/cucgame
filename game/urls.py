from django.conf.urls import url, include

from rest_framework.routers import DefaultRouter

from . import api, views


router = DefaultRouter()
router.register(r'fights', api.FightViewSet, base_name='fight')


urlpatterns = [
    url(r'^$', views.Root.as_view(), name='home'),
    url(r'^results/$', views.ListPlayer.as_view(), name='results'),
    url(r'^rules/$', views.Rules.as_view(), name='rules'),

    url(r'^api/', include(router.urls))
]
