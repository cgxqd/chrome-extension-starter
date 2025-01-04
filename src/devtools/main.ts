chrome.devtools.panels.create('控制台看板', 'assets/icon-128.png', 'src/panel/index.html', (panel) => {
    panel.onShown.addListener(() => {
        console.log('Storyboard panel shown');
    });
    panel.onHidden.addListener(() => {
        console.log('Storyboard panel hidden');
    });
});
