// グローバルに展開
phina.globalize();

const SPRITE_COLUMNS = 4;
const SPRITE_ROWS = 4;
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
    this.bg = Sprite('bg2').addChildTo(this);
    this.bg.origin.set(0, 0);
    this.bg.width = SCREEN_WIDTH;
    this.bg.height = SCREEN_HEIGHT;

    // JSONデータの読み込み
    this.loadGameData().then(() => {
      this.setup();
    });
    
    // 戻るボタンの作成と配置
    this.createBackButton();
  },
  
  // JSONデータの読み込み関数
  loadGameData: function() {
    return new Promise((resolve, reject) => {
      // AssetManagerを使ってJSONを取得
      const gameData = AssetManager.get('json', 'config');
      if (gameData) {
        this.gameData = gameData;  // 読み込んだJSONをthis.gameDataに格納
        resolve();
      } else {
        reject(new Error('JSON data not found.'));
      }
    });
  },
  
  setup: function() {
    // ランダムにanimal_defineから1つ選択
    const randomIndex = Math.floor(Math.random() * this.gameData.data.animal_define.length);
    const selectedAnimal = this.gameData.data.animal_define[randomIndex];


    // 動物スプライトの設定
    this.animal = Sprite('animals', 300, 300).addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.span(6));
      this.animal.frameIndex = selectedAnimal.spriteIndex;

    // 回答スペースの設定
    this.answerSpaces = Array(selectedAnimal.answerLength).fill().map((_, i) => {
      // 回答スペースの幅と高さ
      let answerSpaceWidth = 120;
      let answerSpaceHeight = 120;
      let Len = selectedAnimal.answerLength;
      let Space = 15;

      let xPos = this.setUpPosition(i,Len ,answerSpaceWidth , Space);
      const answershape =
       RectangleShape({
        width: answerSpaceWidth,
        height: answerSpaceHeight,
        strokeWidth: 2,
        stroke: '#222',
        fill: '#FFF',
        cornerRadius: 3
      }).addChildTo(this).setPosition(
        xPos, // X座標
        this.gridY.span(10) // Y座標（例として固定）
      );
      return answershape
    });

    // 回答候補をmojiリストからランダムに選択
    const candidates = this.generateCandidates(selectedAnimal.answerLength, selectedAnimal.answer);

    // 回答候補のオブジェクト
    this.candidateObjects = candidates.map((char, i) => {

      // 回答スペースの幅と高さ
      let answerSpaceWidth = 52;
      let answerSpaceHeight = 52;
      let Len = 5;
      let Space = 40;

      let xPos = this.setUpPosition(i, Len ,answerSpaceWidth , Space);

      const shape =
        RectangleShape({
          width: 70,
          height: 70,
          fill: '#fff',       // 背景色
          stroke: '#222',     // 枠線の色
          strokeWidth: 1,     // 枠線の太さ
          cornerRadius: 3
        }).addChildTo(this).setPosition(xPos, this.gridY.span(14));

      const object =
        Label({
          text: char,
          fontSize: 52,
          fill: '#111',
          align: 'center',    // テキストの水平位置を中央に
          baseline: 'middle', // テキストの垂直位置を中央に
          fontfamily: "'ヒラギノ明朝 ProN','Hiragino Mincho ProN',sans-serif"
        }).addChildTo(this).setPosition(xPos, this.gridY.span(14)).setInteractive(true);
      
      // クリックされたオブジェクトを最前面に移動
      object.onpointstart = function(e) {
        SoundManager.play('click');
        this.parent.addChild(this);
        // 文字の大きさを調整
        this.scaleX = 1.25;
        this.scaleY = 1.25;
      };

      // クリックされたオブジェクトを動かす
      object.onpointmove = function(e) {
        this.x += e.pointer.dx;
        this.y += e.pointer.dy;
      };

      // オブジェクトの移動終了時
      object.onpointend = function() {
        SoundManager.play('click');
        this.checkMatch(object);
      }.bind(this);

      return object; 
    });
  },


  // 回答欄、回答候補の表示ポジション設定
  setUpPosition: function(i , Len , Wid ,Space) {
    
    // 回答スペースの数
    const numAnswerSpaces = Len;
    
    // 画面幅
    const screenWidth = this.width;
    
    // 各回答スペースの間隔を計算（間隔を狭くするための調整）
    const totalWidth = Wid * numAnswerSpaces;
    const desiredSpacing = Space; // 希望する間隔（px）
    const spacing = (screenWidth - totalWidth - (desiredSpacing * (numAnswerSpaces - 1))) / 2;

    return spacing + (Wid + desiredSpacing) * i + Wid / 2 // X座標
  },

  // 戻るボタンを左上に配置
  createBackButton: function() {
    var button = Sprite('back').addChildTo(this).setPosition(this.gridX.span(1.75), this.gridY.span(0.75));

    // ボタンをインタラクティブに設定
    button.setInteractive(true);

    // ボタン押下時の処理
    button.onpointend = function() {
      SoundManager.play('click');
      button.remove();
      this.exit('startScene');
    }.bind(this);
  },

  generateCandidates: function(answerLength, answer) {
    const mojiList = this.gameData.data.moji.slice(); // mojiリストをコピー
    const candidates = answer.split(''); // 正解の文字を候補に追加
  
    // mojiリストからランダムに文字を追加（重複しないように）
    while (candidates.length < 5) { // 必要な候補の数になるまで追加
      const randomMoji = mojiList.splice(Math.floor(Math.random() * mojiList.length), 1)[0];
      if (!candidates.includes(randomMoji)) {
        candidates.push(randomMoji);
      }
    }
  
    // 候補をランダムに並べ替え
    return candidates.sort(() => Math.random() - 0.5);
  },

  checkMatch: function(movedObject) {
    let isCorrect = true;
    let allSpacesFilled = true;

    // 各回答スペースをチェック
    this.answerSpaces.forEach((obj, index) => {
      // 配列の初期化確認
      if (!this.currentAnswer) {
        this.currentAnswer = [];
      }

      // 配列の要素初期化確認
      if (typeof this.currentAnswer[index] === 'undefined') {
        this.currentAnswer[index] = null; // または適切な初期値
      }

      if (movedObject.hitTestElement(obj)) {
        // オブジェクトが回答スペース内にある場合
        this.currentAnswer[index] = movedObject.text;
        movedObject.setPosition(obj.x, obj.y);
      }

      // スペースが空かどうかチェック
      if (this.currentAnswer[index] === null) {
        allSpacesFilled = false;
      }
    });

    // すべてのスペースが埋まっている場合、正解かどうかチェック
    if (allSpacesFilled) {
      const correctAnswer = this.gameData.data.animal_define.find(animal => animal.spriteIndex === this.animal.frameIndex).answer;
      isCorrect = this.currentAnswer.join('') === correctAnswer;

      if (isCorrect) {
        this.showClearMessage();
      } else {
        this.resetIncorrectObjects();
      }
    }
  },

  showClearMessage: function() {
    // 正解音の再生
    SoundManager.play('correct');

    var Clear = Sprite('clear').addChildTo(this)
    .setPosition(this.gridX.center(), this.gridY.span(7));

    // クリアメッセージをタップ可能にする
    Clear.setInteractive(true);
    Clear.onpointend = function() {
    SoundManager.play('click');
    // シーンを再読み込みする
    this.exit();  
    }.bind(this);
  },

  resetIncorrectObjects: function() {
    // 不正解音の再生
    SoundManager.play('incorrect');
    this.candidateObjects.forEach((obj, index) => {
      console.log('Object:', obj); // objの内容を確認
      console.log('Type:', typeof obj); // objの型を確認
    
      // 元の位置を計算
      let answerSpaceWidth = 52;
      let Len = 5;
      let Space = 40;
      let xPos = this.setUpPosition(index, Len, answerSpaceWidth, Space);
      let yPos = this.gridY.span(14);

      // オブジェクトを元の位置に戻す
      obj.tweener.clear()
        .to({ x: xPos, y: yPos }, 500, 'easeOutElastic');
      // 文字の大きさを戻す
      obj.scaleX = 1;
      obj.scaleY = 1;
      
    });

    // 現在の回答をリセット
    this.currentAnswer = new Array(this.answerSpaces.length).fill(null);
  },
});
