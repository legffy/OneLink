from rest_framework import generics

from .models import Building, Group, Reservation, Room
from .serializers import BuildingSerializer, GroupSerializer, ReservationSerializer, RoomSerializer


class BuildingView(generics.ListAPIView):
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GroupView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class ReservationView(generics.ListAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

