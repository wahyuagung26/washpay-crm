import { RHFSwitch } from './rhf-switch';
import { RHFUpload } from './rhf-upload';
import { RHFNumberField } from './rhf-number';
import { RHFTextField } from './rhf-text-field';
import { RHFTextPhone } from './rhf-text-phone';
import { RHFNumberInput } from './rhf-number-input';
import { RHFToggleButton } from './rhf-toggle-button';
import { RHFSearchKeyword } from './rhf-search-keyword';
import { RHFDaterangepicker } from './rhf-daterangepicker';
import { RHFAutocompleteAsync } from './rhf-autocomplete-async';

// ----------------------------------------------------------------------

export const Field = {
    Text: RHFTextField,
    Number: RHFNumberField,
    Phone: RHFTextPhone,
    SearchKeyword: RHFSearchKeyword,
    Switch: RHFSwitch,
    Upload: RHFUpload,
    NumberInput: RHFNumberInput,
    ToggleButton: RHFToggleButton,
    Daterangepicker: RHFDaterangepicker,
    AutoCompleteAsync: RHFAutocompleteAsync,
};
