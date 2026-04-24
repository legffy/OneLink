"use client";

import Image from "next/image";
import Link from "next/link";
import {
  notFound,
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { getBuildingById, getBuildingBySlug } from "../../data/buildings";
import type {
  ApiBuilding,
  ApiBuildingDailyEvent,
  ApiScheduleState,
  ApiScheduleWindow,
  Building,
} from "../../data/buildings";

type BuildingViewModel = {
  name: string;
  campus: string;
  description: string;
  image: string;
  location: string;
  hours: string[];
  highlights: string[];
  facilities: string[];
  selectedDate: string;
  scheduleState: ApiScheduleState;
  scheduleWindow: ApiScheduleWindow;
  dailyEvents: ApiBuildingDailyEvent[];
};

const NEW_YORK_TIMEZONE = "America/New_York";
const HERO_IMAGE_SIZES = "(max-width: 1024px) calc(100vw - 3rem), 700px";
const EMPTY_SCHEDULE_WINDOW: ApiScheduleWindow = {
  start_date: null,
  end_date: null,
};

function getTodayInNewYork(): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: NEW_YORK_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

function isValidDateParam(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function sanitizeDateParam(value: string | null): string {
  return isValidDateParam(value) ? value : getTodayInNewYork();
}

function getCalendarDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function formatDisplayDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: NEW_YORK_TIMEZONE,
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(getCalendarDate(value));
}

function formatEventTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: NEW_YORK_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatEventRange(event: ApiBuildingDailyEvent): string {
  if (event.is_all_day) {
    return "All day";
  }

  return `${formatEventTime(event.start_time)} - ${formatEventTime(event.end_time)}`;
}

function buildFallbackView(building: Building, selectedDate: string): BuildingViewModel {
  return {
    name: building.name,
    campus: building.abbreviation,
    description: building.description,
    image: building.image,
    location: building.location,
    hours: building.hours,
    highlights: building.highlights,
    facilities: building.facilities,
    selectedDate,
    scheduleState: "empty",
    scheduleWindow: EMPTY_SCHEDULE_WINDOW,
    dailyEvents: [],
  };
}

function buildApiView(
  building: ApiBuilding,
  selectedDate: string,
  fallback?: Building,
): BuildingViewModel {
  return {
    name: building.name,
    campus: building.campus,
    description: building.description || fallback?.description || "Building details will be added soon.",
    image: building.image_url || fallback?.image || "/mueller.jpg",
    location: building.address || fallback?.location || "Address will be added soon.",
    hours: fallback?.hours || ["Hours not available yet."],
    highlights: fallback?.highlights || ["Campus access", "Shared academic spaces", "Daily student use"],
    facilities: fallback?.facilities || ["Entry access", "Shared seating", "Wayfinding support"],
    selectedDate: building.selected_date || selectedDate,
    scheduleState: building.schedule_state || "empty",
    scheduleWindow: building.schedule_window || EMPTY_SCHEDULE_WINDOW,
    dailyEvents: building.daily_events || [],
  };
}

function buildScheduleSummary(building: BuildingViewModel): string {
  if (building.scheduleState === "available") {
    return `Reservations scheduled for ${formatDisplayDate(building.selectedDate)}. Times are shown in Eastern Time.`;
  }

  if (building.scheduleState === "out_of_range") {
    if (building.scheduleWindow.start_date && building.scheduleWindow.end_date) {
      return `Reservation data is currently available from ${formatDisplayDate(building.scheduleWindow.start_date)} to ${formatDisplayDate(building.scheduleWindow.end_date)}.`;
    }

    return "Reservation data is not available for the selected date yet.";
  }

  return `No reservations scheduled for ${formatDisplayDate(building.selectedDate)}.`;
}

function buildScheduleBadge(building: BuildingViewModel): string {
  if (building.scheduleState === "available") {
    return `${building.dailyEvents.length} event${building.dailyEvents.length === 1 ? "" : "s"}`;
  }

  if (building.scheduleState === "out_of_range") {
    return "Out of range";
  }

  return "No events";
}

export default function BuildingPage() {
  const params = useParams<{ name: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeValue = params?.name;
  const requestedDate = searchParams.get("date");
  const sanitizedDate = sanitizeDateParam(requestedDate);
  const fallbackBuilding = routeValue ? getBuildingBySlug(routeValue) : undefined;
  const hasRouteValue = Boolean(routeValue);
  const [building, setBuilding] = useState<BuildingViewModel | null>(
    fallbackBuilding ? buildFallbackView(fallbackBuilding, sanitizedDate) : null,
  );
  const [isLoading, setIsLoading] = useState(hasRouteValue && !fallbackBuilding);
  const [hasResolved, setHasResolved] = useState(!hasRouteValue || Boolean(fallbackBuilding));

  useEffect(() => {
    if (pathname && requestedDate !== sanitizedDate) {
      router.replace(`${pathname}?date=${sanitizedDate}`, { scroll: false });
    }
  }, [pathname, requestedDate, router, sanitizedDate]);

  useEffect(() => {
    let ignore = false;
    const resolveBuilding = (nextBuilding: BuildingViewModel | null) => {
      Promise.resolve().then(() => {
        if (ignore) {
          return;
        }

        setBuilding(nextBuilding);
        setIsLoading(false);
        setHasResolved(true);
      });
    };

    if (!routeValue) {
      resolveBuilding(null);
      return () => {
        ignore = true;
      };
    }

    const fallback = getBuildingBySlug(routeValue);

    if (fallback) {
      resolveBuilding(buildFallbackView(fallback, sanitizedDate));
      return () => {
        ignore = true;
      };
    }

    Promise.resolve().then(() => {
      if (ignore) {
        return;
      }

      setIsLoading(true);
      setHasResolved(false);
    });

    getBuildingById(routeValue, sanitizedDate).then((data) => {
      if (ignore) {
        return;
      }

      if (data) {
        const matchedFallback = getBuildingBySlug(data.slug);
        setBuilding(buildApiView(data, sanitizedDate, matchedFallback));
      } else {
        setBuilding(null);
      }

      setIsLoading(false);
      setHasResolved(true);
    });

    return () => {
      ignore = true;
    };
  }, [routeValue, sanitizedDate]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(200,16,46,0.16),transparent_30%),linear-gradient(180deg,#14080a_0%,#1f1115_18%,#f7f3ef_18%,#ffffff_100%)] px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-10 w-48 rounded-full bg-white/20" />
          <div className="h-[420px] rounded-[36px] bg-white/10" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-64 rounded-[28px] bg-white/70" />
            <div className="h-64 rounded-[28px] bg-white/70" />
          </div>
        </div>
      </main>
    );
  }

  if (!building && hasResolved) {
    notFound();
  }

  if (!building) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(200,16,46,0.16),transparent_30%),linear-gradient(180deg,#14080a_0%,#1f1115_18%,#f7f3ef_18%,#ffffff_100%)] px-6 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/buildings"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-black/30"
        >
          {"< Back to buildings"}
        </Link>

        <section className="mt-6 overflow-hidden rounded-[36px] border border-white/10 bg-zinc-950 text-white shadow-[0_40px_100px_-45px_rgba(0,0,0,0.75)]">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative min-h-[360px] bg-zinc-900">
              <Image
                src={building.image}
                alt={building.name}
                fill
                priority
                sizes={HERO_IMAGE_SIZES}
                quality={88}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300">
                  {building.campus}
                </p>
                <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  {building.name}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/80">
                  {building.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 sm:p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/45">Overview</p>
                <p className="mt-4 text-base leading-7 text-white/80">{building.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Highlights</p>
                  <p className="mt-2 text-2xl font-semibold">{building.highlights.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Hours</p>
                  <p className="mt-2 text-2xl font-semibold">{building.hours.length}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/55">
                    posted schedule lines
                  </p>
                </div>
                <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Location</p>
                  <p className="mt-2 text-sm font-semibold leading-6">{building.location}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-700">
              Building highlights
            </p>
            <div className="mt-5 space-y-3">
              {building.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl border border-red-100 bg-red-50/70 px-4 py-3 text-sm font-medium text-zinc-800"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-zinc-200 bg-[linear-gradient(180deg,#fff7f2_0%,#ffffff_100%)] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-700">
              Hours of operation
            </p>
            <div className="mt-5 space-y-3">
              {building.hours.map((hoursLine) => (
                <div
                  key={hoursLine}
                  className="rounded-2xl border border-red-100 bg-white px-4 py-3 text-sm font-medium leading-6 text-zinc-800"
                >
                  {hoursLine}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#f6f8fb_100%)] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
              What you&apos;ll find here
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {building.facilities.map((facility) => (
                <div
                  key={facility}
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm font-medium text-zinc-700"
                >
                  {facility}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8f4ef_100%)] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
          <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-700">
                Daily events
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                Building schedule timeline
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                {buildScheduleSummary(building)}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Select date
                </span>
                <input
                  type="date"
                  value={building.selectedDate}
                  min={building.scheduleWindow.start_date ?? undefined}
                  max={building.scheduleWindow.end_date ?? undefined}
                  onChange={(event) => {
                    if (!event.target.value || !pathname) {
                      return;
                    }

                    const nextDate = sanitizeDateParam(event.target.value);
                    setBuilding((currentBuilding) =>
                      currentBuilding
                        ? {
                            ...currentBuilding,
                            selectedDate: nextDate,
                          }
                        : currentBuilding,
                    );
                    router.replace(`${pathname}?date=${nextDate}`, {
                      scroll: false,
                    });
                  }}
                  className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </label>
              <div className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                {buildScheduleBadge(building)}
              </div>
            </div>
          </div>

          {building.scheduleState === "available" ? (
            <div className="mt-6 space-y-4">
              {building.dailyEvents.map((event) => (
                <div
                  key={event.id}
                  className="grid gap-4 rounded-[24px] border border-zinc-200 bg-white/90 p-5 md:grid-cols-[180px_1fr]"
                >
                  <div className="rounded-2xl bg-zinc-950 px-4 py-4 text-white">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">Time</p>
                    <p className="mt-3 text-lg font-semibold">
                      {event.is_all_day ? "All day" : formatEventTime(event.start_time)}
                    </p>
                    <p className="text-sm text-white/65">
                      {event.is_all_day ? formatDisplayDate(building.selectedDate) : `to ${formatEventTime(event.end_time)}`}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-700">
                        {event.room_name}
                      </span>
                      {event.room_code ? (
                        <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-700">
                          {event.room_code}
                        </span>
                      ) : null}
                      {event.status ? (
                        <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                          {event.status}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-3 text-lg font-semibold text-zinc-950">{event.event_name}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      {event.group_name ? `${event.group_name} - ` : ""}
                      {formatEventRange(event)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[24px] border border-dashed border-zinc-300 bg-white/80 p-6">
              <p className="text-lg font-semibold text-zinc-950">
                {building.scheduleState === "out_of_range"
                  ? "Selected date is outside the available reservation window."
                  : `No reservations scheduled for ${formatDisplayDate(building.selectedDate)}.`}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                {building.scheduleState === "out_of_range" &&
                building.scheduleWindow.start_date &&
                building.scheduleWindow.end_date
                  ? `Try a date between ${formatDisplayDate(building.scheduleWindow.start_date)} and ${formatDisplayDate(building.scheduleWindow.end_date)}.`
                  : "If a room in this building is reserved for the selected day, it will appear here with the room, event name, and time."}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
