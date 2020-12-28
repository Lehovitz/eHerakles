import * as React from "react";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
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

export const paymentIcon = AccountBalanceWalletIcon;

export enum Status {
  Started = "S",
  Pending = "P",
  Finalized = "F",
  Rejected = "R",
}

const statusChoices = [
  { id: "S", name: "Started" },
  { id: "P", name: "Pending" },
  { id: "F", name: "Finalized" },
  { id: "R", name: "Rejected" },
];

export const PaymentList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="email" label="Customer" />
        <DateField source="paymentDate" />
        <DateField source="dueDate" />
        <NumberField source="due" />
        <SelectField choices={statusChoices} source="status" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export const PaymentShow = (props: ShowProps) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="email" label="Customer" />
        <DateField source="paymentDate" />
        <DateField source="dueDate" />
        <NumberField source="due" />
        <SelectField choices={statusChoices} source="status" />
      </SimpleShowLayout>
    </Show>
  );
};

const PaymentTitle = ({ record }: TitleProps) => {
  return <span>Payment {record && `- ${record.subType}`}</span>;
};
//TODO dodac tytul

export const PaymentEdit = (props: EditProps) => {
  return (
    <Edit title={<PaymentTitle />} {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <ReferenceInput
          label="Customer"
          source="customer"
          reference="customers"
        >
          <SelectInput optionText="email" />
        </ReferenceInput>
        <DateInput source="paymentDate" />
        <DateInput source="dueDate" />
        <NumberInput source="due" />
        <SelectInput choices={statusChoices} source="status" />
      </SimpleForm>
    </Edit>
  );
};

export const PaymentCreate = (props: CreateProps) => {
  return (
    <Create title="Create a Payment" {...props}>
      <SimpleForm>
        <ReferenceInput
          label="Customer"
          source="customer"
          reference="customers"
        >
          <SelectInput optionText="email" />
        </ReferenceInput>
        <DateInput source="paymentDate" />
        <DateInput source="dueDate" />
        <NumberInput source="due" />
        <SelectInput choices={statusChoices} source="status" />
      </SimpleForm>
    </Create>
  );
};
