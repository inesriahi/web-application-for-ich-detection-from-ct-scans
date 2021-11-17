import numpy as np

def region_growing_segmentation(image, coors):
    import SimpleITK as sitk


    # Read image
    img = sitk.GetImageFromArray(image)

    # Get coordinates
    points =[]
    for i in coors:
        points.append((i['x'],i['y'],0))
    # print("______coors: ",points)
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
    npa_segmentation = sitk.GetArrayFromImage(seg_implicit_thresholds_clean).reshape(image.shape[0],image.shape[1])

    return npa_segmentation


def merge_image(img, segmentation):
    import cv2
    img = np.float32(img)
    segmentation = np.float32(segmentation)
    img = cv2.cvtColor(img,cv2.COLOR_GRAY2RGB) 
    segmentation = cv2.cvtColor(segmentation,cv2.COLOR_GRAY2RGB)
    segmentation[:,:,0] = 0
    segmentation[:,:,2] = 0


    merged = img.copy()
    merged[np.where(segmentation == 255)] = segmentation[np.where(segmentation == 255)]

    return merged


def array_to_nrrd(array_image,filename):
    import nrrd
    # Write to a NRRD file
    nrrd.write(filename, array_image)
    # Read the data back from file
    mask, header = nrrd.read(filename)
    return mask


def featureExtractor(original, mask):
    from radiomics import featureextractor  # This module is used for interaction with pyradiomics

    array_to_nrrd(original,'original.nrrd')
    array_to_nrrd(mask, 'segmentation.nrrd')

    extractor = featureextractor.RadiomicsFeatureExtractor()
    extractor.enableFeatureClassByName('shape2D') #enable shape2D instead of shape

    result = extractor.execute('original.nrrd', 'segmentation.nrrd')

    # Take all the values from result before diagnostics_Image-original_Mean
    # and store in new dic
    import re
    features = []
    for key, value in result.items():
        if key.startswith('original'):
            _, feature_type, feature_name = key.split('_')
            # Split a string at uppercase letters
            well_writen_feature_name = ' '.join(re.findall('[A-Z][^A-Z]*', feature_name))
            features.append({'feature_name': well_writen_feature_name, 'feature_type':feature_type, 'feature_value':f"{float(value):.5f}"})

    return features # or return results 

def segmented_area_histogram(original,segmented_img):
    segmented_img[segmented_img == 0] = np.nan
    segmented_img[segmented_img == 255] = 1.0
    segmented_area = original.astype(np.float32) * ((segmented_img.astype(np.float32)))
    counts, bins = np.histogram(segmented_area, range(0,256), normed=True)

    # return data as what plt.bar accepts
    return [(bins[:-1]).tolist(), counts.tolist()]