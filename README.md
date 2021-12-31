## Overview
We have built a model, after too many experiments for many state-of-art architectures, that could detect the presence of the bleed as well as its type if it exists. Our best performing model could achieve a 0.75 f1-score on the test dataset. Not only this, but we have also added a feature of manual segmentation of the hemorrhage and allowed radiologists to get over 100 texture analysis features to allow further analysis of the segmented region along with its related histogram. This project greatly strengthened my knowledge about using Deep Learning for medical data and approached me to learn much about the artificial intelligence tools used in this discipline. In addition to this, I also gained deeper knowledge about the methods used to interpret CNN model results by plotting GradCAMs, which are heatmaps to highlight the important regions that contributed to the classification results. A very important addition to this project was that we have built a web interface, using ReactJS for the frontend and Django for the backend to better represent our results to make it accessible for radiologists.      

# 

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
