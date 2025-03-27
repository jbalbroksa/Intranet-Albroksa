import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { es } from "date-fns/locale";
import { format, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Edit,
  Trash,
  Calendar as CalendarIcon,
} from "lucide-react";
import EventDialog from "./EventDialog";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  category: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export default function CalendarView() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<
    CalendarEvent | undefined
  >();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (date && events.length > 0) {
      const eventsForDate = events.filter((event) => {
        // Ensure event_date is properly parsed as a date
        if (!event.event_date) return false;
        const eventDate = new Date(event.event_date);
        return isSameDay(eventDate, date);
      });
      setFilteredEvents(eventsForDate);
    } else {
      setFilteredEvents([]);
    }
  }, [date, events]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(undefined);
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEventToDelete(eventId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", eventToDelete);

      if (error) throw error;

      setEvents(events.filter((event) => event.id !== eventToDelete));
      toast({
        title: "Evento eliminado",
        description: "El evento ha sido eliminado correctamente",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el evento",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Calendario</h1>
        <Button onClick={handleCreateEvent}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Evento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendario de Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-[350px]">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={es}
                className="rounded-md border"
              />
            </div>
            <div className="flex-1">
              {date ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {date.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  {isLoading ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Cargando eventos...
                      </p>
                    </div>
                  ) : filteredEvents.length > 0 ? (
                    <div className="space-y-3">
                      {filteredEvents.map((event) => (
                        <Card key={event.id} className="overflow-hidden">
                          <div className="p-4 border-l-4 border-primary">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{event.title}</h4>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  <span>
                                    {event.start_time} - {event.end_time}
                                  </span>
                                  {event.location && (
                                    <span className="ml-2">
                                      | {event.location}
                                    </span>
                                  )}
                                </div>
                                {event.description && (
                                  <p className="text-sm mt-2">
                                    {event.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditEvent(event)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteEvent(event.id)}
                                >
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        No hay eventos programados para este día.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={handleCreateEvent}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Añadir Evento
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Seleccione una fecha para ver los eventos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <EventDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        event={selectedEvent}
        onEventSaved={fetchEvents}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El evento será eliminado
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteEvent}
              className="bg-destructive text-destructive-foreground"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
