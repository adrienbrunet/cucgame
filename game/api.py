# PYTHON
from uuid import uuid4

# THIRD PARTY APPS
from rest_framework import mixins, viewsets

# OUR WEBAPP
from .models import Fight
from .serializers import FightSerializer


class FightViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = FightSerializer

    def get_queryset(self):
        return Fight.objects.all()

    def perform_create(self, serializer):
        serializer.save(uuid=uuid4())
