// グローバルに展開
phina.globalize();

const PUZZLE_ITEMS = 3;
const SPRITE_COLUMNS = 4;
const SPRITE_ROWS = 3;
const TOTAL_SPRITES = SPRITE_COLUMNS * SPRITE_ROWS;

/*
 * メインシーン
 */
phina.define("mainScene", {
  superClass: 'DisplayScene',
  
  // 初期化
  init: function() {
    // 親クラス初期化
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });
    this.silhouettes = [];
    this.objects = [];
    this.bg = Sprite('bg2').addChildTo(this);
    this.bg.origin.set(0, 0);
    this.bg.width = SCREEN_WIDTH;
    this.bg.height = SCREEN_HEIGHT;

    this.setup();

  },

  setup: function() {
    // Clear existing objects and silhouettes
    this.silhouettes.forEach(s => s.remove());
    this.objects.forEach(o => o.remove());
    this.silhouettes = [];
    this.objects = [];

     // ランダムにスプライトインデックスを選択
     const selectedIndices = this.getRandomIndices(PUZZLE_ITEMS, TOTAL_SPRITES);

    for (let i = 0; i < PUZZLE_ITEMS; i++) {
      const spriteIndex = selectedIndices[i];
      const silhouettePos = this.getNoOverlapPosition(200, 200, this.silhouettes);

      const silhouette = Sprite('silhouettes', 200, 200).addChildTo(this);
      silhouette.setOrigin(0,0).setPosition(silhouettePos.x, silhouettePos.y);
      silhouette.frameIndex = spriteIndex;
      this.silhouettes.push(silhouette);

      const object = Sprite('objects', 200, 200).addChildTo(this);
      object.setOrigin(0,0).setPosition((SCREEN_WIDTH/3) + ((i-1) * 180) + 20, 20);
      // サムネ用リサイズ
      object.setScale(0.75)
      object.frameIndex = spriteIndex;

      // オブジェクトを動かせるようにする
      object.setInteractive(true);

      // クリックされたオブジェクトを最前面に移動
      object.onpointstart = function(e) {
        SoundManager.play('click');
        this.parent.addChild(this);
        // 元の大きさに戻す
        this.scaleX = 1;
        this.scaleY = 1;
      };

      // クリックされたオブジェクトを動かす
      object.onpointmove = function(e) {
        this.x += e.pointer.dx;
        this.y += e.pointer.dy;
      };
      
      // オブジェクトの移動終了時
      object.onpointend = function() {
        SoundManager.play('click');
        this.checkMatch();
      }.bind(this);
      this.objects.push(object);
    }
  },

  getRandomIndices: function(count, max) {
    const indices = [];
    while (indices.length < count) {
      const index = Math.floor(Math.random() * max);
      if (!indices.includes(index)) {
        indices.push(index);
      }
    }
    return indices;
  },

  // シルエット
  getNoOverlapPosition: function(width, height, existingSprites) {
    const margin = 20; // スプライト間の最小距離
    let newPos;
    let overlap;
    do {
      overlap = false;
      newPos = Vector2(
        Random.randint(0, SCREEN_WIDTH - 180),
        Random.randint(220, SCREEN_HEIGHT - 180)
      );
      
      for (let sprite of existingSprites) {
        if (Math.abs(newPos.x - sprite.x) < width + margin && 
            Math.abs(newPos.y - sprite.y) < height + margin) {
          overlap = true;
          break;
        }
      }
    } while (overlap);
    
    return newPos;
  },

  checkMatch: function() {
    let matchedCount = 0;
    this.objects.forEach((obj, index) => {
      const sil = this.silhouettes[index];
      if (obj.hitTestElement(sil) && obj.frameIndex === sil.frameIndex) {
        obj.setPosition(sil.x, sil.y);
        obj.setInteractive(false);
        matchedCount++;
      }
    });

    if (matchedCount === PUZZLE_ITEMS) {
      this.showClearMessage();
    }
  },

  showClearMessage: function() {
    var Back = Sprite('back').addChildTo(this)
              .setPosition(this.gridX.span(3.5), this.gridY.span(1));

    var Clear = Sprite('clear').addChildTo(this)
                .setPosition(this.gridX.center(), this.gridY.span(7));

    // クリアメッセージをタップ可能にする
    Clear.setInteractive(true);
    Clear.onpointend = function() {
      SoundManager.play('click');
      Clear.remove();
      Back.remove();
      this.setup();
    }.bind(this);
    
    // 戻るボタンの設定
    Back.setInteractive(true);
    Back.onpointend = function() {
      SoundManager.play('click');
      Clear.remove();
      Back.remove();
      this.setup();
      this.exit();
    }.bind(this);
    // オブジェクトを操作不可能にする
    this.objects.forEach(obj => obj.setInteractive(false));
  },
});