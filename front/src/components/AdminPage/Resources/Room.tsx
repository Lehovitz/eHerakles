import * as React from "react";
import { MeetingRoom } from "@material-ui/icons";
import {
  Create,
  CreateProps,
  Datagrid,
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

export const RoomIcon = MeetingRoom;

export const RoomList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="roomName" />
        <NumberField source="roomNumber" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export const RoomShow = (props: ShowProps) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="roomName" />
        <NumberField source="roomNumber" />
      </SimpleShowLayout>
    </Show>
  );
};

const RoomTitle = ({ record }: TitleProps) => {
  return (
    <span>Room {record && `${record.roomNumber} - ${record.roomName}`}</span>
  );
};

export const RoomEdit = (props: EditProps) => {
  return (
    <Edit title={<RoomTitle />} {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="roomName" />
        <NumberInput source="roomNumber" />
      </SimpleForm>
    </Edit>
  );
};

export const RoomCreate = (props: CreateProps) => {
  return (
    <Create title="Create a Room" {...props}>
      <SimpleForm>
        <TextInput source="roomName" />
        <NumberInput source="roomNumber" />
      </SimpleForm>
    </Create>
  );
};
