import { Create, DataTable, Edit, EditButton, ImageField, ImageInput, List, ReferenceField, ReferenceInput, Show, SimpleForm, SimpleShowLayout, TextField, TextInput, UrlField } from "react-admin";


export const PhotoList = () => {

    return (
        <List>
            <DataTable>
                <DataTable.Col source="id" />
                <DataTable.Col source="albumId">
                    <ReferenceField source="albumId" reference="albums" />
                </DataTable.Col>
                <DataTable.Col source="title" />
                <DataTable.Col source="url" field={UrlField}/>
                <DataTable.Col source="thumbnailUrl">
                    <ImageField source="thumbnailUrl" />
                </DataTable.Col>
                <EditButton />
            </DataTable>
        </List>
    )
};

export const PhotoShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <ReferenceField source="userId" reference="users" />
            <TextField source="title" />  
            <TextField source="url" /> 
            <ImageField source="thumbnailUrl" />        
        </SimpleShowLayout>
    </Show>
);

export const PhotoEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput disabled source="id" />
                <ReferenceInput source="albumId" reference="albums" isRequired/>
                <TextInput source="title" />
                <TextInput source="url"/>
                <ImageInput source="thumbnailUrl"/>
            </SimpleForm>
        </Edit>
    )
};

export const PhotoCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="id" required/>
                <ReferenceInput source="albumId" reference="albums" isRequired/>
                <TextInput source="title" required/>
                <TextInput source="url" required/>
                <ImageInput source="thumbnailUrl"/>
            </SimpleForm>
        </Create>
    )
}