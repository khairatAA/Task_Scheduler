/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Control } from 'react-hook-form';
import TextField from '@mui/material/TextField';

interface TextInputProps {
    name: string;
    control: Control<any>;
    label: string;
    type?: string;
    defaultValue?: string;
    error?: any;
}

const TextInput = ({ name, control, label, type, defaultValue, error }: TextInputProps) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
                <TextField
                    {...field}
                    label={label}
                    type={type}
                    variant="outlined"
                    fullWidth
                    error={!!error}
                    helperText={error ? error.message : ''}
                    value={field.value ?? ''}
                />
            )}
        />
    )
}

export default TextInput
