import re
import gzip
import pickle

from appdirs import unicode
from bson import ObjectId
from enum import Enum
from pymongo import MongoClient
from datetime import datetime

conn = MongoClient("mongodb://admin.nso:1q2w3e4r@103.90.220.79:27017/TempNSO?authSource=admin")
db = conn.TempNSO

def parse_query(obj: dict):
    return {key.decode(): next(iter([w.decode() for w in obj[key]]), None) for key in obj}

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
        if words[i] not in P:
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
            
            if word in P:
                score = best_score[i - len(re.split(r"_", word))] + P[word]
                    
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

def get_aggregate(langs: list) -> list:
    aggregate_data = [
        {
            "$match": {
                "isDelete": False,
                "isActive": True,
                "taxNumber": { "$ne": "" },
                "textQuery": { "$ne": "" },
                "address.latLng.lng": { "$exists": True },
                "address.latLng.lat": { "$exists": True },
                "address.districtId": { "$exists": True },
                "address.provinceId": { "$exists": True }
            }
        }
    ]
    for lang in langs:
        aggregate_data.append({
            "$lookup": {
                "from": "system_langs",
                "localField": "data." + lang,
                "foreignField": "_id",
                "as": "data." + lang
            }
        })
        aggregate_data.append({
            "$unwind": "$data." + lang
        })
    aggregate_data.append({
        "$project": {
            "data.en.name": 1,
            "data.vi.name": 1,
            "address": 1,
            "taxNumber": 1,
            "codeVnIds": 1,
            "codeNaicsIds": 1,
            "codeSicIds": 1,
            "companyCategoryId": 1,
            "industrialParkId": "$industrialParkId.id"
        }
    })
    
    return aggregate_data
    
    
def convex_hull(points):
    points = sorted(set(points))
    if len(points) <= 1:
        return points

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower = []
    for p in points:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)

    upper = []
    for p in reversed(points):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
        
    return lower[:-1] + upper[:-1]


def get_all_record(module, p_dict):
    print("Start loading module " + module)
    aggregate_data = [
        {
            "$match": {
                "isDelete": False,
                "isActive": True
            }
        }, {
            "$lookup": {
                "from": "system_langs",
                "localField": "data.en",
                "foreignField": "_id",
                "as": "data.en"
            }
        }, {
            "$unwind": "$data.en"
        }, {
            "$lookup": {
                "from": "system_langs",
                "localField": "data.vi",
                "foreignField": "_id",
                "as": "data.vi"
            }
        }, {
            "$unwind": "$data.vi"
        }, {
            "$project": {
                "en": "$data.en.name",
                "vi": "$data.vi.name",
                "code": "$code"
            }
        }
    ]

    if module == "ep_companyCategories":
        aggregate_data[0]["$match"]["groupId"] = ObjectId("5b062e32dc9753105c38da55")

    arr = [w for w in db[module].aggregate(aggregate_data)]

    return { str(e["_id"]): { 
        "en": viterbi(e["en"], p_dict) if module in ["system_mapDistricts", "system_mapProvinces"] else viet2ascii(e["en"].lower()),
        "vi": viterbi(e["vi"], p_dict),
        "code": e["code"] if "code" in e else ""
    } for e in arr }


class CODE(Enum):
    NAICS  = 1
    NSO    = 2
    SIC    = 3
    VN     = 4
    
class Code:
    def __init__(self, _id: str, en: str, vi: str, code: str, code_type: CODE):
        self._id       = _id
        self.en        = en
        self.vi        = vi
        self.code      = code
        self.code_type = code_type

    def get_str(self) -> str:
        return self.en + " " + self.vi + " " + self.code
    
class Category:
    def __init__(self, _id: str, en: str, vi: str):
        self._id = _id
        self.en  = en
        self.vi  = vi

    def get_str(self) -> str:
        return self.en + " " + self.vi
    
class IndustrialPark:
    def __init__(self, _id: str, en: str, vi: str):
        self._id = _id
        self.en  = en
        self.vi  = vi

    def get_str(self) -> str:
        return self.en + " " + self.vi
    
class LatLng:
    def __init__(self, lat: float, lng: float):
        self.lat = lat
        self.lng = lng
        
class Address:
    def __init__(self, province_id: str, district_id: str, lat_lng: LatLng):
        self.province_id = province_id
        self.district_id = district_id
        self.lat_lng     = lat_lng
        
    def get_str(self, modules: dict) -> str:
        _ret = ""
        if self.province_id in modules["mapProvinces"]:
            _ret += modules["mapProvinces"][self.province_id]["en"] + " " + " " + modules["mapProvinces"][self.province_id]["vi"]
        if self.district_id in modules["mapDistricts"]:
            _ret += " " + modules["mapDistricts"][self.district_id]["en"] + " " + modules["mapDistricts"][self.district_id]["vi"]
        return _ret
    
class Company:
    def __init__(self, name: str, tax_number: str, codes: list, categories: list, industrial_park: IndustrialPark, address: Address):
        self.name       = name
        self.tax_number = tax_number
        self.codes      = codes
        self.address    = address
        self.categories = categories
        self.code_dict  = {}
        self.category   = set([str(e._id) for e in self.categories])
        self.industrial_park = industrial_park
        
        self.code_dict[CODE.VN]    = set([str(e._id) for e in self.codes if e.code_type == CODE.VN])
        self.code_dict[CODE.SIC]   = set([str(e._id) for e in self.codes if e.code_type == CODE.SIC])
        self.code_dict[CODE.NAICS] = set([str(e._id) for e in self.codes if e.code_type == CODE.NAICS])
        
        
    def get_str(self, modules: dict) -> str:
        return " ".join([
            self.name,
            self.tax_number,
            self.address.get_str(modules=modules),
            self.industrial_park.get_str() if self.industrial_park != None else "",
            " ".join([code.get_str() for code in self.codes]),
            " ".join([category.get_str() for category in self.categories]),
        ])
    
    def get_short_str(self, modules: dict) -> str:
        return " ".join([
            self.address.get_str(modules=modules),
            " ".join([category.get_str() for category in self.categories]),
        ])
    
    def release(self):
        del self.codes
        del self.name
        del self.tax_number
        del self.categories
        del self.industrial_parks