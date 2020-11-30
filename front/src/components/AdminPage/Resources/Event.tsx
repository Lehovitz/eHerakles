import * as React from "react";
import { Event } from "@material-ui/icons";
import {
  BooleanField,
  Datagrid,
  DateField,
  List,
  ListProps,
  NumberField,
  TextField,
} from "react-admin";

export const EventIcon = Event;

export const EventList = (props: ListProps) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      {/* <NumberField source="identifier" />
      <TextField source="title" />
      <NumberField source="capacity" />
      <DateField source="dateStart" />
      <DateField source="dateEnd" />
      <BooleanField source="isAllDay" />
      <TextField source="exDate" />
      <TextField source="rule" />
      <TextField source="description" /> */}
    </Datagrid>
  </List>
);
