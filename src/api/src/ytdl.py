from datetime import timedelta, datetime
import youtube_dl, json, math

def convert_size(size_bytes):
   if not size_bytes:
       return "0B"
   size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
   i = int(math.floor(math.log(size_bytes, 1024)))
   p = math.pow(1024, i)
   s = round(size_bytes / p, 2)
   return "%s %s" % (s, size_name[i])

def fetch_link(url):   
    ydl = youtube_dl.YoutubeDL({'outtmpl': '%(id)s.%(ext)s'})

    with ydl:
        result = ydl.extract_info(
            url,
            download=False # We just want to extract the info
        )

    if 'entries' in result:
        # Can be a playlist or a list of videos
        video = result['entries'][0]
    else:
        # Just a video
        video = result

    # print(json.dumps(video, indent=2))
    metadata = {
        'title': video['title'],
        'description': video['description'],
        'thumbnail': video['thumbnail'],
        'upload_date': datetime.strptime(video['upload_date'], '%Y%m%d').strftime('%d %B %Y'),
        'duration': str(timedelta(seconds=video['duration'])),
        'view_count': video['view_count'],
        'author': video['uploader'],
        'videos': []
    }

    
    for i in video['formats']:
        if i['ext'] in ['webm','mp4','m4a'] and i["filesize"]:
            metadata['videos'].append({
                "extension": i["ext"],
                "filesize": convert_size(i["filesize"]),
                "format_note": i["format_note"],
                "format": i["format"],
                "url": i["url"]
            })

    return metadata

# video_url = video['url']
# url1 = 'https://www.youtube.com/watch?v=YrRlwUw0GY4'
# url2 = 'https://www.youtube.com/watch?v=U8Qc_dzQTJ4'
# metadata = fetch_link(url2)
# metadata = json.dumps(metadata, indent=2)
# print(metadata)