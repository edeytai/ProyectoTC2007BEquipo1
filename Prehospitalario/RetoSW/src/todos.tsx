import {
    List,
    DataTable,
    ReferenceField,
    EditButton,
    Edit,
    Create,
    SimpleForm,
    ReferenceInput,
    TextInput,
    SelectInput
} from "react-admin";

export const ToDoList = () => (
    <List filters={toDoFilters}>
        <DataTable>
            <DataTable.Col>
             <ReferenceField source="userId" reference="users" link="show" />
            </DataTable.Col>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="completed" />
            <EditButton />
        </DataTable>
    </List>
);

export const ToDoEdit = () => (
    <Edit>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users" />
            <TextInput source="id" />
            <TextInput source="title" />
            <TextInput source="completed" />
        </SimpleForm>
    </Edit>
);

const toDoFilters = [
    <TextInput source="q" label="Search" alwaysOn />,
    <SelectInput source="completed" label="Status" 
            choices={[
            { id: false, name: "Not completed" },
            { id: true, name: "Completed" },
        ]}
    />,
];
