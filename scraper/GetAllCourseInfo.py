import bs4
import requests
import json
#使用chrome的webdriver
data = '<tr><td+width=""33%"">開課學年：107　　開課學期：第2學期</td><td+width=""33%"">開課部別：大學部</td><td+width=""34%"">開課系所：無</td></tr><tr><td+width=""33%"">開課班級：無</td><td+width=""33%"">授課教師：無</td><td+width=""34%"">上課時間：無</td></tr>'
req = requests.post('https://course.nuk.edu.tw/QueryCourse/QueryResult.asp', data = {'Condition':data,'Flag': 1,'OpenYear': 107,'Helf': 2,'Pclass': 'A','Sclass': '','Yclass': '','SirName': '','Sirno': '','WeekDay': '','Card': '','Subject': '','Language': '','Pre_Cono': '','Coname': ''})
req.encoding = 'big5'
# print(req.text)
soup = bs4.BeautifulSoup(req.text,'html.parser')
soup = soup.find_all('tr')
# print(soup.prettify())
i = 0

all_course = [] #總課表
coreGeneralEdu = [] # 核心通識分類

for ele in soup:
    if i<=3:
        i+=1
        continue
    tdSet = ele.find_all('td')
    
    # print(ele.text.split(' '))
    tempCourse = {}
    tempCourse['dept'] = tdSet[0].text.upper()
    tempCourse['id'] = tdSet[1].text.upper()
    tempCourse['target'] = tdSet[3].text
    tempCourse['name'] = tdSet[5].text
    tempCourse['point'] = tdSet[6].text
    if tdSet[7].text == '必':
        tempCourse['compulsory'] = True
    else:
        tempCourse['compulsory'] = False
    tempCourse['teacher'] = tdSet[12].text
    tempCourse['location'] = tdSet[13].text
    course_time = []
    tempCourseTime = []
    for i in range(14,20):
        if tdSet[i].text != '\u3000':
            # print(ele.text.split(' ')[i])
            for day in tdSet[i].text.split(','):
                # print(i-13, day)
                if day == 'X':
                    course_time.append([i-13, 0])
                elif day == 'Y':
                    course_time.append([i-13, 4.5])
                else:
                    course_time.append([i-13, int(day)])
    
    tempCourse['time'] = course_time
    all_course.append(tempCourse)
    # print(all_course)
for ele in all_course:
    # print(ele['dept'])
    if ele['dept'] == 'CC':
        # print(ele['id'])
        infoUrl = 'https://course.nuk.edu.tw/QueryCourse/tcontent.asp?OpenYear=107&Helf=2&Sclass=CC&Cono=' + ele['id']
        CCinfo = requests.get(infoUrl)
        CCinfo.encoding = 'big5'
        CCinfoSoup = bs4.BeautifulSoup(CCinfo.text,'html.parser')
        # td[11]是通識分類 取出之後為"科學素養－科學素養" 再將其切割為"科學素養"
        CCinfoSoup = CCinfoSoup.find_all('td')[11].text.split('－')[0]
        coreGeneralEdu.append(['CC'+ele['id'],ele['name'], CCinfoSoup])
for r in coreGeneralEdu:
    print(r)
with open('test.json','w',encoding='utf8') as f:
    f.write(json.dumps(all_course, ensure_ascii=False).encode("utf8",errors='ignore').decode("utf8",errors='ignore'))