from flask import Flask, send_from_directory
import sys

app = Flask(__name__, static_folder='public')
dir = sys.argv[1] if len(sys.argv) > 1 else './public'
port = int(sys.argv[2]) if len(sys.argv) > 2 else 1313

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static(path):
    if path != "" and path.exists(path):
        return send_from_directory(dir, path)
    else:
        return send_from_directory(dir, 'index.html')

if __name__ == '__main__':
    app.run(port=port)
