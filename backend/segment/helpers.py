import numpy as np

def rescale_pixelarray(dataset):
    '''
    this function rescales the pixel array of a given image 

        Parameters:
        - dataset: DICOM image

        Returns:
        - rescaled_image: DICOM image after rescaling 
    '''
    image = dataset.pixel_array
    rescaled_image = image * dataset.RescaleSlope + dataset.RescaleIntercept
    rescaled_image[rescaled_image < -1024] = -1024
    return rescaled_image

def set_manual_window(hu_image, min_value, max_value):
    '''
    this function sets the windowing values of the image 

        Parameters:
        - hu_image: image array 
        - min_value: minimum window values 
        - max_value: maximum window values 

        Returns:
        - hu_image: image after windowing 
    '''
    hu_image[hu_image < min_value] = min_value  # min value
    hu_image[hu_image > max_value] = max_value  # max value
    return hu_image

def get_hounsfield_window(dataset, min_value, max_value):
    '''
    this function applies image windowing 

        Parameters:
        - dataset: image array
        - min_value: minimum window values 
        - max_value: maximum window values

        Returns:
        - windowed_image: integer value of the input
    '''
    try:
        # rescale pixel array
        hu_image = rescale_pixelarray(dataset)
        # set window values 
        windowed_image = set_manual_window(hu_image, min_value, max_value)
    except ValueError:
        # set to level 
        windowed_image = min_value * np.ones((224, 224))
    return windowed_image

def map_to_whole_image_range(windowd_image):
    '''
    this function maps the windowing to the whole image 

        Parameters:
        - windowed_image: image after windowing 

        Returns:
        - adjusted_image: image after adjusting 
    '''
    min_value =  np.min(windowd_image)  
    max_value = np.max(windowd_image)

    adjusted_image = 255.0 * (windowd_image - min_value)/(max_value - min_value)

    return adjusted_image

def encode_img_to_string(numpy_img):
    '''
    this function encodes the image to string 
        Parameters:
        - numpy_img: image as numpy array 

        Returns:
        - coded_image: string image 
    '''
    
    # import libraries 
    import base64
    import cv2
    
    # encode image to string 
    _, encoded_img = cv2.imencode('.png', np.asarray(numpy_img))
    coded_image = base64.b64encode(encoded_img).decode('utf-8')
    return coded_image

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
    min_value= window_center - (window_width // 2)
    max_value= window_center + (window_width //2 )
    return min_value,max_value

def window_image(img, window_center, window_width, IMAGE_SIZES):
    '''
    this function changes the windowing values of the image

        Parameters:
        - img: DICOM image
        - window_center: window center value of the image from DICOM metadata
        - window_width: window width value of the image from DICOM metadata
        - IMAGE_SIZES: image size 

        Returns:
        -img: DICOM image with the new windowing 
    '''
    img_min, img_max = get_min_max_of_window_value(window_center, window_width)
    try:
        img[img < img_min] = img_min
        img[img > img_max] = img_max
    except :
        img = img_min * np.ones(IMAGE_SIZES)
    return img

def decode_string_to_image(coded_image):
    '''
    this function decodes string to image 

        Parameters:
        - coded_image: string image

        Returns:
        - decoded_image: image array 
    '''

    # import libraries 
    import cv2
    import base64

    # decode string to image
    decoded_image = np.fromstring(base64.b64decode(coded_image), np.uint8)
    decoded_image = cv2.imdecode(decoded_image, cv2.IMREAD_GRAYSCALE)

    return decoded_image

