import * as React from "react";
import CategoryIcon from "@material-ui/icons/Category";
import {
    Create,
    CreateProps,
    Datagrid,
    Edit,
    EditButton,
    EditProps,
    List,
    ListProps,
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

export const categoryIcon = CategoryIcon;

const goalChoices = [
    { id: "M", name: "Gain muscle" },
    { id: "Fit", name: "Get fit" },
    { id: "Rd", name: "Reduce weight" },
    { id: "Rel", name: "Relaxation" },
];

export const CategoryList = (props: ListProps) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="name" />
                <SelectField choices={goalChoices} source="goal" />
                <EditButton />
                <ShowButton />
            </Datagrid>
        </List>
    );
};

export const CategoryShow = (props: ShowProps) => {
    return (
        <Show {...props}>
            <SimpleShowLayout>
                <TextField source="id" />
                <TextField source="name" />
                <SelectField choices={goalChoices} source="goal" />
            </SimpleShowLayout>
        </Show>
    );
};

const CategoryTitle = ({ record }: TitleProps) => {
    return <span>Category {record && `- ${record.subType}`}</span>;
};

export const CategoryEdit = (props: EditProps) => {
    return (
        <Edit title={<CategoryTitle />} {...props}>
            <SimpleForm>
                <TextInput disabled source="id" />
                <TextInput source="name" />
                <SelectInput choices={goalChoices} source="goal" />
            </SimpleForm>
        </Edit>
    );
};

export const CategoryCreate = (props: CreateProps) => {
    return (
        <Create title="Create a Category" {...props}>
            <SimpleForm>
                <TextInput disabled source="id" />
                <TextInput source="name" />
                <SelectInput choices={goalChoices} source="goal" />
            </SimpleForm>
        </Create>
    );
};
