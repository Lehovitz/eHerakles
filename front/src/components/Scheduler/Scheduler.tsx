import * as React from "react";
import { ViewState } from "@devexpress/dx-react-scheduler";
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
  Resources,
  DragDropProvider,
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
import EventsFilter from "./EventsFilter/EventsFilter";
import { Hidden } from "@material-ui/core";

type LastIndex = {
  lastIndex: number;
};

type Category = {
  id: number;
  name: string;
  goal: string;
};

type EventBack = {
  title: string;
  dateStart: string;
  dateEnd: string;
  trainerId: number;
  isAllDay?: boolean;
  description?: string;
  goal: string;
  isAccepted: boolean;
  categoryId: number;
  roomId: number;
  rule?: string;
  exDate?: string;
  capacity: number;
  identifier: number;
  customers: string[];
};

export type EventFront = {
  title: string;
  id: number;
  startDate: Date;
  endDate: Date;
  trainerId: number;
  allDay?: boolean;
  categoryId: number;
  notes?: string;
  isAccepted: boolean;
  goal: string;
  roomId: number;
  rRule?: string;
  exDate?: string;
  capacity: number;
  customers: string[];
  capacityId: number;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState("All");
  const [filteredData, setFilteredData] = useState<EventFront[]>([]);
  const [userGoal, setUserGoal] = useState<string>("Fit");
  const bearerToken = useSelector((state: RootState) => state.token),
    decodedToken: DecodedToken | undefined =
      bearerToken.token.length > 0 ? jwtDecode(bearerToken.token) : undefined,
    role = decodedToken?.role ?? "",
    email = decodedToken?.email ?? "";

  const resources = [
    {
      fieldName: "capacityId",
      title: "Capacity",
      instances: [
        {
          id: 1,
          text: "A lot of places left",
          color: "green",
        },
        {
          id: 2,
          text: "Less than a half places left",
          color: "#e57e00",
        },
        {
          id: 3,
          text: "Full",
          color: "#c40000",
        },
      ],
    },
    {
      fieldName: "categoryId",
      title: "Category",
      instances: categories.map((category) => ({
        id: category.id,
        // TODO:: zmienić category.goal na pełną nazwę
        text: `${category.name} - ${category.goal}`,
        color: "lightgrey",
      })),
    },
    {
      fieldName: "roomId",
      title: "Room",
      instances: rooms.map((room) => ({
        id: room.id,
        text: `${room.roomNumber} - ${room.roomName}`,
        color: "lightgrey",
      })),
    },
    {
      fieldName: "trainerId",
      title: "Trainer",
      instances: trainers.map((trainer) => ({
        id: trainer.id,
        text: `${trainer.name} ${trainer.surname}`,
        color: "lightgrey",
      })),
    },
  ];

  useEffect(() => {
    (async () => {
      const res: Category[] = await fetch(
        `http://localhost:5000/categories`
      ).then((res) => res.json());
      setCategories(res);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res: { goal: string } = await fetch(
        `http://localhost:5000/customers/goal/${email}`
      ).then((res) => res.json());
      setUserGoal(res.goal);
    })();
  }, []);

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
        let capacityId = 1;
        const customersCount = event.customers.length,
          capacity = event.capacity;

        if (customersCount === capacity) capacityId = 3;
        else if (customersCount > capacity / 2) capacityId = 2;

        const eventFront: EventFront = {
          id: event.identifier,
          title: event.title,
          startDate: new Date(Date.parse(event.dateStart)),
          endDate: new Date(Date.parse(event.dateEnd)),
          trainerId: event.trainerId,
          allDay: event.isAllDay,
          notes: event.description,
          roomId: event.roomId,
          isAccepted: event.isAccepted,
          categoryId: event.categoryId,
          rRule: event.rule,
          exDate: event.exDate,
          goal: event.goal,
          capacity: event.capacity,
          customers: event.customers,
          capacityId,
        };
        events.push(eventFront);
      }

      setData(events);
      setFilteredData(
        events.filter((event) => event.isAccepted || role !== "customer")
      );
    })();
  }, []);

  useEffect(() => {
    switch (filter) {
      case "All":
        setFilteredData(
          data.filter((event) => event.isAccepted || role !== "customer")
        );
        break;
      case "My events":
        setFilteredData(
          data
            .filter((event) => event.customers.includes(email))
            .filter((event) => event.isAccepted || role !== "customer")
        );
        break;
      case "Recommended":
        setFilteredData(
          data
            .filter((event) => event.goal === userGoal)
            .filter((event) => event.isAccepted || role !== "customer")
        );
        break;
    }
  }, [data, filter]);

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
    <Paper style={{ height: "calc(100% - 56px)" }}>
      <Scheduler data={filteredData}>
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
        {role === "customer" ? (
          <Toolbar
            flexibleSpaceComponent={() => (
              <EventsFilter selectedFilter={filter} changeFilter={setFilter} />
            )}
          />
        ) : (
          <Toolbar />
        )}
        <ViewSwitcher />
        <DateNavigator />
        <Hidden xsDown>
          <TodayButton />
        </Hidden>
        <Appointments />
        {["trainer", "moderator", "admin"].includes(role) ? (
          <AppointmentTooltip showOpenButton showDeleteButton />
        ) : (
          <AppointmentTooltip
            headerComponent={(props) => (
              <Header data={data} setData={setData} {...props} />
            )}
          />
        )}
        {["trainer", "moderator", "admin"].includes(role) && (
          <AppointmentForm />
        )}
        <Resources
          data={resources}
          palette={[]}
          mainResourceName="capacityId"
        />
        {["trainer", "moderator", "admin"].includes(role) && (
          <DragDropProvider />
        )}
      </Scheduler>
    </Paper>
  );
};

export default SchedulerComponent;
