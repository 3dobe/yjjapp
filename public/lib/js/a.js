
clientType = 'a';   // 客户端类型

// 本地存储
store.get(clientType) || store.set(clientType, {
    talkID: ''
});
var storeS = store.get(clientType);

if (storeS['talkID']) { // 已有讲座
    hashPage = location.hash || '#/view';
} else {
    hashPage = location.hash || '#/join';
}
// 加载子页面
loadFrame(hashPage);