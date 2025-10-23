import {
  List,
  Datagrid,
  TextField,
  EmailField,
  BooleanField,
  FunctionField,
  EditButton,
  DeleteButton,
  TextInput,
  SelectInput,
  useTranslate,
  TopToolbar,
  CreateButton,
  ExportButton,
} from 'react-admin';
import { Chip } from '@mui/material';

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const getUserFilters = (translate: any) => [
  <TextInput key="search" source="q" label={translate('users.filters.search')} alwaysOn />,
  <SelectInput
    key="role"
    source="role"
    label={translate('users.filters.role')}
    choices={[
      { id: 'brigadista', name: translate('users.roles.brigadista') },
      { id: 'coordinador', name: translate('users.roles.coordinador') },
      { id: 'autoridad', name: translate('users.roles.autoridad') },
      { id: 'admin', name: translate('users.roles.admin') },
    ]}
  />,
  <SelectInput
    key="active"
    source="active"
    label={translate('users.filters.state')}
    choices={[
      { id: true, name: translate('users.filters.active') },
      { id: false, name: translate('users.filters.inactive') },
    ]}
  />,
];

export const UserList = () => {
  const translate = useTranslate();

  const getRoleColor = (role: string) => {
    const colors: any = {
      brigadista: 'primary',
      coordinador: 'warning',
      autoridad: 'info',
      admin: 'error'
    };
    return colors[role] || 'default';
  };

  return (
    <List filters={getUserFilters(translate)} actions={<ListActions />}>
      <Datagrid>
        <TextField source="username" label={translate('users.fields.username')} />
        <TextField source="fullName" label={translate('users.fields.fullName')} />
        <EmailField source="email" label={translate('users.fields.email')} />
        <FunctionField
          label={translate('users.fields.role')}
          render={(record: any) => (
            <Chip
              label={translate(`users.roles.${record.role}`)}
              color={getRoleColor(record.role)}
              size="small"
            />
          )}
        />
        <TextField source="department" label={translate('users.fields.department')} />
        <TextField source="phone" label={translate('users.fields.phone')} />
        <BooleanField source="active" label={translate('users.fields.active')} />
        <FunctionField
          label={translate('users.fields.createdAt')}
          render={(record: any) => new Date(record.createdAt).toLocaleDateString()}
        />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};