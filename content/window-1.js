function foo1() {
    console.log("foo1 is execute");
}

function foo2() {
    console.log("foo2 is execute");
}
var ev = document.createEvent('HTMLEvents');
ev.initEvent('fakeEvent', false, false);
document.addEventListener("fakeEvent", foo1, false);
document.addEventListener("fakeEvent", foo2, false);