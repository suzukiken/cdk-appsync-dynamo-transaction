+++
title = "AppSync Dynamo DBのトランザクションリゾルバ"
date = "2021-04-21"
tags = ["AppSync", "Dynamo DB"]
+++

AppSyncのリゾルバでDynamo DBのTransactWriteItemsを使ってこんなのを作ってみた。

実際には全く使い物にならないけど、こんな在庫管理システム。

* SKU1つが1行のレコード（DynamoDBのitem）
* レコードにはSKU（商品番号）とPCS（在庫数）が登録できる
* addStockで個数0のSKUが作られる
* adjustStocksで複数のSKUの在庫数をアトミックに変更できる
* ただし在庫数は0以下にならないような条件を持たせ
* 複数の商品のうち一つでもその条件に合致した場合、要求全体を却下する

[Githubのリポジトリ](https://github.com/suzukiken/cdkappsync-dynamo-transaction)
