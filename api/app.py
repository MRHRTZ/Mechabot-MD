import os
import controller

from flask import Flask, send_from_directory
# from flask_restplus import Api



from dotenv import load_dotenv
load_dotenv()

port = os.getenv('apiport')
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

# Index
@app.route('/')
def index():
    return send_from_directory('template', 'index.html')
@app.route('/css/<path>')
def send_css(path):
    return send_from_directory('template/css', path)
@app.route('/js/<path>')
def send_js(path):
    return send_from_directory('template/js', path)

@app.route('/quit')
def _quit():
    os._exit(0)
    
# API LIST
app.add_url_rule('/api', view_func=controller.apilist, methods=['GET', 'POST'])

# Functions
app.add_url_rule('/api/ytdl', view_func=controller.ytdl, methods=['GET', 'POST'])



if __name__ == '__main__':
    print('Listening port : {0}'.format(port))
    app.run(debug=True, port=port, use_reloader=True)