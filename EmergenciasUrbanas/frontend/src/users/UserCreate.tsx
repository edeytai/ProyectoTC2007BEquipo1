import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  EmailField,
  PasswordInput,
  required,
  email,
  minLength,
  useTranslate,
} from 'react-admin';
import { Box, Typography } from '@mui/material';

const validatePassword = [required(), minLength(6)];
const validateEmail = [required(), email()];

export const UserCreate = () => {
  const translate = useTranslate();

  const getRoleChoices = () => [
    { id: 'brigadista', name: translate('users.roles.descriptions.brigadista') },
    { id: 'coordinador', name: translate('users.roles.descriptions.coordinador') },
    { id: 'autoridad', name: translate('users.roles.descriptions.autoridad') },
    { id: 'admin', name: translate('users.roles.descriptions.admin') },
  ];

  const getDepartmentChoices = () => [
    { id: 'proteccion_civil', name: translate('users.departments.proteccion_civil') },
    { id: 'bomberos', name: translate('users.departments.bomberos') },
    { id: 'seguridad', name: translate('users.departments.seguridad') },
    { id: 'servicios_urbanos', name: translate('users.departments.servicios_urbanos') },
    { id: 'administracion', name: translate('users.departments.administracion') },
  ];

  return (
    <Create redirect="list">
      <SimpleForm>
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          {translate('users.sections.accessInfo')}
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <TextInput
            source="username"
            label={translate('users.fields.username')}
            validate={required()}
            fullWidth
          />
          <PasswordInput
            source="password"
            label={translate('users.fields.password')}
            validate={validatePassword}
            fullWidth
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          {translate('users.sections.personalInfo')}
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <TextInput
            source="fullName"
            label={translate('users.fields.fullName')}
            validate={required()}
            fullWidth
          />
          <TextInput
            source="email"
            label={translate('users.fields.email')}
            validate={validateEmail}
            fullWidth
          />
        </Box>

        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 2 }}>
          <SelectInput
            source="department"
            label={translate('users.fields.department')}
            choices={getDepartmentChoices()}
            validate={required()}
            fullWidth
          />
          <TextInput
            source="phone"
            label={translate('users.fields.phone')}
            fullWidth
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          {translate('users.sections.roleConfig')}
        </Typography>
        <SelectInput
          source="role"
          label={translate('users.fields.role')}
          choices={getRoleChoices()}
          validate={required()}
          fullWidth
          helperText={translate('users.messages.roleHelp')}
        />

        <BooleanInput
          source="active"
          label={translate('users.fields.active')}
          defaultValue={true}
        />
      </SimpleForm>
    </Create>
  );
};