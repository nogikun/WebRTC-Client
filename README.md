# Template

## textlintによる文章チェック

リポジトリのルートで以下のコマンドを実行すると、文章のチェックを行えます。  
利用にはローカル環境へ Node.js のインストールが必要です。インストール方法は参考記事（例: https://qiita.com/ryome/items/eec08b28aff294e8c3d6）を参照してください。

```bash
npm run lint
```

## direnvによる環境の自動設定

[direnv](https://github.com/direnv/direnv) を利用して、プロジェクトごとの環境変数や設定（例: commit-template）を自動で読み込むようにしています。導入方法や使い方は公式リポジトリのドキュメントを確認してください。
