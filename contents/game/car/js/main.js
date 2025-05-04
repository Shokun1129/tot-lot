// グローバルに展開
phina.globalize();

// アセット
var ASSETS = {
    // 画像
    image: {
      'bg': 'img/bg/kumo.png',
      'bg_road1': 'img/bg/road1.png',
      'bg_road2': 'img/bg/road2.png',
      'title': 'img/other/title.png',
      'next': 'img/other/next.png',
      'prev': 'img/other/prev.png',
      'modoru':'img/other/modoru.png',
      'decide':'img/other/decide.png',
      'siren':'img/other/siren.png',
      'car1':'img/car/car1.png',
      'car2':'img/car/car2.png',
      'car3':'img/car/car3.png',
      'car4':'img/car/car4.png',
      'car5':'img/car/car5.png',
    },
    // 効果音
    sound: {
      'clickSound': 'se/Onoma-Button-Click.mp3',
      'clickSound_up': 'se/Scene_Change03-1(Up).mp3',
      'clickSound_down': 'se/Scene_Change03-2(Down).mp3',
      'siren1': 'se/Fire_Truck-Siren.mp3',
      'siren2': 'se/Ambulance-Siren.mp3',
      'siren3': 'se/Police_Car-Siren.mp3',
    },
  };
  // 定数
  var SCREEN_WIDTH  = 960; // 画面横サイズ
  var SCREEN_HEIGHT = 640; // 画面縦サイズ

  // 初期値セット
  var slct_vehicle = 'car1';
  var slct_bg = 'bg_road1';
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
        nextLabel: 'selectScene',
      },

      {
        className: 'selectScene',
        label: 'selectScene',
        nextLabel: 'mainScene',
      },
      {
        className: 'mainScene',
        label: 'mainScene',
        nextLabel: 'startScene',
      },
    ],
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
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