import http.server
import json

from . import files


class MyServer(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/files':
            return self.do_index()
        return super().do_GET()

    def do_index(self):
        self.send_response(200)
        self.send_header('content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(files.FILES).encode('ascii'))


def run():
    server = http.server.HTTPServer(('', 8000), MyServer)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    server.server_close()
