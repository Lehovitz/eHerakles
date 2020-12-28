import * as React from "react";
import { Resources, ViewState } from "@devexpress/dx-react-scheduler";
import {
  Appointments,
  Scheduler,
  TodayButton,
  DateNavigator,
  DayView,
  WeekView,
  AllDayPanel,
  AppointmentTooltip,
  ConfirmationDialog,
  EditRecurrenceMenu,
  AppointmentForm,
  Toolbar,
  ViewSwitcher,
} from "@devexpress/dx-react-scheduler-material-ui";
import { Paper } from "material-ui";
import { EditingState } from "@devexpress/dx-react-scheduler";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import DecodedToken from "../../models/DecodedToken";
import jwtDecode from "jwt-decode";
import Header from "./Header/Header";

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
  name: string;
  surname: string;
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
  const bearerToken = useSelector((state: RootState) => state.token),
    decodedToken: DecodedToken | undefined =
      bearerToken.token.length > 0 ? jwtDecode(bearerToken.token) : undefined,
    role = decodedToken?.role ?? "";

  const resources = [
    {
      fieldName: "roomId",
      title: "Room",
      instances: rooms.map((room) => ({
        id: room.id,
        text: `${room.roomNumber} - ${room.roomName}`,
        color: "blue",
      })),
    },
    {
      fieldName: "trainerId",
      title: "Trainer",
      instances: trainers.map((trainer) => ({
        id: trainer.id,
        text: `${trainer.name} ${trainer.surname}`,
        color: "grey",
      })),
    },
  ];

  useEffect(() => {
    (async () => {
      const res: Trainer[] = await fetch(
        `http://localhost:5000/trainers`
      ).then((res) => res.json());
      setTrainers(res);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res: Room[] = await fetch(
        `http://localhost:5000/rooms`
      ).then((res) => res.json());
      setRooms(res);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res: EventBack[] = await fetch(
        `http://localhost:5000/events`
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
    <Paper>
      <Scheduler data={data} height={660}>
        <ViewState
          defaultCurrentDate={new Date()}
          defaultCurrentViewName="Week"
        />
        <EditingState onCommitChanges={commitChanges} />
        <DayView startDayHour={9} endDayHour={17} />
        <WeekView startDayHour={9} endDayHour={17} />
        <WeekView
          name="work-week"
          displayName="Work Week"
          excludedDays={[0, 6]}
          startDayHour={9}
          endDayHour={17}
        />
        <AllDayPanel />
        <EditRecurrenceMenu />
        <ConfirmationDialog />
        <Toolbar />
        <ViewSwitcher />
        <DateNavigator />
        <TodayButton />
        <Appointments />
        {["trainer", "moderator"].includes(role) ? (
          <AppointmentTooltip showOpenButton showDeleteButton />
        ) : (
          <AppointmentTooltip headerComponent={Header} />
        )}
        {["trainer", "moderator"].includes(role) && <AppointmentForm />}
        <Resources data={resources} palette={[]} mainResourceName="roomId" />
      </Scheduler>
    </Paper>
  );
};

export default SchedulerComponent;
