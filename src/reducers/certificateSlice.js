import { createSlice } from '@reduxjs/toolkit'
let initial = [];
export const slice = createSlice({
    name: 'rows',
    initialState: {
        value: initial,
        flagOfError: false,
        statusOfError: 200,
        selected: initial
    },
    reducers: {
        setFlagOfError: (state, action) => {
            state.flagOfError = action.payload;
        },
        setStatus: (state, action) => {

            state.statusOfError = action.payload;
        },
        addRow:
            (state, action) => {
                state.value.push(action.payload);
            }
        ,
        deleteRows: (state, action) => {
            state.value.delete(action.payload);
        },
        loadAll: (state, action) => {
            state.value = action.payload;
        },
        setSelected: (state, action) => {
            state.selected = action.payload;
        }
    }
});

export const selectRows = state => state.rows.value;
export const selectSelected = state => state.rows.selected;
export const selectFlagOfError = state => state.rows.flagOfError;
export const selectStatusOfError = state => state.rows.statusOfError;
export const { addRow, deleteRows, loadAll, setFlagOfError, setStatus, setSelected } = slice.actions;

export default slice.reducer;
