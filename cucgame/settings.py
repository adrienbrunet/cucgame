import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def root(*dirs):
    return os.path.join(os.path.abspath(BASE_DIR), *dirs)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'yq-rh^b#^0-s=tx$_0qz8h@gaz19fxpdc^1ifi96tz7yisp*3m'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['game.fanfare-cuc.fr' ]


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_assets',
    'rest_framework',
    'game',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'cucgame.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'cucgame.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'cucgame',
        'USER': 'cucgame',
        'PASSWORD': 'cucgame',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = root('static_prod')
STATICFILES_DIRS = (
    root('static'),
    root('node_modules'),
    root('cucgame/static/'),
)


ASSETS_VERSIONS = 'hash:32'
# The javascript we have doesn't pass with Closure advanced optimizations
# CLOSURE_COMPRESSOR_OPTIMIZATION = 'ADVANCED_OPTIMIZATIONS'

CLOSURE_EXTRA_ARGS = ['--language_in', 'ECMASCRIPT5']

ASSETS_URL_EXPIRE = False

ASSETS_DEBUG = DEBUG is True

ASSETS_AUTO_BUILD = DEBUG is True
