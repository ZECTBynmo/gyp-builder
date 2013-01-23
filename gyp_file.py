#!/usr/bin/env python
import glob
import os
import shlex
import sys
import getopt

## grab our
script_dir = os.path.dirname(__file__)
project_root  = os.path.normpath(script_dir)

# Import gyp from the gyp folder inside of our repository
sys.path.insert(0, os.path.join(project_root, 'gyp', 'pylib'))
print os.path.join(project_root, 'gyp', 'pylib')
import gyp

opts, scriptArgs = getopt.getopt(sys.argv[1:], "")

fileName = scriptArgs[0] + ".gyp"
path = scriptArgs[1]
fullPath = path + "/" + fileName

print "Generating %s" % fileName
print "Putting files in: %s" % path

script_dir = os.path.dirname(path)
project_root  = os.path.normpath(os.path.join(script_dir, os.pardir))

sys.path.insert(0, os.path.join(project_root, 'tools', 'gyp', 'pylib'))

# Directory within which we want all generated files (including Makefiles)
# to be written.
output_dir = os.path.join(os.path.abspath(project_root), 'out')

def run_gyp(args):
  rc = gyp.main(args)
  if rc != 0:
    print 'Error running GYP'
    sys.exit(rc)

if __name__ == '__main__':
  fakeargs = ['-f', 'msvs', '-G', 'msvs_version=auto']

  # GYP bug.
  # On msvs it will crash if it gets an absolute path.
  # On Mac/make it will crash if it doesn't get an absolute path.
  if sys.platform == 'win32':
    fakeargs.append(os.path.join(project_root, fullPath))
    common_fn  = os.path.join(project_root, 'common.gypi')
    options_fn = os.path.join(project_root, 'config.gypi')
  else:
    fakeargs.append(os.path.join(os.path.abspath(project_root), fullPath))
    common_fn  = os.path.join(os.path.abspath(project_root), 'common.gypi')
    options_fn = os.path.join(os.path.abspath(project_root), 'config.gypi')

  if os.path.exists(common_fn):
    fakeargs.extend(['-I', common_fn])

  if os.path.exists(options_fn):
    fakeargs.extend(['-I', options_fn])

  fakeargs.append('--depth=' + project_root)

  # There's a bug with windows which doesn't allow this feature.
  if sys.platform != 'win32' and 'ninja' not in fakeargs:
    # Tell gyp to write the Makefiles into output_dir
    fakeargs.extend(['--generator-output', output_dir])

    # Tell make to write its output into the same dir
    fakeargs.extend(['-Goutput_dir=' + output_dir])

  fakeargs.append('-Dcomponent=static_library')
  fakeargs.append('-Dlibrary=static_library')
  gyp_args = list(fakeargs)
  run_gyp(gyp_args)