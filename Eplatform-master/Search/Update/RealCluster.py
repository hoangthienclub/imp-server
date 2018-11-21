import json
import math
import re
from utils import *
from datetime import datetime

class Node:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
    
class Data(Node):
    def __init__(self, x: float, y: float, _id: str):
        Node.__init__(self, x, y)
        self._id = _id
        
class Rect:
    def __str__(self):
        return "(%f, %f), (%f, %f)\n" % (self.left, self.top, self.right, self.bottom)
    
    def __init__(self, top_left: Node, bottom_right: Node):
        self.top = top_left.y
        self.bottom = bottom_right.y
        self.left = top_left.x
        self.right = bottom_right.x
        
    
    @staticmethod
    def contain(rect, point: Node) -> bool:
        return (point.x >= rect.left and point.x <= rect.right and point.y >= rect.bottom and point.y <= rect.top)
    
    @staticmethod
    def bbstring_to_rect(bbstring: str):
        _arr = list(re.split(",", bbstring))
        return Rect(Node(float(_arr[0]), float(_arr[3])), Node(float(_arr[2]), float(_arr[1])))
    


# In[ ]:


class MatrixGrid:
    def get_rect(self, node: Node, level=None) -> tuple:
        max_index = self.max_index
        if level != None:
            max_index = int(math.pow(2, level))
            
        w = 360
        h = 180
        delta_x = w / max_index
        delta_y = h / max_index
        return (int((node.x + 180) / delta_x), int((node.y + 90) / delta_y))
    
        
    def __init__(self, max_level=17):
        self.max_level = max_level
        self.max_index = int(math.pow(2, max_level))
        self.matrix = {}
    

    def populate(self, datas: list):
        for data in datas:
            row, col = self.get_rect(data)
            if row not in self.matrix:
                self.matrix[row] = {}
            
            if col not in self.matrix[row]:
                self.matrix[row][col] = {
                    "datas": [],
                    "count": 0
                }
            
            self.matrix[row][col]["count"] += 1
            self.matrix[row][col]["datas"].append(data)
            
    
    def rect_box(self, level: int, bb_string: str) -> tuple:
        _rect = Rect.bbstring_to_rect(bb_string)
        _l, _t = self.get_rect(Node(_rect.left, _rect.top), level)
        _r, _b = self.get_rect(Node(_rect.right, _rect.bottom), level)
        
        return (_l, _t, _r, _b)
    
    def get_nodes(self, level: int, bb_string: str) -> list:
        _left, _top, _right, _bottom = self.rect_box(level, bb_string)
        delta_level = int(math.pow(2, self.max_level - level))
        
        _nodes = []
        for row, vals in self.matrix.items():
            _row = int(int(row) / delta_level)
            if _left > _row or _row > _right:
                continue
                
            for col, val in vals.items():
                _col = int(int(col) / delta_level)
                if _bottom > _col or _col > _top:
                    continue
                    
                _nodes += [elem._id for elem in val["datas"]]
        return _nodes
                    
    def map_view(self, search_response: list, level: int, bb_string: str):
        search_dict = dict.fromkeys(search_response, False)
        
        _left, _top, _right, _bottom = self.rect_box(level, bb_string)
        delta_level = int(math.pow(2, self.max_level - level))
        
        _cell = {}
        
        for row, vals in self.matrix.items():
            _row = int(int(row) / delta_level)
            if _left > _row or _row > _right:
                continue
                
            if _row not in _cell:
                _cell[_row] = {}
            
            for col, val in vals.items():
                _col = int(int(col) / delta_level)
                if _bottom > _col or _col > _top:
                    continue
                
                _datas = [elem for elem in val["datas"] if elem._id in search_dict]
                _val_count = len(_datas)
                if _val_count == 0:
                    continue
                    
                    
                if _col not in _cell[_row]:
                    _cell[_row][_col] = {
                        "nodes": [],
                        "count": 0,
                        "lat": 0,
                        "lng": 0,
                        "datas": [],
                        "bounding_box": {
                            "top": 0,
                            "left": 1000,
                            "bottom": 1000,
                            "right": 0
                        }
                    }

                _cell[_row][_col]["nodes"] += list(map(lambda x: str(x._id), _datas))
                
                # all latLngs in current cell
                _lats = list(map(lambda data: data.y, _datas))
                _lngs = list(map(lambda data: data.x, _datas))
                
                _cell[_row][_col]["datas"] += convex_hull([(data.x, data.y) for data in _datas])
                
                _new_val_count = _cell[_row][_col]["count"] + _val_count
                _cell[_row][_col]["lat"] = (_cell[_row][_col]["lat"] * _cell[_row][_col]["count"] + sum(_lats)) / _new_val_count
                _cell[_row][_col]["lng"] = (_cell[_row][_col]["lng"] * _cell[_row][_col]["count"] + sum(_lngs)) / _new_val_count
                _cell[_row][_col]["count"] = _new_val_count
                
                    
                _cell[_row][_col]["bounding_box"]["top"]     = max(_cell[_row][_col]["bounding_box"]["top"], max(_lats))
                _cell[_row][_col]["bounding_box"]["right"]   = max(_cell[_row][_col]["bounding_box"]["right"], max(_lngs))
                _cell[_row][_col]["bounding_box"]["left"]    = min(_cell[_row][_col]["bounding_box"]["left"], min(_lngs))
                _cell[_row][_col]["bounding_box"]["bottom"]  = min(_cell[_row][_col]["bounding_box"]["bottom"], min(_lats))
                
        return [{
                    "nodes": w["nodes"] if len(w["nodes"]) == 1 or delta_level == 1 else [],
                    "count": w["count"],
                    "lat": round(w["lat"], 8),
                    "lng": round(w["lng"], 8),
                    "polygon": convex_hull(w["datas"]),
                    "bounding_box": w["bounding_box"]
                } for key, val in _cell.items() for w in val.values()]
    

    def list_view(self, search_response: list, level: int, bb_string: str, page: int):
        search_dict = dict.fromkeys(search_response, False)
        
        _left, _top, _right, _bottom = self.rect_box(level, bb_string)
        delta_level = int(math.pow(2, self.max_level - level))
        
        _cell = {}
        
        for row, vals in self.matrix.items():
            _row = int(int(row) / delta_level)
            if _left > _row or _row > _right:
                continue
                
            if _row not in _cell:
                _cell[_row] = {}
            
            for col, val in vals.items():
                _col = int(int(col) / delta_level)
                if _bottom > _col or _col > _top:
                    continue
                
                _datas = [elem for elem in val["datas"] if elem._id in search_dict]
                for _data in _datas:
                    search_dict[_data._id] = True

        _arr = [key for key, val in search_dict.items() if val == True]

        return {
            "page": page,
            "current_ids": _arr[page * 20: (page + 1) * 20],
            "total": {
                "page": int(len(_arr) / 20) + 1,
                "node": len(_arr)
            }
        }