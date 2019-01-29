import bs4
import requests
import json
coreGeneralEduV2 = {} # 核心通識分類
for y in range(103,108):
    for semester in range(1,3):
        print('現在進度', y, semester)
        data = '<tr><td+width=""33%"">開課學年：' + str(y) + '　　開課學期：第' + str(semester) + '學期</td><td+width=""33%"">開課部別：大學部</td><td+width=""34%"">開課系所：無</td></tr><tr><td+width=""33%"">開課班級：無</td><td+width=""33%"">授課教師：無</td><td+width=""34%"">上課時間：無</td></tr>'
        req = requests.post('https://course.nuk.edu.tw/QueryCourse/QueryResult.asp', data = {'Condition':data,'Flag': 1,'OpenYear': y,'Helf': semester,'Pclass': 'A','Sclass': '','Yclass': '','SirName': '','Sirno': '','WeekDay': '','Card': '','Subject': '','Language': '','Pre_Cono': '','Coname': ''})
        req.encoding = 'big5'
        soup = bs4.BeautifulSoup(req.text,'html.parser')
        soup = soup.find_all('tr')
        i = 0
        all_course = [] #總課表
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
            all_course.append(tempCourse)
        for ele in all_course:
            if ele['dept'] == 'CC':
                # print(ele['id'])
                infoUrl = 'https://course.nuk.edu.tw/QueryCourse/tcontent.asp?OpenYear=' + str(y) + '&Helf=' + str(semester) + '&Sclass=CC&Cono=' + ele['id']
                CCinfo = requests.get(infoUrl)
                CCinfo.encoding = 'big5'
                CCinfoSoup = bs4.BeautifulSoup(CCinfo.text,'html.parser')
                # td[11]是通識分類 取出之後為"科學素養－科學素養" 再將其切割為"科學素養"
                CCinfoSoup = CCinfoSoup.find_all('td')[11].text.split('－')[0]
                coreGeneralEduV2['CC'+ele['id'] +'Y'+str(y) + str(semester)] = [ele['name'].strip(), CCinfoSoup]
        print(coreGeneralEduV2)
    with open('GeneralEduList.json','w',encoding='utf8') as f:
    f.write(json.dumps(coreGeneralEduV2, ensure_ascii=False).encode("utf8",errors='ignore').decode("utf8",errors='ignore'))