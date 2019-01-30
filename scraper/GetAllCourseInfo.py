import bs4
import requests
import json
deptID = {
    '人文社會科學院':'****11;****12;****15;****17;****18',
    '人文社會科學院共同課程':'****11;****12;****15;****17;****18', # <------- WTF IS THIS???????
    '西洋語文學系':'****11',
    '運動健康與休閒學系':'****12',
    '東亞語文學系':'****17',
    '運動競技學系':'****18',
    '建築學系':'****15', # warning i dont know new id
    '工藝與創意設計學系':'****15', # warning i dont know new id
    '創意設計與建築學系':'****15', # warning i dont know new id
    # hi
    '法學院':'****21;****22;****23',
    '法學院共同課程':'****21;****22;****23',
    '法律學系':'****21',
    '政治法律學系':'****22',
    '財經法律學系':'****23',
    # hi
    '管理學院':'****31;****71;****32;****33;****33;****33',
    '管理學院共同課程':'****31;****71;****32;****33;****33;****33',
    '應用經濟學系':'****31',
    '亞太工商管理學系':'****71',
    '金融管理學系':'****32',
    '資訊管理學系':'****33',
    # hi
    '理學院':'****41;****61;****42;****43',
    '理學院共同課程':'****41;****61;****42;****43',
    '應用數學系':'****41',
    '生命科學系':'****61',
    '應用化學系':'****42',
    '應用物理學系':'****43',
    # hi
    '工學院':'****51;****52;****56;****55',
    '工學院共同課程':'****51;****52;****56;****55',
    '電機工程學系':'****51',
    '土木與環境工程學系':'****52',
    '化學工程及材料工程學系':'****56',
    '資訊工程學系':'****55'
    }
currentYear = 107
currentSemester = 2
coreGeneralEduV2 = {} # 核心通識分類
data = '<tr><td+width=""33%"">開課學年：' + str(currentYear) + '　　開課學期：第' + str(currentSemester) + '學期</td><td+width=""33%"">開課部別：大學部</td><td+width=""34%"">開課系所：無</td></tr><tr><td+width=""33%"">開課班級：無</td><td+width=""33%"">授課教師：無</td><td+width=""34%"">上課時間：無</td></tr>'
req = requests.post('https://course.nuk.edu.tw/QueryCourse/QueryResult.asp', data = {'Condition':data,'Flag': 1,'OpenYear': currentYear,'Helf': currentSemester,'Pclass': 'A','Sclass': '','Yclass': '','SirName': '','Sirno': '','WeekDay': '','Card': '','Subject': '','Language': '','Pre_Cono': '','Coname': ''})
req.encoding = 'big5'
# print(req.text)
soup = bs4.BeautifulSoup(req.text,'html.parser')
soup = soup.find_all('tr')
# print(soup.prettify())
i = 0
all_course = [] #總課表

# coreGeneralEdu = [] # 核心通識分類

for ele in soup:
    if i<=3:
        i+=1
        continue
    tdSet = ele.find_all('td')
    tempCourse = {}
    tempCourse['dept'] = tdSet[0].text.upper()
    tempCourse['id'] = tdSet[1].text.upper()
    tempCourse['target'] = tdSet[3].text
    tempCourse['name'] = tdSet[5].text
    tempCourse['point'] = tdSet[6].text
    tempCourse['limit'] = []
    if tdSet[7].text == '必':
        tempCourse['compulsory'] = True
    else:
        tempCourse['compulsory'] = False
    tempCourse['teacher'] = tdSet[12].decode_contents()[0:-5].replace('<br/>',',')
    # print(tdSet[12].decode_contents()[0:-5].replace('<br/>',','))
    tempCourse['location'] = tdSet[13].text
    # tempCourse['limit'] = tdSet[21].text
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
    if '限修' in tdSet[21].text:
        limitList = ''
        limitReq = requests.get('https://course.nuk.edu.tw/QueryCourse/Limit.asp?OpenYear='+str(currentYear)+'&Helf='+str(currentSemester)+'&Sclass='+tempCourse['dept']+'&Cono='+tempCourse['id'])
        limitReq.encoding = 'big5'
        limitSoup = bs4.BeautifulSoup(limitReq.text, 'html.parser')
        limitSoup = limitSoup.select('table[border="0"] td[width="80%"]')
        print(tempCourse['name'])
        for ele in limitSoup:
            # print(ele.text)
            if '年級' in ele.text:
                limitList+=ele.text[-7:-1]
            else:
                try:
                    limitList+=deptID[ele.text]
                except:
                    limitList+=ele.text.split(' ')[0]
            limitList+=';'
        tempCourse['limit'] = limitList.split(';')[:-1]
    all_course.append(tempCourse)
    # print(all_course)
# for r in coreGeneralEdu:
#     print(r)
with open('AllCourse.json','w',encoding='utf8') as f:
    f.write(json.dumps(all_course, ensure_ascii=False).encode("utf8",errors='ignore').decode("utf8",errors='ignore'))