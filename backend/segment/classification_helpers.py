from tensorflow import keras
import tensorflow as tf
import pydicom
import numpy as np


IMAGE_SIZE = (224,224)

def correct_dcm(dcm):
    x = dcm.pixel_array + 1000
    px_mode = 4096
    x[x>=px_mode] = x[x>=px_mode] - px_mode
    dcm.PixelData = x.tobytes()
    dcm.RescaleIntercept = -1000
    
def get_first_of_dicom_field_as_int(x):
    if type(x) == pydicom.multival.MultiValue:
        return int(x[0])
    return int(x)
    
def get_windowing(data):
    dicom_fields = [data[('0028','1050')].value, # window center
                    data[('0028','1051')].value, # window width
                    data[('0028','1052')].value, # intercept
                    data[('0028','1053')].value, # slope
                   ]
    return [get_first_of_dicom_field_as_int(x) for x in dicom_fields]
    

def get_min_max_of_window_value(window_center, window_width):
    mini = window_center - (window_width // 2)
    maxi = window_center + (window_width // 2) 
    return mini, maxi

def window_image(img, window_center, window_width):
    try:
        _,_, intercept, slope = get_windowing(img)
        img = img.pixel_array * slope + intercept
        img_min, img_max = get_min_max_of_window_value(window_center, window_width)
        img[img < img_min] = img_min
        img[img > img_max] = img_max
    except:
        img = img_min * np.ones(IMAGE_SIZE)
        
    return img

def normalize(channel, wc_ww: tuple, norm_type = 'none'):
    if norm_type.lower() == 'none':
        return channel
    if norm_type.lower() == 'min_max':
        mini, maxi = get_min_max_of_window_value(wc_ww[0], wc_ww[1])
        resulted_channel = (channel - mini) / (maxi - mini)
        return resulted_channel
    

def bsb_window(img):
    bsb_config = {'brain': (40,80),
             'subdural': (80,200),
             'bone': (600, 2000)}
    brain_img = window_image(img, *bsb_config['brain'])
    subdural_img = window_image(img,*bsb_config['subdural'])
    bone_img = window_image(img, *bsb_config['bone'])
    
    brain_img = normalize(brain_img, bsb_config['brain'], 'min_max')
    subdural_img = normalize(subdural_img, bsb_config['subdural'], 'min_max')
    bone_img = normalize(bone_img, bsb_config['bone'], 'min_max')
    bsb_img = np.zeros((brain_img.shape[0], brain_img.shape[1],3))
    bsb_img[:, :, 0] = brain_img
    bsb_img[:, :, 1] = subdural_img
    bsb_img[:, :, 2] = bone_img
    
    if (np.any(np.isnan(bsb_img))):
        bsb_img = np.ones((*IMAGE_SIZE,3))
        
    return bsb_img

        
def np_multilabel_loss(class_weights=None):
    def single_class_crossentropy(y_true, y_pred):
        y_true = tf.cast(y_true, tf.float32)
        y_pred = tf.cast(y_pred, tf.float32)
        
        y_pred = tf.where(y_pred > 1-(1e-07), 1-1e-07, y_pred)
        y_pred = tf.where(y_pred < 1e-07, 1e-07, y_pred)
        single_class_cross_entropies = - tf.reduce_mean(y_true * tf.math.log(y_pred) + (1-y_true) * tf.math.log(1-y_pred), axis=0)

        if class_weights is None:
            loss = tf.reduce_mean(single_class_cross_entropies)
        else:
            loss = tf.reduce_sum(class_weights*single_class_cross_entropies)
        return loss
    return single_class_crossentropy