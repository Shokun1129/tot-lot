phina.globalize();

const PLAYER_MOVE_RANGE = 150;
const PLAYER_SPEED_MAX = 35;
const PLAYER_SPEED_MIN = 0;
const ACCELERATION = 0.5;
const DECELERATION = 0.6;

phina.define('mainScene', {
  superClass: 'DisplayScene',

  init: function(param) {
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });

    this.backgroundColor = '#AEE1EB';
    // 戻るボタンの作成と配置
    this.createBackButton();

    // 背景グループ
    this.bgGroup = DisplayElement().addChildTo(this);

    // 遠景
    this.farBackgrounds = [];
    (2).times(function(i) {
      var bg = Sprite('bg').addChildTo(this.bgGroup)
                  .setPosition(this.gridX.span(0) + i * SCREEN_WIDTH, this.gridY.center());
      this.farBackgrounds.push(bg);
    }, this);

    // 近景
    this.nearBackgrounds = [];
    (2).times(function(i) {
      var bg = Sprite(param.slct_bg).addChildTo(this.bgGroup)
              .setOrigin(0.5, 1).setPosition(this.gridX.center() + i * SCREEN_WIDTH, this.height);
      this.nearBackgrounds.push(bg);
    }, this);

    // プレイヤー
    this.player = Sprite(param.slct_vehicle)
      .addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.span(12));

    this.speed = 0;
    this.direction = 0; // -1: 左, 0: 停止, 1: 右
    this.lastDirection = 1;

    // タップ領域（左）
    this.leftArea = RectangleShape({
      width: SCREEN_WIDTH / 2,
      height: SCREEN_HEIGHT,
      fill: 'transparent',
      stroke: null,
    }).addChildTo(this).setPosition(this.gridX.span(3), this.gridY.center());

    // タップ領域（右）
    this.rightArea = RectangleShape({
      width: SCREEN_WIDTH / 2,
      height: SCREEN_HEIGHT,
      fill: 'transparent',
      stroke: null,
    }).addChildTo(this).setPosition(this.gridX.span(13), this.gridY.center());

    this.leftArea.setInteractive(true);
    this.rightArea.setInteractive(true);

    this.leftArea.on('pointstart', () => this.startMove(-1));
    this.leftArea.on('pointend', () => this.stopMove());
    this.rightArea.on('pointstart', () => this.startMove(1));
    this.rightArea.on('pointend', () => this.stopMove());

    // スクロールスピードの設定
    this.farSpeed = 0.3;  // 遠景のスクロールスピード
    this.nearSpeed = 0.7; // 近景のスクロールスピード

    // サイレンボタンの作成と配置
    if (param.slct_vehicle == 'car1' || param.slct_vehicle == 'car2' || param.slct_vehicle == 'car3'){
      this.createSirenButton(param);
    }

  },

  update: function() {
    // 速度の更新
    if (this.direction !== 0) {
      this.speed = Math.min(this.speed + ACCELERATION, PLAYER_SPEED_MAX);
      this.lastDirection = this.direction;
    } else {
      // 徐々に減速
      this.speed = Math.max(this.speed - DECELERATION, PLAYER_SPEED_MIN);
    }

    // 移動処理
    const moveX = this.speed * (this.direction !== 0 ? this.direction : this.lastDirection);

    // プレイヤーの移動
    const centerX = this.gridX.center();
    const moveDirection = this.direction !== 0 ? this.direction : this.lastDirection;
    if ((moveDirection < 0 && this.player.x > centerX - PLAYER_MOVE_RANGE) ||
        (moveDirection > 0 && this.player.x < centerX + PLAYER_MOVE_RANGE)) {
      this.player.x += moveX;
    }

    // プレイヤーの位置を制限
    this.player.x = Math.clamp(this.player.x, centerX - PLAYER_MOVE_RANGE, centerX + PLAYER_MOVE_RANGE);

    // 背景のスクロール
    this.scrollBackground(this.farBackgrounds, -moveX * this.farSpeed);
    this.scrollBackground(this.nearBackgrounds, -moveX * this.nearSpeed);
  },

  scrollBackground: function(backgrounds, speed) {
    backgrounds.forEach(function(bg) {
      bg.x += speed;
      if (bg.right < 0) {
        bg.x += SCREEN_WIDTH * 2;
      } else if (bg.left > SCREEN_WIDTH) {
        bg.x -= SCREEN_WIDTH * 2;
      }
    });
  },

  startMove: function(dir) {
    this.direction = dir;
    this.lastDirection = dir;
  },

  stopMove: function() {
    this.direction = 0;
  },

  // 戻るボタンを左上に配置
  createBackButton: function() {
    var button = Sprite('modoru').addChildTo(this).setPosition(this.gridX.span(1.5), this.gridY.span(1));

    // ボタンをインタラクティブに設定
    button.setInteractive(true);

    // ボタン押下時の処理
    button.onpointend = function() {
      SoundManager.stopMusic();
      SoundManager.play('clickSound_down');
      this.exit('selectScene');
    }.bind(this);
  },

  // サイレンボタンを右上に配置
  createSirenButton: function(param) {
    var se_button = Sprite('siren').addChildTo(this).setPosition(this.gridX.span(14), this.gridY.span(2));

    // ボタンをインタラクティブに設定
    se_button.setInteractive(true);

    // ボタン押下時の処理
    se_button.onpointend = function() {
      //選択した車種によりサウンド変更
      switch (param.slct_vehicle) {
        case 'car1':
          SoundManager.playMusic('siren1');
          break;
        case 'car2':
          SoundManager.playMusic('siren2');
          break;
        case 'car3':
          SoundManager.playMusic('siren3');
          break;
        default:
          //SoundManager.playMusic('clickSound_down');
          break;
      };
    }.bind(this);
  },
});
