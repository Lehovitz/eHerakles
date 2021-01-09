import * as React from "react";
import { Person } from "@material-ui/icons";
import {
  Create,
  CreateProps,
  Datagrid,
  DateField,
  DateInput,
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
  SelectInput,
  SelectField,
} from "react-admin";

const goalChoices = [
  { id: "M", name: "Gain muscle" },
  { id: "Fit", name: "Get fit" },
  { id: "Rd", name: "Reduce weight" },
  { id: "Rel", name: "Relaxation" },
];

const genderChoices = [
  { id: "M", name: "Male" },
  { id: "F", name: "Female" },
  { id: "O", name: "Other" },
];

export const CustomerIcon = Person;

export const CustomerList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="email" />
        <TextField source="name" />
        <TextField source="surname" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export const CustomerShow = (props: ShowProps) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="email" />
        <TextField source="name" />
        <TextField source="surname" />
        <SelectField choices={goalChoices} source="goal" />
        <SelectField choices={genderChoices} source="gender" />
        <DateField source="birthDate" />
        <TextField source="phoneNum" />
        <TextField source="pesel" />
        <TextField source="address" />
        <TextField source="country" />
        <TextField source="city" />
        <TextField source="postalCode" />
      </SimpleShowLayout>
    </Show>
  );
};

const CustomerTitle = ({ record }: TitleProps) => {
  return <span>Customer {record && `${record.name} ${record.surname}`}</span>;
};

export const CustomerEdit = (props: EditProps) => {
  return (
    <Edit title={<CustomerTitle />} {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="email" />
        <TextInput source="name" />
        <TextInput source="surname" />
        <SelectInput choices={goalChoices} source="goal" />
        <SelectInput choices={genderChoices} source="gender" />
        <DateInput source="birthDate" />
        <TextInput source="phoneNum" />
        <TextInput source="pesel" />
        <TextInput source="address" />
        <TextInput source="country" />
        <TextInput source="city" />
        <TextInput source="postalCode" />
      </SimpleForm>
    </Edit>
  );
};

export const CustomerCreate = (props: CreateProps) => {
  return (
    <Create title="Create a Customer" {...props}>
      <SimpleForm>
        <TextInput source="email" />
        <TextInput source="password" />
        <TextInput source="name" />
        <TextInput source="surname" />{" "}
        <SelectInput choices={goalChoices} source="goal" />
        <SelectInput choices={genderChoices} source="gender" />
        <DateInput source="birthDate" />
        <TextInput source="phoneNum" />
        <TextInput source="pesel" />
        <TextInput source="address" />
        <TextInput source="country" />
        <TextInput source="city" />
        <TextInput source="postalCode" />
      </SimpleForm>
    </Create>
  );
};
