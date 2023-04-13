import sys
sys.path.insert(0, '/home/b5root/SERVER')

activate_this = '/home/b5root/.local/share/virtualenvs/SERVER-ZcsPzXIg/bin/activate_this.py'

with open(activate_this) as file_:
    exec(file.read(), dict(__file__=activate_this))

from app import app as application 