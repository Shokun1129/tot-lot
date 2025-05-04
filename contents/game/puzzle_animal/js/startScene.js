// グローバルに展開
phina.globalize();

/*
 * スタートシーン
 */
phina.define('startScene', {
  superClass: 'DisplayScene',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });

    // 背景追加
    this.bg = Sprite('bg').addChildTo(this);
    this.bg.origin.set(0, 0);
    this.bg.width = SCREEN_WIDTH;
    this.bg.height = SCREEN_HEIGHT;

    // 提供記載
    var creditGroup = DisplayElement().addChildTo(this);
    creditGroup.setPosition(10, 10);  // 左上に配置

    var createLabel = function(text, fontSize, y) {
      return Label({
        text: text,
        fontSize: fontSize,
        fill: 'dark gray',
        align: 'left',
      }).addChildTo(creditGroup).setPosition(0, y);
    };

    createLabel('音楽提供', 14, 0);
    createLabel('OtoLogic(https://otologic.jp)', 12, 20);

    // スタートボタン配置
    Sprite('start').addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.span(11.3))
      .tweener.fadeOut(1000).fadeIn(500).setLoop(true).play();
    // 画面タッチ時
    this.on('pointend', function() {
      SoundManager.play('click');
      // 次のシーンへ
      this.exit();
    });
  },
});