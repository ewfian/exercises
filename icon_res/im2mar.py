# coding=gbk
from PIL import Image
import numpy as np
# import scipy

def loadImage():
    # ��ȡͼƬ
    im = Image.open("logo.bmp")

    # ��ʾͼƬ
    im.show() 
    np.set_printoptions(threshold=np.nan)
    im = im.convert("L") 
    data = im.getdata()
    data = np.reshape(data,(30,130))
    data = np.matrix(data)
    print(data)
    
    new_im = Image.fromarray(data)
    # ��ʾͼƬ
    new_im.show()
    
loadImage()
