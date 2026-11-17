// Only works with available media or working interactive demos are listed.
export const categories = [
  {
    "id": "realtime",
    "number": "01",
    "title": "实时视觉",
    "english": "Real-time Visuals",
    "short": "Real-time",
    "description": "在声音、现场与影像之间，探索即时发生的视觉体验。",
    "medium": "实时影像 / 视听现场 / 交互装置",
    "art": "orbit",
    "heroTitle": "REALTIME<br>VISUALS",
    "heroAria": "REALTIME VISUALS",
    "headingDescription": "在声音与运动中探索视觉的更多可能。",
    "motif": "wave"
  },
  {
    "id": "coding",
    "number": "02",
    "title": "创意编程 / 生成式视觉",
    "english": "Creative Coding & Generative Art",
    "short": "Creative coding",
    "description": "把代码作为创作材料，让规则、随机与秩序生成新的图像。",
    "medium": "生成艺术 / 算法图形 / 网页实验",
    "art": "wave",
    "heroTitle": "CREATIVE<br>CODING",
    "heroAria": "CREATIVE CODING",
    "motif": "flow"
  },
  {
    "id": "motion",
    "number": "03",
    "title": "三维 / 特效",
    "english": "3D & VFX",
    "short": "3D & VFX",
    "description": "以空间、材质与运动，构建介于真实与想象之间的数字世界。",
    "medium": "三维探索 / 动态设计 / 视觉特效",
    "art": "sculpture",
    "heroTitle": "3D<br>VISUALS",
    "heroAria": "3D VISUALS",
    "motif": "structure"
  },
  {
    "id": "graphic",
    "number": "04",
    "title": "平面 / 插画 / 文创",
    "english": "Graphic Design & Illustration",
    "short": "Graphic & illustration",
    "description": "从图形到物件，让视觉语言在不同媒介中延展。",
    "medium": "视觉设计 / 插画叙事 / 文创产品",
    "art": "poster",
    "heroTitle": "GRAPHIC<br>DESIGN",
    "heroAria": "GRAPHIC DESIGN",
    "motif": "arcs"
  }
];

export const projects = [
  {
    "id": "realtime-dandelion",
    "category": "realtime",
    "title": "风的来信",
    "english": "Letter from Wind",
    "featured": true,
    "video": "/public/videos/dandelion.mp4",
    "screenshot": "/public/images/dandelion-td-network.png",
    "description": "基于 TouchDesigner 制作的像素风实时交互视觉作品。触发方式支持按键交互，也可接入呼吸传感器，通过吹气驱动蒲公英种子随风飘散，把呼吸转化为流动的数字意象，探索气息、风与像素画面的实时联动。",
    "tools": "TouchDesigner"
  },
  {
    "id": "realtime-bubbles",
    "category": "realtime",
    "title": "彩虹泡泡",
    "english": "Rainbow Bubbles",
    "featured": true,
    "video": "/public/videos/bubbles.mp4",
    "description": "治愈系实时互动泡泡影像。泛着彩虹光泽的泡泡缓缓飘起，点击就会轻轻炸开，简单的交互带来轻松的游玩感。",
    "tools": "TouchDesigner"
  },
  {
    "id": "realtime-disco",
    "category": "realtime",
    "title": "迪斯科球",
    "english": "Disco ball",
    "featured": true,
    "video": "/public/videos/dsk-ball.mp4",
    "previewBackground": "black",
    "description": "复刻复古迪斯科镜面球效果。球体持续旋转，反射斑斓彩色方块灯光，延伸出无限纵深的隧道空间，适配 VJ 现场、舞台影像输出。",
    "tools": "TouchDesigner"
  },
  {
    "id": "realtime-1",
    "category": "realtime",
    "title": "漫画爆炸",
    "english": "Comic Explosion",
    "featured": true,
    "video": "/public/videos/explosion.mp4",
    "previewBackground": "white",
    "description": "以漫画爆炸符号为原型的生成式视觉，每一次迸发的图形形态随机变化，在秩序与随机之间，重现漫画独有的夸张张力。",
    "tools": "TouchDesigner"
  },
  {
    "id": "realtime-2",
    "category": "realtime",
    "title": "生成式图形",
    "english": "Generative Shape",
    "featured": false,
    "video": "/public/videos/september-07-01.mp4",
    "previewBackground": "white",
    "description": "极简几何风格实时视觉素材，十字图形集群动态变化，色彩柔和，可对接音乐信号，随节拍改变图形生成速度。",
    "tools": "TouchDesigner"
  },
  {
    "id": "realtime-3",
    "category": "realtime",
    "title": "音频可视化",
    "english": "Audio Visualization",
    "featured": false,
    "video": "/public/videos/audio-visualization.mp4",
    "previewBackground": "black",
    "description": "把声音转译为可见的图像。点阵随音乐起伏舒展，每一段旋律、鼓点都化作光点的律动，让听觉拥有具象的形态。",
    "tools": "TouchDesigner"
  },
  {
    "id": "realtime-4",
    "category": "realtime",
    "title": "寒露",
    "english": "寒露",
    "featured": false,
    "video": "/public/videos/cold-dew.mp4"
  },
  {
    "id": "realtime-portfolio-effect",
    "category": "realtime",
    "title": "螺旋点阵",
    "english": "螺旋点阵",
    "featured": false,
    "video": "/public/videos/portfolio-effect.mp4",
    "previewBackground": "black"
  },
  {
    "id": "realtime-ribbon",
    "category": "realtime",
    "title": "粒子丝带",
    "english": "Particle ribbon",
    "featured": false,
    "video": "/public/videos/particle-ribbon.mp4",
    "videoStart": 3.5,
    "previewBackground": "black"
  },

  {
    "id": "coding-1",
    "category": "coding",
    "title": "有机地形",
    "english": "Organic terrain",
    "featured": true,
    "video": "/public/videos/organic-terrain.mp4",
    "previewBackground": "white",
    "videoShape": "portrait",
    "tags": ["p5.js"]
  },

  {
    "id": "coding-2",
    "category": "coding",
    "title": "粒子烟花",
    "english": "Particle fireworks",
    "featured": true,
    "video": "/public/videos/particle-fireworks.mp4",
    "previewBackground": "black",
    "tags": ["p5.js"]
  },
  {
    "id": "coding-3",
    "category": "coding",
    "title": "流体文字",
    "english": "Fluid type",
    "featured": false,
    "video": "/public/videos/fluid-text.mp4",
    "previewBackground": "black",
    "tags": ["TouchDesigner"]
  },
  {
    "id": "coding-4",
    "category": "coding",
    "title": "ALA 动态片头",
    "english": "ALA motion intro",
    "featured": false,
    "video": "/public/videos/ala-intro.mp4",
    "previewBackground": "black",
    "tags": ["TouchDesigner"]
  },
  {
    "id": "coding-5",
    "category": "coding",
    "title": "雨幕",
    "english": "Rain curtain",
    "featured": false,
    "video": "/public/videos/rain.mp4",
    "previewBackground": "black",
    "tags": ["TouchDesigner"]
  },
  {
    "id": "coding-6",
    "category": "coding",
    "title": "粒子丝带",
    "english": "Particle ribbon",
    "featured": false,
    "video": "/public/videos/particle-ribbon.mp4",
    "previewBackground": "black",
    "tags": ["TouchDesigner"]
  },

  {
    "id": "motion-1",
    "category": "motion",
    "title": "海边小屋",
    "english": "Seaside cottage",
    "featured": true,
    "cover": "/public/images/seaside-fish-house.png",
    "width": 1448,
    "height": 1086
  },
  {
    "id": "motion-5",
    "category": "motion",
    "title": "暖瓦小屋",
    "english": "Terracotta cottage",
    "featured": false,
    "cover": "/public/images/terracotta-cottage.png",
    "coverAspect": "scene",
    "width": 1448,
    "height": 1086
  },
  {
    "id": "motion-6",
    "category": "motion",
    "title": "崖边补给站",
    "english": "Cliffside trading post",
    "featured": false,
    "cover": "/public/images/cliffside-trading-post.png",
    "coverAspect": "scene",
    "width": 1448,
    "height": 1086
  },
  {
    "id": "motion-7",
    "category": "motion",
    "title": "风车面包坊",
    "english": "Windmill bakery",
    "featured": false,
    "cover": "/public/images/windmill-bakery.png",
    "coverAspect": "scene",
    "width": 1448,
    "height": 1086
  },
  {
    "id": "motion-8",
    "category": "motion",
    "title": "奇幻植物设定",
    "english": "Fantasy plant concepts",
    "featured": false,
    "cover": "/public/images/fantasy-plants.png",
    "coverAspect": "square",
    "width": 1280,
    "height": 1080
  },
  {
    "id": "motion-9",
    "category": "motion",
    "title": "复古电脑",
    "english": "Retro computer",
    "featured": false,
    "cover": "/public/images/retro-computer.png",
    "coverAspect": "portrait",
    "width": 736,
    "height": 1104
  },
  {
    "id": "motion-10",
    "category": "motion",
    "title": "纸艺静物",
    "english": "Papercraft still life",
    "featured": false,
    "cover": "/public/images/papercraft-still-life.png",
    "coverAspect": "portrait",
    "width": 1024,
    "height": 1536
  },
  {
    "id": "graphic-9",
    "category": "graphic",
    "title": "风的来信",
    "english": "Letter from the wind",
    "featured": true,
    "cover": "/public/images/wind-letter-dandelion.png",
    "coverAspect": "portrait",
    "width": 1086,
    "height": 1448
  },
  {
    "id": "graphic-10",
    "category": "graphic",
    "title": "虹彩泡泡",
    "english": "Iridescent bubbles",
    "featured": false,
    "cover": "/public/images/iridescent-bubbles.png",
    "coverAspect": "portrait",
    "width": 1086,
    "height": 1448
  },
  {
    "id": "graphic-11",
    "category": "graphic",
    "title": "霓虹音画共振",
    "english": "Neon audio-visual resonance",
    "featured": false,
    "cover": "/public/images/neon-audio-visual.png",
    "coverAspect": "portrait",
    "width": 1086,
    "height": 1448
  },
  {
    "id": "graphic-12",
    "category": "graphic",
    "title": "数字植物标本",
    "english": "Digital herbarium",
    "featured": false,
    "cover": "/public/images/digital-herbarium.jpg",
    "coverAspect": "portrait",
    "width": 1086,
    "height": 1448
  },
  {
    "id": "graphic-13",
    "category": "graphic",
    "title": "音频可视化",
    "english": "Audio visualization",
    "featured": false,
    "cover": "/public/images/audio-visual-poster.png",
    "coverAspect": "portrait",
    "width": 1086,
    "height": 1448
  },
  {
    "id": "graphic-14",
    "category": "graphic",
    "title": "漩涡",
    "english": "Vortex",
    "featured": false,
    "cover": "/public/images/vortex.png",
    "coverAspect": "portrait",
    "width": 1086,
    "height": 1448
  },
  {
    "id": "graphic-15",
    "category": "graphic",
    "title": "迪斯科之夜",
    "english": "Disco night",
    "featured": false,
    "cover": "/public/images/neon-disco-night.png",
    "coverAspect": "portrait",
    "width": 1086,
    "height": 1448
  },
  {
    "id": "graphic-16",
    "category": "graphic",
    "title": "怪诞小手",
    "english": "Odd little hands",
    "featured": false,
    "cover": "/public/images/neon-odd-hands.png",
    "coverAspect": "portrait",
    "width": 1086,
    "height": 1448
  },
  {
    "id": "graphic-17",
    "category": "graphic",
    "title": "数字脉冲",
    "english": "Digital pulse",
    "featured": false,
    "cover": "/public/images/digital-pulse-tunnel.png",
    "coverAspect": "portrait",
    "width": 1086,
    "height": 1448
  },
  {
    "id": "graphic-18",
    "category": "graphic",
    "title": "爆炸",
    "english": "Explosion",
    "featured": false,
    "cover": "/public/images/explosion-poster.png",
    "coverAspect": "portrait",
    "width": 1086,
    "height": 1448
  },
  {
    "id": "graphic-5",
    "category": "graphic",
    "title": "鲤跃莲华",
    "english": "Lotus & carp",
    "featured": false,
    "cover": "/public/images/pattern-lotus-carp.png",
    "coverAspect": "square",
    "minimalArtwork": true,
    "width": 945,
    "height": 945
  },
  {
    "id": "graphic-6",
    "category": "graphic",
    "title": "云福引瑞",
    "english": "Azure cloud motifs",
    "featured": false,
    "cover": "/public/images/pattern-auspicious-clouds.png",
    "coverAspect": "square",
    "minimalArtwork": true,
    "width": 1080,
    "height": 1080
  },
  {
    "id": "graphic-7",
    "category": "graphic",
    "title": "青穹鹤舞",
    "english": "Crane dance",
    "featured": false,
    "cover": "/public/images/pattern-jade-bird.png",
    "coverAspect": "square",
    "minimalArtwork": true,
    "width": 1280,
    "height": 1280
  },
  {
    "id": "graphic-8",
    "category": "graphic",
    "title": "鹿衔金桂",
    "english": "Deer & golden osmanthus",
    "featured": false,
    "cover": "/public/images/pattern-violet-deer.png",
    "coverAspect": "square",
    "minimalArtwork": true,
    "width": 1280,
    "height": 1280
  }
];
