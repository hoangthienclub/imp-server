import json
import math
class SearchData:
    def __init__(self, text_dict: dict, ignore_p=False):
        print ("Init search")
        self.text_dict = text_dict
        
        # get origin tf dict
        self.origin_tf_dict = self._create_origin_tf_dict()
        print("###               origin_tf_dict")
        
        # get tdf dict
        self.idf_dict = self._create_idf_dict()
        print("###               idf_dict")
        
        # get tf dict
        self.tf_dict = self._create_tf_dict()
        print("###               tf_dict")
        
        # tfidf dict
        self.tfidf_dict = self._create_tfidf_dict(ignore_p=ignore_p)
        print("###               tfidf_dict")
    
    def _create_origin_tf_dict(self) -> dict:
        origin_tf_dict = {}
        count = 0
        for text in self.text_dict.values():
            for word in text:
                if word not in origin_tf_dict:
                    origin_tf_dict[word] = 0
                    
                origin_tf_dict[word] += text[word]

            count += 1
            if count % 10000 == 0:
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
        idf_dict = {}
        length = len(self.text_dict.values())

        for word in self.origin_tf_dict.keys():
            idf_dict[word] = 1 + math.log(length / (float(self.origin_tf_dict[word])))

        return idf_dict

    def _create_tfidf_dict(self, ignore_p=False) -> dict:
        tfidf_dict = {}
        count = 0

        for index, text in self.text_dict.items():
            tfidf_dict[index] = {}
            for word in text:
                if word not in self.idf_dict:
                    continue
                
                if ignore_p:
                    tfidf_dict[index][word] = 1 if (self.tf_dict[index][word]) * (self.idf_dict[word]) > 0 else 0
                else:
                    tfidf_dict[index][word] = (self.tf_dict[index][word]) * (self.idf_dict[word])

            count += 1
            if count % 10000 == 0:
                print(count)

        return tfidf_dict