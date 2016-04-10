# PYTHON
import json
from uuid import uuid4

# DJANGO
from django.http import JsonResponse

# THIRD PARTY APPS
from rest_framework import mixins, viewsets
from rest_framework.decorators import detail_route

# OUR WEBAPP
from .models import Fight
from .serializers import FightSerializer


class FightViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = FightSerializer

    def get_queryset(self):
        return Fight.objects.all()

    def perform_create(self, serializer):
        serializer.save(uuid=uuid4())

    @detail_route(methods=['GET'])
    def get_fight_data(self, request, pk):
        try:
            fight_obj = Fight.objects.get(uuid=request.GET.get('uuid'))
            fight_data_json = fight_obj.data
            fight_data = json.loads(fight_data_json)
        except:
            fight_data = {}

        return JsonResponse(fight_data)
