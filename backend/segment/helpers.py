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

def decode_string_to_image(coded_image):
    import cv2
    import base64
    # decoded_image = base64.b64decode(coded_image)
    decoded_image = np.fromstring(base64.b64decode(coded_image), np.uint8)
    decoded_image = cv2.imdecode(decoded_image, cv2.IMREAD_GRAYSCALE)
    print(decoded_image)
    print("shhhhhhhape:",decoded_image.shape)
    return decoded_image

def region_growing_segmentation(image, coors):
    import SimpleITK as sitk
    T1_WINDOW_LEVEL = (200,80)
    # Read image
    img = sitk.GetImageFromArray(image)
    # print(img_T1)
    img_255 = sitk.Cast(sitk.IntensityWindowing(img, 
                                            windowMinimum=T1_WINDOW_LEVEL[1]-T1_WINDOW_LEVEL[0]/2.0, 
                                            windowMaximum=T1_WINDOW_LEVEL[1]+T1_WINDOW_LEVEL[0]/2.0), 
                                            sitk.sitkUInt8)
    # Get coordinates
    points =[]
    for i in coors:
        points.append((i['x'],i['y'],0))
    print(points)
    initial_seed_point_indexes = points

    