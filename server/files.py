import os


def _find():
    for path, subdirs, files in os.walk('images'):
        for fname in files:
            if fname.lower().rsplit('.', 1)[-1] in ('jpeg', 'jpg', 'png'):
                yield os.path.join(path, fname)


FILES = list(_find())
