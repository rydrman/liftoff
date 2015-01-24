/*

ENVIRONMENT

this file is for storing values related to the rendering and gameplay environment
should be used for settings, window sizes, client info etc.

*/

var Settings = {
    
    debug: true,
    
    renderWidth: 1920,
    renderHeight: 1080,
    renderScale: 1,
    canvasWidth: 0,
    canvasHeight: 0,
    aspectW : 16,
    aspectH : 9,
   
    //for world generation

    
    //browser / device info
    browser: (typeof(chrome) != 'undefined')                ? 'chrome' :
             (typeof(document.documentMode) != 'undefined') ? 'ie' :
             (typeof(InstallTrigger) != 'undefined')        ? 'firefox' :
             'other',
    
    //input vars and settings
    /*pointerLocked: false,
    usePointerLock : true,
    pointerLockAvailible : typeof(document.pointerLockElement) != 'undefined' 
                            || typeof(document.mozPointerLockElement) != 'undefined' 
                            || typeof(document.webkitPointerLockElement) != 'undefined',
    mouseSensitivity : 0.002,
    mouseInvert : false,*/
};