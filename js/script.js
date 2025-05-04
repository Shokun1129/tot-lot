var unit = 100,
    canvasList, // キャンバスの配列
    info = {}, // 全キャンバス共通の描画情報
    colorList; // 各キャンバスの色情報

/**
 * Init function.
 * 
 * Initialize variables and begin the animation.
 */
function init() {
    info.seconds = 0;
    info.t = 0;
    canvasList = [];
    colorList = [];

    // TOPのSVGパス編集
    const svg = document.getElementById('fluid-shape');
    const path = document.getElementById('blob');
    const mediaQuery = window.matchMedia('(min-width: 479px)');

    function updatePath(e) {
        if (e.matches) {
            // PC用
            svg.setAttribute('viewBox', '-180 -5 1100 650' );
            //path.setAttribute('d', 'M 48.007812 142.855469 C 47.464844 89.628906 117.273438 45.082031 162.253906 78.878906 C 187.953125 102.972656 203.429688 118.320312 237.800781 95.847656 C 266.007812 74.140625 306.441406 47.671875 324.71875 94.929688 C 335.65625 116.410156 347.949219 103.929688 365.03125 102.308594 C 411.910156 113.625 367.730469 212.601562 313.46875 180.410156 C 303.011719 173.71875 294.382812 161.433594 282.136719 161.785156 C 267.71875 162.199219 251.167969 184.566406 220.589844 193.300781 C 188.660156 202.417969 175.476562 189.511719 152.164062 171.652344 C 117.351562 153.390625 57.519531 205.160156 48.007812 142.855469 Z M 48.007812 142.855469 ');
            path.setAttribute('d', 'M 238.546875 44.636719 C 174.589844 50.292969 113.199219 81.152344 70.507812 129.113281 C 23.550781 181.867188 0.0429688 257.5 18.625 325.636719 C 37.210938 393.773438 101.9375 449.347656 172.554688 448.3125 C 220.136719 447.613281 264.558594 423.425781 311.976562 419.410156 C 369.90625 414.5 425.441406 439.804688 480.476562 458.546875 C 535.511719 477.289062 599.273438 488.972656 649.375 459.484375 C 686.046875 437.902344 708.386719 397.402344 717.628906 355.867188 C 730.011719 300.203125 721.457031 240.910156 698.351562 188.773438 C 675.242188 136.640625 638.144531 91.425781 594.707031 54.480469 C 567.085938 30.988281 535.316406 10.042969 499.359375 5.410156 C 458.289062 0.113281 418.015625 16.601562 378.597656 29.28125 C 339.175781 41.960938 294.457031 39.695312 238.546875 44.636719 Z M 238.546875 44.636719 ' );
        } else {
            // モバイル用
            svg.setAttribute('viewBox', '0 0 414 800' );
            path.setAttribute('d', 'M 363.5625 197.222656 C 359.734375 145.675781 335.558594 95.910156 297.390625 61 C 255.402344 22.597656 194.710938 2.8125 139.574219 16.992188 C 84.441406 31.171875 38.910156 82.636719 38.9375 139.492188 C 38.957031 177.796875 57.945312 213.832031 60.644531 252.042969 C 63.941406 298.730469 42.910156 343.140625 27.175781 387.226562 C 11.441406 431.3125 1.296875 482.5 24.492188 523.167969 C 41.46875 552.929688 73.859375 571.375 107.234375 579.289062 C 151.957031 589.894531 199.851562 583.683594 242.136719 565.679688 C 284.421875 547.675781 321.292969 518.332031 351.566406 483.789062 C 370.816406 461.828125 388.0625 436.492188 392.207031 407.601562 C 396.941406 374.605469 384.113281 342 374.34375 310.125 C 364.574219 278.25 366.910156 242.28125 363.5625 197.222656 Z M 363.5625 197.222656 ');
        }
    }

    mediaQuery.addListener(updatePath);
    updatePath(mediaQuery);

    // canvas1個めの色指定
    canvasList.push(document.getElementById("waveCanvas"));
    colorList.push(['#fff']);
    
    // canvas2個めの色指定
    canvasList.push(document.getElementById("waveCanvas2"));
    colorList.push(['#fff']);
    
    // canvas3個めの色指定
    canvasList.push(document.getElementById("waveCanvas3"));
    colorList.push(['#ececec']);

    // canvas4個めの色指定
    canvasList.push(document.getElementById("waveCanvas4"));
    colorList.push(['#ffe816']);
   
    // 各キャンバスの初期化
    for(var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        canvas.width = document.documentElement.clientWidth; //Canvasのwidthをウィンドウの幅に合わせる
        canvas.height = 150;//波の高さ
        canvas.contextCache = canvas.getContext("2d");
    }
    // 共通の更新処理呼び出し
    update();
}

function update() {
    for(var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        // 各キャンバスの描画
        if (canvasIndex == '1' ){
            draw(canvas, colorList[canvasIndex],0);
        } else {
            draw(canvas, colorList[canvasIndex],1);
        }
    }
    // 共通の描画情報の更新
    info.seconds = info.seconds + .014;
    info.t = info.seconds*Math.PI;
    // 自身の再起呼び出し
    setTimeout(update, 55);
}

function draw(canvas, color ,category) {
    // 対象のcanvasのコンテキストを取得
    var context = canvas.contextCache;
    // キャンバスの描画をクリア
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    drawWave(canvas, color[0], 1, 2.6, 1, category);
}

/*
* 波を描画
* drawWave(色, 不透明度, 波の幅のzoom, 波の開始位置の遅れ)
*/
function drawWave(canvas, color, alpha, zoom, delay, category) {
    var context = canvas.contextCache;
    context.fillStyle = color;//塗りの色
    context.globalAlpha = alpha;
    context.beginPath(); //パスの開始
    if (category == '0'){
        drawSine0(canvas, info.t / 0.5, zoom, delay);
        context.lineTo(canvas.width + 10, 0); //パスをCanvasの右上へ
        context.lineTo(0, 0); //パスをCanvasの左上へ
        context.closePath() //パスを閉じる
        context.fill(); //塗りつぶす
    }else{
        drawSine1(canvas, info.t / 0.5, zoom, delay);
        context.lineTo(canvas.width + 10, canvas.height); //パスをCanvasの右下へ
        context.lineTo(0, canvas.height); //パスをCanvasの左下へ
        context.closePath() //パスを閉じる
        context.fill(); //塗りつぶす
    }
}


function drawSine0(canvas, t, zoom, delay) {
    var xAxis = Math.floor(canvas.height/2);
    var yAxis = 0;
    var context = canvas.contextCache;
    // Set the initial x and y, starting at 0,0 and translating to the origin on
    // the canvas.
    var x = t; //時間を横の位置とする
    var y = -Math.sin(x - delay)/zoom; // 波の上下を反転して計算
    context.moveTo(yAxis, unit*y+xAxis); //スタート位置にパスを置く

    // Loop to draw segments (横幅の分、波を描画)
    for (i = yAxis; i <= canvas.width + 10; i += 10) {
        x = t+(-yAxis+i)/unit/zoom;
        y = -Math.sin(x - delay)/zoom; // 波の上下を反転して計算
        context.lineTo(i, unit*y+xAxis);
    }
}

function drawSine1(canvas, t, zoom, delay) {
    var xAxis = Math.floor(canvas.height/2);
    var yAxis = 0;
    var context = canvas.contextCache;
    // Set the initial x and y, starting at 0,0 and translating to the origin on
    // the canvas.
    var x = t; //時間を横の位置とする
    var y = Math.sin(x)/zoom;
    context.moveTo(yAxis, unit*y+xAxis); //スタート位置にパスを置く

    // Loop to draw segments (横幅の分、波を描画)
    for (i = yAxis; i <= canvas.width + 10; i += 10) {
        x = t+(-yAxis+i)/unit/zoom;
        y = Math.sin(x - delay)/3;
        context.lineTo(i, unit*y+xAxis);
    }
}

init();

document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in-up');
    const boxesInner = document.querySelector('.boxes-inner');
  
    const fadeInUp = () => {
      const boxesInnerRect = boxesInner.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.75; // 画面の75%位置をトリガーポイントとする
  
      fadeElements.forEach((element, index) => {
        const delay = index * 200; // 各要素に200ミリ秒ずつ遅延を追加
  
        if (boxesInnerRect.top < triggerPoint && boxesInnerRect.bottom > 0) {
          setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }, delay);
        }
      });
    };
  
    window.addEventListener('scroll', fadeInUp);
    fadeInUp(); // 初期表示時にも実行

    // アイコンのアニメーション
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // 要素が表示領域に入った時
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } 
          // 要素が表示領域から出た時
          else {
            entry.target.classList.remove('visible');
          }
        });
      }, {
        threshold: 0.1,
        // 要素が画面外に出る前にアニメーションを開始
        rootMargin: '-50px'
      });
  
      // 監視対象の要素を登録
      document.querySelectorAll('.icon_img').forEach(img => {
        observer.observe(img);
      });   
  });
  
