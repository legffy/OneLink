from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Building, Room, Reservation, Group, BuildingHours

admin.site.register(Building)
admin.site.register(Room)
admin.site.register(Reservation)
admin.site.register(Group)
admin.site.register(BuildingHours)