import nltk
import re
import math
import numpy as np
import zerorpc
import json

from datetime import datetime
from nltk.probability import FreqDist
from bs4 import BeautifulSoup
from nltk import word_tokenize
from nltk.corpus import stopwords
from appdirs import unicode
from pymongo import MongoClient
from bson.objectid import ObjectId

conn = MongoClient("mongodb://admin.nso:1q2w3e4r@103.90.220.79:27017/TempNSO?authSource=admin")
db = conn.TempNSO
langs = ["en", "vi"]

def viet2ascii(text):
    text = text.lower()
    vietnamese_map = {
        ord(u'o'): 'o', ord(u'ò'): 'o', ord(u'ó'): 'o', ord(u'ỏ'): 'o', ord(u'õ'): 'o', ord(u'ọ'): 'o',
        ord(u'ơ'): 'o', ord(u'ờ'): 'o', ord(u'ớ'): 'o', ord(u'ở'): 'o', ord(u'ỡ'): 'o', ord(u'ợ'): 'o',
        ord(u'ô'): 'o', ord(u'ồ'): 'o', ord(u'ố'): 'o', ord(u'ổ'): 'o', ord(u'ỗ'): 'o', ord(u'ộ'): 'o',

        ord(u'a'): 'a', ord(u'à'): 'a', ord(u'á'): 'a', ord(u'ả'): 'a', ord(u'ã'): 'a', ord(u'ạ'): 'a',
        ord(u'ă'): 'a', ord(u'ắ'): 'a', ord(u'ằ'): 'a', ord(u'ẳ'): 'a', ord(u'ẵ'): 'a', ord(u'ặ'): 'a',
        ord(u'â'): 'a', ord(u'ầ'): 'a', ord(u'ấ'): 'a', ord(u'ậ'): 'a', ord(u'ẫ'): 'a', ord(u'ẩ'): 'a',

        ord(u'đ'): 'd', ord(u'd'): 'd',

        ord(u'è'): 'e', ord(u'é'): 'e', ord(u'ẻ'): 'e', ord(u'ẽ'): 'e', ord(u'ẹ'): 'e', ord(u'e'): 'e',
        ord(u'ê'): 'e', ord(u'ề'): 'e', ord(u'ế'): 'e', ord(u'ể'): 'e', ord(u'ễ'): 'e', ord(u'ệ'): 'e',

        ord(u'ì'): 'i', ord(u'í'): 'i', ord(u'ỉ'): 'i', ord(u'ĩ'): 'i', ord(u'ị'): 'i', ord(u'i'): 'i',
        ord(u'ư'): 'u', ord(u'ừ'): 'u', ord(u'ứ'): 'u', ord(u'ử'): 'u', ord(u'ữ'): 'u', ord(u'ự'): 'u',
        ord(u'u'): 'u', ord(u'ũ'): 'u', ord(u'ụ'): 'u', ord(u'ủ'): 'u', ord(u'ú'): 'u', ord(u'ù'): 'u',
        ord(u'ý'): 'y', ord(u'ỳ'): 'y', ord(u'ỷ'): 'y', ord(u'ỹ'): 'y', ord(u'ỵ'): 'y', ord(u'y'): 'y',
        ord(u'-'): ' '
    }
    return unicode(text).translate(vietnamese_map)

def format_string(text, pattern):
    text = re.sub(pattern, "", text.lower())
    return viet2ascii(text.lower().strip())

def viterbi(text, P):
    text = viet2ascii(" ".join(re.split(r"\s+", text)).lower())
    words = [""] + list(re.split(r" ", text))
    best_score = [0] * (len(words) + 1)
    best_edge = [""] * len(words)
    
    
    i = 1
    while i < len(words):
        if words[i] not in p_dict:
            best_score[i] = 0
            best_edge[i] = words[i]
            i += 1
            continue
            
            
        best_score[i] = 9999999999999999999999
        
        j = i
        while j >= 1:
                
            if j == i:
                word = words[i]
            else:
                word = words[j] + "_" + word
            
            if word in p_dict:
                score = best_score[i - len(re.split(r"_", word))] + p_dict[word]
                    
                if score < best_score[i]:
                    best_score[i] = score
                    best_edge[i] = word
                
            j -= 1
        i += 1
        
        
    sent = []
    i = len(words) - 1
    while i > 0:
        sent.append(best_edge[i])
        i -= len(re.split(r"_", sent[-1]))
    
    return " ".join(sent[::-1])

print(datetime.now())
p_dict = json.load(open("model_1.json", "r"))
print(datetime.now())

class SearchData:
    def __init__(self, text_dict: dict, ignore_p=False):
        print ("Init search")
        self.text_dict = text_dict
        
        # convert text to word_set         
        self.word_set = self._create_word_set()
        print("Word set has " + str(len(list(self.word_set))) + " word(s)")
        
        # get origin tf dict
        self.origin_tf_dict = self._create_origin_tf_dict()
        print("###               origin_tf_dict")
        
        # get tf dict
        self.tf_dict = self._create_tf_dict()
        print("###               tf_dict")
        
        # idf dict
        self.idf_dict = self._create_idf_dict()
        print("###               idf_dict")
        
        # tfidf dict
        self.tfidf_dict = self._create_tfidf_dict()
        print("###               tfidf_dict")
        
        # dict
        self.dict = self._create_dict(ignore_p=ignore_p)
        print("###               dict")
        
        
        
    # get search data
    def get_data(self):
        self.search
    
    # Private function   
    def _create_word_set(self) -> set:
        word_set = set([])
        for text in self.text_dict.values():
            word_set = word_set.union(set(list(text)))
            
        return word_set
    
    def _create_origin_tf_dict(self) -> dict:
        origin_tf_dict = dict.fromkeys(self.word_set, 0)
        count = 0
        for text in self.text_dict.values():
            for word in text:
                origin_tf_dict[word] += text[word]

            count += 1
            if count % 1000 == 0:
                print(count)
        return origin_tf_dict
    

    def _create_tf_dict(self) -> dict:
        tf_dict = {}
        count = 0
        for key, text in self.text_dict.items():
            length = sum(text.values())
            tf_dict[key] = {}
            for word in text:
                tf_dict[key][word] = text[word] / length

            count += 1
            if count % 10000 == 0:
                print(count)
                
        return tf_dict

    def _create_idf_dict(self) -> dict:
        idf_dict = dict.fromkeys(self.word_set, 0)
        length = len(self.text_dict.values())

        for word in idf_dict.keys():
            idf_dict[word] = 1 + math.log(length / (float(self.origin_tf_dict[word])))

        return idf_dict

    def _create_tfidf_dict(self) -> dict:
        tfidf_dict = {}
        count = 0

        for index, text in self.text_dict.items():
            tfidf_dict[index] = {}
            for word in text:
                if word not in self.idf_dict:
                    continue
                    
                tfidf_dict[index][word] = (self.tf_dict[index][word]) * (self.idf_dict[word])

            count += 1
            if count % 10000 == 0:
                print(count)

        return tfidf_dict

    def _create_dict(self, ignore_p=False) -> dict:
        if ignore_p:
            return { key: {x: 1 if y > 0 else 0 for x, y in w.items() if y != 0} for key, w in self.tfidf_dict.items() }
        return { key: {x: y for x, y in w.items() if y != 0} for key, w in self.tfidf_dict.items() }


class Search(object):
    # Util function
    def _get_all_record(self, module):
        if module == "codeTags":
            return {}
        
        global db
        print("Start loading module " + module)
        aggregate_data = [
            {
                "$match": {
                    "isDelete": False,
                    "isActive": True
                }
            }, {
                "$lookup": {
                    "from": "langs",
                    "localField": "data.en",
                    "foreignField": "_id",
                    "as": "data.en"
                }
            }, {
                "$unwind": "$data.en"
            }, {
                "$lookup": {
                    "from": "langs",
                    "localField": "data.vi",
                    "foreignField": "_id",
                    "as": "data.vi"
                }
            }, {
                "$unwind": "$data.vi"
            }, {
                "$project": {
                    "en": "$data.en.name",
                    "vi": "$data.vi.name"
                }
            }
        ]
        if module == "companyCategories":
            aggregate_data[0]["$match"]["groupId"] = ObjectId("5b062e32dc9753105c38da55")
            
        arr = [w for w in db[module].aggregate(aggregate_data)]
        if module in ["mapDistricts", "mapProvinces"]:
            return { str(e["_id"]): viterbi(e["en"], p_dict) + " " + viterbi(e["vi"], p_dict) for e in arr }
        
        return { str(e["_id"]): viet2ascii(e["en"].lower()) + " " + viterbi(e["vi"], p_dict) for e in arr }

    def normalize_company(self, company: dict) -> dict:
        global langs
        for attr in [e["attr"] for e in self.arr_lookup]:
            if attr in company:
                arr = []
                if type(company[attr]) == type([]):
                    for _e in company[attr]:
                        if _e is None:
                            continue
                        if "id" in _e:
                            arr.append(str(_e["id"]))
                        else:
                            arr.append(str(_e))
                elif type(company[attr]) == type([]):
                    if "id" in company[attr]:
                        arr.append(str(company[attr]["id"]))
                    else:
                        arr.append(str(company[attr]))
                else:
                    arr.append(str(company[attr]))

                company[attr] = " ".join([self.modules[attr][w] for w in arr if len(w) == 24 and w in self.modules[attr]])
            else:
                company[attr] = " "
        try:
            address = ""
            if "address" in company:
                if "districtId" in company["address"]:
                    address += viet2ascii(self.modules["mapDistricts"][str(company["address"]["districtId"])].lower())
                if "provinceId" in company["address"]:
                    address += " " + viet2ascii(self.modules["mapProvinces"][str(company["address"]["provinceId"])].lower())
            company["address"] = address
        except:
            print("Error - Company id: " + str(company["_id"]))
            company["address"] = ""

        for attr in ["cre_ts", "mod_ts", "userId", "modByUserId", 'logoImageId',
                     'bannerImageId', 'galleryImageIds', 'isActive', 'isDelete', 'completionRate', 'textQuery']:
            if attr in company:
                del company[attr]

            for lang in langs:
                if attr in company["data"][lang]:
                    del company["data"][lang][attr]
        company["_id"] = str(company["_id"])
        
        return company

    def get_companies(self, begin=0, end=100):
        aggregate_data = [
            {
                "$match": {
                    "isDelete": False,
                    "isActive": True,
                    "taxNumber": { "$ne": "" },
                    "textQuery": { "$ne": "" }
                }
            }
        ]
        # aggregate_data.append({"$sort": {"completionRate": -1}})
        aggregate_data.append({"$skip": begin})
        aggregate_data.append({"$limit": end})

        for lang in langs:
            aggregate_data.append({
                "$lookup": {
                    "from": "langs",
                    "localField": "data." + lang,
                    "foreignField": "_id",
                    "as": "data." + lang
                }
            })
            aggregate_data.append({
                "$unwind": "$data." + lang
            })

        return { str(w["_id"]): self.normalize_company(w) for w in db[collectionConst.COMPANIES].aggregate(aggregate_data) }

    #     convert company to list words
    def _company2words(self, company: dict) -> list:
        global langs
        module = self.module

        pattern = r"[<>,\.\.…\-–*`“&'():® \";\/@，]"
        arr = []
        
        
        for key, val in company.items():
            if key in module and module[key] in ["single", "number", "decimal", "email", "tel", "select_lookup", "map"]:
                if module[key] in ["tel"]:
                    arr += list(map(lambda x: re.sub("[^0-9]", "", x["text"].lower()), val))
                elif module[key] in ["email"]:
                    arr += list(map(lambda x: re.sub(pattern, " ", x["text"].lower()), val))
                else:
                    arr.append(re.sub(pattern, " ", str(val)))
                        
                        
        for lang in langs:
            for key, val in company["data"][lang].items():
                if key in ["shortDesc"]:
                    continue
                if key in module and module[key] in ["text"]:
                    _t = ""
                    if lang == "vi":
                        if module[key] == "texteditor":
                            soup = BeautifulSoup(val, 'html.parser')
                            _t = ", ".join(viterbi(re.sub(pattern, " ", text, p_dict)) for text in soup.text.split("\n"))
                        elif module[key] == "map":
                            _t = re.sub(pattern, " ", viterbi(val["rawAddress"], p_dict))
                        else:
                            _t = re.sub(pattern, " ", viterbi(val, p_dict))
                            
                    else:
                        if module[key] == "texteditor":
                            soup = BeautifulSoup(val, 'html.parser')
                            _t = re.sub(pattern, " ", ", ".join(soup.text.split("\n")).lower())
                        elif module[key] == "map":
                            _t = re.sub(pattern, " ", viterbi(val["rawAddress"], p_dict))
                        else:
                            _t = re.sub(pattern, " ", val.lower())

                        _t = " ".join([w for w in word_tokenize(_t) if w not in self.stop_words])
                        
                    
                    arr += re.split(pattern=pattern, string=_t)
                    
            
        freqd = FreqDist([w for w in word_tokenize(viet2ascii(" ".join(arr)))])
        return freqd
    
    
    def _company_related_words(self, company: dict) -> list:
        freqd = FreqDist([w for w in word_tokenize(viet2ascii(company["companyCategoryId"] + " " + company["address"]))])
        return freqd
    
    
    def add_company(self, company: dict):
        self.text_dict[str(company["_id"])] = self._company2words(company)
        vector = list(self.get_tfidf(self.text_dict[str(company["_id"])]).values())
        self.vectors.append(vector)
        self.companies.append(company)
        return vector

    def add_companies(self):
        companies = self.get_companies(begin=self.total_init_record, end=20000)
        count = 0
        for company in companies:
            self.add_company(company)

            count += 1
            if count % 1000 == 0:
                print(count)
    
    
    #     init search: get all data
    def __init__(self, total_init_record=100):
        self.total_init_record = total_init_record
        print("Init")
        print(datetime.now())

        self.stop_words = set(stopwords.words('english'))

        self.module = {}
        self.modules = {}
        
        self.fields = list(db.developmentModules.find({"collection": "companies"}))[0]["config"]['fields']
        self.arr_lookup = [field for field in self.fields if field["inputType"] == "select_lookup"]

        # load another modules
        for e in self.arr_lookup:
            self.modules[e["attr"]] = self._get_all_record(e["lookupFrom"])

        # load map data
        self.modules["mapDistricts"] = self._get_all_record("mapDistricts")
        self.modules["mapProvinces"] = self._get_all_record("mapProvinces")

        print("Loading all modules completed")

        for field in self.fields:
            if field["inputType"] == "tab":
                continue

            self.module[field["attr"]] = field["inputType"]

        self.companies = self.get_companies(0, self.total_init_record)
        print("Load all " + str(len(self.companies)) + " records")

        # init data for searching         
        search_text_dict = { key: self._company2words(company) for key, company in self.companies.items() }
        print("Convert all " + str(len(self.companies)) + " records to text")
    
        self.search_data = SearchData(text_dict=search_text_dict)
        
        
        
        # related  
        related_text_dict = { key: self._company_related_words(company) for key, company in self.companies.items() }
        print("Convert all " + str(len(self.companies)) + " records to text")
    
        self.related_data = SearchData(text_dict=related_text_dict, ignore_p=True)
        print ("Init search completed")
        print(datetime.now())

    
    
    # Public function  
    def get_tf(self, arr_word: list, data: SearchData):
        freqd = FreqDist(arr_word)
        length = len(arr_word)

        tf = dict.fromkeys(data.word_set, 0)
        for word in freqd:
            tf[word] = freqd[word] / length
        return tf

    def get_tfidf(self, arr_word: list, data: SearchData):
        tfidf = dict.fromkeys(data.word_set, 0)
        tf = self.get_tf(arr_word, data)

        for word in arr_word:
            if word not in tf or word not in data.idf_dict:
                continue

            tfidf[word] = (tf[word]) * (data.idf_dict[word])

        return tfidf

    def get_dict(self, search_text: str, data: SearchData, lang="en"):
        if lang != "en":
            search_text = word_tokenize(viterbi(search_text, p_dict))
        else:
            search_text = word_tokenize(search_text.lower())

        return {x: y for x, y in self.get_tfidf(search_text, data).items() if y != 0}

    def _get_val(self, word_dict, key):
        if key in word_dict:
            return word_dict[key]
        return 0
    
    
    def __similarity(self, vector: list, word_dict: list, data: SearchData, min_similar=0.5):
        vectors = {_id: [self._get_val(w, key) for key in word_dict.keys()] for _id, w in data.dict.items()}
        
        arr = []
        for key, v in vectors.items():
            similarity = 1 - nltk.cluster.cosine_distance(v, vector)
            if similarity > min_similar:
                arr.append({"_id": key, "similarity": similarity})

        arr.sort(key=lambda x: x["similarity"], reverse=True)

        return [w["_id"] for w in arr]
    
    def similarity(self, text: str):
        word_dict = self.get_dict(viterbi(text, p_dict), self.search_data)
        vector = [word_dict[key] for key in word_dict.keys()]
        
        return self.__similarity(vector=vector, word_dict=word_dict, data=self.search_data)

    def similarity_with_id(self, company_id, uuid=None):
        if company_id in self.companies:
            text = self.companies[company_id]["companyCategoryId"] + " " + self.companies[company_id]["address"]
            word_dict = {x: y for x, y in self.get_tfidf(word_tokenize(text), self.related_data).items() if y != 0}
            vector = [word_dict[key] for key in word_dict.keys()]

            return [e for e in self.__similarity(vector=vector, word_dict=word_dict, data=self.related_data, min_similar=0.5) if e != company_id][:20]
        else:
            return []


s = zerorpc.Server(Search(20000))
print(datetime.now())
s.bind("tcp://0.0.0.0:5252")
s.run()