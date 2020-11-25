import * as React from "react";
import * as ReactDOM from "react-dom";
import { Resources, ViewState } from "@devexpress/dx-react-scheduler";
import {
  DayView,
  Appointments,
  Scheduler,
  WeekView,
  AllDayPanel,
  AppointmentTooltip,
  ConfirmationDialog,
  EditRecurrenceMenu,
  AppointmentForm,
} from "@devexpress/dx-react-scheduler-material-ui";
import { Paper } from "material-ui";
import { MuiThemeProvider } from "material-ui/styles";
import { EditingState } from "@devexpress/dx-react-scheduler";
import { useEffect, useState } from "react";

const currentDate = "2018-11-01";
const trainers = [{ text: "Paris", id: 1, color: "blue" }];
const room = [{ text: "Cała sala", id: 1, color: "#212121" }];
const resources = [
  { fieldName: "roomId", title: "Room", instances: room },
  { fieldName: "trainerId", title: "Trainer", instances: trainers },
];

type LastIndex = {
  lastIndex: number;
};
type EventBack = {
  Title: string;
  id: number;
  DateStart: string;
  DateEnd: string;
  TrainerId: number;
  AllDay?: boolean;
  Notes?: string;
  RoomId: number;
  Rule?: string;
  ExDate?: string;
  Capacity: number;
  EventId: number;
};

type EventFront = {
  title: string;
  id: number;
  startDate: Date;
  endDate: Date;
  trainerId: number;
  allDay?: boolean;
  notes?: string;
  roomId: number;
  rRule?: string;
  exDate?: string;
  capacity: number;
  eventId: number;
};

const SchedulerComponent = () => {
  const [data, setData] = useState<EventFront[]>([]);
  useEffect(() => {
    (async () => {
      const res: EventBack[] = await fetch(
        `http://localhost:5000/events/`
      ).then((res) => res.json());
      const events: EventFront[] = [];
      for (let event of res) {
        console.log(event);
        const eventFront: EventFront = {
          title: event.Title,
          id: event.id,
          startDate: new Date(Date.parse(event.DateStart)),
          endDate: new Date(Date.parse(event.DateEnd)),
          trainerId: event.TrainerId,
          allDay: event.AllDay,
          notes: event.Notes,
          roomId: event.RoomId,
          rRule: event.Rule,
          exDate: event.ExDate,
          capacity: event.Capacity,
          eventId: event.EventId,
        };
        console.log(event.DateStart);

        events.push(eventFront);
      }

      setData(events);
      console.log(events);
    })();
  }, []);

  const commitChanges = async ({ added, changed, deleted }: any) => {
    let newData = [...data];

    if (added) {
      console.log(added);
      const startingAddedId: LastIndex = await fetch(
        `http://localhost:5000/events/getNextId`
      ).then((res) => res.json());

      await fetch(`http://localhost:5000/events/`, {
        method: "POST",
        body: JSON.stringify({ ...added, id: startingAddedId.lastIndex }),
        headers: { "Content-Type": "application/json" },
      });
      newData.push({ ...added, id: startingAddedId.lastIndex });
    }
    if (changed) {
      newData = data.map((appointment) =>
        changed[appointment.id]
          ? { ...appointment, ...changed[appointment.id] }
          : appointment
      );
      const changedObj = newData.find(
        (appointment) => appointment.id === +Object.keys(changed)[0]
      );
      console.log(changedObj);
      await fetch(`http://localhost:5000/events/${changedObj!.eventId}`, {
        method: "PUT",
        body: JSON.stringify(changedObj),
        headers: { "Content-Type": "application/json" },
      });
    }
    if (deleted !== undefined) {
      const deletedId = data.find((appointment) => appointment.id === deleted);
      await fetch(`http://localhost:5000/events/${deletedId!.eventId}`, {
        method: "DELETE",
      });
      newData = data.filter((appointment) => appointment.id !== deleted);
    }
    setData(newData);
  };

  return (
    <MuiThemeProvider>
      <Paper>
        <Scheduler data={data} height={660}>
          <ViewState currentDate={currentDate} />
          <EditingState onCommitChanges={commitChanges} />
          <WeekView startDayHour={9} endDayHour={17} />
          <AllDayPanel />
          <EditRecurrenceMenu />
          <ConfirmationDialog />
          <Appointments />
          <AppointmentTooltip showOpenButton showDeleteButton />
          <AppointmentForm />
          <Resources data={resources} palette={[]} mainResourceName="roomId" />
        </Scheduler>
      </Paper>
    </MuiThemeProvider>
  );
};

export default SchedulerComponent;
