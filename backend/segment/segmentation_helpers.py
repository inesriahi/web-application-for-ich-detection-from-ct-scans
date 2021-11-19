import numpy as np

def region_growing_segmentation(image, coors):
    '''
    this function aplies segmentation using region growing method
    
        Parameters:
        - image: DICOM image 
        - coors: coordinates of the area to be segmented 

        Returns:
        - npa_segmentation: segmented area 
    '''

    # import library 
    import SimpleITK as sitk

    # Read image
    img = sitk.GetImageFromArray(image)

    # Get coordinates
    points =[]
    for i in coors:
        points.append((i['x'],i['y'],0))
    # print("______coors: ",points)
    initial_seed_point_indexes = points

    # Connected Threshold
    seg_explicit_thresholds = sitk.ConnectedThreshold(img, seedList=initial_seed_point_indexes, lower=20, upper=40)
    
    # Confidence Connected, the region growing algorithm 
    seg_implicit_thresholds = sitk.ConfidenceConnected(img, seedList=initial_seed_point_indexes,
                                                   numberOfIterations=0,
                                                   multiplier=2,
                                                   initialNeighborhoodRadius=1,
                                                   replaceValue=1)

    # Binary Morphological Closing, Cleaning
    vectorRadius=(10,10,10)
    kernel=sitk.sitkBall
    seg_implicit_thresholds_clean = sitk.BinaryMorphologicalClosing(seg_implicit_thresholds, 
                                                                    vectorRadius,
                                                                    kernel)

    # Convert image to array
    npa_segmentation = sitk.GetArrayFromImage(seg_implicit_thresholds_clean).reshape(image.shape[0],image.shape[1])

    return npa_segmentation

def merge_image(img, segmentation):
    '''
    this function merges the segmented area to the original image 
    
        Parameters:
        - img: original image without segmentation
        - segmentation: segmented area image 

        Returns:
        - merged: image with segmentation applied 
    '''

    # import library 
    import cv2

    # image to array 
    img = np.float32(img) 
    segmentation = np.float32(segmentation)

    # apply grayscale 
    img = cv2.cvtColor(img,cv2.COLOR_GRAY2RGB) 
    segmentation = cv2.cvtColor(segmentation,cv2.COLOR_GRAY2RGB)

    segmentation[:,:,0] = 0
    segmentation[:,:,2] = 0

    # merge images 
    merged = img.copy()
    merged[np.where(segmentation == 255)] = segmentation[np.where(segmentation == 255)]

    return merged

def array_to_nrrd(array_image, filename):
    '''
    this function converts numpy array to nrrd file

        Parameters:
        - array_image: image as numpy array 
        - filename: NRRD filename 

        Returns:
        - readdata: data from NRRD file
    '''

    # import needed library 
    import nrrd

    # Write to a NRRD file
    nrrd.write(filename, array_image)
    # Read the data back from file
    readdata, header = nrrd.read(filename)
    return readdata

def featureExtractor(original, mask):
    '''
    this function extracts features of the segmented area

        Parameters:
        - original: original image as numpy array 
        - mask: segmentation mask as numpy array 

        Returns:
        - features: dictionary of features and their values 
    '''

    from radiomics import featureextractor  # This module is used for interaction with pyradiomics

    # convert images to nrrd 
    array_to_nrrd(original,'original.nrrd')
    array_to_nrrd(mask, 'segmentation.nrrd')

    # initialize extractor 
    extractor = featureextractor.RadiomicsFeatureExtractor()
    extractor.enableFeatureClassByName('shape2D') #enable shape2D instead of shape

    # features as a dictionary 
    result = extractor.execute('original.nrrd', 'segmentation.nrrd')

    # Take all the values from result before diagnostics_Image-original_Mean and store in new dic
    import re
    features = []
    for key, value in result.items():
        if key.startswith('original'):
            _, feature_type, feature_name = key.split('_')
            
            # Split a string at uppercase letters
            well_writen_feature_name = ' '.join(re.findall('[A-Z][^A-Z]*', feature_name))
            
            # append to dictionary
            features.append({'feature_name': well_writen_feature_name, 'feature_type':feature_type, 'feature_value':f"{float(value):.5f}"})

    return features 

def segmented_area_histogram(original,segmented_img):
    '''
    this function creates a histogram for the segmented area

        Parameters:
        - original: original image 
        - segmented_img: segmented image 

        Returns:
        - plt.bar parameters: data as what plt.bar accepts
    '''
    
    segmented_img[segmented_img == 0] = np.nan
    segmented_img[segmented_img == 255] = 1.0
    segmented_area = original.astype(np.float32) * ((segmented_img.astype(np.float32)))
    counts, bins = np.histogram(segmented_area, range(0,256), normed=True)

    # return data as what plt.bar accepts
    return [(bins[:-1]).tolist(), counts.tolist()]