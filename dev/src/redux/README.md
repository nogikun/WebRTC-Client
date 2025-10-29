# Redux URL状態管理

## 概要
ReduxとRedux Toolkitを使用してURL指定の状態管理を実装しました。
**redux-persist**を使用して、URL情報はlocalStorageに自動保存され、ページリロードや通話終了後も保持されます。
Storybookにも対応しており、すべてのストーリーでRedux Storeが利用可能です。

## 特徴

✅ URL情報の永続化（localStorage）
✅ ページリロード後も状態保持
✅ 通話終了後も前回のURL情報を保持
✅ TypeScript完全対応
✅ Storybook対応

## ファイル構成

```
src/redux/
├── store.ts              # メインストア設定（永続化設定含む）
├── hooks.ts              # 型付けされたRedux hooks
├── autoReducers.ts       # 自動リデューサー登録
└── slices/
    └── urlSlice.ts       # URL状態管理slice
```

## 永続化の仕組み

- **redux-persist**がReduxの状態をlocalStorageに自動保存
- ページリロード時に自動的に状態を復元
- `whitelist: ['url']` で、URLの状態のみを永続化
- 他の状態（例：一時的なUI状態）は永続化されない

## 使用方法

### 基本的な使い方

```tsx
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUrl, clearUrl } from '@/redux/slices/urlSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const url = useAppSelector((state) => state.url.url);

  const handleChange = (newUrl: string) => {
    dispatch(setUrl(newUrl));
  };

  const handleClear = () => {
    dispatch(clearUrl());
  };

  return (
    <div>
      <input value={url} onChange={(e) => handleChange(e.target.value)} />
      <button onClick={handleClear}>Clear</button>
    </div>
  );
}
```

### Storybookでの使用

`.storybook/preview.tsx`で自動的にProviderが適用されるため、
各ストーリーで個別にProviderを設定する必要はありません。

```tsx
// ストーリーファイル
import type { Meta, StoryObj } from '@storybook/react';
import { UrlInput } from './UrlInput';

const meta = {
  title: 'Components/UrlInput',
  component: UrlInput,
} satisfies Meta<typeof UrlInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

## アプリケーション側の設定

`main.tsx`でProviderとPersistGateを適用：

```tsx
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
```

`PersistGate`は、localStorageから状態を復元するまでアプリのレンダリングを待機します。

## データの確認方法

ブラウザのDevToolsで永続化されたデータを確認できます：

1. DevToolsを開く（F12）
2. **Application** タブ → **Local Storage** → あなたのドメイン
3. キー `persist:root` を確認

## 永続化の設定変更

`store.ts`の`persistConfig`で制御：

```tsx
const persistConfig = {
  key: 'root',           // localStorageのキー名
  storage,               // localStorage使用
  whitelist: ['url'],    // 永続化する状態（追加可能）
  // blacklist: ['temp'], // 永続化しない状態も指定可能
};
```

## 新しいSliceの追加方法

1. `src/redux/slices/`に新しいsliceファイルを作成
2. `src/redux/autoReducers.ts`に追加

```tsx
// 新しいslice例: menuSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const menuSlice = createSlice({
  name: 'menu',
  initialState: { isOpen: false },
  reducers: {
    toggleMenu: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { toggleMenu } = menuSlice.actions;
export default menuSlice.reducer;

// autoReducers.tsに追加
import menuReducer from './slices/menuSlice';

export const autoReducers = {
  url: urlReducer,
  menu: menuReducer, // 追加
};
```
