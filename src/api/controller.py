import os
import traceback
from flask import request
from src import (
    ytdl as ytdlfunc
) 

status = {
    'active': 'T',
    'maintenance': 'F',
    'error': 'E'
}

def apilist():
    listapi = [
        {
            'status': status['active'],
            'title': 'Youtube Downloader ',
            'description': 'Download MP4 and MP3 From Youtube',
            'category': 'Downloader ⬇️',
            'command': ['ytdl', 'ytmp3', 'ytmp4', 'youtube', 'yt', 'ytdownload'],
            'args': ['url'],
            'endpoint': '/ytdl'
        }
    ]
    return { 'status': 200, 'result': listapi }

def ytdl():
    if request.method == "POST":
        response = { 'status': 500, 'message':'', 'result': {} }
        try:
            url = request.json['url']
            result = ytdlfunc.fetch_link(url)
            response['status'] = 200
            response['result'] = result
            return response
        except:
            response['message'] = traceback.format_exc()
            return response
    else:
        return {
            'status': 400,
            'request': {
                'url': 'https://www.youtube.com/watch?v=StRuaKYHl6o'
            }
        }