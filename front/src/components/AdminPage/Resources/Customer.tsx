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
  NumberField,
} from "react-admin";

const genderChoices = [
  { id: "M", name: "Male" },
  { id: "F", name: "Female" },
  { id: "O", name: "Other" },
];

const docTypeChoices = [
  { id: "Passport", name: "Passport" },
  { id: "IdCard", name: "IdCard" },
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
        <SelectField choices={genderChoices} source="gender" />
        <SelectField choices={docTypeChoices} source="docType" />
        <DateField source="birthDate" />
        <TextField source="phoneNum" />
        <TextField source="pesel" />
        <TextField source="docNumber" />
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
        <SelectInput choices={genderChoices} source="gender" />
        <SelectInput choices={docTypeChoices} source="docType" />
        <DateInput source="birthDate" />
        <TextInput source="phoneNum" />
        <TextInput source="pesel" />
        <TextInput source="docNumber" />
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
        <TextInput source="surname" />
        <SelectInput choices={genderChoices} source="gender" />
        <SelectInput choices={docTypeChoices} source="docType" />
        <DateInput source="birthDate" />
        <TextInput source="phoneNum" />
        <TextInput source="pesel" />
        <TextInput source="docNumber" />
        <TextInput source="address" />
        <TextInput source="country" />
        <TextInput source="city" />
        <TextInput source="postalCode" />
      </SimpleForm>
    </Create>
  );
};
