import * as React from "react";
import { EventAvailable } from "@material-ui/icons";
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

export const SubscriptionIcon = EventAvailable;

export const SubscriptionList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <NumberField source="cost" />
        <NumberField source="period" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export const SubscriptionShow = (props: ShowProps) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="name" />
        <NumberField source="cost" />
        <NumberField source="period" />
      </SimpleShowLayout>
    </Show>
  );
};

const SubscriptionTitle = ({ record }: TitleProps) => {
  return (
    <span>Subscription {record && `${record.cost} - ${record.name}`}</span>
  );
};

export const SubscriptionEdit = (props: EditProps) => {
  return (
    <Edit title={<SubscriptionTitle />} {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="name" />
        <NumberInput source="cost" />
        <NumberInput source="period" />
      </SimpleForm>
    </Edit>
  );
};

export const SubscriptionCreate = (props: CreateProps) => {
  return (
    <Create title="Create a Subscription" {...props}>
      <SimpleForm>
        <TextInput source="name" />
        <NumberInput source="cost" />
        <NumberInput source="period" />
      </SimpleForm>
    </Create>
  );
};
