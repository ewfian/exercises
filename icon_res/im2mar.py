# coding=gbk
from PIL import Image
import numpy as np
# import scipy

def loadImage():
    # 读取图片
    im = Image.open("logo.bmp")

    # 显示图片
    im.show() 
    np.set_printoptions(threshold=np.nan)
    im = im.convert("L") 
    data = im.getdata()
    data = np.reshape(data,(30,130))
    data = np.matrix(data)
    print(data)
    
    new_im = Image.fromarray(data)
    # 显示图片
    new_im.show()
    
loadImage()
