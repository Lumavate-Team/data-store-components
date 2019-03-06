declare const Context: any;
var isMobile = /webOS|iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile|Windows Phone|Windows Mobile/i.test(navigator.userAgent);
Context.mode = isMobile ? 'mobile' : 'desktop';

document.documentElement.setAttribute('mode',Context.mode);
