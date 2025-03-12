import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { PlusCircle, Calendar as CalendarIcon, Clock } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  description?: string;
}

const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Quarterly Sales Meeting",
    date: new Date(2024, 6, 15),
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    location: "Main Conference Room",
    category: "Meeting",
    description: "Review Q2 sales performance and discuss Q3 targets",
  },
  {
    id: "2",
    title: "New Product Training",
    date: new Date(2024, 6, 18),
    startTime: "2:00 PM",
    endTime: "4:00 PM",
    location: "Training Room B",
    category: "Training",
    description: "Introduction to the new cyber insurance product line",
  },
  {
    id: "3",
    title: "Team Building Event",
    date: new Date(2024, 6, 22),
    startTime: "1:00 PM",
    endTime: "5:00 PM",
    location: "City Park",
    category: "Social",
    description: "Annual team building activity with outdoor games",
  },
  {
    id: "4",
    title: "Compliance Webinar",
    date: new Date(2024, 6, 25),
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    location: "Online",
    category: "Webinar",
    description: "Updates on regulatory changes affecting insurance sales",
  },
  {
    id: "5",
    title: "Marketing Strategy Session",
    date: new Date(2024, 6, 28),
    startTime: "9:00 AM",
    endTime: "12:00 PM",
    location: "Conference Room A",
    category: "Meeting",
    description: "Planning for Q4 marketing campaigns",
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Meeting":
      return "bg-blue-100 text-blue-800";
    case "Training":
      return "bg-green-100 text-green-800";
    case "Social":
      return "bg-purple-100 text-purple-800";
    case "Webinar":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Get events for the selected date
  const eventsForSelectedDate = date
    ? MOCK_EVENTS.filter(
        (event) =>
          event.date.getDate() === date.getDate() &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear(),
      )
    : [];

  // Get dates with events for highlighting in the calendar
  const datesWithEvents = MOCK_EVENTS.map((event) => event.date);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                event: datesWithEvents,
              }}
              modifiersStyles={{
                event: {
                  fontWeight: "bold",
                  backgroundColor: "var(--primary-50)",
                  color: "var(--primary-900)",
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsForSelectedDate.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <p className="mt-4 text-muted-foreground">
                  No events scheduled for this day.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {eventsForSelectedDate.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 border rounded-md hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.location}
                        </p>
                      </div>
                      <Badge
                        className={getCategoryColor(event.category)}
                        variant="outline"
                      >
                        {event.category}
                      </Badge>
                    </div>
                    {selectedEvent?.id === event.id && event.description && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm">{event.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
