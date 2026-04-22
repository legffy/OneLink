from rest_framework import serializers

from .models import Building, Group, Reservation, Room


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = "__all__"


class DailyEventSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    room_name = serializers.CharField()
    room_code = serializers.CharField(allow_blank=True)
    event_name = serializers.CharField()
    group_name = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    is_all_day = serializers.BooleanField()
    status = serializers.CharField(allow_blank=True, allow_null=True, required=False)


class ScheduleWindowSerializer(serializers.Serializer):
    start_date = serializers.DateField(allow_null=True)
    end_date = serializers.DateField(allow_null=True)


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = "__all__"




class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"




class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = "__all__"

