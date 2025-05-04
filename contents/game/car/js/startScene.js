// グローバルに展開
phina.globalize();

/*
 * スタートシーン
 */
phina.define('startScene', {
  superClass: 'DisplayScene',
  // コンストラクタ
  init: function() {
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });
    // 背景色
    this.backgroundColor = '#AEE1EB';
    // グループ
    var bgGroup = DisplayElement().addChildTo(this);

    // 背景追加
    // 遠景
    (2).times(function(i) {
      Sprite('bg').addChildTo(bgGroup)
                  .setPosition(this.gridX.span(0) + i * SCREEN_WIDTH, this.gridY.center())
                  .physical.force(1, 0);
    }, this);
    // 近景
    (2).times(function(i) {
      Sprite('bg_road1').addChildTo(bgGroup)
                  .setPosition(this.gridX.center() + i * SCREEN_WIDTH, this.gridY.span(13))
                  .physical.force(2, 0);
    }, this);
    // オブジェクト
    Sprite('car1').addChildTo(bgGroup)
                .setPosition(this.gridX.span(9), this.gridY.span(12))
                .tweener
                .wait(100)
                .by({x: -150}, 1500)
                .by({x: 150}, 1500)
                .setLoop(true)
                .play();

    // タイトル
    this.object = Sprite('title').addChildTo(this);
    this.object.setPosition(this.gridX.center(), this.gridY.span(5))
    .tweener.wait(700).fadeOut(1000).fadeIn(700).setLoop(true).play();
    // 提供記載
    var creditGroup = DisplayElement().addChildTo(this);
    creditGroup.setPosition(10, 10);  // 左上に配置

    var createLabel = function(text, fontSize, y) {
      return Label({
        text: text,
        fontSize: fontSize,
        fill: 'white',
        align: 'left',
      }).addChildTo(creditGroup).setPosition(0, y);
    };

    createLabel('音楽提供', 14, 0);
    createLabel('OtoLogic(https://otologic.jp)', 12, 20);

    // 画面タッチ時
    this.on('pointend', function() {
      // 次のシーンへ
      SoundManager.play('clickSound_up');
      this.exit();
    });
    // 参照用
    this.bgGroup = bgGroup;
  },
  // 毎フレーム更新処理
  update: function() {
    // 背景のループ処理
    this.bgGroup.children.forEach(function(child) {
      if (child.left > SCREEN_WIDTH) {
        child.x -= SCREEN_WIDTH * 2;
      }
    });
  },

  
});