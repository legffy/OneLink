from core.models import Reservation, Room, Building
def reset_data():
    Reservation.objects.all().delete()
    Room.objects.all().delete()
    Building.objects.all().delete()
