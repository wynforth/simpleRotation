import urllib.request
import json, os
from time import sleep
from random import uniform

dir_path = os.path.dirname(os.path.realpath(__file__))

baseurl = "https://api.xivdb.com/status/"
store = os.path.join(dir_path,"img\/status\/")
print(dir_path)

fullurl = baseurl + "1"
errcount = 0
for j in range(1381,1415,50):
	sleep(uniform(0,5))
	if errcount > 10:
		break
	for i in range(j,j+50):
		sleep(uniform(0,1))
		fullurl = baseurl + str(i)
		try:
			with urllib.request.urlopen(fullurl) as url:
				data = json.loads(url.read().decode())
				name = data["name"].lower().replace(" ","_")
				icon_url = data["icon_hq"]
				urllib.request.urlretrieve (icon_url, store+name+".png")
				print(data["name"])
				
		except:
			print("no status id " + str(i))
			errcount = errcount + 1
			if errcount > 10:
				print("quitting early at " + str(i) + " too many skipped")
				break
			#print(data)