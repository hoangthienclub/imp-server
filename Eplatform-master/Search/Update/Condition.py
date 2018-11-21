from utils import CODE
from datetime import datetime

class Condition:
    def __init__(self, params={}):
        self.province_ids = set(list(filter(None, [w.strip() for w in params["system_mapProvinces"].split(",")])) if "system_mapProvinces" in params else [])
        self.district_ids = set(list(filter(None, [w.strip() for w in params["system_mapDistricts"].split(",")])) if "system_mapDistricts" in params else [])
        self.categories = set(list(filter(None, [w.strip() for w in params["ep_companyCategories"].split(",")])) if "ep_companyCategories" in params else [])
        self.code_vns = set(list(filter(None, [w.strip() for w in params["ep_codeVns"].split(",")])) if "ep_codeVns" in params else [])
        self.code_sics = set(list(filter(None, [w.strip() for w in params["ep_codeSics"].split(",")])) if "ep_codeSics" in params else [])
        self.code_naics = set(list(filter(None, [w.strip() for w in params["ep_codeNaics"].split(",")])) if "ep_codeNaics" in params else [])
        self.industrial_parks = set(list(filter(None, [w.strip() for w in params["ep_industrialParks"].split(",")])) if "ep_industrialParks" in params else [])
        
    def valid(self, ids: list, company_dict: dict) -> list:
        # check province id
        if len(self.province_ids) > 0:
            ids = [w for w in ids if company_dict[w].address.province_id in self.province_ids]
            
        # check district id
        if len(self.district_ids) > 0:
            ids = [w for w in ids if company_dict[w].address.district_id in self.district_ids]
            
        # check industrial_parks id
        if len(self.industrial_parks) > 0:
            ids = [w for w in ids if company_dict[w].industrial_park and company_dict[w].industrial_park._id in self.industrial_parks]
            
        # check categories id
        if len(self.categories) > 0:
            ids = [w for w in ids if len(company_dict[w].category & self.categories) > 0]
            
        # check code_vns id
        if len(self.code_vns) > 0:
            ids = [w for w in ids if len(company_dict[w].code_dict[CODE.VN] & self.code_vns) > 0]
            
        # check code_vns id
        if len(self.code_sics) > 0:
            ids = [w for w in ids if len(company_dict[w].code_dict[CODE.SIC] & self.code_sics) > 0]
            
        # check code_vns id
        if len(self.code_naics) > 0:
            ids = [w for w in ids if len(company_dict[w].code_dict[CODE.NAICS] & self.code_naics) > 0]
            
        return ids
    
    def has_condition(self):
        return (len(self.province_ids) + len(self.district_ids) + len(self.categories) + len(self.industrial_parks) + len(self.code_vns) + len(self.code_sics) + len(self.code_naics) > 0)