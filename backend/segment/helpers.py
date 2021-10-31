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

def decode_string_to_image(coded_image):
    import cv2
    import base64
    # decoded_image = base64.b64decode(coded_image)
    decoded_image = np.fromstring(base64.b64decode(coded_image), np.uint8)
    decoded_image = cv2.imdecode(decoded_image, cv2.IMREAD_GRAYSCALE)
    print(decoded_image)
    print("______shape:",decoded_image.shape)
    return decoded_image

def region_growing_segmentation(image, coors,window):
    import SimpleITK as sitk
    T1_WINDOW_LEVEL = (200,80)

    # Read image
    img = sitk.GetImageFromArray(image)
    img_255 = sitk.Cast(sitk.IntensityWindowing(img, 
                                            windowMinimum=T1_WINDOW_LEVEL[1]-T1_WINDOW_LEVEL[0]/2.0, 
                                            windowMaximum=T1_WINDOW_LEVEL[1]+T1_WINDOW_LEVEL[0]/2.0), 
                                            sitk.sitkUInt8)
    # Get coordinates
    points =[]
    for i in coors:
        points.append((i['x'],i['y'],0))
    print("______coors: ",points)
    initial_seed_point_indexes = points

    # ConnectedThreshold
    seg_explicit_thresholds = sitk.ConnectedThreshold(img, seedList=initial_seed_point_indexes, lower=20, upper=40)
    
    # ConfidenceConnected, the region growing algorithm 
    seg_implicit_thresholds = sitk.ConfidenceConnected(img, seedList=initial_seed_point_indexes,
                                                   numberOfIterations=0,
                                                   multiplier=2,
                                                   initialNeighborhoodRadius=1,
                                                   replaceValue=1)

    # BinaryMorphologicalClosing, Cleaning
    vectorRadius=(10,10,10)
    kernel=sitk.sitkBall
    seg_implicit_thresholds_clean = sitk.BinaryMorphologicalClosing(seg_implicit_thresholds, 
                                                                    vectorRadius,
                                                                    kernel)

    # Convert image to array
    npa_segmentation = sitk.GetArrayFromImage(seg_implicit_thresholds_clean).reshape(512,-1)

    return npa_segmentation


def merge_image(img, segmentation):
    import cv2
    # img = np.float32(img)
    segmentation = np.float32(segmentation)
    img = cv2.cvtColor(img,cv2.COLOR_GRAY2RGB) 
    segmentation = cv2.cvtColor(segmentation,cv2.COLOR_GRAY2RGB)
    segmentation[:,:,0] = 0
    segmentation[:,:,2] = 0

    print('shape:_________',img.shape)
    print('shape:_________',segmentation.shape)
    # merged = cv2.merge(img,segmentation)

    # ret, segmentation_mask = cv2.threshold(segmentation[:,:,0], 0, 255, cv2.THRESH_BINARY|cv2.THRESH_OTSU)
    merged = img.copy()
    merged[np.where(segmentation == 255)] = segmentation[np.where(segmentation == 255)]
    print(img.min(), img.max())
    print(segmentation.min(), segmentation.max())
    return merged
