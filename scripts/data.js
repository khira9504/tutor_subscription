const users = [
  {
    name: "admin",
    email: "admin@example.com",
    image: "/avatar/boy_01.png",
    password: "admin",
  },
];

const specialTutors = [
  {
    title: "家庭教師E",
    week: "月〜金",
    time: "3時間",
    subject: "現代文・古文・漢文",
    content: "上級レベルの現代文・古文・漢文を担当します。トップを目指すために教えます！",
    image: "/images/icon_business_woman03.png"
  },
  {
    title: "家庭教師G",
    week: "金〜日",
    time: "3時間",
    subject: "数学",
    content: "上級レベルの数学を担当します。トップを目指すために教えます！",
    image: "/images/icon_business_man04.png"
  },
];

const standardTutors = [
  {
    title: "家庭教師C",
    week: "火・金",
    time: "2時間",
    subject: "社会",
    content: "標準レベルの社会科を担当します。偏差値55を目指して頑張りましょう",
    image: "/images/icon_business_man02.png"
  },
  {
    title: "家庭教師D",
    week: "月・水・土・日",
    time: "2時間",
    subject: "社会",
    content: "標準レベルの社会科を担当します。偏差値55を目指して頑張りましょう",
    image: "/images/icon_business_man02.png"
  },
];

const freeTutors = [
  {
    title: "家庭教師A",
    week: "月〜金",
    time: "1時間",
    subject: "数学・英語",
    content: "〇〇大学の学生です。初級レベルを担当します。数学と英語を楽しんで学んでいきましょう！",
    image: "/images/icon_business_man01.png"
  },
  {
    title: "家庭教師B",
    week: "月〜水・土",
    time: "1時間",
    subject: "国語",
    content: "△△大学の学生です。初級レベルを担当します。国語をわかりやすく教えます！",
    image: "/images/icon_business_woman01.png"
  },
];

module.exports = {
  users,
  specialTutors,
  standardTutors,
  freeTutors,
};