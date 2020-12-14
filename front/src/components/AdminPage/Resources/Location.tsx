import * as React from "react";
import { LocationCity } from "@material-ui/icons";
import {
  Create,
  CreateProps,
  Datagrid,
  Edit,
  EditButton,
  EditProps,
  List,
  ListProps,
  Show,
  ShowButton,
  ShowProps,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  TitleProps,
} from "react-admin";

export const LocationIcon = LocationCity;

export const LocationList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="country" />
        <TextField source="city" />
        <TextField source="postalCode" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export const LocationShow = (props: ShowProps) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="country" />
        <TextField source="city" />
        <TextField source="postalCode" />
      </SimpleShowLayout>
    </Show>
  );
};

const LocationTitle = ({ record }: TitleProps) => {
  return <span>Location {record && `${record.country} - ${record.city}`}</span>;
};

export const LocationEdit = (props: EditProps) => {
  return (
    <Edit title={<LocationTitle />} {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="country" />
        <TextInput source="city" />
        <TextInput source="postalCode" />
      </SimpleForm>
    </Edit>
  );
};

export const LocationCreate = (props: CreateProps) => {
  return (
    <Create title="Create a Location" {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="country" />
        <TextInput source="city" />
        <TextInput source="postalCode" />
      </SimpleForm>
    </Create>
  );
};
