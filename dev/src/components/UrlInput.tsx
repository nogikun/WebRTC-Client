import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setUrl, clearUrl } from '../redux/slices/urlSlice';

export const UrlInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const url = useAppSelector((state) => state.url.url);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setUrl(e.target.value));
  };

  const handleClear = () => {
    dispatch(clearUrl());
  };

  return (
    <div className="p-4 space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={handleChange}
          placeholder="Enter URL..."
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Clear
        </button>
      </div>
      <div className="text-sm text-gray-600">
        Current URL: <span className="font-mono">{url || '(empty)'}</span>
      </div>
    </div>
  );
};
