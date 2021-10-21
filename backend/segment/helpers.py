import numpy as np

def rescale_pixelarray(dataset):
    image = dataset.pixel_array
    rescaled_image = image * dataset.RescaleSlope + dataset.RescaleIntercept
    rescaled_image[rescaled_image < -1024] = -1024
    return rescaled_image

def set_manual_window(hu_image, min_value, max_value):
    hu_image[hu_image < min_value] = min_value
    hu_image[hu_image > max_value] = max_value #max_value
    return hu_image

def get_hounsfield_window(dataset, min_value, max_value):
        try:
            hu_image = rescale_pixelarray(dataset)
            windowed_image = set_manual_window(hu_image, min_value, max_value)
        except ValueError:
            # set to level 
            windowed_image = min_value * np.ones((224, 224))
        return windowed_image

def map_to_whole_image_range(windowd_image):
    min_value =  np.min(windowd_image)
    max_value = np.max(windowd_image)

    adjusted_image = 255 * (windowd_image - min_value)/(max_value - min_value)

    return adjusted_image

def encode_img_to_string(numpy_img):
    import base64
    import cv2
    
    _, encoded_img = cv2.imencode('.png', np.asarray(numpy_img))
    coded_image = base64.b64encode(encoded_img).decode('utf-8')
    return coded_image

def get_min_max_of_window_value(window_center, window_width):
    min_value= int(window_center) - (int(window_width) // 2)
    max_value= int(window_center) + (int(window_width) //2 )
    return min_value,max_value

def window_image(img, window_center, window_width,IMAGE_SIZES):
    img_min, img_max = get_min_max_of_window_value(window_center, window_width)
    try:
        img[img < img_min] = img_min
        img[img > img_max] = img_max
    except :
        img = img_min * np.ones(IMAGE_SIZES)
    return img
