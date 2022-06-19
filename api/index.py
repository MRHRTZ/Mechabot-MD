import sys
from src import ytdl 

args = sys.argv

function_name = args[1]
data = args[2:]

result = ''

if function_name == 'ytinfo':
    result = ytdl.ytinfo(*data) # [url]
elif function_name == 'ytfile':
    result = ytdl.ytfile(*data) # [resolution, _id, v_id, type]

print(result)