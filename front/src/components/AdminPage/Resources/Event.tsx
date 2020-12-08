import * as React from "react";
import { Event } from "@material-ui/icons";
import {
  BooleanField,
  BooleanInput,
  Create,
  CreateProps,
  Datagrid,
  DateField,
  DateInput,
  DateTimeInput,
  Edit,
  EditButton,
  EditProps,
  List,
  ListProps,
  NumberField,
  NumberInput,
  Show,
  ShowButton,
  ShowProps,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  TitleProps,
} from "react-admin";

export const EventIcon = Event;

export const EventList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <NumberField source="identifier" />
        <TextField source="title" />
        <NumberField source="capacity" />
        <DateField source="dateStart" />
        <DateField source="dateEnd" />
        <BooleanField source="isAllDay" />
        <TextField source="exDate" />
        <TextField source="rule" />
        <TextField source="description" />
        <NumberField source="trainerId" />
        <NumberField source="roomId" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export const EventShow = (props: ShowProps) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <NumberField source="identifier" />
        <TextField source="title" />
        <NumberField source="capacity" />
        <DateField source="dateStart" />
        <DateField source="dateEnd" />
        <BooleanField source="isAllDay" />
        <TextField source="exDate" />
        <TextField source="rule" />
        <TextField source="description" />
        <NumberField source="trainerId" />
        <NumberField source="roomId" />
      </SimpleShowLayout>
    </Show>
  );
};

const EventTitle = ({ record }: TitleProps) => {
  return (
    <span>
      Event{" "}
      {record
        ? `${record.title} - ${new Date(record.dateStart).toString()}`
        : ""}
    </span>
  );
};

export const EventEdit = (props: EditProps) => {
  return (
    <Edit title={<EventTitle />} {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <NumberInput source="identifier" />
        <TextInput source="title" />
        <NumberInput source="capacity" />
        <DateTimeInput source="dateStart" />
        <DateTimeInput source="dateEnd" />
        <BooleanInput source="isAllDay" />
        <TextInput source="exDate" />
        <TextInput source="rule" />
        <TextInput source="description" />
        <NumberInput source="trainerId" />
        <NumberInput source="roomId" />
      </SimpleForm>
    </Edit>
  );
};

export const EventCreate = (props: CreateProps) => {
  return (
    <Create title="Create an Event" {...props}>
      <SimpleForm>
        <NumberInput source="identifier" />
        <TextInput source="title" />
        <NumberInput source="capacity" />
        <DateTimeInput source="startDate" />
        <DateTimeInput source="endDate" />
        <BooleanInput source="allDay" />
        <TextInput source="exDate" />
        <TextInput source="rRule" />
        <TextInput source="notes" />
        <NumberInput source="trainerId" />
        <NumberInput source="roomId" />
      </SimpleForm>
    </Create>
  );
};
