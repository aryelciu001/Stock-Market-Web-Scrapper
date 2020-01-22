import time
import datetime
import pytz
import bs4
import json
from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup

#for time
now = datetime.datetime.now()
timezone = pytz.timezone("Asia/Jakarta")
now_aware = now.astimezone(timezone)

#Preparation
listOfStocks = ["BBNI", "BBRI", "BBCA", "AALI", "ACES", "ADES", "ADRO", "BNLI", "INDF", "MNCN", "TLKM", "UNVR"]

url = "https://sg.finance.yahoo.com/quote/"
stocks = {}
stock = {}

def infoCleaner(infoContainer):
    information = []
    for i in infoContainer.findAll("td"):
        if len(i.findAll(text=True)) > 1:
            string = i.findAll(text=True)
            sliceObject = slice(0,5,2)
            string = string[sliceObject]
            string = ''.join(string)
            information.append(string)
        else:
            information.append(i.findAll(text = True)[0])
    return information

def infoInserter(information, stockInfo):
    i = 0
    while i != len(information):
        stockInfo[information[i]] = information[i+1]
        i+=2
    return stockInfo

def requester(url, index):
    url = "https://sg.finance.yahoo.com/quote/"
    url = url + stock + ".JK"
    uClient = uReq(url)
    pageHtml = uClient.read()
    uClient.close()
    pageSoup = soup(pageHtml, "html.parser")
    return pageSoup

#Loop
# while(True):
for stock in listOfStocks:
    try:
        stockInfo = {}
        url = "https://sg.finance.yahoo.com/quote/"
        
        #request the page
        pageSoup = requester(url, stock)
        
        #input the information
        infoContainer = pageSoup.findAll("div",{"id":"quote-summary"})[0]
        information = infoCleaner(infoContainer)
        stockInfo = infoInserter(information, stockInfo)
        
        #Find the price
        price = (pageSoup.findAll("span", {"class":"Trsdu(0.3s)"})[0].contents[0]).replace(",","")
        stockInfo["Price"] = price
        
        stocks[stock] = stockInfo
    except:
        pass

stocks = json.dumps(stocks)

print(stocks)