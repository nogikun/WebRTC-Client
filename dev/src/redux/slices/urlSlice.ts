import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UrlState {
  url: string;
}

const initialState: UrlState = {
  url: '',
};

const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    setUrl: (state, action: PayloadAction<string>) => {
      console.log('[URL Slice] setUrl called with:', action.payload);
      state.url = action.payload;
    },
    clearUrl: (state) => {
      console.log('[URL Slice] clearUrl called');
      state.url = '';
    },
  },
});

export const { setUrl, clearUrl } = urlSlice.actions;
export default urlSlice.reducer;
