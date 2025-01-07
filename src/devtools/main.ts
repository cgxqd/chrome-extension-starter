import Browser from 'webextension-polyfill';
Browser.devtools.panels.create('控制台看板', 'assets/icon-128.png', 'src/panel/index.html').then((panel) => {
    panel.onShown.addListener(() => {
        console.log('Storyboard panel shown');
    });
    panel.onHidden.addListener(() => {
        console.log('Storyboard panel hidden');
    });
});
