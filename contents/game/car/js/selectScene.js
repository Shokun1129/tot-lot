// グローバルに展開
phina.globalize();

/*
 * セレクトシーン
 */
phina.define('selectScene', {
  superClass: 'DisplayScene',
  
  init: function() {
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });
    
    // 背景色を薄い青色に設定
    this.backgroundColor = '#AEE1EB';

    // 各要素のセットアップを行う
    this.setupBackground();
    this.setupThumbnails();
    this.setupNavigationButtons();
    this.createDecisionButton();
  },
  
  setupThumbnails: function() {
    // サムネイル配置スペースを作成
    var band = RectangleShape({
      width: this.width,  // 画面の幅いっぱい
      height: 120,         // 帯の高さ
      fill: 'rgba(0, 0, 0, 0.5)',  // 半透明の黒色
      stroke: null,       // 枠線なし
    }).addChildTo(this);

    // 帯を画面上部に配置
    band.setOrigin(0.5, 0.1);  // 基準点(※余白が出来てしまうため調整)
    band.setPosition(this.gridX.center(), 0);  // 画面の左上に配置

    // サムネイル用の乗り物リスト
    var vehicles = ['car1', 'car2', 'car3', 'car4', 'car5'];
    var thumbnailGroup = DisplayElement().addChildTo(this);
    // サムネイルのサイズ設定
    var thumbnailWidth = 100;
    var thumbnailHeight = 100;

    // 各乗り物のサムネイルを作成し配置
    vehicles.forEach(function(vehicle, index) {
      var thumbnail = Sprite(vehicle).addChildTo(thumbnailGroup);
      // リサイズ
      thumbnail.width = thumbnail.width / 2;
      thumbnail.height = thumbnail.height / 2;
      thumbnail.setPosition((SCREEN_WIDTH/5) + (index * 150), 60);
      thumbnail.setInteractive(true);
      
      // サムネイルタップ時の処理
      thumbnail.onpointend = function() {
        SoundManager.play('clickSound');
        this.alpha = 1.0;
        slct_vehicle = vehicle;
        this.selectVehicle(vehicle);
      }.bind(this);

      // 最初の車両（vehicles[0]）を初期選択状態にする
      if (index === 0) {
        this.selectVehicle(vehicle);
        slct_vehicle = vehicle;
      }
    }, this);
  },
  
  setupBackground: function() {
    // 背景画像のリストと初期インデックス
    this.backgrounds = ['bg_road1', 'bg_road2'];
    this.currentBgIndex = 0;
    slct_bg = this.backgrounds[0];
    // 初期背景の設定
    this.background = Sprite(this.backgrounds[0]).addChildTo(this);
    this.background.setOrigin(0, 1).setPosition(0, this.height);
  },
  
  setupNavigationButtons: function() {
    // 前へボタンの作成
    var prevButton = Sprite('prev').addChildTo(this).setPosition(50, this.gridY.center());
    
    // 次へボタンの作成
    var nextButton = Sprite('next').addChildTo(this).setPosition(this.width - 50, this.gridY.center());

    // ボタンをインタラクティブに設定
    prevButton.setInteractive(true);
    nextButton.setInteractive(true);

    // ボタンのイベント設定
    prevButton.onpointend  = this.changeBackground.bind(this, -1);
    nextButton.onpointend  = this.changeBackground.bind(this, 1);
  },

  // 決定ボタンの作成
  createDecisionButton: function() {
    var button = Sprite('decide').addChildTo(this).setPosition(this.gridX.span(14.3), this.gridY.span(14.5));

    // ボタンをインタラクティブに設定
    button.setInteractive(true);

    // ボタン押下時の処理
    button.onpointend = function() {
      SoundManager.play('clickSound_up');
      this.exit({slct_vehicle :slct_vehicle ,slct_bg : slct_bg});
    }.bind(this);this.exit();
  },

  selectVehicle: function(vehicle) {
    // 既に選択された乗り物がある場合は削除
    if (this.selectedVehicle) {
      this.selectedVehicle.remove();
    }
    // 新しく選択された乗り物を表示
    this.selectedVehicle = Sprite(vehicle).addChildTo(this);
    this.selectedVehicle.setPosition(this.gridX.center(), this.gridY.span(12));
  },
  
  changeBackground: function(direction) {
    
    // 背景インデックスを更新（ループ処理）
    this.currentBgIndex = (this.currentBgIndex + direction + this.backgrounds.length) % this.backgrounds.length;
    // 新しい背景画像を設定
    this.background.setImage(this.backgrounds[this.currentBgIndex]);
    slct_bg = this.backgrounds[this.currentBgIndex];
  },
});