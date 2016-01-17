# coding: utf-8


from django_assets import Bundle, register


css_main = Bundle(
    'bootstrap/dist/css/bootstrap.css',
    'font-awesome/css/font-awesome.css',
    'css/styles.css',

    filters=('cssrewrite', 'yui_css',),
    output='compiled-assets/gen/css_main.%(version)s.css'
)

register('css_main', css_main)

js_main = Bundle(
    'lodash/lodash.js',

    'angular/angular.js',

    'angular-animate/angular-animate.js',
    'angular-cookies/angular-cookies.js',
    'angular-resource/angular-resource.js',
    'angular-route/angular-route.js',

    'angular-ui-bootstrap/dist/ui-bootstrap.js',
    'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',

    'js/angular-app/game/module.js',
    'js/angular-app/game/services.js',
    'js/angular-app/game/resources.js',
    'js/angular-app/game/controllers.js',

    'js/angular-app/dispatch.js',

    filters='closure_js',
    output='compiled-assets/gen/js_main.%(version)s.js')

register('js_main', js_main)
