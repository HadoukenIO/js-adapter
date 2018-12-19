#!/usr/bin/env python

import os
import subprocess
import sys

SOURCE_ROOT = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
DOCS_DIR = os.path.join(SOURCE_ROOT, 'docs')
JENKINS_ROOT = os.path.dirname(os.path.dirname(SOURCE_ROOT))
S3_CREDENTIALS_FILE = os.path.join(JENKINS_ROOT, 'config', 's3credentials')

VERSION_NUMBER = os.environ['VERSION_NUMBER']
RELEASE_CHANNEL = os.environ['RELEASE_CHANNEL']


def main():
  # S3 credentials
  if not os.path.isfile(S3_CREDENTIALS_FILE):
    return 'Error: Can\'t find {0}'.format(S3_CREDENTIALS_FILE)
  copy_to_environment(S3_CREDENTIALS_FILE)

  args = ['--recursive', '--cache-control', 'max-age=60']
  if RELEASE_CHANNEL == 'stable':
    return (upload_to_s3(DOCS_DIR, 's3://cdn.openfin.co/docs/javascript/' + VERSION_NUMBER, args) or
            upload_to_s3(DOCS_DIR, 's3://cdn.openfin.co/docs/javascript/stable', args) or
            upload_to_s3(DOCS_DIR, 's3://cdn.openfin.co/docs/javascript/staging', args) or
            upload_to_s3(DOCS_DIR, 's3://cdn.openfin.co/docs/javascript/community', args))
  else:
    return (upload_to_s3(DOCS_DIR, 's3://cdn.openfin.co/docs/javascript/' + VERSION_NUMBER, args) or
            upload_to_s3(DOCS_DIR, 's3://cdn.openfin.co/docs/javascript/' + RELEASE_CHANNEL, args))


def copy_to_environment(credentials_file):
  with open(credentials_file, 'r') as f:
    for line in f:
      key, value = line.strip().split('=')
      value = value.strip("'")
      os.environ[key] = value


def s3_config():
  config = (os.environ.get('RUNTIME_S3_ACCESS_KEY', ''),
            os.environ.get('RUNTIME_S3_SECRET_KEY', ''))
  message = ('Error: Please set the '
             '$RUNTIME_S3_ACCESS_KEY, and '
             '$RUNTIME_S3_SECRET_KEY environment variables')
  assert all(len(c) for c in config), message
  return config


def upload_to_s3(file, s3_dest_path, args=[]):
  access_key, secret_key = s3_config()
  env = os.environ.copy()
  env['AWS_ACCESS_KEY_ID'] = access_key
  env['AWS_SECRET_ACCESS_KEY'] = secret_key
  return subprocess.call(['aws', 's3', 'cp', file, s3_dest_path] + args, env=env)


if __name__ == '__main__':
  sys.exit(main())
