from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status

from .models import Building, Group, Room, Reservation
from .serializers import BuildingSerializer, ReservationSerializer, RoomSerializer, GroupSerializer


class BuildingView(APIView):
    def get(self, request: Request) -> Response:
        buildings = Building.objects.all()
        serializer = BuildingSerializer(buildings, many=True)
        return Response(serializer.data)


class BuildingDetailView(APIView):
    def get(self, request: Request, building_id: str) -> Response:
        try:
            building = Building.objects.get(id=building_id)
        except Building.DoesNotExist:
            return Response({"detail": "Building not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BuildingSerializer(building)
        return Response(serializer.data)


class RoomView(APIView):
    def get(self, request: Request) -> Response:
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)


class GroupView(APIView):
    def get(self, request: Request) -> Response:
        groups = Group.objects.all()
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)


class ReservationView(APIView):
    def get(self, request: Request) -> Response:
        reservations = Reservation.objects.all()
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)
