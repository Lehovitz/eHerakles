import * as React from "react";
import { Resources, ViewState } from "@devexpress/dx-react-scheduler";
import {
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

const currentDate = new Date();

type LastIndex = {
  lastIndex: number;
};

type EventBack = {
  title: string;
  dateStart: string;
  dateEnd: string;
  trainerId: number;
  isAllDay?: boolean;
  description?: string;
  roomId: number;
  rule?: string;
  exDate?: string;
  capacity: number;
  identifier: number;
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
};

type Trainer = {
  id: number;
  trainerName: string;
  trainerSurname: string;
};

type Room = {
  id: number;
  roomName: string;
  roomNumber: number;
};

const SchedulerComponent = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [data, setData] = useState<EventFront[]>([]);

  const resources = [
    {
      fieldName: "roomId",
      title: "Room",
      instances: rooms.map((room) => {
        return {
          id: room.id,
          text: `${room.roomNumber} - ${room.roomName}`,
          color: "blue",
        };
      }),
    },
    {
      fieldName: "trainerId",
      title: "Trainer",
      instances: trainers.map((trainer) => {
        return {
          id: trainer.id,
          text: `${trainer.trainerName} ${trainer.trainerSurname}`,
          color: "grey",
        };
      }),
    },
  ];

  useEffect(() => {
    (async () => {
      const res: Trainer[] = await fetch(
        `http://localhost:5000/trainers/?sort=["id","ASC"]&filter={}&range=[0,100000]`
      ).then((res) => res.json());
      setTrainers(res);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res: Room[] = await fetch(
        `http://localhost:5000/rooms/?sort=["id","ASC"]&filter={}&range=[0,100000]`
      ).then((res) => res.json());
      setRooms(res);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res: EventBack[] = await fetch(
        `http://localhost:5000/events/?sort=["id","ASC"]&filter={}&range=[0,100000]`
      ).then((res) => res.json());

      const events: EventFront[] = [];
      for (let event of res) {
        const eventFront: EventFront = {
          id: event.identifier,
          title: event.title,
          startDate: new Date(Date.parse(event.dateStart)),
          endDate: new Date(Date.parse(event.dateEnd)),
          trainerId: event.trainerId,
          allDay: event.isAllDay,
          notes: event.description,
          roomId: event.roomId,
          rRule: event.rule,
          exDate: event.exDate,
          capacity: event.capacity,
        };
        events.push(eventFront);
      }

      setData(events);
    })();
  }, []);

  const commitChanges = async ({ added, changed, deleted }: any) => {
    let newData = [...data];

    if (added) {
      const startingAddedId: LastIndex = await fetch(
        `http://localhost:5000/events/getNextId`
      ).then((res) => res.json());

      await fetch(`http://localhost:5000/events/`, {
        method: "POST",
        body: JSON.stringify({
          ...added,
          identifier: startingAddedId.lastIndex,
        }),
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
      await fetch(`http://localhost:5000/events/${changedObj!.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...changedObj }),
        headers: {
          "Content-Type": "application/json",
          "X-Identifier-Type": "Identifier",
        },
      });
    }
    if (deleted !== undefined) {
      const deletedId = data.find((appointment) => appointment.id === deleted);
      await fetch(
        `http://localhost:5000/events/byIdentifier/${deletedId!.id}`,
        {
          method: "DELETE",
        }
      );
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
