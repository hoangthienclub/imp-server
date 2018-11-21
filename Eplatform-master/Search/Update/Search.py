
# coding: utf-8

# In[ ]:


# coding: utf-8
import re
import math
import numpy as np
import json

from utils import *
from RealCluster import *
from datetime import datetime
from nltk.probability import FreqDist
from nltk import word_tokenize, cluster
from pymongo import MongoClient
from bson import ObjectId

from SearchData import SearchData
from Condition import Condition


langs = ["en", "vi"]

# # Load data
#      ===============================
print("#", datetime.now())
with gzip.open("model_11092018.bin", "rb") as f:
    p_dict = pickle.load(f)
print("#", datetime.now())

#     ================================
modules = {}
modules["mapDistricts"] = get_all_record("system_mapDistricts", p_dict=p_dict)
modules["mapProvinces"] = get_all_record("system_mapProvinces", p_dict=p_dict)
modules["companyCategories"] = [Category(_id=key, en=w["en"], vi=w["vi"]) for key, w in get_all_record("ep_companyCategories", p_dict=p_dict).items()]
modules["industrialParks"] = {str(key): IndustrialPark(_id=key, en=w["en"], vi=w["vi"]) for key, w in get_all_record("ep_industrialParks", p_dict=p_dict).items()}

modules["codes"] = [Code(_id=key, en=w["en"], vi=w["vi"], code=w["code"], code_type=CODE.NAICS) for key, w in get_all_record("ep_codeNaics", p_dict=p_dict).items()] + [Code(_id=key, en=w["en"], vi=w["vi"], code=w["code"], code_type=CODE.SIC) for key, w in get_all_record("ep_codeSics", p_dict=p_dict).items()] + [Code(_id=key, en=w["en"], vi=w["vi"], code=w["code"], code_type=CODE.VN) for key, w in get_all_record("ep_codeVns", p_dict=p_dict).items()]

print("Loading all modules completed")

class Search(object):
    def optimize_word_dict(self, word_dict):
        if len(word_dict.keys()) == 0:
            return {}
        average = sum(word_dict.values()) * 0.75 / float(len(word_dict.keys()))
        return { key: val for key, val in word_dict.items() if val >= average }
    
    def get_company(self, w: dict) -> Company:
        _cats_id = []
        if "companyCategoryId" in w:
            try:
                _cats_id = [str(e["id"]) for e in w["companyCategoryId"]]
            except:
                pass
            
            
        _codes_id = []
        for _code_attr in ["codeNaicsIds", "codeSicIds", "codeVnIds"]:
            if _code_attr in w:
                _codes_id += [str(e["id"]) for e in w[_code_attr]]
                
        
        return Company(
            name=viterbi(w["data"]["vi"]["name"], p_dict) + " " + str(w["data"]["en"]["name"]).lower(), 
            tax_number=str(w["taxNumber"]), 
            address=Address(
                province_id=str(w["address"]["provinceId"]), 
                district_id=str(w["address"]["districtId"]), 
                lat_lng=LatLng(
                    lat=float(w["address"]["latLng"]["lat"]), 
                    lng=float(w["address"]["latLng"]["lng"])
                )
            ),
            industrial_park=modules["industrialParks"][str(w["industrialParkId"])] if "industrialParkId" in w and str(w["industrialParkId"]) in modules["industrialParks"] else None, 
            categories=[elem for elem in modules["companyCategories"] if elem._id in _cats_id], 
            codes=[elem for elem in modules["codes"] if elem._id in _codes_id]
        )
    
    #     init search: get all data
    def __init__(self, companies=[]):
        print("Init")
        print(datetime.now())
        self.companies = {}
        for i, w in enumerate(companies):
            self.companies[str(w["_id"])] = self.get_company(w)
            if i % 10000 == 0:
                print (i)

        print("Load all " + str(len(self.companies)) + " records")
        
        # init data for searching
        search_text_dict = {  }
        _count = 0
        for key, company in self.companies.items():
            search_text_dict[key] = FreqDist(list(re.split(r"[^a-z0-9_]", company.get_str(modules=modules))))

            _count += 1
            if _count % 10000 == 0:
                print (_count)
                
        print("Convert all " + str(len(self.companies)) + " records to text")
        self.search_data = SearchData(text_dict=search_text_dict)
        
        # related  
        related_text_dict = {  }
        _count = 0
        for key, company in self.companies.items():
            related_text_dict[key] = FreqDist(list(re.split(r"[^a-z0-9_]", company.get_short_str(modules=modules))))

            _count += 1
            if _count % 10000 == 0:
                print (_count)
            
        print("Convert all " + str(len(self.companies)) + " records to text")
        self.related_data = SearchData(text_dict=related_text_dict, ignore_p=True)
        
        
        
        self.matrix_grid = MatrixGrid(max_level=18)
        self.matrix_grid.populate([Data(x=val.address.lat_lng.lng, y=val.address.lat_lng.lat, _id=key) for key, val in self.companies.items()])
        print ("Init search completed")
        print(datetime.now())
    
    
    # need repair
    # Public function  
    def get_tf(self, arr_word: list, data: SearchData):
        freqd = FreqDist(arr_word)
        length = len(arr_word)
        tf = {}
        for word in freqd:
            tf[word] = freqd[word] / length
        return tf

    def get_tfidf(self, arr_word: list, data: SearchData):
        tfidf = {}
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

        return self.optimize_word_dict({ x: y for x, y in self.get_tfidf(search_text, data).items() if y != 0 })
    
    def map_view(self, text: str, zoom: int, bb_string: str, params={}):
        word_dict = self.get_dict(viterbi(text, p_dict), self.search_data)
        vector = [word_dict[key] for key in word_dict.keys()]
        
        ret = self.matrix_grid.map_view(
            search_response=self.process_similarity(vector=vector, word_dict=word_dict, data=self.search_data, zoom=zoom, bb_string=bb_string, order=False, params=params),
            level=zoom,
            bb_string=bb_string
        )
        return ret
    
    def list_view(self, text: str, zoom: int, bb_string: str, page: int, params={}):
        word_dict = self.get_dict(viterbi(text, p_dict), self.search_data)
        vector = [word_dict[key] for key in word_dict.keys()]
        
        ret = self.matrix_grid.list_view(
            search_response=self.process_similarity(vector=vector, word_dict=word_dict, data=self.search_data, zoom=zoom, bb_string=bb_string, params=params),
            level=zoom,
            bb_string=bb_string,
            page=page
        )
        return ret
    
    def similarity_with_id(self, company_id, uuid=None, min_similar=0.5):
        if company_id in self.companies:
            text = self.companies[company_id]["companyCategoryId"] + " " + self.companies[company_id]["address"]
            word_dict = {x: y for x, y in self.get_tfidf(word_tokenize(text), self.related_data).items() if y != 0}
            vector = [word_dict[key] for key in word_dict.keys()]

            vectors = {}
            for _id, w in self.related_data.tfidf_dict.items():
                _v = [w[key] if key in w else 0 for key in word_dict.keys()]
                vectors[_id] = _v

            arr = []
            for key, v in vectors.items():
                similarity = 1 - cluster.cosine_distance(v, vector)
                if similarity > min_similar:
                    arr.append({"_id": key, "similarity": similarity})
                    
            arr.sort(key=lambda x: x["similarity"], reverse=True)
            
            return [e for e in arr if e != company_id][:20]
        else:
            return []
        
    def process_similarity(self, vector: list, word_dict: list, data: SearchData, zoom: int, bb_string: str, min_similar=0.5, order=True, params={}):
        condition = Condition(params=params)
        if len(vector) > 0:
            # get all nodes in current view
            _nodes = self.matrix_grid.get_nodes(level=zoom, bb_string=bb_string)
            print ("#", len(_nodes))
            if condition.has_condition():
                _nodes = condition.valid(_nodes, self.companies)
                min_similar = 0
                
            vectors = {}
            for _id in _nodes:
                w = data.tfidf_dict[_id]
                _v = [w[key] if key in w else 0 for key in word_dict.keys()]
                if sum(_v) > 0:
                    vectors[_id] = _v
                    
            arr = []
            for key, v in vectors.items():
                similarity = 1 - cluster.cosine_distance(v, vector)
                if similarity > min_similar:
                    arr.append({"_id": key, "similarity": similarity})

            if order:
                arr.sort(key=lambda x: x["similarity"], reverse=True)

            return [w["_id"] for w in arr]
        else:
            _nodes = list(data.tfidf_dict.keys())
            if condition.has_condition():
                _nodes = condition.valid(_nodes, self.companies)
            return _nodes# In[ ]:


from datetime import datetime
print("#", datetime.now())
import pickle, gzip
with gzip.open("search_20112018.bin", "rb") as f:
    s = pickle.load(f)
print("#", datetime.now())


import zerorpc
class SearchRPC(object):
    def map_view(self, query):
        return s.map_view(
            text=query["text"],
            zoom=int(query["zoom"]),
            bb_string=query["bb_string"],
            params=query["params"]
        )
    def list_view(self, query):
        return s.list_view(
            text=query["text"],
            zoom=int(query["zoom"]),
            page=int(query["page"]),
            bb_string=query["bb_string"],
            params=query["params"]
        )

print("#", "Running", datetime.now()) 
server = zerorpc.Server(SearchRPC())
server.bind("tcp://0.0.0.0:5252")
server.run()