"""
Django's settings for mandatabase project.

Generated by 'django-admin startproject' using Django 4.2.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from django.core.management.utils import get_random_secret_key

# from osgeo import gdal
from pathlib import Path
import os
import configparser

# print(get_random_secret_key())

# Read the config file
config = configparser.ConfigParser()
config.read("config.ini")

# from django.contrib.gis.gdal import GDAL_LIBRARY_PATH
# GDAL_LIBRARY_PATH = os.path.join('C:', 'Program Files', 'GDAL', 'gdal.dll')

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config.get("django", "SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# local
ALLOWED_HOSTS = ["*"]

# production
# ALLOWED_HOSTS = [
#    'http://ec2-50-19-10-121.compute-1.amazonaws.com/',
#    '50.19.10.121',
#    'http://50.10.19.121',
#    'django',
# ]

# Application definition
INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Maritime
    "maritimeapp",
    # GeoDjango
    "django.contrib.gis",
    # GIS rest
    "rest_framework_gis",
    # restframework
    "rest_framework",
    # filters for django
    "django_filters",
]


MIDDLEWARE = [
    # reponse headers
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "maritimeapp.middleware.CorsMiddleware",
]


SECURE_REFERRER_POLICY = "origin-when-cross-origin"

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
    'aod_key',
    'sites',

]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3001',
]

# CSRF_COOKIE_SECURE = False
# CSRF_COOKIE_SAMESITE = 'None'
CORS_ALLOW_ALL_ORIGINS = True
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:63343",
#     "http://127.0.0.1:63343",
# ]

# ALLOWED_HOSTS = [
#     '127.0.0.1'
#     'localhost',
#     'localhost:63343',
# ]

CORS_ALLOW_METHODS = ["POST", "OPTIONS", "GET"]

# CORS_ALLOW_HEADERS = [
#     'Content-Type',
#     'X-CSRFToken',
# ]

ROOT_URLCONF = "mandatabase.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "mandatabase.wsgi.application"

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# Get the database configuration values
database_engine = config.get("database", "ENGINE")
database_name = config.get("database", "NAME")
database_user = config.get("database", "USER")
database_password = config.get("database", "PASSWORD")
database_host = os.getenv('DJANGO_DB_HOST', 'db')
database_port = config.get("database", "PORT")

DATABASES = {
    "default": {
        "ENGINE": database_engine,
        "NAME": database_name,
        "USER": database_user,
        "PASSWORD": database_password,
        "HOST": database_host,
        "PORT": database_port,
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"