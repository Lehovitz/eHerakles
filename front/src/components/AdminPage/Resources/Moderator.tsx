import * as React from "react";
import { VerifiedUser } from "@material-ui/icons";
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

const genderChoices = [
  { id: "M", name: "Male" },
  { id: "F", name: "Female" },
  { id: "O", name: "Other" },
];

const docTypeChoices = [
  { id: "Passport", name: "Passport" },
  { id: "IdCard", name: "IdCard" },
];

export const ModeratorIcon = VerifiedUser;

export const ModeratorList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="modMail" />
        <TextField source="name" />
        <TextField source="surname" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export const ModeratorShow = (props: ShowProps) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="modMail" />
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

const ModeratorTitle = ({ record }: TitleProps) => {
  return <span>Moderator {record && `${record.name} ${record.surname}`}</span>;
};

export const ModeratorEdit = (props: EditProps) => {
  return (
    <Edit title={<ModeratorTitle />} {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="modMail" />
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

export const ModeratorCreate = (props: CreateProps) => {
  return (
    <Create title="Create a Moderator" {...props}>
      <SimpleForm>
        <TextInput source="modMail" />
        <TextInput source="modPass" />
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
