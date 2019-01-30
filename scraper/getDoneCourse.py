# 修過的課
import bs4
import requests
import json
import sys
doneCourse = []
req = requests.Session()
# if you wanna test this code, please input your account and password
req.post('https://aca.nuk.edu.tw/Student2/Menu1.asp',{'Account':sys.argv[1],'Password':sys.argv[2]})
# Classno is your student ID
r = req.post('https://aca.nuk.edu.tw/Student2/SO/ScoreQuery.asp',data={'Classno':''})
r.encoding = 'big5'
soup = bs4.BeautifulSoup(r.text,'html.parser')
soup = soup.select('table[border="1"] tr[align="center"] td')
for i in range(int(len(soup)/7)):
    compulsory = (soup[i*7+3].text == "必修")
    doneCourse.append([soup[i*7].text,soup[i*7+1].text,soup[i*7+2].text,soup[i*7+5].text,compulsory])
# for r in doneCourse:
#     print(r)
print(json.dumps(doneCourse, ensure_ascii=False).encode("utf8",errors='ignore').decode("utf8",errors='ignore'))
# with open('doneCourse.json','w',encoding='utf8') as web:
#    web.write(json.dumps(doneCourse, ensure_ascii=False).encode("utf8",errors='ignore').decode("utf8",errors='ignore'))