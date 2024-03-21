+++
title = "ブログのSSL証明書をより強固に自動更新したい"
description = "SSL証明書をcertbotでcronするだけの脳死構成ではなく、ちゃんとCloudflareAPIを利用した堅牢な証明書自動更新環境を作成したい。"
date = "2024-03-08"
author = "Buntin-Synthia"
categories = ["SSL"]
tags = ["SSL","Cloudflare","DNS"]
keywords = ["dehydrated","Let's Encrypt","certbot","SSL","Cloudflare","証明書","更新","スクリプト"]
toa = true
+++

## より強固に？？

`SSL証明書をcertbotでcronするだけの脳死構成ではなく、ちゃんとCloudflareAPIを利用した堅牢な証明書自動更新環境を作成したい。`

こんなこと書いてみましたが、何いってるのと言う感じでしょうか。以下の私の環境を紹介しておきます。
このブログとは別の環境になります。これを執筆している環境ですね。

ブログの技術スタックは別の記事でいつか紹介しようと思います。

あ、「より強固に」を「より権威的な CA からの無料証明書の入手する」と空見した方はお帰りください。そのような方法は知りません。

## 環境

**自宅 LAN 内**

- ONU(Nuro) ほぼ固定 IP
- Red Hat Enterprise Linux 9.3 (x86_64)
- Ubuntu 22 LTS (x86_64)
- Miracle Linux 9.2 (x86_64)

これらに対して、ZTE 製の Nuro の ONU でポート解放を行い、それぞれのサーバーを外部からアクセスできるようにしています。

使用用途は主に、開発用、web サーバー用、趣味用となります。
ゲーム用のサーバーを立てたりもしています。

RHEL に強い CPU が乗っているため、ほぼそれがメインです。

これらに対して、あるドメインを取得し、Cloudflare で DNS を管理しています。

これも別記事になると思いますが、Cloudflare は神です。
ですので、DNS,CDN,SSL,DDoS 対策など、私のインフラはだいぶ Cloudflare 依存気味ですので、真似はあまりお勧めしません。。

## 現状解説・今までの証明書更新

説明に自宅ドメインを使うのも変なので、ここでは `example.com`と言うドメインを利用している前提とします。

まず、自宅回線でビジネスプランでもないので ISP から払い出された IP が変わることがあります。

Nuro を導入して早 5 年ほど経ちますが、今の所一度しか変化していません。

しかし、それでもやはりドメインと IP が機械的につながっていないと安心できない私は、Cloudflare API を利用したダイナミック DNS を利用しています。

今までは、複数のサブドメインに対して、certbot で証明書をサーバー内から取得するものと、ZeroSSL を利用する 2 パターンが混在していました。

> [certbot](https://certbot.eff.org/)- Let's Encrypt の公式クライアント

> [ZeroSSL](https://zerossl.com/) > [ブラウザから無料で簡単に証明書を発行できる ZeroSSL | DevelopersIO](https://dev.classmethod.jp/articles/zerossl-a-free-and-easy-way-to-issue-certificates-from-your-browser/)

ドメインごとに、何が使われているのかわかりにくく、かつ ZeroSSL については証明書の更新時の課金の強制感(うまくやれば(本来は)払わなくて良い)がうざかったので、やめました。ブラウザから手頃にとって来れるのは良いんですけどね。

**で？**
結局こいつらがやってるのは ACME プロトコルに準じた自動的な証明書の発行です。偉いのは CA であってこいつらでは決してありません。いや ZeroSSL はワンチャン偉いか？

また、certbot はやることに比べて偉く高級で多機能なクライアントです。web サーバー機能までもっちゃってます。

正直、自分はあまり好みではないです。必要最低限の機能のみを抽出して、それがしっかり動けばそれが一番良いと思っています。（趣味サーバーはその範疇ではない笑）

また、自分がお客様のサーバーで証明書を設定するときに、Let's Encrypt で証明書を取るときは一時的に通信が http になったりします。自分は、証明書の差し替えは裏でやって、Nginx などは`reload`や`restart`のみを行う形式にしたいと考えています。そのためには、TXT レコードなどを利用したドメインの検証が必要になります。
ここを、CloudflareAPI をうまくこねくり回して解決したいところです。

以上が現状まとめ、となります。

## 今後の証明書更新

要件は以下のようになります。自宅用の自己満構成なのでかなり緩めです。

**要件**

- 結局自分がしたいのは、Cloudflare 管理のドメインで、自動的に証明書が更新されてほしい。

- 自宅 IP が変わったら動作しないスクリプトにしたくない。

- certbot は少し多機能すぎる。ZeroSSL は論外。

- 更新時 Web サーバーを止めたくない。

以上の要件から、自分が出した答えは以下の二つの構成です。

**dehydrated**

[github](https://github.com/dehydrated-io/dehydrated) - シェルで書かれた acme クライアント (必要な機能は全てありつつ非常に単純明快な構造をしています)

**letsencrypt-cloudflare-hook**

[github](https://github.com/kappataumu/letsencrypt-cloudflare-hook) - python 製 hooks スクリプト (dehydrated がチャレンジの TXT レコードを CloudflareAPI 経由で設定できます。)

レゴで自分が欲しいところだけ組んだような感じですね。自分としてはこれらを見つけたとき運命感じました。

### dehydrated の設定

これを見に来ている方には使い方がわかっているツールの説明などいらないかと思うので割愛します。[こちら](https://github.com/dehydrated-io/dehydrated)をどうぞ。

やったことは、以下の通りです。

1. dehydrated をインストール(/opt/dehydrated)
2. CloudflareAPI のトークンを取得
3. letsencrypt-cloudflare-hook をインストール(/opt/dehydrated/hooks/cloudflare/hook.py)
4. dehydrated の設定ファイルを設定(/opt/dehydrated/config)
5. 対象ドメインを設定(/opt/dehydrated/domains.txt)

#### domains.txt

```
code.example.com
ubcode.example.com
example.com
```

#### 結果

```
[::] buntin@example.com:/opt/dehydrated (master %) $ ./dehydrated -c -t dns-01 -k 'hooks/cloudflare/hook.py'
# INFO: Using main config file /opt/dehydrated/config
 + CloudFlare hook executing: startup_hook
 + Creating chain cache directory /opt/dehydrated/chains
Processing code.example.com
 + Creating new directory /opt/dehydrated/certs/code.example.com ...
 + Signing domains...
 + Generating private key...
 + Generating signing request...
 + Requesting new certificate order from CA...
 + Received 1 authorizations URLs from the CA
 + Handling authorization for code.example.com
 + 1 pending challenge(s)
 + Deploying challenge tokens...
 + CloudFlare hook executing: deploy_challenge
 + Creating TXT record: code.example.com => 8FWozOTG6G7zCTs7zQJWQ34OK3sLFgJUzAGLjbscDPs
 + Challenge: nONCKnH5i7U3CfAQN444-IjR8DhXYPdd1-2vSLH4F7A
 + Unable to locate record named _acme-challenge.code.example.com
 + TXT record created, CFID: 8bba036b11b3533c15ebb2ce30fc8a4f
 + Settling down for 10s...
 + Responding to challenge for code.example.com authorization...
 + Challenge is valid!
 + Cleaning challenge tokens...
 + CloudFlare hook executing: clean_challenge
 + Deleted TXT _acme-challenge.code.example.com, CFID 8bba036b11b3533c15ebb2ce30fc8a4f
 + Requesting certificate...
 + Checking certificate...
 + Done!
 + Creating fullchain.pem...
 + CloudFlare hook executing: deploy_cert
 + ssl_certificate: /opt/dehydrated/certs/code.example.com/fullchain.pem
 + ssl_certificate_key: /opt/dehydrated/certs/code.example.com/privkey.pem
 + Done!
Processing ubcode.example.com
 + Creating new directory /opt/dehydrated/certs/ubcode.example.com ...
 + Signing domains...
 + Generating private key...
 + Generating signing request...
 + Requesting new certificate order from CA...
 + Received 1 authorizations URLs from the CA
 + Handling authorization for ubcode.example.com
 + 1 pending challenge(s)
 + Deploying challenge tokens...
 + CloudFlare hook executing: deploy_challenge
 + Creating TXT record: ubcode.example.com => XuJ-ew6NftVdV1JbQrrBqJ6F-GL9yQf0zNwF0l5jhOg
 + Challenge: GouLgn8g2KM5FPocZcMkMHmXtMOSKsS5d7MVSrx5qT4
 + Unable to locate record named _acme-challenge.ubcode.example.com
 + TXT record created, CFID: efc3b9608a42101d4b31c727a8d62678
 + Settling down for 10s...
 + The DNS response does not contain an answer to the question: _acme-challenge.ubcode.example.com. IN TXT. Retrying query...
 + DNS not propagated, waiting 30s...
 + The DNS response does not contain an answer to the question: _acme-challenge.ubcode.example.com. IN TXT. Retrying query...
 + DNS not propagated, waiting 30s...
 + Responding to challenge for ubcode.example.com authorization...
 + Challenge is valid!
 + Cleaning challenge tokens...
 + CloudFlare hook executing: clean_challenge
 + Deleted TXT _acme-challenge.ubcode.example.com, CFID efc3b9608a42101d4b31c727a8d62678
 + Requesting certificate...
 + Checking certificate...
 + Done!
 + Creating fullchain.pem...
 + CloudFlare hook executing: deploy_cert
 + ssl_certificate: /opt/dehydrated/certs/ubcode.example.com/fullchain.pem
 + ssl_certificate_key: /opt/dehydrated/certs/ubcode.example.com/privkey.pem
 + Done!
Processing example.com
 + Creating new directory /opt/dehydrated/certs/example.com ...
 + Signing domains...
 + Generating private key...
 + Generating signing request...
 + Requesting new certificate order from CA...
 + Received 1 authorizations URLs from the CA
 + Handling authorization for example.com
 + 1 pending challenge(s)
 + Deploying challenge tokens...
 + CloudFlare hook executing: deploy_challenge
 + Creating TXT record: example.com => TB2owBPoTysC6r1c5mUBnxZgKQuu4OmRDklPN9zADyQ
 + Challenge: 2vebQ4X3RyqUzV1qUJXNbZPD15pvyPDpwLIERRa21BQ
 + Unable to locate record named _acme-challenge.example.com
 + TXT record created, CFID: ac73764513bc4e7a4812212c3e8cfc28
 + Settling down for 10s...
 + DNS not propagated, waiting 30s...
 + DNS not propagated, waiting 30s...
 + Responding to challenge for example.com authorization...
 + Challenge is valid!
 + Cleaning challenge tokens...
 + CloudFlare hook executing: clean_challenge
 + Deleted TXT _acme-challenge.example.com, CFID ac73764513bc4e7a4812212c3e8cfc28
 + Requesting certificate...
 + Checking certificate...
 + Done!
 + Creating fullchain.pem...
 + CloudFlare hook executing: deploy_cert
 + ssl_certificate: /opt/dehydrated/certs/example.com/fullchain.pem
 + ssl_certificate_key: /opt/dehydrated/certs/example.com/privkey.pem
 + Done!
 + CloudFlare hook executing: exit_hook
[::] buntin@example.com:/opt/dehydrated (master %) $ ls
```

証明書の更新はこれで終わりです。

<img src="https://res.cloudinary.com/xlog/image/upload/v1/2024/03/08/welcome-dehydrated-info?_a=BAMHUyJt0" alt="Cloudinary image<welcome-dehydrated-info.png-2024/03/08/welcome-dehydrated-info>" />

唯々、神。以上です。(nginx への適用、リロードをお忘れなく)

これでより安全で簡潔な証明書更新スクリプトが整理できました。

毎回証明書更新のたびに新しい方法に手を出してきましたが、しばらくは変更いらないくらい堅牢なのができたと思います。

あとは、例のスクリプトをもとに自分が書いた TypeScript 製にしちゃいたいですね。Bun & TypeScript 構成にハマっているのでそのうちやると思います。

Cloudflare 関連の Web 通信系の心配は全くないんですが、証明書関連がどうなのか、、、まあ扱っているのはネットの証明書なわけですから全てあるでしょう。

では！

## 改訂履歴

(2024/03/10) 最後の方を編集しました。
