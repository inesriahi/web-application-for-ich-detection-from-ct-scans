from tensorflow.keras.models import Model
import tensorflow as tf
import numpy as np
import cv2
# import imutils
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.preprocessing.image import load_img
from tensorflow.keras.applications import imagenet_utils
from .classification_helpers import *

import pydicom


class GradCAM:
    def __init__(self, model, classIdx,base_line_model_index=None, layerName=None):
        # store the model, the class index used to measure the class
        # activation map, and the layer to be used when visualizing
        # the class activation map
        self.model = model
        self.classIdx = classIdx
        self.layerName = layerName
        self.base_line_model_index = base_line_model_index

        # if the layer name is None, attempt to automatically find
            # the target output layer
        if self.layerName is None:
            self.layerName = self.find_target_layer()

    def find_target_layer(self):
    # attempt to find the final convolutional layer in the network
        # by looping over the layers of the network in reverse order
        if self.base_line_model_index is None:
            for layer in reversed(self.model.layers):
            # check to see if the layer has a 4D output
                if 'conv' in layer.name:
                    return layer.name
        else:
            for layer in reversed(self.model.layers[self.base_line_model_index].layers):
            # check to see if the layer has a 4D output
                if 'conv' in layer.name:
                    print("LAST LAYER IS:",layer.name)
                    return layer.name
            
            raise ValueError("Could not find 4D layer. Cannot apply GradCAM")

    def compute_heatmap(self, image, eps= 1e-8 ):
        if self.base_line_model_index is None:
            gradModel = Model(
                inputs=[self.model.inputs],
                outputs=[self.model.get_layer(self.layerName).output,
                        self.model.output])
        else:
            gradModel = Model(
                inputs=[self.model.layers[self.base_line_model_index].inputs],
                outputs=[self.model.layers[self.base_line_model_index].get_layer(self.layerName).output,
                        self.model.layers[self.base_line_model_index].output])
    
        # record operations for automatic differentiation
        with tf.GradientTape() as tape:
            # cast the image tensor to a float-32 data type, pass the
                # image through the gradient model, and grab the loss
                # associated with the specific class index
            inputs = tf.cast(image, tf.float32)
            (convOutputs, predictions) = gradModel(inputs)
            loss = predictions[:, self.classIdx]

        # use automatic differentiation to compute the gradients
        grads = tape.gradient(loss, convOutputs)

        # compute the guided gradients
        castConvOutputs = tf.cast(convOutputs > 0, "float32")
        castGrads = tf.cast(grads > 0, "float32")
        guidedGrads = castConvOutputs * castGrads * grads

        # the convolution and guided gradients have a batch dimension
            # (which we don't need) so let's grab the volume itself and
            # discard the batch
        convOutputs = convOutputs[0]
        guidedGrads = guidedGrads[0]

        # compute the average of the gradient values, and using them
            # as weights, compute the ponderation of the filters with
            # respect to the weights
        weights = tf.reduce_mean(guidedGrads, axis=(0,1))
        cam = tf.reduce_sum(tf.multiply(weights, convOutputs), axis = -1)

        # grab the spatial dimensions of the input image and resize
            # the output class activation map to match the input image
            # dimensions
        (w, h) = (image.shape[2], image.shape[1])
        heatmap = cv2.resize(cam.numpy(), (w,h))

        # normalize the heatmap such that all values lie in the range
            # [0, 1], scale the resulting values to the range [0, 255],
            # and then convert to an unsigned 8-bit integer
        numer = heatmap - np.min(heatmap)
        denom = (heatmap.max() - heatmap.min()) + eps
        heatmap = numer / denom
        heatmap = (heatmap * 255).astype("uint8")

        # return the resulting heatmap to the calling function
        return heatmap

    def overlay_heatmap(self, heatmap, image, alpha=0.5,
        colormap=cv2.COLORMAP_VIRIDIS):
        # apply the supplied color map to the heatmap and then
        # overlay the heatmap on the input image
        heatmap = cv2.applyColorMap(heatmap, colormap)
        heatmap = cv2.normalize(heatmap, None, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_32F)
        output = cv2.addWeighted(image, alpha, heatmap, 1 - alpha, 0, dtype = cv2.CV_32F)
            # return a 2-tuple of the color mapped heatmap and the output,
            # overlaid image
        return (heatmap, output)

def plot_GradCAM(model, image_dcom,classnames,base_line_model_index, class_idx= None, layerName=None, colormap=cv2.COLORMAP_MAGMA, stack=False, figsize=(10,10), alpha = 0.5):
  multilabel_header = ['epidural', 'intraparenchymal', 'intraventricular', 'subarachnoid', 'subdural']
  figures = dict()
  image = preprocess_img_soft(image_dcom)
  orig = image.numpy()
  resized = tf.image.resize(orig, (224,224))

  figures['original'] = orig[:,:,::-1]

  image = np.expand_dims(orig, axis=0)
  preds = model.predict(np.expand_dims(resized, axis=0))
  if class_idx is None:
    
    i = int(np.round(preds[0]))
    predicted_label = classnames[int(round(preds[0][0]))]


    # initialize our gradient class activation map and build the heatmap
    cam = GradCAM(model, i, base_line_model_index=base_line_model_index)
  else:
    cam = GradCAM(model, class_idx, base_line_model_index=base_line_model_index)

  heatmap = cam.compute_heatmap(image)
  # resize the resulting heatmap to the original input image dimensions
  # and then overlay heatmap on top of the image
  heatmap = cv2.resize(heatmap, (orig.shape[1], orig.shape[0]))


  (heatmap, output) = cam.overlay_heatmap(heatmap, orig, alpha=alpha, colormap=colormap)

  figures['heatmap'] = heatmap[:,:,::-1]
  figures['mask'] = output[:,:,::-1]
  
  # display the original image and resulting heatmap and output image
  # to our screen
#   if stack:
#     plt.figure(figsize=(5,15))
#     output = np.vstack([orig, heatmap, output])
#   else:
#     plt.figure(figsize=figsize)

#   output = imutils.resize(output, height=1400)
  
#   plt.imshow(output[:,:,::-1])
#   if len(classnames) > 2:
#     pred_prob = [pred for pred in preds[0] if pred > 0.5]
#     plt.title('predicted_probs:' + str(pred_prob) )
#     pred_list = [pred for pred in preds[0]]
#     figures['pred'] = [multilabel_header, pred_list]
#     return figures

#   else:
#     plt.title('predicted_label:' + predicted_label  + ", Prob: " + str(preds[0][0]))
#     figures['pred'] = preds[0][0]

  return preds[0][0], heatmap

