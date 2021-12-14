# import libraries 
from tensorflow import keras
import tensorflow as tf
import pydicom
import numpy as np

# initialize image size variable 
IMAGE_SIZE = (224,224)

def correct_dcm(dcm):
    '''
    this function corrects the DICOM images whose bits stored == 12, pixel representation == 0 and rescale intercept > -100

        Parameters:
        - dcm: DICOM image 
    '''
    x = dcm.pixel_array + 1000
    px_mode = 4096
    x[x>=px_mode] = x[x>=px_mode] - px_mode
    dcm.PixelData = x.tobytes()
    dcm.RescaleIntercept = -1000
    
def get_first_of_dicom_field_as_int(x):
    '''
    this function converts a multi-valued DICOM value to integer 

        Parameters:
        - x: multi-valued DICOM value

        Returns:
        - int(x): integer value of the input
    '''
    if type(x) == pydicom.multival.MultiValue:
        return int(x[0])
    return int(x)
    
def get_windowing(data):
    '''
    this function gets the windowing values from the DICOM metadata

        Parameters:
        - data: DICOM metadata

        Returns:
        - list of integer windowing values 
    '''
    dicom_fields = [data[('0028','1050')].value, # window center
                    data[('0028','1051')].value, # window width
                    data[('0028','1052')].value, # intercept
                    data[('0028','1053')].value, # slope
                   ]
    return [get_first_of_dicom_field_as_int(x) for x in dicom_fields]

def get_min_max_of_window_value(window_center, window_width):
    '''
    this function computes the maximum and minimum window values

        Parameters:
        - window_center: window center value of the image from DICOM metadata
        - window_width: window width value of the image from DICOM metadata

        Returns:
        - mini: minimum window value 
        - maxi: maximum window value 
    '''
    mini = window_center - (window_width // 2)
    maxi = window_center + (window_width // 2) 
    return mini, maxi

def window_image(img, window_center, window_width):
    '''
    this function changes the windowing values of the image

        Parameters:
        - img: DICOM image
        - window_center: window center value of the image from DICOM metadata
        - window_width: window width value of the image from DICOM metadata

        Returns:
        -img: DICOM image with the new windowing 
    '''
    try:
        # call get_windowing function to get window values
        _,_, intercept, slope = get_windowing(img) 
        # change window values 
        img = img.pixel_array * slope + intercept
        img_min, img_max = get_min_max_of_window_value(window_center, window_width)
        img[img < img_min] = img_min
        img[img > img_max] = img_max
    except:
        img = img_min * np.ones(IMAGE_SIZE)
        
    return img

def normalize(channel, wc_ww: tuple, norm_type = 'none'):
    '''
    this function normalizes the image channel with respect to the given window values

        Parameters:
        - channel: DICOM image with the channel windowing (ex: brain, subdural, bone)
        - wc_ww: tuple of window center and window width values
        - norm_type: normalization type

        Returns:
        - resulted_channel: image after normalization 
    '''
    if norm_type.lower() == 'none':
        # return same image if no normalization type is specified 
        return channel 
    if norm_type.lower() == 'min_max':
        # get min and max values of window center and window width
        mini, maxi = get_min_max_of_window_value(wc_ww[0], wc_ww[1]) 
        # normalize channel 
        resulted_channel = (channel - mini) / (maxi - mini)
        return resulted_channel
    
def bsb_window(img, third_window):
    '''
    this function preprocesses the DICOM image

        Parameters:
        - img: DICOM image

        Returns:
        - bsb_image: image array after preproessing  
    '''
    if third_window == "bone":
        third = (600, 2000)
    else:
        third = (50, 350)

    bsb_config = {'brain': (40,80),     # brain channel
             'subdural': (80,200),      # subdural channel
             third_window: third}       # bone channel

    brain_img = window_image(img, *bsb_config['brain'])         # image with brain channel
    subdural_img = window_image(img,*bsb_config['subdural'])    # image with subdural channel
    third_img = window_image(img, *bsb_config[third_window])           # image with bone channel
    
    brain_img = normalize(brain_img, bsb_config['brain'], 'min_max')                # normalize image with brain channel
    subdural_img = normalize(subdural_img, bsb_config['subdural'], 'min_max')       # normalize image with subdural channel
    third_img = normalize(third_img, bsb_config[third_window], 'min_max')                   # normalize image with bone channel

    # preprocessed image
    bsb_img = np.zeros((brain_img.shape[0], brain_img.shape[1], 3)) 
    bsb_img[:, :, 0] = brain_img
    bsb_img[:, :, 1] = subdural_img
    bsb_img[:, :, 2] = third_img
    
    if (np.any(np.isnan(bsb_img))):
        bsb_img = np.ones((*IMAGE_SIZE,3)) # reshape image 
        
    return bsb_img

def preprocess_img_soft(dcm):
  if (dcm.BitsStored == 12) and (dcm.PixelRepresentation == 0) and (int(dcm.RescaleIntercept) > -100):
          correct_dcm(dcm)
  img = bsb_window(dcm, third_window="soft")
  img = tf.convert_to_tensor(img, dtype=tf.float64)
  return img

def preprocess_img_bone(dcm):
  if (dcm.BitsStored == 12) and (dcm.PixelRepresentation == 0) and (int(dcm.RescaleIntercept) > -100):
          correct_dcm(dcm)
  img = bsb_window(dcm, third_window="bone")
  img = tf.convert_to_tensor(img, dtype=tf.float64)
  return img
        
def np_multilabel_loss(class_weights=None):
    '''
        this function defines another function that compute the single class crossentropy loss

            Parameters:
            - class_weights: class weights 

            Returns:
            - single_class_crossentropy: function that computes the loss
        '''
    def single_class_crossentropy(y_true, y_pred):
        '''
        this function computes the single class crossentropy loss value 

            Parameters:
            - y_true: true value 
            - y_pred: predicted value 

            Returns:
            - loss: loss percentage 
        '''
        y_true = tf.cast(y_true, tf.float32) 
        y_pred = tf.cast(y_pred, tf.float32)
        
        y_pred = tf.where(y_pred > 1-(1e-07), 1-1e-07, y_pred)
        y_pred = tf.where(y_pred < 1e-07, 1e-07, y_pred)

        # single class crossentropy calculations
        single_class_cross_entropies = - tf.reduce_mean(y_true * tf.math.log(y_pred) + (1-y_true) * tf.math.log(1-y_pred), axis=0)

        if class_weights is None:
            # if no weights are given compute the loss without weights 
            loss = tf.reduce_mean(single_class_cross_entropies)
        else:
            # compute the loss with respect to the given weights 
            loss = tf.reduce_sum(class_weights*single_class_cross_entropies)
        return loss
    return single_class_crossentropy