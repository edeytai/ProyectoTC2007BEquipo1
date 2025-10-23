import { useMediaQuery, Theme } from "@mui/material";
import { List, SimpleList, DataTable, EmailField } from "react-admin";
import {
    ReferenceField,
    EditButton,
    Edit,
    Create,
    SimpleForm,
    ReferenceInput,
    TextInput,
} from "react-admin";
import { SuspendUserButton } from './SuspendUserButton';
import { UserRowActions } from './UserRowActions';
import { UsersHeader } from './UsersHeader';
import { QuickCreateUser } from './QuickCreateUser';

export const UserList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    return (
        <List>
            <QuickCreateUser />
            <UsersHeader />
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.name}
                    secondaryText={(record) => record.username}
                    tertiaryText={(record) => record.email}
                />
            ) : (
                <DataTable>
                    <DataTable.Col source="id" />
                    <DataTable.Col source="name" />
                    <DataTable.Col source="username" />
                    <DataTable.Col source="email">
                        <EmailField source="email" />
                    </DataTable.Col>
                    <DataTable.Col source="address.street" />
                    <DataTable.Col source="phone" />
                    <DataTable.Col source="website" />
                    <DataTable.Col source="company.name" />
                    <DataTable.Col>
                        {({ record }) => <SuspendUserButton id={record.id} website={record.website} />}
                    </DataTable.Col>
                    <DataTable.Col>
                        <UserRowActions />
                    </DataTable.Col>
                    <EditButton />
                </DataTable>
            )}
        </List>
    );
};

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" />
            <TextInput source="username" />
            <TextInput source="email" />
            <TextInput source="address.street" />
            <TextInput source="phone" />
            <TextInput source="website" />
            <TextInput source="company.name" />
        </SimpleForm>
    </Edit>
);
