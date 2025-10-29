# WebRTC Client

React + TypeScript + Storybookで構築されたWebRTCクライアントアプリケーション

## 🌐 デモ

**Live Demo:** https://nogikun.github.io/WebRTC-Client/

## ✨ 特徴

- 📹 WebRTCによるリアルタイムビデオ・音声通信
- 🎨 Storybookによるコンポーネント駆動開発
- 💪 TypeScriptによる型安全性
- ⚡ Viteによる高速ビルド
- 📱 レスポンシブデザイン
- 🚀 GitHub Pagesへの自動デプロイ

## 🚀 クイックスタート

### デプロイ

```bash
# GitHub Pagesへデプロイ
git push origin main  # 自動的にデプロイされます
```

詳細: [QUICKSTART_DEPLOY.md](QUICKSTART_DEPLOY.md)

### 開発

```bash
cd dev
NODE_ENV=development npm install
npm run dev
```

詳細: [README_PROJECT.md](README_PROJECT.md)

## 📚 ドキュメント

- [プロジェクト詳細](README_PROJECT.md) - プロジェクト構成と技術スタック
- [デプロイガイド](DEPLOY.md) - GitHub Pagesへのデプロイ方法
- [クイックスタート](QUICKSTART_DEPLOY.md) - すぐにデプロイする
- [作業サマリー](WORK_SUMMARY.md) - 実装内容の詳細

## textlintによる文章チェック

リポジトリのルートで以下のコマンドを実行すると、文章のチェックを行えます。  
利用にはローカル環境へ Node.js のインストールが必要です。インストール方法は参考記事（例: https://qiita.com/ryome/items/eec08b28aff294e8c3d6）を参照してください。

```bash
npm run lint
```

## direnvによる環境の自動設定

[direnv](https://github.com/direnv/direnv) を利用して、プロジェクトごとの環境変数や設定（例: commit-template）を自動で読み込むようにしています。導入方法や使い方は公式リポジトリのドキュメントを確認してください。

## 📄 ライセンス

ISC
