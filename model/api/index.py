"""Vercel entry point.

This file exposes the FastAPI `app` object required by the @vercel/python runtime.
It simply imports the existing application defined in `services/geoclustering.py`.
from services.geoclustering import app as fastapi_app
app = fastapi_app
"""

from flask import Flask, jsonify
import json
import os

app = Flask(__name__)

@app.route('/clusters', methods=['GET'])
def get_clusters():
    with open(os.path.join(os.path.dirname(__file__), '../clusters.json')) as f:
        clusters = json.load(f)
    return jsonify(clusters)

if __name__ == '__main__':
    app.run(port=8000)
