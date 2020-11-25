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
import { useState } from "react";

const currentDate = "2018-11-01";
const schedulerData = [
  {
    id: 0,
    startDate: new Date("2018-11-01T09:45"),
    endDate: new Date("2018-11-01T11:00"),
    title: "Meeting",
    trainerId: 1,
    capacity: 16,
    roomId: 1,
  },
  {
    id: 1,
    startDate: new Date("2018-11-01T12:00"),
    endDate: new Date("2018-11-01T13:30"),
    title: "Go to a gym",
    trainerId: 1,
    capacity: 16,
    roomId: 1,
  },
  {
    id: 2,
    startDate: new Date("2018-11-03T13:00"),
    endDate: new Date("2018-11-03T16:20"),
    title: "Kaja Godek to kurwa",
    trainerId: 1,
    capacity: 16,
    roomId: 1,
  },
];
const trainers = [{ text: "Paris", id: 1, color: "blue" }];
const room = [{ text: "Cała sala", id: 1, color: "#212121" }];
const resources = [
  { fieldName: "roomId", title: "Room", instances: room },
  { fieldName: "trainerId", title: "Trainer", instances: trainers },
];
const addedAppointment = (arg: any) => {
  console.log(arg);
};
const changeAddedAppointment = (arg: any) => {
  console.log(arg);
};
const appointmentChanges = (arg: any) => {
  console.log(arg);
};
const changeAppointmentChanges = (arg: any) => {
  console.log(arg);
};
const editingAppointment = (arg: any) => {
  console.log(arg);
};
const changeEditingAppointment = (arg: any) => {
  console.log(arg);
};

type Event = {
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

const SchedulerComponent = () => {
  const [data, setData] = useState<Event[]>(schedulerData);

  const commitChanges = async ({ added, changed, deleted }: any) => {
    let newData = [...data];

    if (added) {
      const startingAddedId =
        data.length > 0 ? data[data.length - 1].id + 1 : 0;
      newData = [...data, { id: startingAddedId, ...added }];
      console.log({ id: startingAddedId, ...added });

      await fetch(`http://localhost:5000/events/`, {
        method: "POST",
        body: JSON.stringify({ id: startingAddedId, ...added }),
        headers: { "Content-Type": "application/json" },
      });
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
        body: JSON.stringify(changed),
      });
    }
    if (deleted !== undefined) {
      const deletedId = data.find((appointment) => appointment.id === deleted);
      await fetch(`http://localhost:5000/events/${deletedId!.id}`, {
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
