import * as React from "react";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import {
  BooleanField,
  BooleanInput,
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
  NumberField,
  NumberInput,
  ReferenceInput,
  SelectField,
  SelectInput,
  Show,
  ShowButton,
  ShowProps,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  TitleProps,
} from "react-admin";

const subChoices = [
  { id: "N", name: "None" },
  { id: "M", name: "Monthly" },
  { id: "Q", name: "Quarterly" },
  { id: "S", name: "Semestral" },
  { id: "Y", name: "Yearly" },
];

export const CardIcon = CreditCardIcon;

export const CardList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="email" />
        <SelectField choices={subChoices} source="subType" />
        <DateField source="expDate" />
        <NumberField source="due" />
        <BooleanField source="isActive" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export const CardShow = (props: ShowProps) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="email" />
        <SelectField choices={subChoices} source="subType" />
        <DateField source="expDate" />
        <NumberField source="due" />
        <BooleanField source="isActive" />
      </SimpleShowLayout>
    </Show>
  );
};

const CardTitle = ({ record }: TitleProps) => {
  return <span>Card {record && `- ${record.subType}`}</span>;
};
//TODO dodac tytul

export const CardEdit = (props: EditProps) => {
  return (
    <Edit title={<CardTitle />} {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <SelectInput choices={subChoices} source="subType" />
        <DateInput source="expDate" />
        <NumberInput source="due" />
        <BooleanInput source="isActive" />
      </SimpleForm>
    </Edit>
  );
};

export const CardCreate = (props: CreateProps) => {
  return (
    <Create title="Create a Card" {...props}>
      <SimpleForm>
        <ReferenceInput
          label="Customer"
          source="customer"
          reference="customers"
        >
          <SelectInput optionText="email" />
        </ReferenceInput>
        <SelectInput choices={subChoices} source="subType" />
        <DateInput source="expDate" />
        <NumberInput source="due" />
        <BooleanInput source="isActive" />
      </SimpleForm>
    </Create>
  );
};
