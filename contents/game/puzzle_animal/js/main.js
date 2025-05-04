// グローバルに展開
phina.globalize();

// アセット
var ASSETS = {
    // 画像
    image: {
      'bg': 'img/bg/top_bg.png',
      'start': 'img/other/start.png',
      'bg2': 'img/bg/bg.png',
      'objects':'img/objects/objects.png',
      'silhouettes': 'img/objects/silhouettes.png',
      'back': 'img/other/back.png',
      'clear': 'img/other/clear.png'
    },
    // 効果音
    sound: {
      'click': 'se/click.mp3',
      'se_clear': 'se/clear.mp3'
    }
  };
  // 定数
  var SCREEN_WIDTH  = 640; // 画面横サイズ
  var SCREEN_HEIGHT = 960; // 画面縦サイズ

/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    // startScene から開始
    startLabel: 'startScene',
    // シーンのリストを引数で渡す
    scenes: [
      {
        className: 'startScene',
        label: 'startScene',
        nextLabel: 'mainScene',
      },

      {
        className: 'mainScene',
        label: 'mainScene',
        nextLabel: 'startScene',
      },
    ],
    // アセット読み込み
    assets: ASSETS,
  });

  // safariブラウザで音を再生するためのダミー
  app.domElement.addEventListener('touchend', function dummy() {
    var s = phina.asset.Sound();
    s.loadFromBuffer();
    s.play().stop();
    app.domElement.removeEventListener('touchend', dummy);
  });

  // 実行
  app.run();
});